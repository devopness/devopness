use std::collections::{BTreeMap, BTreeSet};

use serde::{Deserialize, Serialize};
use tetanus_core::error::Result;

use crate::Ecosystem;

/// Stable identity of a resolved package.
///
/// Version is part of the identity because two versions of one name are two
/// copies of the code. An advisory against one does not cover the other, so
/// collapsing them would understate the risk exactly where it matters.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct PackageId(String);

impl PackageId {
    pub fn new(ecosystem: Ecosystem, name: &str, version: &str) -> Self {
        Self(format!("{}:{}@{}", ecosystem.as_str(), name, version))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }

    /// The package name, without ecosystem or version.
    pub fn name(&self) -> &str {
        let rest = self.0.split_once(':').map(|(_, r)| r).unwrap_or(&self.0);
        match rest.rfind('@') {
            // A scoped npm name starts with `@`, so the separator is the last
            // `@` and a name containing no version has none.
            Some(index) if index > 0 => &rest[..index],
            _ => rest,
        }
    }

    pub fn version(&self) -> &str {
        let rest = self.0.split_once(':').map(|(_, r)| r).unwrap_or(&self.0);
        match rest.rfind('@') {
            Some(index) if index > 0 => &rest[index + 1..],
            _ => "",
        }
    }

    pub fn ecosystem(&self) -> Option<Ecosystem> {
        match self.0.split(':').next()? {
            "npm" => Some(Ecosystem::Npm),
            "pypi" => Some(Ecosystem::Pypi),
            "crates.io" => Some(Ecosystem::Crates),
            _ => None,
        }
    }
}

impl std::fmt::Display for PackageId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.0)
    }
}

/// Which part of the build a package is reachable from.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Scope {
    Production,
    TestOnly,
}

impl Scope {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Production => "production",
            Self::TestOnly => "test_only",
        }
    }
}

/// The assembled dependency graph with its derived measurements.
pub struct DepGraph {
    packages: Vec<crate::Package>,
    edges: Vec<crate::Edge>,
    by_id: std::collections::BTreeMap<PackageId, usize>,
    /// Names declared as direct dependencies but absent from the lockfile.
    unresolved: Vec<String>,
    lockfiles: Vec<String>,
    /// Packages whose install scripts the workspace policy permits.
    permitted_builds: BTreeSet<String>,
}

impl DepGraph {
    pub fn new(assembly: crate::Assembly, permitted_builds: BTreeSet<String>) -> Self {
        // The same package can appear in two lockfiles: `esbuild` is in both the
        // pnpm workspace and the `docs` npm lockfile. Records are merged rather
        // than deduplicated, because the two carry different information and
        // the one that is kept has to be the more informative. Plain
        // `dedup_by` after sorting silently discarded the npm lockfile's
        // `hasInstallScript` in favour of the pnpm record, which has no such
        // field, and the install-script count came out as zero.
        let mut packages: Vec<crate::Package> = Vec::with_capacity(assembly.packages.len());
        let mut by_id: BTreeMap<PackageId, usize> = BTreeMap::new();
        for package in assembly.packages {
            match by_id.get(&package.id) {
                None => {
                    by_id.insert(package.id.clone(), packages.len());
                    packages.push(package);
                }
                Some(&index) => {
                    let existing = &mut packages[index];
                    // A lockfile that records the install-script signal beats one
                    // that cannot.
                    if package.has_script_signal && !existing.has_script_signal {
                        existing.has_build_script = package.has_build_script;
                    }
                    existing.has_script_signal |= package.has_script_signal;
                    existing.dev_only &= package.dev_only;
                    // A workspace member in any lockfile is a workspace member.
                    existing.workspace_member |= package.workspace_member;
                    if existing.source == crate::Source::Unknown {
                        existing.source = package.source;
                    }
                    if existing.platform_specific.is_none() {
                        existing.platform_specific = package.platform_specific;
                    }
                    let mut lockfiles = vec![existing.lockfile.clone()];
                    lockfiles.push(package.lockfile);
                    lockfiles.sort();
                    lockfiles.dedup();
                    existing.lockfile = lockfiles.join(",");
                }
            }
        }
        packages.sort_by(|a, b| a.id.cmp(&b.id));

        let by_id: BTreeMap<PackageId, usize> = packages
            .iter()
            .enumerate()
            .map(|(index, p)| (p.id.clone(), index))
            .collect();

        // Edges whose endpoints are not in the package set are dropped rather
        // than retained as dangling references, because a dangling edge would
        // make a traversal silently under-count reachability.
        let edges: Vec<crate::Edge> = assembly
            .edges
            .into_iter()
            .filter(|e| by_id.contains_key(&e.from) && by_id.contains_key(&e.to))
            .collect();

        Self {
            packages,
            edges,
            by_id,
            unresolved: assembly.unresolved,
            lockfiles: assembly.lockfiles,
            permitted_builds,
        }
    }

