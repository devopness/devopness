//! Unified dependency and security graph.
//!
//! One graph over every ecosystem in the repository, assembled from lockfiles
//! rather than manifests. A manifest states intent; a lockfile states what will
//! actually be installed. Reading manifests would let a range resolve
//! differently tomorrow with no file changing, and the graph would then describe
//! a tree nobody is going to install.
//!
//! The capability this buys is answering, for any package, whether it can reach
//! production code. A dependency that exists only in a test scope is a different
//! risk from one on the runtime path, and a flat list cannot express that.

use std::collections::{BTreeMap, BTreeSet};

use serde::{Deserialize, Serialize};
use tetanus_core::error::Error;

pub mod cargo;
pub mod graph;
pub mod npm;
pub mod pnpm;
pub mod uv;

pub use graph::{DepGraph, Metrics, PackageId, Scope};

/// Which ecosystem a package belongs to.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Ecosystem {
    Npm,
    Pypi,
    Crates,
}

impl Ecosystem {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Npm => "npm",
            Self::Pypi => "pypi",
            Self::Crates => "crates.io",
        }
    }

    /// Ecosystem identity is part of a package's identity. `left-pad` on npm and
    /// a crate called `left-pad` are unrelated code, and conflating them would
    /// make duplicate detection wrong in both directions.
    pub fn index(self) -> usize {
        match self {
            Self::Npm => 0,
            Self::Pypi => 1,
            Self::Crates => 2,
        }
    }
}

/// Where a package was resolved from.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum Source {
    /// A package index, which is the only source that gets advisories.
    Registry {
        registry: String,
    },
    Git {
        url: String,
        rev: Option<String>,
    },
    /// A local path, which is a workspace member rather than a dependency.
    Path {
        path: String,
    },
    /// A direct URL, which bypasses the index entirely.
    DirectUrl {
        url: String,
    },
    /// The lockfile did not say. Treated as unknown rather than assumed safe.
    Unknown,
}

impl Source {
    pub fn is_registry(&self) -> bool {
        matches!(self, Self::Registry { .. })
    }

    /// Whether the source is trusted to publish vulnerability advisories.
    pub fn is_advisory_covered(&self) -> bool {
        self.is_registry()
    }
}

/// One resolved package.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Package {
    pub id: PackageId,
    pub name: String,
    pub version: String,
    pub ecosystem: Ecosystem,
    pub source: Source,
    /// True when the package declares an install script. The lockfile records the
    /// declaration; whether it is *permitted* is policy, tracked separately.
    pub has_build_script: bool,
    /// True when *this lockfile format* can report the flag above at all. An
    /// npm lockfile can; a pnpm v9 lockfile cannot, so its packages carry
    /// `has_build_script: false` and `has_script_signal: false` together, which
    /// is "unknown" rather than "no".
    pub has_script_signal: bool,
    /// True when the package is only reachable through a dev edge.
    pub dev_only: bool,
    /// Restricted to specific CPU architectures or operating systems.
    pub platform_specific: Option<String>,
    /// True when the package is a workspace member, not a third-party dependency.
    pub workspace_member: bool,
    /// The lockfile the entry came from, for provenance.
    pub lockfile: String,
}

impl Package {
    pub fn is_third_party(&self) -> bool {
        !self.workspace_member && !matches!(self.source, Source::Path { .. })
    }
}

/// An edge from one package to another.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub struct Edge {
    pub from: PackageId,
    pub to: PackageId,
    /// True for a dev-dependency edge. Kept rather than discarded so production
    /// reachability is a subtraction instead of a second traversal.
    pub dev: bool,
}

/// Errors that must fail the run rather than produce an empty report.
///
/// An empty security report and an unreadable lockfile are indistinguishable
/// without this. A silently empty graph would read as "no vulnerabilities".
#[derive(Debug)]
pub enum LockfileError {
    Missing { path: String, reason: String },
    Unreadable { path: String, reason: String },
    Malformed { path: String, reason: String },
}

impl std::fmt::Display for LockfileError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Missing { path, reason } => {
                write!(f, "{path} is required for the security graph: {reason}")
            }
            Self::Unreadable { path, reason } => {
                write!(f, "{path} could not be read: {reason}")
            }
            Self::Malformed { path, reason } => {
                write!(f, "{path} could not be parsed: {reason}")
            }
        }
    }
}

impl From<LockfileError> for Error {
    fn from(value: LockfileError) -> Self {
        Error::Other(value.to_string())
    }
}

/// One package resolved at more than one version.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub struct Duplicate {
    pub name: String,
    pub ecosystem: Ecosystem,
    pub versions: Vec<String>,
    /// The lowest version, which is the one an advisory is most likely to
    /// match. Present so a report can lead with the most vulnerable copy.
    pub lowest: String,
}

#[derive(Debug, Default)]
pub struct Assembly {
    pub packages: Vec<Package>,
    pub edges: Vec<Edge>,
    /// Lockfiles that were read, for provenance in the report.
    pub lockfiles: Vec<String>,
    /// Direct dependencies named by a manifest but absent from the lockfile.
    pub unresolved: Vec<String>,
}

impl Assembly {
    pub fn push(&mut self, package: Package) {
        self.packages.push(package);
    }

    pub fn edge(&mut self, edge: Edge) {
        self.edges.push(edge);
    }

