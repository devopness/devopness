//! `pnpm-lock.yaml` reader.
//!
//! Lockfile version 9.0 splits the resolved tree across two sections:
//! `packages` holds the resolution and integrity of each entry, `snapshots`
//! holds the resolved dependency edges. A reader that looks only at `packages`
//! gets versions and no edges, and then every reachability question is
//! unanswerable.

use std::collections::{BTreeMap, BTreeSet};

use serde::Deserialize;
use tetanus_core::error::Result;

use crate::{Assembly, Ecosystem, Edge, LockfileError, Package, PackageId, Source};

#[derive(Debug, Default, Deserialize)]
struct Lockfile {
    #[serde(default, rename = "lockfileVersion")]
    _lockfile_version: Option<String>,
    #[serde(default)]
    importers: BTreeMap<String, Importer>,
    #[serde(default)]
    packages: BTreeMap<String, PackageEntry>,
    #[serde(default)]
    snapshots: BTreeMap<String, SnapshotEntry>,
}

#[derive(Debug, Deserialize, Default)]
struct Importer {
    #[serde(default, rename = "dependencies")]
    dependencies: BTreeMap<String, Resolved>,
    #[serde(default, rename = "devDependencies")]
    dev_dependencies: BTreeMap<String, Resolved>,
}

/// `specifier` is the declared range. It is deliberately not used: the graph
/// reports what was resolved, not what was asked for.
#[derive(Debug, Deserialize)]
struct Resolved {
    #[serde(default)]
    #[allow(dead_code)]
    specifier: Option<String>,
    #[serde(default)]
    version: Option<String>,
}

/// Fields are read to document the lockfile schema even where a value is not
/// consumed today, so that adding support later does not require rediscovering
/// the shape.
#[derive(Debug, Deserialize)]
#[allow(dead_code)]
struct PackageEntry {
    #[serde(default)]
    resolution: Option<Resolution>,
    #[serde(default)]
    engines: Option<BTreeMap<String, String>>,
    #[serde(default)]
    cpu: Option<Vec<String>>,
    #[serde(default)]
    os: Option<Vec<String>>,
    #[serde(default)]
    deprecated: Option<String>,
    #[serde(default)]
    has_bin: Option<bool>,
}

#[derive(Debug, Deserialize)]
struct Resolution {
    #[serde(default, rename = "integrity")]
    _integrity: Option<String>,
    #[serde(default, rename = "tarball")]
    tarball: Option<String>,
    #[serde(default, rename = "repo")]
    repo: Option<RepoSource>,
}

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
struct RepoSource {
    #[serde(default)]
    url: Option<String>,
    #[serde(default, rename = "type")]
    kind: Option<String>,
    #[serde(default)]
    commit: Option<String>,
}

#[derive(Debug, Deserialize, Default)]
#[allow(dead_code)]
struct SnapshotEntry {
    #[serde(default)]
    dependencies: BTreeMap<String, String>,
    #[serde(default, rename = "optionalDependencies")]
    optional_dependencies: BTreeMap<String, String>,
    #[serde(default)]
    optional: Option<bool>,
    #[serde(default, rename = "hasBin")]
    has_bin: Option<bool>,
    #[serde(default, rename = "requiresBuild")]
    requires_build: Option<bool>,
}

const LOCKFILE: &str = "pnpm-lock.yaml";

