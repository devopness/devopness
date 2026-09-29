//! `Cargo.lock` reader.
//!
//! Cargo's lockfile is TOML, and its dependency edges name a version only when
//! the name is ambiguous. `"getrandom 0.3.4"` is the same package as
//! `"getrandom"`, and conflating them would drop a real edge.

use std::collections::BTreeMap;

use serde::Deserialize;
use tetanus_core::error::Result;

use crate::{Assembly, Ecosystem, Edge, LockfileError, Package, PackageId, Source};

const LOCKFILE: &str = "tools/tetanus/Cargo.lock";

#[derive(Debug, Deserialize)]
struct CargoLock {
    #[serde(default)]
    package: Vec<CargoPackage>,
}

#[derive(Debug, Deserialize)]
struct CargoPackage {
    name: String,
    version: String,
    #[serde(default)]
    source: Option<String>,
    #[serde(default)]
    dependencies: Option<Vec<String>>,
}

pub fn parse(text: &str) -> Result<Assembly> {
    let lock: CargoLock = toml::from_str(text).map_err(|e| LockfileError::Malformed {
        path: LOCKFILE.into(),
        reason: e.to_string(),
    })?;

    let mut assembly = Assembly {
        lockfiles: vec![LOCKFILE.to_string()],
        ..Default::default()
    };

    for package in &lock.package {
        let source = package
            .source
            .as_deref()
            .map(classify)
            .unwrap_or_else(|| Source::Path {
                path: package.name.clone(),
            });
        let workspace_member = package.source.is_none();

        assembly.push(Package {
            id: PackageId::new(Ecosystem::Crates, &package.name, &package.version),
            name: package.name.clone(),
            version: package.version.clone(),
            ecosystem: Ecosystem::Crates,
            source,
            // Cargo runs `build.rs` when a crate declares one. The lockfile
            // records no build-script flag, so this stays false rather than
            // being guessed from a `links` key or a name.
            has_build_script: false,
            has_script_signal: false,
            dev_only: false,
            platform_specific: None,
            workspace_member,
            lockfile: LOCKFILE.into(),
        });
    }

    // Resolve an edge target: Cargo writes either `name` or `name version`.
    let mut by_name: BTreeMap<&str, &str> = BTreeMap::new();
    for package in &lock.package {
        by_name
            .entry(package.name.as_str())
            .or_insert(&package.version);
    }

    for package in &lock.package {
        for dep in package.dependencies.iter().flatten() {
            let (dep_name, dep_version) = split_dep(dep, &by_name);
            let Some(dep_version) = dep_version else {
                continue;
            };
            assembly.edge(Edge {
                from: PackageId::new(Ecosystem::Crates, &package.name, &package.version),
                to: PackageId::new(Ecosystem::Crates, &dep_name, &dep_version),
                dev: false,
            });
        }
    }

    Ok(assembly)
}

/// `getrandom 0.3.4` -> (getrandom, 0.3.4); `memchr` -> (memchr, resolved).
fn split_dep(dep: &str, by_name: &BTreeMap<&str, &str>) -> (String, Option<String>) {
    match dep.split_once(char::is_whitespace) {
        Some((name, version)) => (name.to_string(), Some(version.to_string())),
        None => (dep.to_string(), by_name.get(dep).map(|v| (*v).to_string())),
    }
}

fn classify(source: &str) -> Source {
    if let Some(rest) = source.strip_prefix("registry+") {
        return Source::Registry {
            registry: rest.to_string(),
        };
    }
    if let Some(rest) = source.strip_prefix("git+") {
        // `git+<url>?rev=<sha>#<sha>` — the commit is what actually pins it.
        let (url, rev) = match rest.split_once('?') {
            Some((url, query)) => {
                // The query runs to the end of the string, fragment included, so
                // `rev=abc#abc` has to be cut at the `#` before the value is
                // usable. Without that the recorded revision is `abc#abc`.
                let (query, fragment) = match query.split_once('#') {
                    Some((q, f)) => (q, Some(f)),
                    None => (query, None),
                };
                let rev = query
                    .split('&')
                    .find_map(|pair| {
                        pair.strip_prefix("rev=")
                            .or_else(|| pair.strip_prefix("commit="))
                    })
                    .map(str::to_string)
                    .or(fragment.map(str::to_string));
                (url.to_string(), rev)
            }
            None => (rest.to_string(), None),
        };
        return Source::Git { url, rev };
    }
    if let Some(rest) = source.strip_prefix("sparse+") {
        return Source::Registry {
            registry: rest.to_string(),
        };
    }
    Source::DirectUrl {
        url: source.to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = r#"
version = 4

[[package]]
name = "tetanus-core"
version = "0.1.0"
dependencies = [
 "blake3",
 "serde",
]

[[package]]
name = "blake3"
version = "1.5.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "abc"

[[package]]
name = "serde"
version = "1.0.219"
source = "registry+https://github.com/rust-lang/crates.io-index"

[[package]]
name = "acme"
version = "0.1.0"
source = "git+https://github.com/acme/acme?rev=deadbeef#deadbeef"
"#;

    #[test]
    fn a_crate_without_a_source_is_a_workspace_member() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let core = assembly
            .packages
            .iter()
            .find(|p| p.name == "tetanus-core")
            .unwrap();
        assert!(core.workspace_member);
    }

    #[test]
    fn registry_sources_are_registry() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let blake3 = assembly
            .packages
            .iter()
            .find(|p| p.name == "blake3")
            .unwrap();
        assert!(blake3.source.is_registry());
    }

    #[test]
    fn git_sources_carry_the_revision() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let acme = assembly.packages.iter().find(|p| p.name == "acme").unwrap();
        match &acme.source {
            Source::Git { url, rev } => {
                assert!(url.contains("acme"), "{url}");
                assert_eq!(rev.as_deref(), Some("deadbeef"));
            }
            other => panic!("expected a git source, got {other:?}"),
        }
    }

    #[test]
    fn an_unqualified_edge_resolves_by_name() {
        let assembly = parse(SAMPLE).expect("sample parses");
        let core = PackageId::new(Ecosystem::Crates, "tetanus-core", "0.1.0");
        assert!(assembly.edges.iter().any(
            |e| e.from == core && e.to == PackageId::new(Ecosystem::Crates, "blake3", "1.5.5")
        ));
    }

    #[test]
    fn a_versioned_edge_keeps_that_version() {
        let by_name = BTreeMap::from([("getrandom", "0.3.4")]);
        assert_eq!(
            split_dep("getrandom 0.3.4", &by_name),
            ("getrandom".to_string(), Some("0.3.4".to_string()))
        );
    }
}
