//! `uv.lock` reader.
//!
//! uv records a package's own version in the lockfile alongside the project's,
//! so a version bump makes the lock stale. That coupling is why CI regenerates
//! the lock after syncing a version, and it is why a lockfile that disagrees
//! with the manifest is an error rather than a warning.

use std::collections::BTreeMap;

use serde::Deserialize;
use tetanus_core::error::Result;

use crate::{Assembly, Ecosystem, Edge, LockfileError, Package, PackageId, Source};

const LOCKFILE: &str = "packages/sdks/python/uv.lock";

#[derive(Debug, Deserialize)]
struct UvLock {
    #[serde(default)]
    package: Vec<UvPackage>,
}

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
struct UvPackage {
    name: String,
    version: String,
    #[serde(default)]
    source: Option<toml::Value>,
    #[serde(default)]
    dependencies: Option<Vec<UvDep>>,
    #[serde(default, rename = "dev-dependencies")]
    dev_dependencies: Option<BTreeMap<String, Vec<UvDep>>>,
    #[serde(default)]
    optional: Option<bool>,
}

#[derive(Debug, Deserialize)]
struct UvDep {
    name: String,
    #[serde(default)]
    version: Option<String>,
}

pub fn parse(text: &str) -> Result<Assembly> {
    let lock: UvLock = toml::from_str(text).map_err(|e| LockfileError::Malformed {
        path: LOCKFILE.into(),
        reason: e.to_string(),
    })?;

    let mut assembly = Assembly {
        lockfiles: vec![LOCKFILE.to_string()],
        ..Default::default()
    };

    // Index name -> version so a dependency edge with no explicit version can be
    // resolved. uv omits the version when the name is unambiguous.
    let mut by_name: BTreeMap<&str, &str> = BTreeMap::new();
    for package in &lock.package {
        // A package can legitimately appear at several versions; the first wins
        // for edge resolution, and every version is still a node.
        by_name
            .entry(package.name.as_str())
            .or_insert(&package.version);
    }

    for package in &lock.package {
        let source = classify(package.source.as_ref());
        let workspace_member = matches!(source, Source::Path { .. });

        assembly.push(Package {
            id: PackageId::new(Ecosystem::Pypi, &package.name, &package.version),
            name: package.name.clone(),
            version: package.version.clone(),
            ecosystem: Ecosystem::Pypi,
            source,
            // uv does not run PEP 517 build scripts for locked registry
            // dependencies; it installs the published wheel. There is therefore
            // no build-script signal to read from this lockfile, and reporting
            // one would be inventing it.
            has_build_script: false,
            has_script_signal: false,
            dev_only: false,
            platform_specific: None,
            workspace_member,
            lockfile: LOCKFILE.into(),
        });

        for dep in package.dependencies.iter().flatten() {
            let version = dep
                .version
                .clone()
                .or_else(|| by_name.get(dep.name.as_str()).map(|v| (*v).to_string()));
            let Some(version) = version else { continue };
            assembly.edge(Edge {
                from: PackageId::new(Ecosystem::Pypi, &package.name, &package.version),
                to: PackageId::new(Ecosystem::Pypi, &dep.name, &version),
                dev: false,
            });
        }

        for deps in package
            .dev_dependencies
            .iter()
            .flat_map(|groups| groups.values())
        {
            for dep in deps {
                let resolved_version = dep
                    .version
                    .clone()
                    .or_else(|| by_name.get(dep.name.as_str()).map(|v| (*v).to_string()));
                let Some(version) = resolved_version else {
                    continue;
                };
                assembly.edge(Edge {
                    from: PackageId::new(Ecosystem::Pypi, &package.name, &package.version),
                    to: PackageId::new(Ecosystem::Pypi, &dep.name, &version),
                    dev: true,
                });
            }
        }
    }

    mark_dev_only(&mut assembly);
    Ok(assembly)
}

