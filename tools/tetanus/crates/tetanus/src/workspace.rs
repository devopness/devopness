//! Workspace analysis: repository state in, engineering graph out.
//!
//! The graph is always rebuilt from source. Nothing is read from a previous
//! run, so a stale cache can only cost time, never correctness.

use std::collections::{BTreeMap, BTreeSet};
use std::path::PathBuf;

use tetanus_ast::model::{ImportForm, Language, ModuleAnalysis};
use tetanus_ast::{python, ts};
use tetanus_cache::{Cache, CacheProvider};
use tetanus_config::generated::{Classification, GeneratedRegistry};
use tetanus_config::repo::RepoPaths;
use tetanus_core::analysis;
use tetanus_core::digest::Digest;
use tetanus_core::error::{Error, Result};
use tetanus_core::graph::{Edge, EdgeKind, Graph, Node, NodeKind};
use tetanus_core::id::NodeId;
use tetanus_graph::BackendKind;

/// A workspace package and the modules it owns.
#[derive(Debug, Clone)]
pub struct Package {
    pub name: String,
    pub root: String,
    pub manifest: String,
    pub entrypoints: Vec<String>,
    pub private: bool,
}

pub struct Workspace {
    pub paths: RepoPaths,
    pub packages: Vec<Package>,
    pub modules: Vec<ModuleAnalysis>,
    pub entrypoints: BTreeSet<NodeId>,
}

impl Workspace {
    pub fn package_of(&self, path: &str) -> &str {
        self.packages
            .iter()
            .filter(|p| path.starts_with(&p.root))
            .max_by_key(|p| p.root.len())
            .map(|p| p.name.as_str())
            .unwrap_or("repository")
    }
}

/// Directories never descended into.
const SKIP_DIRECTORIES: &[&str] = &[
    ".git",
    ".next",
    ".turbo",
    ".venv",
    "__pycache__",
    "coverage",
    "dist",
    "node_modules",
    "target",
    "venv",
];

/// Files with no bearing on the code graph.
fn is_analysable(path: &str) -> bool {
    Language::from_path(path).is_script() || path.ends_with(".py")
}

fn read_package_manifest(paths: &RepoPaths, manifest: &str) -> Result<Package> {
    let absolute = paths.absolute(manifest);
    let text = std::fs::read_to_string(&absolute).map_err(|e| Error::io(absolute.display(), e))?;
    let value: serde_json::Value =
        serde_json::from_str(&text).map_err(|e| Error::parse(absolute.display(), e.to_string()))?;

    let name = value
        .get("name")
        .and_then(|v| v.as_str())
        .unwrap_or(manifest)
        .to_string();
    let private = value
        .get("private")
        .and_then(|v| v.as_bool())
        .unwrap_or(false);

    let mut entrypoints: Vec<String> = Vec::new();
    let root = manifest
        .rsplit_once('/')
        .map(|(dir, _)| dir.to_string())
        .unwrap_or_default();

    for key in ["main", "module", "types"] {
        if let Some(value) = value.get(key).and_then(|v| v.as_str()) {
            entrypoints.push(join_entrypoint(&root, value));
        }
    }
    if let Some(exports) = value.get("exports").and_then(|v| v.as_object()) {
        for (_, target) in exports {
            collect_export_targets(target, &mut entrypoints);
        }
    }
    if let Some(bin) = value.get("bin") {
        match bin {
            serde_json::Value::String(path) => entrypoints.push(join_entrypoint(&root, path)),
            serde_json::Value::Object(map) => {
                for path in map.values().filter_map(|v| v.as_str()) {
                    entrypoints.push(join_entrypoint(&root, path));
                }
            }
            _ => {}
        }
    }

    entrypoints.sort();
    entrypoints.dedup();

    Ok(Package {
        name,
        root,
        manifest: manifest.to_string(),
        entrypoints,
        private,
    })
}

fn collect_export_targets(value: &serde_json::Value, out: &mut Vec<String>) {
    match value {
        serde_json::Value::String(path) => out.push(path.clone()),
        serde_json::Value::Object(map) => {
            for target in map.values() {
                collect_export_targets(target, out);
            }
        }
        _ => {}
    }
}

