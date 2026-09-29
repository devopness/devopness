//! The generated-artifact registry (`.tetanus/generated.toml`).
//!
//! 54% of the lines in this repository are produced by OpenAPI Generator, a
//! Next.js build, or Changesets. Any metric computed without segregating those
//! files is noise. The registry is what makes the segregation mechanical
//! rather than a convention people have to remember.

use std::collections::BTreeMap;
use std::path::Path;

use serde::{Deserialize, Serialize};
use tetanus_core::error::{Error, Result};

use crate::PathMatcher;

/// One generator and the tree it owns.
#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Artifact {
    pub id: String,
    pub paths: Vec<String>,
    pub generator: String,
    #[serde(default)]
    pub command: Option<String>,
    #[serde(default)]
    pub inputs: Vec<String>,
    #[serde(default)]
    pub committed: bool,
    /// True when a generator outside Tetanus owns the file, e.g. Changesets
    /// owns the per-package `CHANGELOG.md`. Tetanus classifies these but must
    /// never render, rewrite, or drift-check them as if they were its own
    /// output.
    #[serde(default)]
    pub foreign_generator: bool,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct GeneratedRegistry {
    #[serde(default = "default_version")]
    pub version: u32,
    #[serde(default)]
    pub artifact: Vec<Artifact>,
}

fn default_version() -> u32 {
    1
}

impl GeneratedRegistry {
    pub fn load(path: &Path) -> Result<Self> {
        let text =
            std::fs::read_to_string(path).map_err(|e| Error::io(path.display().to_string(), e))?;
        let registry: Self = toml::from_str(&text)
            .map_err(|e| Error::parse(path.display().to_string(), e.to_string()))?;
        registry.validate()?;
        Ok(registry)
    }

    pub fn validate(&self) -> Result<()> {
        if self.version != 1 {
            return Err(Error::config(format!(
                "unsupported .tetanus/generated.toml version {}",
                self.version
            )));
        }
        let mut seen = std::collections::BTreeSet::new();
        for artifact in &self.artifact {
            if artifact.id.trim().is_empty() {
                return Err(Error::config("an artifact entry has an empty id"));
            }
            if !seen.insert(artifact.id.clone()) {
                return Err(Error::config(format!(
                    "duplicate artifact id {:?}",
                    artifact.id
                )));
            }
            if artifact.paths.is_empty() {
                return Err(Error::config(format!(
                    "artifact {:?} declares no paths",
                    artifact.id
                )));
            }
            for path in &artifact.paths {
                PathMatcher::new([path]).map_err(|e| {
                    Error::config(format!("artifact {:?} path {path:?}: {e}", artifact.id))
                })?;
            }
        }

        let matchers = self.compiled()?;
        for (i, left) in self.artifact.iter().enumerate() {
            for (j, right) in self.artifact.iter().enumerate().skip(i + 1) {
                if let Some(shared) = overlap(&matchers[i].1, &matchers[j].1) {
                    return Err(Error::config(format!(
                        "artifacts {:?} and {:?} both claim the glob {shared:?}; \
                         a path may belong to exactly one generator",
                        left.id, right.id
                    )));
                }
            }
        }
        Ok(())
    }

    pub fn compiled(&self) -> Result<Vec<(String, PathMatcher)>> {
        self.artifact
            .iter()
            .map(|a| Ok((a.id.clone(), PathMatcher::new(&a.paths)?)))
            .collect()
    }

    /// Which artifact owns a repository-relative path, if any.
    pub fn owner<'a>(&self, compiled: &'a [(String, PathMatcher)], path: &str) -> Option<&'a str> {
        compiled
            .iter()
            .find(|(_, matcher)| matcher.is_match(path))
            .map(|(id, _)| id.as_str())
    }
}

/// Find a literal glob declared by both artifacts.
///
/// Overlap is only rejected for exactly identical globs. Overlapping glob
/// *shapes* are legitimate: `dist/**` and `packages/*/dist/**` cover some of
/// the same files, and the classifier reports that ambiguity from real
/// filesystem state rather than guessing from pattern text.
fn overlap(left: &PathMatcher, right: &PathMatcher) -> Option<String> {
    left.patterns()
        .iter()
        .find(|p| right.patterns().contains(p))
        .cloned()
}

/// A classified file: which artifact produced it, or hand-written.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct Classified {
    pub path: String,
    pub artifact: Option<String>,
    pub generated: bool,
    pub foreign_generator: bool,
}

#[derive(Debug, Clone, Default)]
pub struct Classification {
    pub files: Vec<Classified>,
    pub by_artifact: BTreeMap<String, usize>,
    pub foreign: usize,
}

#[cfg(test)]
mod tests {
    use super::*;

    fn artifact(id: &str, paths: &[&str]) -> Artifact {
        Artifact {
            id: id.into(),
            paths: paths.iter().map(|s| (*s).into()).collect(),
            generator: "test".into(),
            command: None,
            inputs: vec![],
            committed: true,
            foreign_generator: false,
        }
    }

    #[test]
    fn duplicate_id_is_rejected() {
        let registry = GeneratedRegistry {
            version: 1,
            artifact: vec![artifact("a", &["x/**"]), artifact("a", &["y/**"])],
        };
        assert!(registry.validate().is_err());
    }

    #[test]
    fn identical_glob_under_two_artifacts_is_rejected() {
        let registry = GeneratedRegistry {
            version: 1,
            artifact: vec![artifact("a", &["dist/**"]), artifact("b", &["dist/**"])],
        };
        let err = registry.validate().unwrap_err().to_string();
        assert!(err.contains("exactly one generator"), "{err}");
    }

    #[test]
    fn artifact_without_paths_is_rejected() {
        let registry = GeneratedRegistry {
            version: 1,
            artifact: vec![artifact("a", &[])],
        };
        assert!(registry.validate().is_err());
    }

    #[test]
    fn foreign_generator_is_preserved() {
        let mut a = artifact("package-changelogs", &["packages/*/*/CHANGELOG.md"]);
        a.foreign_generator = true;
        let registry = GeneratedRegistry {
            version: 1,
            artifact: vec![a],
        };
        registry.validate().unwrap();
        let compiled = registry.compiled().unwrap();
        assert_eq!(
            registry.owner(&compiled, "packages/ui/react/CHANGELOG.md"),
            Some("package-changelogs")
        );
    }
}