    pub fn packages(&self) -> &[crate::Package] {
        &self.packages
    }

    pub fn edges(&self) -> &[crate::Edge] {
        &self.edges
    }

    pub fn lockfiles(&self) -> &[String] {
        &self.lockfiles
    }

    pub fn unresolved(&self) -> &[String] {
        &self.unresolved
    }

    /// Non-dev edges out of a package.
    fn production_edges(&self, id: &PackageId) -> Vec<&PackageId> {
        self.edges
            .iter()
            .filter(|e| &e.from == id && !e.dev)
            .map(|e| &e.to)
            .collect()
    }

    /// Packages reachable from the given roots by following non-dev edges only.
    ///
    /// Iterative rather than recursive, and driven by a sorted worklist, so the
    /// result depends on the graph alone and never on insertion order.
    pub fn production_reachable(
        &self,
        roots: &[PackageId],
    ) -> std::collections::BTreeSet<PackageId> {
        let mut seen: std::collections::BTreeSet<PackageId> = std::collections::BTreeSet::new();
        let mut queue: std::collections::VecDeque<PackageId> = std::collections::VecDeque::new();

        for root in roots {
            if seen.insert(root.clone()) {
                queue.push_back(root.clone());
            }
        }

        while let Some(current) = queue.pop_front() {
            for target in self.production_edges(&current) {
                if seen.insert(target.clone()) {
                    queue.push_back(target.clone());
                }
            }
        }
        seen
    }

    /// Workspace packages that are published, and therefore the roots of
    /// production reachability.
    pub fn production_roots(&self) -> Vec<PackageId> {
        self.packages
            .iter()
            .filter(|p| p.workspace_member)
            .map(|p| p.id.clone())
            .collect()
    }

    /// Classify every third-party package by whether production code can reach
    /// it.
    ///
    /// A package no published package depends on at all is `TestOnly` by
    /// elimination. That is the conservative direction: it can only understate
    /// production exposure if a published package depends on something through a
    /// path this traversal cannot see, which for a lockfile-derived graph is not
    /// possible.
    pub fn scopes(&self) -> std::collections::BTreeMap<PackageId, Scope> {
        let reachable = self.production_reachable(&self.production_roots());
        self.packages
            .iter()
            .map(|p| {
                let scope = if reachable.contains(&p.id) {
                    Scope::Production
                } else {
                    Scope::TestOnly
                };
                (p.id.clone(), scope)
            })
            .collect()
    }

    pub fn duplicates(&self) -> Vec<crate::Duplicate> {
        let mut assembly = crate::Assembly {
            packages: self.packages.clone(),
            edges: Vec::new(),
            lockfiles: self.lockfiles.clone(),
            unresolved: Vec::new(),
        };
        assembly.packages.dedup();
        assembly.duplicates()
    }

    /// Direct dependencies: what a manifest names, as opposed to what the
    /// lockfile resolved transitively.
    pub fn direct_dependencies(&self) -> Vec<&crate::Package> {
        let referenced: std::collections::BTreeSet<&PackageId> =
            self.edges.iter().map(|e| &e.to).collect();
        self.packages
            .iter()
            .filter(|p| p.is_third_party() && referenced.contains(&p.id))
            .collect()
    }