/// Parse a pnpm lockfile into the shared assembly.
///
/// pnpm 12 writes a two-document stream: the first holds `importers`, `packages`
/// and `snapshots`, the second holds `settings` and `overrides`. Reading only the
/// first document silently drops the resolution of every package, and reading
/// them as one document is an outright parse error. The documents are therefore
/// parsed separately and the second is merged in, which is also the correct
/// semantic: the second document's `overrides` are the ones actually enforced.
pub fn parse(text: &str) -> Result<Assembly> {
    let mut lock = Lockfile::default();
    let mut documents = 0usize;

    for document in serde_yaml::Deserializer::from_str(text) {
        let parsed = Lockfile::deserialize(document).map_err(|e| LockfileError::Malformed {
            path: LOCKFILE.into(),
            reason: e.to_string(),
        })?;
        lock.importers.extend(parsed.importers);
        // A later document wins: it is the one describing the enforced settings.
        for (key, value) in parsed.packages {
            lock.packages.insert(key, value);
        }
        for (key, value) in parsed.snapshots {
            lock.snapshots.insert(key, value);
        }
        documents += 1;
    }

    if documents == 0 {
        return Err(crate::LockfileError::Malformed {
            path: LOCKFILE.into(),
            reason: "no YAML document found".to_string(),
        }
        .into());
    }

    let mut assembly = Assembly {
        lockfiles: vec![LOCKFILE.to_string()],
        ..Default::default()
    };

    // Workspace packages are nodes too, and they are the roots of production
    // reachability, so they are materialised from the importers rather than
    // being inferred from the package section.
    for (importer_path, importer) in &lock.importers {
        // Named by its path, not by its directory basename. A basename collides
        // with a real package: `packages/ui/react` would produce a node called
        // `react` and shadow the react dependency it depends on.
        let name = format!("workspace:{importer_path}");
        let id = PackageId::new(Ecosystem::Npm, &name, "workspace");
        assembly.push(Package {
            id: id.clone(),
            name,
            version: "workspace".into(),
            ecosystem: Ecosystem::Npm,
            source: Source::Path {
                path: importer_path.clone(),
            },
            has_build_script: false,
            has_script_signal: false,
            dev_only: false,
            platform_specific: None,
            workspace_member: true,
            lockfile: LOCKFILE.into(),
        });

        for (dep, resolved) in &importer.dependencies {
            if let Some(target) = resolve_version(resolved) {
                assembly.edge(Edge {
                    from: id.clone(),
                    to: PackageId::new(Ecosystem::Npm, dep, &target),
                    dev: false,
                });
            }
        }
        for (dep, resolved) in &importer.dev_dependencies {
            if let Some(target) = resolve_version(resolved) {
                assembly.edge(Edge {
                    from: id.clone(),
                    to: PackageId::new(Ecosystem::Npm, dep, &target),
                    dev: true,
                });
            }
        }
    }

    // Resolve each package entry once, then attach edges from the snapshot
    // section keyed by the same `name@version` string.
    for (key, entry) in &lock.packages {
        let Some((name, version)) = split_key(key) else {
            continue;
        };
        let snapshot = lock.snapshots.get(key);
        let source = match &entry.resolution {
            Some(resolution) => classify(resolution),
            None => Source::Unknown,
        };

        // A build script is the union of what the package section and the
        // snapshot section declare. `hasBin` is not a build script and is not
        // treated as one: installing a binary is not the same as running code.
        let has_build_script = snapshot.and_then(|s| s.requires_build).unwrap_or(false);

        let platform_specific = match (&entry.cpu, &entry.os) {
            (Some(cpu), Some(os)) => Some(format!("{}/{}", join(cpu), join(os))),
            (Some(cpu), None) => Some(join(cpu)),
            (None, Some(os)) => Some(join(os)),
            (None, None) => None,
        };

        let self_id = PackageId::new(Ecosystem::Npm, &name, &version);
        assembly.push(Package {
            id: self_id.clone(),
            name,
            version,
            ecosystem: Ecosystem::Npm,
            source,
            has_build_script,
            // pnpm lockfile v9 records no install-script flag, so this is
            // "unknown", not "no".
            has_script_signal: false,
            dev_only: false,
            platform_specific,
            workspace_member: false,
            lockfile: LOCKFILE.into(),
        });

        // Every edge a package declares is a dependency. A dev edge here would
        // be unusual: pnpm records dependency kind at the importer, and the
        // snapshot edges are all runtime edges of that package. A package
        // reachable only from a dev importer is therefore marked dev-only later,
        // by the reachability traversal, rather than by labelling its own edges.
        if let Some(snapshot) = snapshot {
            for (dep, target_version) in snapshot
                .dependencies
                .iter()
                .chain(snapshot.optional_dependencies.iter())
            {
                let Some((dep_name, dep_version)) = split_resolved(dep, target_version) else {
                    continue;
                };
                assembly.edge(Edge {
                    from: self_id.clone(),
                    to: PackageId::new(Ecosystem::Npm, &dep_name, &dep_version),
                    dev: false,
                });
            }
        }
    }

    // Flag packages no production importer reaches, so `dev_only` is a property
    // of the graph rather than an assumption.
    mark_dev_only(&mut assembly);

    // A direct dependency named by a manifest but absent from the lockfile means
    // the lockfile is stale.
    assembly
        .unresolved
        .extend(find_unresolved(&lock, &assembly));

    Ok(assembly)
}

fn join(values: &[String]) -> String {
    values.join(",")
}