fn join_entrypoint(root: &str, target: &str) -> String {
    if target.starts_with("./") && !root.is_empty() {
        format!("{root}/{}", &target[2..])
    } else {
        target.to_string()
    }
}

/// Load every workspace package from the manifest list.
pub fn load_packages(paths: &RepoPaths, manifests: &[String]) -> Result<Vec<Package>> {
    let mut packages: Vec<Package> = manifests
        .iter()
        .map(|m| read_package_manifest(paths, m))
        .collect::<Result<Vec<_>>>()?;
    packages.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(packages)
}

/// Resolve a relative specifier against the importing module's path.
///
/// Returns `None` when the specifier escapes the repository or does not name a
/// file this analyser understands, which is recorded as a dynamic boundary
/// rather than silently dropped.
pub fn resolve_internal(
    importer: &str,
    specifier: &str,
    known: &BTreeSet<String>,
) -> Option<String> {
    if !specifier.starts_with('.') {
        return None;
    }
    let importer_dir = match importer.rsplit_once('/') {
        Some((dir, _)) => dir.to_string(),
        None => String::new(),
    };
    let joined = if importer_dir.is_empty() {
        specifier.to_string()
    } else {
        format!("{importer_dir}/{specifier}")
    };

    let mut normalised: Vec<String> = Vec::new();
    for segment in joined.split('/') {
        if segment.is_empty() {
            continue;
        }
        // A run of dots, with or without a name attached, is a level directive.
        // Handling both spellings in one place is what lets TypeScript's
        // `./x` and Python's `.x` share a resolver: Python writes a level-1
        // import as a single `.name` segment, so splitting on `/` alone left the
        // dot glued to the name and the specifier resolved to `.base_service.py`,
        // which does not exist.
        //
        // One dot stays put, each further dot goes up a level, and any name after
        // the dots is pushed as a normal segment.
        let dots = segment.len() - segment.trim_start_matches('.').len();
        for _ in 1..dots {
            normalised.pop();
        }
        let name = &segment[dots..];
        if name.is_empty() {
            continue;
        }
        // Python separates package levels with dots, not slashes: a level-2
        // relative import is the single segment `..core.api_error`, which has to
        // become two path segments. Splitting on `/` alone left it as one
        // segment named `core.api_error`, and no such path exists, so every
        // Python relative import failed to resolve. The Python graph was empty
        // as a result: no fan-in, no fan-out, no reachability, and no
        // affected-test precision.
        //
        // Only a dot-prefixed segment is split this way. TypeScript writes
        // `./x` and `../x` with a slash and the remainder carries no dots, and a
        // file whose name contains one must not be torn apart.
        if dots > 0 {
            for part in name.split('.') {
                if !part.is_empty() {
                    normalised.push(part.to_string());
                }
            }
        } else {
            normalised.push(name.to_string());
        }
    }
    let base = normalised.join("/");

    resolution_candidates(&base)
        .into_iter()
        .find(|candidate| known.contains(candidate))
}

/// Resolve one specifier to a module path, whichever convention wrote it.
///
/// Three forms, tried in order of specificity: a path relative to the importer,
/// a dotted absolute Python module, and a declared package alias. Every caller
/// goes through here, because an edge and a dead-code verdict that disagreed
/// about what a specifier meant would report reachable code as dead.
pub fn resolve_specifier(
    importer: &str,
    specifier: &str,
    known: &BTreeSet<String>,
    dotted: &BTreeMap<String, String>,
    aliases: &Aliases,
) -> Option<String> {
    resolve_internal(importer, specifier, known)
        .or_else(|| dotted.get(specifier).cloned())
        .or_else(|| resolve_alias(specifier, known, aliases))
}