fn classify(source: Option<&toml::Value>) -> Source {
    let Some(value) = source else {
        return Source::Unknown;
    };
    let table = value.as_table();

    if let Some(registry) = table
        .and_then(|t| t.get("registry"))
        .and_then(|v| v.as_str())
    {
        return Source::Registry {
            registry: registry.to_string(),
        };
    }
    if table.is_some_and(|t| t.contains_key("editable") || t.contains_key("directory")) {
        let path = table
            .and_then(|t| t.get("editable").or_else(|| t.get("directory")))
            .and_then(|v| v.as_str())
            .unwrap_or(".")
            .to_string();
        return Source::Path { path };
    }
    if let Some(git) = table.and_then(|t| t.get("git")) {
        let url = git
            .as_str()
            .map(str::to_string)
            .or_else(|| git.get("url").and_then(|v| v.as_str()).map(str::to_string))
            .unwrap_or_default();
        let rev = git
            .get("rev")
            .or_else(|| git.get("commit"))
            .and_then(|v| v.as_str())
            .map(str::to_string);
        return Source::Git { url, rev };
    }
    if let Some(url) = table.and_then(|t| t.get("url")).and_then(|v| v.as_str()) {
        return Source::DirectUrl {
            url: url.to_string(),
        };
    }
    Source::Unknown
}

fn mark_dev_only(assembly: &mut Assembly) {
    let roots: std::collections::BTreeSet<PackageId> = assembly
        .packages
        .iter()
        .filter(|p| p.workspace_member)
        .map(|p| p.id.clone())
        .collect();

    let mut reachable = roots.clone();
    let mut queue: std::collections::VecDeque<PackageId> = roots.into_iter().collect();
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

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = r#"
version = 1
requires-python = ">=3.11"

[[package]]
name = "devopness"
version = "2.8.5"
source = { editable = "." }
dependencies = [
    { name = "httpx" },
]

[package.dev-dependencies]
dev = [
    { name = "ruff" },
    { name = "mypy" },
]

[[package]]
name = "httpx"
version = "0.28.1"
source = { registry = "https://pypi.org/simple" }
dependencies = [
    { name = "httpcore" },
]

[[package]]
name = "httpcore"
version = "1.0.9"
source = { registry = "https://pypi.org/simple" }

[[package]]
name = "ruff"
version = "0.16.9"
source = { registry = "https://pypi.org/simple" }

[[package]]
name = "mypy"
version = "2.3.1"
source = { registry = "https://pypi.org/simple" }
"#;

    #[test]
    fn parses_registry_sources_and_the_project() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let httpx = assembly
            .packages
            .iter()
            .find(|p| p.name == "httpx")
            .unwrap();
        assert!(httpx.source.is_registry());
        assert!(!httpx.workspace_member);

        let project = assembly
            .packages
            .iter()
            .find(|p| p.name == "devopness")
            .unwrap();
        assert!(project.workspace_member);
    }

    #[test]
    fn a_dependency_edge_with_no_version_resolves_by_name() {
        let assembly = parse(SAMPLE).expect("sample parses");
        assert!(
            assembly
                .edges
                .iter()
                .any(|e| e.to == PackageId::new(Ecosystem::Pypi, "httpcore", "1.0.9")),
            "httpx -> httpcore must resolve despite the missing version"
        );
    }

    #[test]
    fn dev_groups_are_dev_edges() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let ruff_edge = assembly
            .edges
            .iter()
            .find(|e| e.to.name() == "ruff")
            .expect("ruff edge");
        assert!(ruff_edge.dev, "ruff is a dev-group dependency");
    }

    #[test]
    fn transitive_packages_are_marked_dev_only_when_unreachable() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let ruff = assembly.packages.iter().find(|p| p.name == "ruff").unwrap();
        assert!(ruff.dev_only);
        let httpcore = assembly
            .packages
            .iter()
            .find(|p| p.name == "httpcore")
            .unwrap();
        assert!(!httpcore.dev_only, "httpcore is on the runtime path");
    }

    #[test]
    fn malformed_toml_is_an_error() {
        let err = parse("[[package]]\nname = ").unwrap_err();
        assert!(err.to_string().contains("could not be parsed"), "{err}");
    }
}
