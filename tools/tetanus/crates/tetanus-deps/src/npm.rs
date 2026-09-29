//! `package-lock.json` reader, for the projects excluded from the pnpm
//! workspace.
//!
//! `docs` installs from its own npm lockfile, so reading only the pnpm lockfile
//! would produce a security graph that omits a project whose code is actually
//! installed and built on every deploy.

use std::collections::BTreeMap;

use serde::Deserialize;
use tetanus_core::error::Result;

use crate::{Assembly, Ecosystem, Edge, LockfileError, Package, PackageId, Source};

#[derive(Debug, Deserialize)]
struct NpmLock {
    #[serde(default, rename = "lockfileVersion")]
    _lockfile_version: Option<u32>,
    #[serde(default)]
    packages: BTreeMap<String, NpmEntry>,
}

#[derive(Debug, Deserialize, Default)]
struct NpmEntry {
    #[serde(default)]
    version: Option<String>,
    #[serde(default)]
    resolved: Option<String>,
    #[serde(default)]
    dev: Option<bool>,
    #[serde(default, rename = "optional")]
    _optional: Option<bool>,
    #[serde(default)]
    os: Option<Vec<String>>,
    #[serde(default)]
    cpu: Option<Vec<String>>,
    #[serde(default)]
    dependencies: Option<BTreeMap<String, String>>,
    #[serde(default, rename = "devDependencies")]
    dev_dependencies: Option<BTreeMap<String, String>>,
    #[serde(default, rename = "hasInstallScript")]
    has_install_script: Option<bool>,
    #[serde(default)]
    link: Option<bool>,
}

/// Path segment to skip in `dev`, which is a path, not a flag.
const DEV: &str = "node_modules/";

pub fn parse(text: &str, lockfile_label: &str) -> Result<Assembly> {
    let lock: NpmLock = serde_json::from_str(text).map_err(|e| LockfileError::Malformed {
        path: lockfile_label.into(),
        reason: e.to_string(),
    })?;

    let mut assembly = Assembly {
        lockfiles: vec![lockfile_label.to_string()],
        ..Default::default()
    };

    // The workspace root is the entry with an empty path key.
    let root_id = PackageId::new(Ecosystem::Npm, "workspace", "workspace");
    assembly.push(Package {
        id: root_id.clone(),
        name: "workspace".into(),
        version: "workspace".into(),
        ecosystem: Ecosystem::Npm,
        source: Source::Path { path: ".".into() },
        has_build_script: false,
        has_script_signal: true,
        dev_only: false,
        platform_specific: None,
        workspace_member: true,
        lockfile: lockfile_label.into(),
    });

    // npm keys entries by install path, which encodes the nesting. The name is
    // the last `node_modules/` segment.
    for (path, entry) in &lock.packages {
        if path.is_empty() || entry.link.unwrap_or(false) {
            continue;
        }
        let Some(name) = name_from_path(path) else {
            continue;
        };
        let version = entry.version.clone().unwrap_or_else(|| "unknown".into());

        assembly.push(Package {
            id: PackageId::new(Ecosystem::Npm, &name, &version),
            name: name.clone(),
            version,
            ecosystem: Ecosystem::Npm,
            source: classify(entry.resolved.as_deref()),
            has_build_script: entry.has_install_script.unwrap_or(false),
            has_script_signal: true,
            dev_only: false,
            platform_specific: match (entry.cpu.as_ref(), entry.os.as_ref()) {
                (None, None) => None,
                (cpu, os) => Some(format!(
                    "{}/{}",
                    cpu.map(|c| c.join(",")).unwrap_or_default(),
                    os.map(|o| o.join(",")).unwrap_or_default()
                )),
            },
            workspace_member: false,
            lockfile: lockfile_label.into(),
        });

        let from = PackageId::new(
            Ecosystem::Npm,
            &name,
            &entry.version.clone().unwrap_or_default(),
        );
        for (dep, _) in entry.dependencies.iter().flatten() {
            // npm records the declared range, not the resolved version, so the
            // target is resolved from the flat index by name.
            if let Some(target) = resolve_by_name(&lock, dep) {
                assembly.edge(Edge {
                    from: from.clone(),
                    to: target,
                    dev: false,
                });
            }
        }
        for (dep, _) in entry.dev_dependencies.iter().flatten() {
            if let Some(target) = resolve_by_name(&lock, dep) {
                assembly.edge(Edge {
                    from: from.clone(),
                    to: target,
                    dev: true,
                });
            }
        }
    }

    // npm records `dev: true` on entries that are only reachable from dev
    // dependencies. That flag is authoritative here, unlike in a pnpm lockfile,
    // so it is read directly rather than recomputed by traversal.
    for (path, entry) in &lock.packages {
        if path.is_empty() {
            continue;
        }
        let Some(name) = name_from_path(path) else {
            continue;
        };
        let version = entry.version.clone().unwrap_or_default();
        let id = PackageId::new(Ecosystem::Npm, &name, &version);
        if let Some(package) = assembly.packages.iter_mut().find(|p| p.id == id) {
            package.dev_only = entry.dev.unwrap_or(false);
        }
    }

    Ok(assembly)
}