/// Map every module's dotted Python name to its path, anchored at `src/`.
///
/// `packages/sdks/python/src/devopness/core/api_error.py` becomes
/// `devopness.core.api_error`, and the containing `__init__.py` files become the
/// package names, so `from devopness.core import x` resolves to the package while
/// `from devopness.core.api_error import x` resolves to the module. Both spellings
/// are registered because Python treats them as different modules.
fn dotted_index(known: &BTreeSet<String>) -> BTreeMap<String, String> {
    let mut out: BTreeMap<String, String> = BTreeMap::new();
    for path in known {
        if !path.ends_with(".py") {
            continue;
        }
        let Some((root, rest)) = path.split_once("/src/") else {
            continue;
        };
        let _ = root;
        let trimmed = rest.trim_end_matches(".py");
        let segments: Vec<&str> = trimmed.split('/').collect();
        // Register the module itself, then each package above it, so an import
        // that stops at any level of the path finds the right `__init__.py`.
        for take in (1..=segments.len()).rev() {
            let dotted = segments[..take].join(".");
            let target = if take == segments.len() {
                path.clone()
            } else {
                format!("{root}/src/{}/__init__.py", segments[..take].join("/"))
            };
            if known.contains(&target) {
                out.entry(dotted).or_insert(target);
            }
        }
    }
    out
}

/// Candidate filenames for a specifier that omitted its extension.
fn resolution_candidates(base: &str) -> Vec<String> {
    let mut out = vec![base.to_string()];
    for extension in ["ts", "tsx", "js", "jsx", "mjs", "cjs", "py"] {
        out.push(format!("{base}.{extension}"));
    }
    for extension in ["ts", "tsx", "js", "jsx", "py"] {
        out.push(format!("{base}/index.{extension}"));
    }
    out
}

pub struct AnalyseOptions {
    pub backend: BackendKind,
    pub cache: Cache,
    /// Digest of every input to the analysis that is not the file's own content:
    /// the package layout, the generated-artifact registry, and the file list.
    ///
    /// Without this the parse cache key is content plus parser version, and two
    /// sources of stale results follow. Reassigning a file to a different package
    /// changes the analysis but not the key, so the cached answer is returned.
    /// Adding or removing a file changes which specifiers resolve, and again the
    /// key is unchanged. Both were observed: adding a package to the manifest
    /// left every already-cached module reporting the old package.
    ///
    /// A cache that can return a wrong answer is worse than no cache, so the key
    /// covers the whole input set.
    context_digest: Digest,
}

impl AnalyseOptions {
    /// Derive the context digest from the inputs, so it cannot be forgotten or
    /// set to something stale.
    pub fn new(
        backend: BackendKind,
        cache: Cache,
        registry: &GeneratedRegistry,
        packages: &[Package],
        tracked: &[String],
    ) -> Self {
        Self {
            backend,
            cache,
            context_digest: context_digest(registry, packages, tracked),
        }
    }
}

/// Parse cache key: file content, parser version, and the analysis context.
pub fn parse_key_with_context(
    content_digest: &Digest,
    parser_version: &str,
    context_digest: &Digest,
) -> Digest {
    Digest::of_iter([
        content_digest.as_str(),
        parser_version,
        context_digest.as_str(),
    ])
}

/// Digest of every input to the analysis that is not a file's own content.
///
/// Ordered by construction: packages are sorted by name when loaded, the file
/// list is sorted by git, and the registry is declared. Two runs over the same
/// state therefore produce the same digest, which is what keeps the cache from
/// becoming a source of nondeterminism in its own right.
fn context_digest(
    registry: &GeneratedRegistry,
    packages: &[Package],
    tracked: &[String],
) -> Digest {
    let mut parts: Vec<String> = Vec::with_capacity(tracked.len() + packages.len() * 4);
    parts.push(format!("tracked={}", tracked.len()));
    parts.extend(tracked.iter().cloned());
    for package in packages {
        parts.push(format!(
            "pkg:{}|{}|{}|{}",
            package.name,
            package.root,
            package.manifest,
            package.entrypoints.join(",")
        ));
    }
    for artifact in &registry.artifact {
        parts.push(format!(
            "artifact:{}|{}|{}",
            artifact.id,
            artifact.paths.join(","),
            artifact.foreign_generator
        ));
    }
    Digest::of_iter(parts.iter().map(String::as_str))
}