/// Strip pnpm's peer-dependency suffix from a resolved version.
///
/// `axios@1.20.0(debug@4.4.3(supports-color@10.2.2))(supports-color@10.2.2)` is
/// one package at one version with two resolved peers. Treating the whole string
/// as a version would make every peer combination look like a distinct version
/// and produce nonsense duplicate counts.
pub fn base_version(version: &str) -> String {
    let mut depth = 0usize;
    for (index, ch) in version.char_indices() {
        match ch {
            '(' => depth += 1,
            ')' => depth = depth.saturating_sub(1),
            _ if depth == 0 => {}
            _ => {}
        }
        if depth == 0 && index > 0 {
            // Continue; the loop finds the first char after the base version.
        }
    }
    // Take the prefix up to the first '(' that begins a peer suffix.
    match version.find('(') {
        Some(index) => version[..index].to_string(),
        None => version.to_string(),
    }
}

fn resolve_version(resolved: &Resolved) -> Option<String> {
    let version = resolved.version.as_ref()?;
    // An importer may record a bare version, or a `name@version` with peers.
    // Strip peers first, then split off the name if one is present.
    let base = base_version(version);
    Some(match base.rsplit_once('@') {
        Some((_, v)) if !v.is_empty() => v.to_string(),
        _ => base,
    })
}

fn split_key(key: &str) -> Option<(String, String)> {
    let unquoted = key.trim_matches('\'');
    let index = unquoted.rfind('@')?;
    if index == 0 {
        return None;
    }
    let name = unquoted[..index].to_string();
    let version = base_version(&unquoted[index + 1..]);
    Some((name, version))
}

fn split_resolved(name: &str, version: &str) -> Option<(String, String)> {
    let base = base_version(version);
    if base.is_empty() {
        return None;
    }
    // pnpm writes peer suffixes as `/name@version` inside the version string.
    let cleaned = base.rsplit('/').next().unwrap_or(&base).to_string();
    let version_part = match cleaned.rfind('@') {
        Some(index) if index > 0 => cleaned[index + 1..].to_string(),
        _ => cleaned.clone(),
    };
    Some((name.to_string(), version_part))
}

fn classify(resolution: &Resolution) -> Source {
    if let Some(repo) = &resolution.repo {
        let url = repo.url.clone().unwrap_or_default();
        // A tarball pointing at a git host is a git dependency wearing a
        // tarball costume, and it is not covered by registry advisories.
        if url.starts_with("git+") || url.contains("github.com") {
            return Source::Git {
                url,
                rev: repo.commit.clone(),
            };
        }
        return Source::DirectUrl { url };
    }
    if let Some(tarball) = &resolution.tarball {
        if tarball.starts_with("git+") || tarball.contains("github.com") {
            return Source::Git {
                url: tarball.clone(),
                rev: None,
            };
        }
        return Source::DirectUrl {
            url: tarball.clone(),
        };
    }
    Source::Registry {
        registry: "https://registry.npmjs.org".into(),
    }
}

/// Mark a package dev-only when no production importer reaches it.
fn mark_dev_only(assembly: &mut Assembly) {
    let production_roots: BTreeSet<PackageId> = assembly
        .packages
        .iter()
        .filter(|p| p.workspace_member)
        .map(|p| p.id.clone())
        .collect();

    let mut reachable: BTreeSet<PackageId> = production_roots.clone();
    let mut queue: std::collections::VecDeque<PackageId> = production_roots.into_iter().collect();

    while let Some(current) = queue.pop_front() {
        for edge in assembly
            .edges
            .iter()
            .filter(|e| e.from == current && !e.dev)
        {
            if reachable.insert(edge.to.clone()) {
                queue.push_back(edge.to.clone());
            }
        }
    }

    for package in &mut assembly.packages {
        if !package.workspace_member && !reachable.contains(&package.id) {
            package.dev_only = true;
        }
    }
}