    pub fn metrics(&self) -> Metrics {
        let scopes = self.scopes();
        let build_script_availability = self.build_script_availability();
        let third_party: Vec<&crate::Package> = self
            .packages
            .iter()
            .filter(|p| p.is_third_party())
            .collect();

        let build_scripts: Vec<&crate::Package> = third_party
            .iter()
            .copied()
            .filter(|p| p.has_build_script)
            .collect();
        let permitted = build_scripts
            .iter()
            .filter(|p| self.permitted_builds.contains(&p.name))
            .count();

        Metrics {
            lockfiles_read: self.lockfiles.len(),
            total_packages: self.packages.len(),
            third_party_packages: third_party.len(),
            direct_dependencies: self.direct_dependencies().len(),
            transitive_dependencies: third_party.len(),
            duplicate_names: self.duplicates().len(),
            duplicate_copies: self
                .duplicates()
                .iter()
                .map(|d| d.versions.len().saturating_sub(1))
                .sum(),
            build_script_packages: build_scripts.len(),
            permitted_build_scripts: permitted,
            git_dependencies: third_party
                .iter()
                .filter(|p| matches!(p.source, crate::Source::Git { .. }))
                .count(),
            direct_url_dependencies: third_party
                .iter()
                .filter(|p| matches!(p.source, crate::Source::DirectUrl { .. }))
                .count(),
            unknown_sources: third_party
                .iter()
                .filter(|p| matches!(p.source, crate::Source::Unknown))
                .count(),
            production_packages: scopes.values().filter(|s| **s == Scope::Production).count(),
            test_only_packages: scopes.values().filter(|s| **s == Scope::TestOnly).count(),
            unresolved_direct_dependencies: self.unresolved.len(),
            platform_specific_packages: third_party
                .iter()
                .filter(|p| p.platform_specific.is_some())
                .count(),
            build_script_availability,
        }
    }

    /// Which lockfiles can report install scripts.
    ///
    /// Keyed by lockfile, not by ecosystem, because the pnpm workspace and the
    /// `docs` npm lockfile are both npm and only one of them records the flag.
    /// Deriving this from the readers rather than declaring it by hand means a
    /// new reader cannot quietly widen the blind spot.
    fn build_script_availability(&self) -> Availability {
        // Split a merged `lockfile` field back apart.
        let sources_of = |package: &crate::Package| -> Vec<String> {
            package.lockfile.split(',').map(str::to_string).collect()
        };

        let mut all_sources: Vec<String> = Vec::new();
        for package in &self.packages {
            for source in sources_of(package) {
                if !all_sources.contains(&source) {
                    all_sources.push(source);
                }
            }
        }
        all_sources.sort();

        let mut measured_in: Vec<String> = Vec::new();
        let mut unmeasurable_in: Vec<String> = Vec::new();
        let mut reason: Vec<String> = Vec::new();

        for source in &all_sources {
            let third_party: Vec<&crate::Package> = self
                .packages
                .iter()
                .filter(|p| sources_of(p).iter().any(|s| s == source) && p.is_third_party())
                .collect();

            // Only a lockfile that actually contributed third-party packages
            // makes a claim about them. A lockfile that contributed none is
            // reported separately rather than counted as coverage.
            if third_party.is_empty() {
                continue;
            }

            if third_party.iter().any(|p| p.has_script_signal) {
                measured_in.push(source.clone());
            } else {
                unmeasurable_in.push(source.clone());
                reason.push(format!(
                    "{source}: {}",
                    match source.as_str() {
                        s if s.contains("package-lock.json") => {
                            "unexpected: the npm lockfile format does record hasInstallScript"
                        }
                        s if s.contains("pnpm-lock.yaml") => {
                            "records no install-script flag; the npm lockfile format is the only one that does"
                        }
                        s if s.contains("uv.lock") => {
                            "uv installs published wheels for locked dependencies, so no build step runs"
                        }
                        s if s.contains("Cargo.lock") => {
                            "records nothing about which crates declare build.rs"
                        }
                        _ => "no install-script signal is recorded",
                    }
                ));
            }
        }

        Availability {
            measured_in,
            unmeasurable_in,
            reason,
        }
    }

    /// Packages that are not reachable from a registry, which is the only source
    /// that publishes advisories.
    pub fn non_registry(&self) -> Vec<&crate::Package> {
        self.packages
            .iter()
            .filter(|p| p.is_third_party() && !p.source.is_advisory_covered())
            .collect()
    }