pub struct Analysis {
    pub graph: Graph,
    pub backend_identity: String,
    pub digest: Digest,
    pub reachable: BTreeSet<NodeId>,
    pub unreachable: Vec<Node>,
    pub cycles: Vec<Vec<NodeId>>,
    pub fan_in: BTreeMap<String, usize>,
    pub fan_out: BTreeMap<String, usize>,
    pub unused_exports: Vec<(String, String)>,
    /// Power of Ten violations across the repository, by metric. Every metric
    /// is present, including the ones at zero, because an absent metric must
    /// not be readable as unmeasured.
    pub power: BTreeMap<String, usize>,
    /// Where each Power of Ten violation is. A count a developer cannot act on
    /// is a scoreboard, not a gate, so the locations travel with the totals.
    pub power_sites: BTreeMap<String, Vec<(String, u32, String)>>,
}

/// Parse every analysable module and assemble the engineering graph.
#[allow(clippy::too_many_arguments)]
pub fn analyse(
    paths: &RepoPaths,
    registry: &GeneratedRegistry,
    packages: &[Package],
    tracked: &[String],
    options: &AnalyseOptions,
) -> Result<Analysis> {
    let aliases = Aliases::from_pyprojects(paths, packages);
    let (modules, _classification) = parse_all(paths, registry, packages, tracked, options)?;
    let known: BTreeSet<String> = tracked
        .iter()
        .filter(|p| is_analysable(p))
        .cloned()
        .collect();

    // Python names its package levels with dots, and an absolute import such as
    // `from devopness.core.api_error import x` carries no path at all. Anchoring
    // every module's dotted name once, at its `src/` root, turns those into a
    // single map lookup instead of a search.
    //
    // Built in one pass over the tracked files, so the cost is O(V) and the
    // resolution that uses it stays O(1) per specifier.
    let dotted = dotted_index(&known);

    let mut backend = tetanus_graph::resolve(options.backend)?;

    // Repository and package nodes.
    let repo = Node::new(NodeKind::Repository, "devopness", "devopness");
    let repo_id = repo.id.clone();
    backend.insert_node(repo)?;

    let mut package_ids: BTreeMap<String, NodeId> = BTreeMap::new();
    for package in packages {
        let node = Node::new(NodeKind::Package, "", &package.name)
            .with_path(&package.manifest)
            .with_attr("private", package.private.to_string());
        let id = node.id.clone();
        backend.insert_node(node)?;
        backend.insert_edge(Edge::new(EdgeKind::Contains, &repo_id, &id))?;
        package_ids.insert(package.name.clone(), id);
    }

    // Module nodes.
    let mut module_ids: BTreeMap<String, NodeId> = BTreeMap::new();
    for module in &modules {
        let node = Node::new(NodeKind::Module, &module.package, &module.path)
            .with_path(&module.path)
            .with_generated(module.generated)
            .with_attr("language", module.language.as_str());
        let id = node.id.clone();
        backend.insert_node(node)?;
        module_ids.insert(module.path.clone(), id);
    }

    // Entry points: declared manifests plus test files.
    let mut entrypoints: BTreeSet<NodeId> = BTreeSet::new();
    for package in packages {
        for entry in &package.entrypoints {
            if let Some(id) = module_ids.get(entry) {
                entrypoints.insert(id.clone());
            }
        }
    }
    for module in &modules {
        if is_test_file(&module.path) {
            if let Some(id) = module_ids.get(&module.path) {
                entrypoints.insert(id.clone());
            }
        }
    }

    // Symbol nodes.
    let mut symbol_ids: BTreeMap<(String, String), NodeId> = BTreeMap::new();
    for module in &modules {
        let Some(module_id) = module_ids.get(&module.path) else {
            continue;
        };
        for symbol in &module.symbols {
            let node = Node::new(NodeKind::Symbol, &module.package, &symbol.qualified_name)
                .with_path(&module.path)
                .with_generated(module.generated)
                .with_attr("kind", format!("{:?}", symbol.kind).to_lowercase())
                .with_attr("exported", symbol.exported.to_string());
            let id = node.id.clone();
            backend.insert_node(node)?;
            backend.insert_edge(Edge::new(EdgeKind::Contains, module_id, &id))?;
            symbol_ids.insert((module.path.clone(), symbol.qualified_name.clone()), id);
        }
    }

    // Import, re-export and dependency edges.
    let mut fan_in: BTreeMap<String, usize> = BTreeMap::new();
    let mut fan_out: BTreeMap<String, usize> = BTreeMap::new();

    for module in &modules {
        let Some(from) = module_ids.get(&module.path) else {
            continue;
        };

        for import in &module.imports {
            let resolved =
                resolve_specifier(&module.path, &import.specifier, &known, &dotted, &aliases);
            let Some(target) = resolved else {
                if !import.internal {
                    *fan_out.entry(module.path.clone()).or_default() += 1;
                }
                continue;
            };
            let Some(to) = module_ids.get(&target) else {
                continue;
            };
            // A type-only import is erased at runtime, so it is recorded as an
            // edge but is not treated as a runtime dependency by reachability.
            let kind = match import.form {
                ImportForm::TypeOnly => EdgeKind::Exports,
                _ => EdgeKind::Imports,
            };
            backend.insert_edge(Edge::new(kind, from, to))?;
            *fan_out.entry(module.path.clone()).or_default() += 1;
            *fan_in.entry(target.clone()).or_default() += 1;
        }

        for reexport in &module.reexports {
            let resolved = resolve_internal(&module.path, &reexport.specifier, &known)
                .or_else(|| resolve_alias(&reexport.specifier, &known, &aliases));
            let Some(target) = resolved else {
                continue;
            };
            let Some(to) = module_ids.get(&target) else {
                continue;
            };
            backend.insert_edge(Edge::new(EdgeKind::Reexports, from, to))?;
        }

        for specifier in module.external_specifiers() {
            let node = Node::new(NodeKind::Dependency, &module.package, specifier)
                .with_attr("source", "registry")
                .with_attr("scope", "external");
            let id = node.id.clone();
            if backend.insert_node(node)? {
                backend.insert_edge(Edge::new(EdgeKind::DependsOn, from, &id))?;
            }
        }
    }

    let graph = backend.export()?;

    let roots: Vec<NodeId> = entrypoints.iter().cloned().collect();
    let reachable = analysis::reachable_from(&graph, &roots, EdgeKind::Imports);

    let unreachable: Vec<Node> = graph
        .nodes()
        .filter(|n| n.kind == NodeKind::Module && !n.generated && !reachable.contains(&n.id))
        .cloned()
        .collect();

    let cycles = analysis::cycles(&graph, EdgeKind::Imports);

    // An export is unused when nothing pulls it by name, and nothing re-exports
    // it. Two passes over one flat edge list, so the cost is O(V + E) with a
    // logarithmic lookup per symbol. Deliberately not a per-symbol walk of the
    // module's importers: that is O(symbols x fan_in), which is the one shape
    // that gets expensive exactly where the graph is dense, and the dense
    // modules are the ones being analysed.
    //
    // `consumed` holds names pulled explicitly. `wholesale` holds modules whose
    // entire export surface is reached by a form that names nothing: a
    // namespace import, `export *`, or `export * as ns`. A wholesale reference
    // makes every one of the target's exports live in one set lookup, so a
    // barrel that re-exports a module costs the same as one that re-exports a
    // single name.
    let mut consumed: BTreeMap<String, BTreeSet<String>> = BTreeMap::new();
    let mut wholesale: BTreeSet<String> = BTreeSet::new();
    for module in &modules {
        for reference in module.imports.iter().chain(module.reexports.iter()) {
            let target = match resolve_specifier(
                &module.path,
                &reference.specifier,
                &known,
                &dotted,
                &aliases,
            ) {
                Some(t) => t,
                None => continue,
            };
            if reference.star {
                wholesale.insert(target);
            } else {
                consumed
                    .entry(target)
                    .or_default()
                    .extend(reference.names.iter().cloned());
            }
        }
    }

    // A module that nothing imports is a script, not a library: its top-level
    // names are its interface to the world, not dead exports. Reporting those
    // would flag every helper in every one-off script in the repository.
    let mut unused_exports: Vec<(String, String)> = Vec::new();
    for module in &modules {
        if module.generated || is_test_file(&module.path) {
            continue;
        }
        // Nothing names this module at all, or a star form covers all of it.
        // Either way there is no per-symbol verdict to reach.
        if wholesale.contains(&module.path) {
            continue;
        }
        let Some(named) = consumed.get(&module.path) else {
            continue;
        };
        for symbol in &module.symbols {
            if !symbol.exported {
                continue;
            }
            // A module that states its public surface is the package declaring
            // who it is for. The reader of a declared export is expected to be
            // outside the repository, so finding no internal importer is the
            // normal case rather than evidence of anything, and reporting it
            // told the maintainers to delete their own API.
            if module.declared_surface {
                continue;
            }
            if !named.contains(&symbol.name) {
                unused_exports.push((module.path.clone(), symbol.qualified_name.clone()));
            }
        }
    }
    unused_exports.sort();
    unused_exports.dedup();

    // Power of Ten totals, summed from the per-module counts the parse already
    // recorded. Summed rather than recounted so no source is read twice and the
    // gate can never see a different tree from the graph.
    let mut power: BTreeMap<String, usize> = tetanus_ast::power::rule::ALL
        .iter()
        .map(|r| (r.to_string(), 0))
        .collect();
    let mut power_sites: BTreeMap<String, Vec<(String, u32, String)>> = BTreeMap::new();
    for module in &modules {
        if module.generated {
            // Generated code is not hand-maintained, so a rule aimed at what a
            // person writes does not apply to it. Counting it would put a
            // baseline nobody can move out of reach.
            continue;
        }
        for (rule, count) in &module.power {
            *power.entry(rule.clone()).or_default() += count;
        }
        for (rule, sites) in &module.power_sites {
            let bucket = power_sites.entry(rule.clone()).or_default();
            for (line, message) in sites {
                bucket.push((module.path.clone(), *line, message.clone()));
            }
        }
    }

    let digest = graph.digest();

    Ok(Analysis {
        graph,
        backend_identity: backend.identity(),
        digest,
        reachable,
        unreachable,
        cycles,
        fan_in,
        fan_out,
        unused_exports,
        power,
        power_sites,
    })
}