fn name_from_path(path: &str) -> Option<String> {
    let index = path.rfind(DEV)?;
    Some(path[index + DEV.len()..].to_string())
}

/// Resolve a dependency name to the shallowest installed version, which is what
/// npm would hoist and therefore what the dependant actually resolves to.
fn resolve_by_name(lock: &NpmLock, name: &str) -> Option<PackageId> {
    let needle = format!("{DEV}{name}");
    let mut best: Option<(&String, &NpmEntry)> = None;
    for (path, entry) in &lock.packages {
        if !path.ends_with(&needle) {
            continue;
        }
        match best {
            // Fewer `node_modules/` segments means shallower.
            Some((best_path, _)) if best_path.matches(DEV).count() <= path.matches(DEV).count() => {
            }
            _ => best = Some((path, entry)),
        }
    }
    best.and_then(|(_, entry)| {
        entry
            .version
            .as_ref()
            .map(|v| PackageId::new(Ecosystem::Npm, name, v))
    })
}

fn classify(resolved: Option<&str>) -> Source {
    let Some(resolved) = resolved else {
        return Source::Unknown;
    };
    if resolved.starts_with("git+") || resolved.contains("github.com") {
        return Source::Git {
            url: resolved.to_string(),
            rev: None,
        };
    }
    if resolved.starts_with("http://") || resolved.starts_with("https://") {
        // The only shape that is a plain registry tarball is the npmjs one. A
        // tarball from any other host bypasses the index and is not covered by
        // registry advisories.
        if resolved.contains("registry.npmjs.org") {
            return Source::Registry {
                registry: "https://registry.npmjs.org".into(),
            };
        }
        return Source::DirectUrl {
            url: resolved.to_string(),
        };
    }
    Source::Unknown
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = r#"
{
  "name": "devopness-docs",
  "lockfileVersion": 3,
  "packages": {
    "": { "name": "devopness-docs", "version": "0.0.0" },
    "node_modules/next": { "version": "16.3.5", "resolved": "https://registry.npmjs.org/next/-/next-16.3.5.tgz" },
    "node_modules/esbuild": { "version": "0.28.2", "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz", "hasInstallScript": true },
    "node_modules/typescript": { "version": "7.0.2", "resolved": "https://registry.npmjs.org/typescript/-/typescript-7.0.2.tgz", "dev": true },
    "node_modules/some-dep": { "version": "1.0.0", "resolved": "https://codeload.github.com/acme/some-dep/tar.gz/v1" },
    "node_modules/next/node_modules/ms": { "version": "2.1.3" }
  }
}
"#;

    #[test]
    fn reads_the_workspace_root_and_packages() {
        let assembly = parse(SAMPLE, "docs/package-lock.json").expect("sample parses");
        assert!(assembly.packages.iter().any(|p| p.workspace_member));
        let next = assembly.packages.iter().find(|p| p.name == "next").unwrap();
        assert_eq!(next.version, "16.3.5");
        assert!(next.source.is_registry());
    }

    #[test]
    fn install_scripts_are_recorded() {
        let assembly = parse(SAMPLE, "docs/package-lock.json").expect("sample parses");
        let esbuild = assembly
            .packages
            .iter()
            .find(|p| p.name == "esbuild")
            .unwrap();
        assert!(esbuild.has_build_script);
        let next = assembly.packages.iter().find(|p| p.name == "next").unwrap();
        assert!(!next.has_build_script);
    }

    #[test]
    fn the_dev_flag_is_authoritative() {
        let assembly = parse(SAMPLE, "docs/package-lock.json").expect("sample parses");
        let typescript = assembly
            .packages
            .iter()
            .find(|p| p.name == "typescript")
            .unwrap();
        assert!(typescript.dev_only);
        let next = assembly.packages.iter().find(|p| p.name == "next").unwrap();
        assert!(!next.dev_only);
    }

    #[test]
    fn a_non_npmjs_tarball_is_not_a_registry_source() {
        let assembly = parse(SAMPLE, "docs/package-lock.json").expect("sample parses");
        let dep = assembly
            .packages
            .iter()
            .find(|p| p.name == "some-dep")
            .unwrap();
        assert!(!dep.source.is_advisory_covered());
    }

    #[test]
    fn a_name_is_read_from_the_last_node_modules_segment() {
        assert_eq!(
            name_from_path("node_modules/next/node_modules/ms").as_deref(),
            Some("ms")
        );
    }
}