    /// Install scripts that the workspace policy permits.
    pub fn permitted_build_script_packages(&self) -> Vec<&crate::Package> {
        self.packages
            .iter()
            .filter(|p| p.has_build_script && self.permitted_builds.contains(&p.name))
            .collect()
    }

    /// Install scripts present in the tree that no policy entry covers. These
    /// are blocked by default, and the count is reported so that adding a build
    /// script is visible rather than silent.
    pub fn unpermitted_build_script_packages(&self) -> Vec<&crate::Package> {
        self.packages
            .iter()
            .filter(|p| p.has_build_script && !self.permitted_builds.contains(&p.name))
            .collect()
    }

    /// The dependency closure of a package, used by `tetanus deps tree`.
    pub fn closure(&self, root: &PackageId) -> Result<Vec<PackageId>> {
        let mut seen = std::collections::BTreeSet::new();
        let mut queue = std::collections::VecDeque::new();
        if self.by_id.contains_key(root) {
            seen.insert(root.clone());
            queue.push_back(root.clone());
        }
        while let Some(current) = queue.pop_front() {
            for edge in self.edges.iter().filter(|e| e.from == current) {
                if seen.insert(edge.to.clone()) {
                    queue.push_back(edge.to.clone());
                }
            }
        }
        Ok(seen.into_iter().collect())
    }
}

/// Whether a metric could be measured at all.
///
/// This exists because a lockfile does not always record what a metric needs.
/// pnpm lockfile version 9 carries no `requiresBuild` flag, so the count of npm
/// install scripts in the pnpm workspace is genuinely unknown, not zero. A
/// report that said zero would read as "no package runs code at install time",
/// which is the most reassuring possible wrong answer.
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct Availability {
    /// Lockfiles whose format records the signal this metric needs.
    pub measured_in: Vec<String>,
    /// Lockfiles whose format does not record it.
    pub unmeasurable_in: Vec<String>,
    /// Why, in one line per lockfile.
    pub reason: Vec<String>,
}

impl Availability {
    pub fn complete(&self) -> bool {
        self.unmeasurable_in.is_empty()
    }
}

/// Measurements the ratchet compares against a baseline.
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct Metrics {
    pub lockfiles_read: usize,
    pub total_packages: usize,
    pub third_party_packages: usize,
    pub direct_dependencies: usize,
    pub transitive_dependencies: usize,
    pub duplicate_names: usize,
    /// Extra copies beyond the first of each duplicated name.
    pub duplicate_copies: usize,
    pub build_script_packages: usize,
    pub permitted_build_scripts: usize,
    pub git_dependencies: usize,
    pub direct_url_dependencies: usize,
    pub unknown_sources: usize,
    pub production_packages: usize,
    pub test_only_packages: usize,
    pub unresolved_direct_dependencies: usize,
    pub platform_specific_packages: usize,
    /// Whether `build_script_packages` is fully measured, and where it is not.
    pub build_script_availability: Availability,
}