/// Parse every analysable module and return the analyses, without building a
/// graph. Used by manifest generation, which needs the parse results and
/// nothing else.
/// Maps a package's *installed* name onto the directory its source lives in.
///
/// Needed because a source file imports its own package by the name consumers
/// use, not by a relative path. `packages/sdks/python/src/devopness/base.py`
/// is imported as `devopness.base`, and `src/services/Api.ts` is imported as
/// `./services/Api`. Without the mapping the Python import is classified as
/// external, the closure stops at the test file, and affected-test selection
/// degenerates to "every Python test always runs".
#[derive(Debug, Clone, Default)]
pub struct Aliases {
    /// Installed name -> source root, e.g. `devopness` ->
    /// `packages/sdks/python/src/devopness`.
    map: BTreeMap<String, String>,
}

impl Aliases {
    /// Read `pyproject.toml` files and record `name` against each package's
    /// source directory.
    pub fn from_pyprojects(paths: &RepoPaths, packages: &[Package]) -> Self {
        let mut map = BTreeMap::new();
        for package in packages {
            // Selected by manifest, not by name. An earlier version skipped names
            // beginning with `@`, intending to exclude scoped npm packages, and
            // that also excluded `@devopness/sdk-python`: the Python SDK's
            // distribution name is scoped-looking but its importable name is not.
            let manifest = paths.absolute(&format!("{}/pyproject.toml", package.root));
            let Ok(text) = std::fs::read_to_string(&manifest) else {
                continue;
            };
            let Ok(value) = toml::from_str::<toml::Value>(&text) else {
                continue;
            };
            let Some(name) = value
                .get("project")
                .and_then(|p| p.get("name"))
                .and_then(|n| n.as_str())
            else {
                continue;
            };
            // PEP 621 and the hatch wheel target both place the importable
            // package under `src/`. Deriving it rather than hardcoding keeps the
            // two in step if the layout ever changes.
            let source = paths.absolute(&format!("{}/src/{name}", package.root));
            if source.is_dir()
                && let Ok(relative) = source.strip_prefix(&paths.root)
            {
                map.insert(
                    name.to_string(),
                    tetanus_config::normalise(&relative.to_string_lossy()),
                );
            }
        }
        Self { map }
    }