    /// Packages resolved at more than one version within one ecosystem.
    pub fn duplicates(&self) -> Vec<Duplicate> {
        let mut by_name: BTreeMap<(Ecosystem, &str), BTreeSet<&str>> = BTreeMap::new();
        for package in &self.packages {
            if !package.is_third_party() {
                continue;
            }
            by_name
                .entry((package.ecosystem, package.name.as_str()))
                .or_default()
                .insert(package.version.as_str());
        }

        let mut out: Vec<Duplicate> = by_name
            .into_iter()
            .filter(|(_, versions)| versions.len() > 1)
            .map(|((ecosystem, name), versions)| {
                let mut list: Vec<String> = versions.into_iter().map(str::to_string).collect();
                // Version order is a string comparison, which is wrong for 1.10
                // against 1.9. It only affects which version is reported first,
                // never whether a duplicate exists, so it is sorted numerically
                // where the components are numeric and left alone otherwise.
                list.sort_by(|a, b| compare_versions(a, b));
                let lowest = list.first().cloned().unwrap_or_default();
                Duplicate {
                    name: name.to_string(),
                    ecosystem,
                    versions: list,
                    lowest,
                }
            })
            .collect();
        out.sort();
        out
    }
}

/// Compare dotted numeric versions, falling back to string order for anything
/// with a non-numeric component.
pub fn compare_versions(a: &str, b: &str) -> std::cmp::Ordering {
    use std::cmp::Ordering;

    // Split the numeric release tuple from any pre-release or build suffix.
    // `1.0.0-rc1` is numerically equal to `1.0.0` and sorts *below* it, which a
    // plain string comparison gets backwards: it sees the longer string as
    // greater, so a release candidate would rank above the release it precedes.
    fn split(v: &str) -> (Option<Vec<u64>>, Option<&str>) {
        let (core, suffix) = match v.find(['-', '+']) {
            Some(index) => (&v[..index], Some(&v[index + 1..])),
            None => (v, None),
        };
        let numbers = core
            .split('.')
            .map(str::parse::<u64>)
            .collect::<Result<Vec<u64>, _>>()
            .ok();
        (numbers, suffix)
    }

    let (a_core, a_suffix) = split(a);
    let (b_core, b_suffix) = split(b);

    match (a_core, b_core) {
        (Some(x), Some(y)) if x != y => return x.cmp(&y),
        (Some(_), Some(_)) => {}
        _ => return a.cmp(b),
    }
    match (a_suffix, b_suffix) {
        (None, None) => Ordering::Equal,
        // No suffix means the release, which outranks any pre-release.
        (None, Some(_)) => Ordering::Greater,
        (Some(_), None) => Ordering::Less,
        (Some(x), Some(y)) => x.cmp(y),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn pkg(name: &str, version: &str, ecosystem: Ecosystem) -> Package {
        Package {
            id: PackageId::new(ecosystem, name, version),
            name: name.into(),
            version: version.into(),
            ecosystem,
            source: Source::Registry {
                registry: "https://registry.npmjs.org".into(),
            },
            has_build_script: false,
            has_script_signal: true,
            dev_only: false,
            platform_specific: None,
            workspace_member: false,
            lockfile: "pnpm-lock.yaml".into(),
        }
    }

    #[test]
    fn versions_compare_numerically_not_lexically() {
        use std::cmp::Ordering;
        assert_eq!(compare_versions("1.9.0", "1.10.0"), Ordering::Less);
        assert_eq!(compare_versions("1.10.0", "1.9.0"), Ordering::Greater);
        assert_eq!(compare_versions("2.0.0", "2.0.0"), Ordering::Equal);
    }

    #[test]
    fn a_prerelease_sorts_below_the_release_it_precedes() {
        use std::cmp::Ordering;
        assert_eq!(compare_versions("1.0.0-rc1", "1.0.0"), Ordering::Less);
        assert_eq!(compare_versions("1.0.0", "1.0.0-rc1"), Ordering::Greater);
        assert_eq!(compare_versions("1.0.0-rc1", "1.0.0-rc1"), Ordering::Equal);
        assert_eq!(compare_versions("1.0.0-rc1", "1.0.0-rc2"), Ordering::Less);
    }

    #[test]
    fn one_version_per_name_is_not_a_duplicate() {
        let mut assembly = Assembly::default();
        assembly.push(pkg("axios", "1.20.0", Ecosystem::Npm));
        assembly.push(pkg("axios", "1.20.0", Ecosystem::Npm));
        assert!(assembly.duplicates().is_empty());
    }

    #[test]
    fn two_versions_of_one_name_are_a_duplicate() {
        let mut assembly = Assembly::default();
        assembly.push(pkg("glob", "7.2.3", Ecosystem::Npm));
        assembly.push(pkg("glob", "11.1.0", Ecosystem::Npm));
        let duplicates = assembly.duplicates();
        assert_eq!(duplicates.len(), 1);
        assert_eq!(duplicates[0].versions, vec!["7.2.3", "11.1.0"]);
        assert_eq!(duplicates[0].lowest, "7.2.3");
    }

    #[test]
    fn the_same_name_in_two_ecosystems_is_not_a_duplicate() {
        let mut assembly = Assembly::default();
        assembly.push(pkg("left-pad", "1.0.0", Ecosystem::Npm));
        assembly.push(pkg("left-pad", "2.0.0", Ecosystem::Crates));
        assert!(assembly.duplicates().is_empty());
    }

    #[test]
    fn workspace_members_are_excluded_from_duplicates() {
        let mut assembly = Assembly::default();
        let mut a = pkg("devopness", "2.8.5", Ecosystem::Pypi);
        a.workspace_member = true;
        let mut b = pkg("devopness", "2.9.0", Ecosystem::Pypi);
        b.workspace_member = true;
        assembly.push(a);
        assembly.push(b);
        assert!(assembly.duplicates().is_empty());
    }
}