impl Metrics {
    /// `(metric name, value)` pairs, sorted by name for stable output.
    pub fn as_pairs(&self) -> Vec<(String, f64)> {
        let mut pairs: Vec<(String, f64)> = vec![
            ("dependency_surface".into(), self.direct_dependencies as f64),
            (
                "transitive_dependencies".into(),
                self.transitive_dependencies as f64,
            ),
            (
                "duplicate_dependency_names".into(),
                self.duplicate_names as f64,
            ),
            (
                "duplicate_dependency_copies".into(),
                self.duplicate_copies as f64,
            ),
            (
                "build_script_packages".into(),
                self.build_script_packages as f64,
            ),
            (
                "permitted_build_scripts".into(),
                self.permitted_build_scripts as f64,
            ),
            ("git_dependencies".into(), self.git_dependencies as f64),
            (
                "direct_url_dependencies".into(),
                self.direct_url_dependencies as f64,
            ),
            (
                "unknown_dependency_sources".into(),
                self.unknown_sources as f64,
            ),
            (
                "production_reachable_dependencies".into(),
                self.production_packages as f64,
            ),
            (
                "test_only_dependencies".into(),
                self.test_only_packages as f64,
            ),
            (
                "unresolved_direct_dependencies".into(),
                self.unresolved_direct_dependencies as f64,
            ),
            (
                "platform_specific_dependencies".into(),
                self.platform_specific_packages as f64,
            ),
        ];
        pairs.sort_by(|a, b| a.0.cmp(&b.0));
        pairs
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{Assembly, Ecosystem, Edge, Package, Source};

    fn pkg(
        name: &str,
        version: &str,
        ecosystem: Ecosystem,
        lockfile: &str,
        signal: bool,
        build_script: bool,
    ) -> Package {
        Package {
            id: PackageId::new(ecosystem, name, version),
            name: name.into(),
            version: version.into(),
            ecosystem,
            source: Source::Registry {
                registry: "https://registry.npmjs.org".into(),
            },
            has_build_script: build_script,
            has_script_signal: signal,
            dev_only: false,
            platform_specific: None,
            workspace_member: false,
            lockfile: lockfile.into(),
        }
    }

    fn graph(packages: Vec<Package>, edges: Vec<Edge>, permitted: &[&str]) -> DepGraph {
        DepGraph::new(
            Assembly {
                packages,
                edges,
                lockfiles: vec!["test".into()],
                unresolved: Vec::new(),
            },
            permitted.iter().map(|s| (*s).to_string()).collect(),
        )
    }

    /// The regression this pins: the same package in two lockfiles, one of which
    /// records an install script and one of which cannot. Dedup by id kept the
    /// uninformative record and the count came out as zero.
    #[test]
    fn a_merged_package_keeps_the_install_script_signal() {
        let g = graph(
            vec![
                pkg(
                    "esbuild",
                    "0.28.2",
                    Ecosystem::Npm,
                    "pnpm-lock.yaml",
                    false,
                    false,
                ),
                pkg(
                    "esbuild",
                    "0.28.2",
                    Ecosystem::Npm,
                    "docs/package-lock.json",
                    true,
                    true,
                ),
            ],
            Vec::new(),
            &["esbuild"],
        );
        assert_eq!(g.packages().len(), 1, "one package, not two");
        assert!(
            g.packages()[0].has_build_script,
            "the signal survives the merge"
        );
        assert!(g.packages()[0].has_script_signal);
        assert_eq!(g.metrics().build_script_packages, 1);
    }

    #[test]
    fn merging_never_loses_a_build_script_to_a_signal_free_record() {
        // Reversed order, to prove the outcome does not depend on which
        // lockfile was read first.
        let g = graph(
            vec![
                pkg(
                    "esbuild",
                    "0.28.2",
                    Ecosystem::Npm,
                    "docs/package-lock.json",
                    true,
                    true,
                ),
                pkg(
                    "esbuild",
                    "0.28.2",
                    Ecosystem::Npm,
                    "pnpm-lock.yaml",
                    false,
                    false,
                ),
            ],
            Vec::new(),
            &[],
        );
        assert!(g.packages()[0].has_build_script);
        assert_eq!(g.metrics().build_script_packages, 1);
    }

    #[test]
    fn a_permitted_build_script_is_separated_from_a_blocked_one() {
        let g = graph(
            vec![
                pkg(
                    "esbuild",
                    "0.28.2",
                    Ecosystem::Npm,
                    "docs/package-lock.json",
                    true,
                    true,
                ),
                pkg(
                    "fsevents",
                    "2.3.3",
                    Ecosystem::Npm,
                    "docs/package-lock.json",
                    true,
                    true,
                ),
            ],
            Vec::new(),
            &["esbuild"],
        );
        assert_eq!(g.permitted_build_script_packages().len(), 1);
        assert_eq!(g.unpermitted_build_script_packages().len(), 1);
        assert_eq!(g.metrics().permitted_build_scripts, 1);
    }

    #[test]
    fn availability_is_keyed_by_lockfile_not_by_ecosystem() {
        let g = graph(
            vec![
                pkg(
                    "axios",
                    "1.20.0",
                    Ecosystem::Npm,
                    "pnpm-lock.yaml",
                    false,
                    false,
                ),
                pkg(
                    "esbuild",
                    "0.28.2",
                    Ecosystem::Npm,
                    "docs/package-lock.json",
                    true,
                    true,
                ),
            ],
            Vec::new(),
            &[],
        );
        let availability = g.metrics().build_script_availability;
        assert!(
            availability
                .measured_in
                .contains(&"docs/package-lock.json".to_string())
        );
        assert!(
            availability
                .unmeasurable_in
                .contains(&"pnpm-lock.yaml".to_string())
        );
        assert!(!availability.complete());
    }

    #[test]
    fn a_dev_edge_does_not_make_a_package_production_reachable() {
        let root = Package {
            id: PackageId::new(Ecosystem::Npm, "workspace:app", "workspace"),
            name: "workspace:app".into(),
            version: "workspace".into(),
            ecosystem: Ecosystem::Npm,
            source: Source::Path { path: ".".into() },
            has_build_script: false,
            has_script_signal: true,
            dev_only: false,
            platform_specific: None,
            workspace_member: true,
            lockfile: "pnpm-lock.yaml".into(),
        };
        let g = graph(
            vec![
                root.clone(),
                pkg(
                    "vitest",
                    "5.0.2",
                    Ecosystem::Npm,
                    "pnpm-lock.yaml",
                    false,
                    false,
                ),
                pkg(
                    "ms",
                    "2.1.3",
                    Ecosystem::Npm,
                    "pnpm-lock.yaml",
                    false,
                    false,
                ),
            ],
            vec![
                Edge {
                    from: root.id.clone(),
                    to: PackageId::new(Ecosystem::Npm, "vitest", "5.0.2"),
                    dev: true,
                },
                Edge {
                    from: PackageId::new(Ecosystem::Npm, "vitest", "5.0.2"),
                    to: PackageId::new(Ecosystem::Npm, "ms", "2.1.3"),
                    dev: false,
                },
            ],
            &[],
        );
        let scopes = g.scopes();
        assert_eq!(
            scopes[&PackageId::new(Ecosystem::Npm, "vitest", "5.0.2")],
            Scope::TestOnly
        );
        // A transitive dependency of a test-only package is itself test-only.
        assert_eq!(
            scopes[&PackageId::new(Ecosystem::Npm, "ms", "2.1.3")],
            Scope::TestOnly
        );
    }

    #[test]
    fn metrics_are_reported_in_a_stable_order() {
        let g = graph(vec![], Vec::new(), &[]);
        let pairs = g.metrics().as_pairs();
        let mut sorted = pairs.clone();
        sorted.sort_by(|a, b| a.0.cmp(&b.0));
        assert_eq!(pairs, sorted);
    }

    #[test]
    fn a_closure_is_deterministic() {
        let root = Package {
            id: PackageId::new(Ecosystem::Crates, "tetanus", "0.1.0"),
            name: "tetanus".into(),
            version: "0.1.0".into(),
            ecosystem: Ecosystem::Crates,
            source: Source::Path { path: ".".into() },
            has_build_script: false,
            has_script_signal: false,
            dev_only: false,
            platform_specific: None,
            workspace_member: true,
            lockfile: "Cargo.lock".into(),
        };
        let g = graph(
            vec![
                root.clone(),
                pkg(
                    "serde",
                    "1.0.0",
                    Ecosystem::Crates,
                    "Cargo.lock",
                    false,
                    false,
                ),
                pkg(
                    "blake3",
                    "1.5.5",
                    Ecosystem::Crates,
                    "Cargo.lock",
                    false,
                    false,
                ),
            ],
            vec![
                Edge {
                    from: root.id.clone(),
                    to: PackageId::new(Ecosystem::Crates, "serde", "1.0.0"),
                    dev: false,
                },
                Edge {
                    from: root.id.clone(),
                    to: PackageId::new(Ecosystem::Crates, "blake3", "1.5.5"),
                    dev: false,
                },
            ],
            &[],
        );
        let a = g.closure(&root.id).expect("closure");
        let b = g.closure(&root.id).expect("closure");
        assert_eq!(a, b);
        assert_eq!(a.len(), 3);
    }
}