    pub fn get(&self, name: &str) -> Option<&String> {
        self.map.get(name)
    }

    pub fn len(&self) -> usize {
        self.map.len()
    }

    pub fn is_empty(&self) -> bool {
        self.map.is_empty()
    }
}

/// Resolve a bare specifier that names a workspace package's installed name.
/// Resolve a bare specifier that names a workspace package by its installed name.
pub fn resolve_alias(
    specifier: &str,
    known: &BTreeSet<String>,
    aliases: &Aliases,
) -> Option<String> {
    let head = specifier.split(['.', '/']).next()?;
    let root = aliases.get(head)?;
    let rest = &specifier[head.len()..];
    let tail = rest
        .trim_start_matches('.')
        .trim_start_matches('/')
        .replace('.', "/");
    let base = if tail.is_empty() {
        root.clone()
    } else {
        format!("{root}/{tail}")
    };
    resolution_candidates(&base)
        .into_iter()
        .find(|candidate| known.contains(candidate))
}

/// Parse every analysable module, and classify every tracked file in the same
/// pass. Split out from [`analyse`] so manifest generation can reuse the parse
/// results without building a graph it would not use.
#[allow(clippy::too_many_arguments)]
fn parse_all(
    paths: &RepoPaths,
    registry: &GeneratedRegistry,
    packages: &[Package],
    tracked: &[String],
    options: &AnalyseOptions,
) -> Result<(Vec<ModuleAnalysis>, Classification)> {
    let compiled = registry.compiled()?;
    let foreign: BTreeSet<&str> = registry
        .artifact
        .iter()
        .filter(|a| a.foreign_generator)
        .map(|a| a.id.as_str())
        .collect();

    let mut modules: Vec<ModuleAnalysis> = Vec::new();
    let mut classification = Classification::default();

    for path in tracked {
        let owner = registry.owner(&compiled, path);
        let generated = owner.is_some();
        classification
            .files
            .push(tetanus_config::generated::Classified {
                path: path.clone(),
                artifact: owner.map(str::to_string),
                generated,
                foreign_generator: owner.is_some_and(|id| foreign.contains(id)),
            });
        if let Some(id) = owner {
            *classification
                .by_artifact
                .entry(id.to_string())
                .or_default() += 1;
            if foreign.contains(id) {
                classification.foreign += 1;
            }
        }

        if !is_analysable(path) {
            continue;
        }
        if path
            .split('/')
            .any(|segment| SKIP_DIRECTORIES.contains(&segment))
        {
            continue;
        }

        let absolute = paths.absolute(path);
        let source = match std::fs::read_to_string(&absolute) {
            Ok(text) => text,
            Err(_) => continue,
        };

        let package = packages
            .iter()
            .filter(|p| path.starts_with(&p.root))
            .max_by_key(|p| p.root.len())
            .map(|p| p.name.clone())
            .unwrap_or_else(|| "repository".to_string());

        let content = Digest::of_bytes(source.as_bytes());
        let version = if path.ends_with(".py") {
            python::PARSER_VERSION
        } else {
            ts::PARSER_VERSION
        };
        let key = parse_key_with_context(&content, version, &options.context_digest);
        let cached = options
            .cache
            .get(&key)
            .ok()
            .flatten()
            .and_then(|bytes| serde_json::from_slice::<ModuleAnalysis>(&bytes).ok());

        let module = match cached {
            Some(module) => module,
            None => {
                let parsed = if path.ends_with(".py") {
                    python::analyze(path, &package, generated, &source).map(|a| a.module)
                } else {
                    let allocator = oxc_allocator::Allocator::default();
                    ts::analyze(path, &package, generated, &source, &allocator)
                };
                match parsed {
                    Ok(module) => {
                        if let Ok(bytes) = serde_json::to_vec(&module) {
                            let _ = options.cache.put(&key, &bytes);
                        }
                        module
                    }
                    Err(_) => continue,
                }
            }
        };
        modules.push(module);
    }

    modules.sort_by(|a, b| a.path.cmp(&b.path));
    Ok((modules, classification))
}

