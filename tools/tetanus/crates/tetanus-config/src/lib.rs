//! Loading and validation of the declarative engineering state.
//!
//! Three files form the configuration surface, in increasing specificity:
//!
//! - `.tetanus/tetanus.toml` — the deliberately boring top level
//! - `.tetanus/specs/*.toml` — one file per subsystem
//! - `living.toml` — canonical project state
//!
//! Nothing in this crate invents defaults for a required field. A missing
//! required key is a configuration error, never a silent fallback, because a
//! silent fallback would make enforcement depend on a value nobody chose.

use std::path::{Path, PathBuf};

use globset::{Glob, GlobSet, GlobSetBuilder};
use serde::{Deserialize, Serialize};
use tetanus_core::error::{Error, Result};

pub mod bugs;
pub mod date;
pub mod generated;
pub mod living;
pub mod ratchet;
pub mod repo;

pub use generated::{Artifact, GeneratedRegistry};
pub use living::{Living, Objective, Phase, Session, WorkItem};
pub use ratchet::{Direction, Exception, Ratchet, RatchetFile, Verdict, VerdictKind};
pub use repo::RepoPaths;

/// The top level `.tetanus/tetanus.toml`.
#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct TetanusConfig {
    #[serde(default = "default_version")]
    pub version: u32,
    pub project: Option<ProjectSection>,
    pub architecture: Option<ArchitectureSection>,
    pub analysis: Option<AnalysisSection>,
    pub testing: Option<TestingSection>,
    pub ratchet: Option<RatchetSection>,
    pub living: Option<LivingSection>,
    pub security: Option<SecuritySection>,
    pub ci: Option<CiSection>,
}

fn default_version() -> u32 {
    1
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct ProjectSection {
    pub name: Option<String>,
    pub engineering_substrate: Option<String>,
    pub cli_name: Option<String>,
    pub mode: Option<String>,
    #[serde(default)]
    pub deterministic: bool,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct ArchitectureSection {
    pub package_manager: Option<String>,
    pub task_runner: Option<String>,
    #[serde(default)]
    pub rust_engine: bool,
    pub cache_layer: Option<String>,
    pub graph_backend: Option<String>,
    pub canonical_state: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct AnalysisSection {
    #[serde(default)]
    pub reachability: bool,
    #[serde(default)]
    pub tree_shaking: bool,
    #[serde(default)]
    pub dead_code: bool,
    #[serde(default)]
    pub cycles: bool,
    #[serde(default)]
    pub scc: bool,
    #[serde(default)]
    pub deterministic: bool,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct TestingSection {
    pub manifest: Option<PathBuf>,
    #[serde(default)]
    pub require_manifest: bool,
    #[serde(default)]
    pub require_affected_tests: bool,
    #[serde(default)]
    pub allow_untracked_tests: bool,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct RatchetSection {
    #[serde(default)]
    pub unknown_is_failure: bool,
    #[serde(default)]
    pub allow_explicit_exceptions: bool,
    pub baseline: Option<PathBuf>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct LivingSection {
    pub source: Option<PathBuf>,
    #[serde(default)]
    pub generated: Vec<PathBuf>,
    #[serde(default)]
    pub require_sync: bool,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct SecuritySection {
    #[serde(default)]
    pub require_locked_dependencies: bool,
    #[serde(default)]
    pub track_lifecycle_scripts: bool,
    #[serde(default)]
    pub track_git_dependencies: bool,
    #[serde(default)]
    pub track_duplicate_versions: bool,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct CiSection {
    #[serde(default)]
    pub require_ast: bool,
    #[serde(default)]
    pub require_graph: bool,
    #[serde(default)]
    pub require_manifest: bool,
    #[serde(default)]
    pub require_tests: bool,
    #[serde(default)]
    pub require_ratchet: bool,
    #[serde(default)]
    pub require_living_sync: bool,
}

impl TetanusConfig {
    pub fn load(path: &Path) -> Result<Self> {
        let text =
            std::fs::read_to_string(path).map_err(|e| Error::io(path.display().to_string(), e))?;
        let config: Self = toml::from_str(&text)
            .map_err(|e| Error::parse(path.display().to_string(), e.to_string()))?;
        config.validate()?;
        Ok(config)
    }

    pub fn validate(&self) -> Result<()> {
        if self.version != 1 {
            return Err(Error::config(format!(
                "unsupported .tetanus/tetanus.toml version {}; this build understands version 1",
                self.version
            )));
        }
        if let Some(mode) = self.project.as_ref().and_then(|p| p.mode.as_deref())
            && mode != "ratchet"
        {
            return Err(Error::config(format!(
                "unsupported project.mode {mode:?}; expected \"ratchet\""
            )));
        }
        if let Some(backend) = self
            .architecture
            .as_ref()
            .and_then(|a| a.graph_backend.as_deref())
            && !matches!(backend, "in_memory" | "embedded" | "ephemeral")
        {
            return Err(Error::config(format!(
                "unsupported architecture.graph_backend {backend:?}; the graph must be ephemeral and reconstructable from repository state"
            )));
        }
        Ok(())
    }
}

/// Compiled glob set over repository-relative paths.
///
/// Paths are normalised to forward slashes before matching so that a glob
/// behaves identically on every platform.
#[derive(Debug, Clone)]
pub struct PathMatcher {
    set: GlobSet,
    patterns: Vec<String>,
}

impl PathMatcher {
    pub fn new<I, S>(patterns: I) -> Result<Self>
    where
        I: IntoIterator<Item = S>,
        S: AsRef<str>,
    {
        let mut builder = GlobSetBuilder::new();
        let mut collected = Vec::new();
        for pattern in patterns {
            let pattern = pattern.as_ref().to_string();
            let compiled = Glob::new(&pattern)
                .map_err(|e| Error::config(format!("invalid glob {pattern:?}: {e}")))?;
            builder.add(compiled);
            collected.push(pattern);
        }
        let set = builder
            .build()
            .map_err(|e| Error::config(format!("could not compile glob set: {e}")))?;
        Ok(Self {
            set,
            patterns: collected,
        })
    }

    pub fn is_match(&self, path: &str) -> bool {
        self.set.is_match(normalise(path))
    }

    pub fn patterns(&self) -> &[String] {
        &self.patterns
    }
}

/// Convert a path to the forward-slash, `./`-free form the registry uses.
pub fn normalise(path: &str) -> String {
    let replaced = path.replace('\\', "/");
    replaced.trim_start_matches("./").to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matcher_normalises_separators() {
        let matcher = PathMatcher::new(["packages/*/*/CHANGELOG.md"]).unwrap();
        assert!(matcher.is_match("packages/sdks/javascript/CHANGELOG.md"));
        assert!(matcher.is_match("packages\\ui\\react\\CHANGELOG.md"));
        assert!(!matcher.is_match("packages/sdks/javascript/README.md"));
    }

    #[test]
    fn unknown_toplevel_key_is_rejected() {
        let err = toml::from_str::<TetanusConfig>("nonsense = true").unwrap_err();
        assert!(err.to_string().contains("nonsense"));
    }

    #[test]
    fn non_ephemeral_graph_backend_is_rejected() {
        let config: TetanusConfig =
            toml::from_str("[architecture]\ngraph_backend = \"postgres\"\n").unwrap();
        assert!(config.validate().is_err());
    }
}