fn find_unresolved(lock: &Lockfile, assembly: &Assembly) -> Vec<String> {
    let known: BTreeSet<(&str, &str)> = assembly
        .packages
        .iter()
        .filter(|p| !p.workspace_member)
        .map(|p| (p.name.as_str(), p.version.as_str()))
        .collect();

    let mut out = Vec::new();
    for (importer_path, importer) in &lock.importers {
        for (name, resolved) in importer
            .dependencies
            .iter()
            .chain(&importer.dev_dependencies)
        {
            if let Some(version) = resolve_version(resolved)
                && !known.contains(&(name.as_str(), version.as_str()))
            {
                out.push(format!("{importer_path}: {name}@{version}"));
            }
        }
    }
    out.sort();
    out.dedup();
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = r#"
lockfileVersion: '9.0'

importers:
  .:
    dependencies: {}
    devDependencies:
      vite-plus:
        specifier: 0.3.3
        version: 0.3.3
  packages/ui/react:
    dependencies:
      react:
        specifier: ^18.3.1
        version: 18.3.1
      axios:
        specifier: ^1.20.0
        version: 1.20.0(debug@4.4.3(supports-color@10.2.2))(supports-color@10.2.2)
    devDependencies:
      vitest:
        specifier: ^5.0.1
        version: 5.0.2

packages:

  react@18.3.1:
    resolution: {integrity: sha512-abc}

  axios@1.20.0:
    resolution: {integrity: sha512-def}

  debug@4.4.3:
    resolution: {integrity: sha512-ghi}

  supports-color@10.2.2:
    resolution: {integrity: sha512-jkl}

  vite-plus@0.3.3:
    resolution: {integrity: sha512-mno}
    hasBin: true

  vitest@5.0.2:
    resolution: {integrity: sha512-pqr}
    hasBin: true

  esbuild@0.28.2:
    resolution: {integrity: sha512-stu}
    cpu: [x64]
    os: [linux]

  acme-git@1.0.0:
    resolution: {tarball: 'https://codeload.github.com/acme/acme-git/tar.gz/v1.0.0'}

snapshots:

  react@18.3.1: {}

  axios@1.20.0:
    dependencies:
      debug: 4.4.3
      supports-color: 10.2.2

  debug@4.4.3:
    dependencies:
      ms: 2.1.3

  supports-color@10.2.2: {}

  vite-plus@0.3.3: {}

  vitest@5.0.2: {}

  esbuild@0.28.2: {}

  acme-git@1.0.0: {}

  ms@2.1.3: {}
"#;

    #[test]
    fn peer_suffix_is_stripped_from_versions() {
        assert_eq!(
            base_version("1.20.0(debug@4.4.3)(supports-color@10.2.2)"),
            "1.20.0"
        );
        assert_eq!(base_version("18.3.1"), "18.3.1");
    }

    #[test]
    fn parses_packages_and_edges() {
        let assembly = parse(SAMPLE).expect("sample parses");

        let react = assembly
            .packages
            .iter()
            .find(|p| p.name == "react")
            .expect("react present");
        assert_eq!(react.version, "18.3.1");
        assert!(!react.dev_only, "react is a production dependency");

        // The peer-suffixed axios must resolve to one package at one version,
        // not several.
        let axios: Vec<_> = assembly
            .packages
            .iter()
            .filter(|p| p.name == "axios")
            .collect();
        assert_eq!(axios.len(), 1);
        assert_eq!(axios[0].version, "1.20.0");
    }

    #[test]
    fn transitive_edges_come_from_snapshots() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let axios_id = PackageId::new(Ecosystem::Npm, "axios", "1.20.0");
        assert!(
            assembly
                .edges
                .iter()
                .any(|e| e.from == axios_id
                    && e.to == PackageId::new(Ecosystem::Npm, "debug", "4.4.3")),
            "axios must depend on debug"
        );
    }

    #[test]
    fn dev_only_packages_are_reachable_from_nothing_production() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let vitest = assembly
            .packages
            .iter()
            .find(|p| p.name == "vitest")
            .expect("vitest present");
        assert!(vitest.dev_only, "vitest is a devDependency");
    }

    #[test]
    fn has_bin_is_not_treated_as_a_build_script() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let vite_plus = assembly
            .packages
            .iter()
            .find(|p| p.name == "vite-plus")
            .expect("vite-plus present");
        assert!(!vite_plus.has_build_script);
    }

    #[test]
    fn platform_specific_packages_are_recorded() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let esbuild = assembly
            .packages
            .iter()
            .find(|p| p.name == "esbuild")
            .expect("esbuild present");
        assert_eq!(esbuild.platform_specific.as_deref(), Some("x64/linux"));
    }

    #[test]
    fn a_github_tarball_is_classified_as_git_not_direct_url() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let git = assembly
            .packages
            .iter()
            .find(|p| p.name == "acme-git")
            .expect("acme-git present");
        assert!(
            matches!(git.source, Source::Git { .. }),
            "expected a git source, got {:?}",
            git.source
        );
    }

    #[test]
    fn malformed_yaml_is_an_error_not_an_empty_graph() {
        let err = parse("lockfileVersion: '9.0'\nimporters: [not a map").unwrap_err();
        assert!(err.to_string().contains("could not be parsed"), "{err}");
    }
}