pub fn analyse_modules(
    paths: &RepoPaths,
    registry: &GeneratedRegistry,
    packages: &[Package],
    tracked: &[String],
    options: &AnalyseOptions,
) -> Result<Vec<ModuleAnalysis>> {
    Ok(parse_all(paths, registry, packages, tracked, options)?.0)
}

pub fn is_test_file(path: &str) -> bool {
    crate::testgraph::is_test_module(path)
}

pub fn is_source_file(path: &str) -> bool {
    is_analysable(path) && !is_test_file(path)
}

pub fn repo_paths(root: &std::path::Path) -> Result<RepoPaths> {
    RepoPaths::discover(root)
}

pub fn default_paths() -> Result<RepoPaths> {
    RepoPaths::discover(&PathBuf::from("."))
}

#[cfg(test)]
mod cache_key_tests {
    use super::*;

    fn package(name: &str, root: &str) -> Package {
        Package {
            name: name.into(),
            root: root.into(),
            manifest: format!("{root}/package.json"),
            entrypoints: vec![format!("{root}/src/index.ts")],
            private: false,
        }
    }

    fn registry() -> GeneratedRegistry {
        GeneratedRegistry {
            version: 1,
            artifact: vec![tetanus_config::generated::Artifact {
                id: "gen".into(),
                paths: vec!["gen/**".into()],
                generator: "test".into(),
                command: None,
                inputs: vec![],
                committed: true,
                foreign_generator: false,
            }],
        }
    }

    fn tracked() -> Vec<String> {
        vec!["a.ts".into(), "b.ts".into()]
    }

    /// The regression this pins: the parse cache key used to be file content plus
    /// parser version, so adding a package left every already-cached module
    /// reporting the old package. The context digest has to change when the
    /// package layout does.
    #[test]
    fn adding_a_package_changes_the_context_digest() {
        let before = context_digest(&registry(), &[package("root", "")], &tracked());
        let after = context_digest(
            &registry(),
            &[package("root", ""), package("sdk", "packages/sdk")],
            &tracked(),
        );
        assert_ne!(
            before, after,
            "the cache key must change with the package layout"
        );
    }

    #[test]
    fn reassigning_a_file_changes_the_context_digest() {
        let a = context_digest(
            &registry(),
            &[package("root", ""), package("sdk", "packages/sdk")],
            &tracked(),
        );
        let b = context_digest(
            &registry(),
            &[package("root", ""), package("sdk", "packages/other")],
            &tracked(),
        );
        assert_ne!(a, b, "moving a package root must invalidate the cache");
    }

    #[test]
    fn adding_or_removing_a_tracked_file_changes_the_context_digest() {
        let base = context_digest(&registry(), &[package("root", "")], &tracked());
        let mut extended = tracked();
        extended.push("c.ts".into());
        let with_extra = context_digest(&registry(), &[package("root", "")], &extended);
        assert_ne!(base, with_extra);

        // A new file changes which relative specifiers resolve, so every cached
        // parse computed without it is potentially wrong.
        let without = context_digest(&registry(), &[package("root", "")], &["a.ts".to_string()]);
        assert_ne!(base, without);
    }

    #[test]
    fn changing_the_registry_changes_the_context_digest() {
        let base = context_digest(&registry(), &[package("root", "")], &tracked());
        let mut altered = registry();
        altered.artifact[0].paths.push("more/**".into());
        let changed = context_digest(&altered, &[package("root", "")], &tracked());
        assert_ne!(
            base, changed,
            "a changed registry changes what counts as generated"
        );
    }

    #[test]
    fn the_same_inputs_produce_the_same_context_digest() {
        let a = context_digest(&registry(), &[package("root", "")], &tracked());
        let b = context_digest(&registry(), &[package("root", "")], &tracked());
        assert_eq!(a, b, "the cache must not be a source of nondeterminism");
    }

    #[test]
    fn the_parse_key_includes_the_context() {
        let content = Digest::of_str("file contents");
        let a = parse_key_with_context(&content, "parser-1", &Digest::of_str("ctx-a"));
        let b = parse_key_with_context(&content, "parser-1", &Digest::of_str("ctx-b"));
        assert_ne!(a, b);
    }
}
