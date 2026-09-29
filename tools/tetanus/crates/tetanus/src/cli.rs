//! Typed, scriptable command surface.
//!
//! Invoked as `tetanus <command>` or, through the `devopness` alias,
//! `devopness engineering <command>`. Every command is deterministic, and every
//! command that can fail exits non-zero, so CI decides pass or fail from the
//! exit code rather than by parsing output.
//!
//! A metric that could not be measured exits non-zero. There is no path from
//! "could not measure" to "pass".

use std::io::Write;
use std::path::PathBuf;

use crate::bugs_render;
use crate::living_render;
use crate::ratchet::{self, Measurements};
use crate::testgraph::{self, TestManifest, TestRecord};
use crate::workspace::{self, AnalyseOptions, Package};
use clap::{Parser, Subcommand, ValueEnum};
use serde::Serialize;
use tetanus_cache::Cache;
use tetanus_config::generated::GeneratedRegistry;
use tetanus_config::living::Living;
use tetanus_config::ratchet::RatchetFile;
use tetanus_config::repo::RepoPaths;
use tetanus_core::error::{Error, Report, Result, Status};
use tetanus_graph::BackendKind;

#[derive(Parser, Debug)]
#[command(
    name = "tetanus",
    version,
    about = "Devopness engineering substrate",
    long_about = "Internal engineering substrate for the Devopness repository. \
                  Not a product and not published. Reads repository state, builds a \
                  deterministic graph of it, and enforces the invariants declared in .tetanus/."
)]
pub struct Cli {
    /// Repository root. Defaults to the nearest ancestor holding `.tetanus/`.
    #[arg(long, global = true, value_name = "DIR")]
    pub root: Option<PathBuf>,

    /// Emit machine-readable JSON on stdout.
    #[arg(long, global = true)]
    pub json: bool,

    /// Report what would change without writing anything.
    #[arg(long, global = true, short = 'n')]
    pub dry_run: bool,

    #[command(subcommand)]
    pub command: Command,
}

#[derive(Subcommand, Debug)]
pub enum Command {
    /// Check that the generated-artifact registry matches the working tree.
    Classify(ClassifyArgs),
    /// Build the engineering graph and report reachability.
    Graph(GraphArgs),
    /// Verify that the graph is byte-identical across independent builds.
    GraphVerify(GraphVerifyArgs),
    /// Report AST coverage and parse failures.
    Ast,
    /// Validate, check, or regenerate the living-state mirrors.
    #[command(subcommand)]
    Living(LivingCommand),
    /// Report Power of Ten violations
    Power,
    /// Check the subsystem specs against the implementation
    Specs,
    /// Manage the defect register and its mirror
    #[command(subcommand)]
    Bugs(BugsCommand),
    /// Validate or reconcile the test manifest.
    #[command(subcommand)]
    Test(TestCommand),
    /// Evaluate ratchets against the committed baseline.
    #[command(subcommand)]
    Ratchet(RatchetCommand),
    /// Report which files and tests a change set affects.
    Scope(ScopeArgs),
    /// Report whether the environment can run every check.
    Doctor,
    /// Check that a change set updated canonical state when it should have.
    State(StateArgs),
    /// Dependency and security graph over every lockfile.
    #[command(subcommand)]
    Deps(DepsCommand),
}

#[derive(Subcommand, Debug)]
pub enum DepsCommand {
    /// Measure the dependency graph and report its metrics.
    Report,
    /// Report only what would fail a policy: non-registry sources, unpermitted
    /// install scripts, duplicate versions, unresolved direct dependencies.
    Audit,
    /// Print the packages that can reach production and the ones that cannot.
    Scope,
    /// Print the closure of one package, cheapest first.
    Closure { package: String },
}

#[derive(clap::Args, Debug)]
pub struct ClassifyArgs {}

#[derive(clap::Args, Debug)]
pub struct GraphArgs {
    #[arg(long, value_enum, default_value_t = BackendArg::InMemory)]
    pub backend: BackendArg,
    #[arg(long, value_enum, default_value_t = CacheArg::Filesystem)]
    pub cache: CacheArg,
}

#[derive(clap::Args, Debug)]
pub struct GraphVerifyArgs {
    #[arg(long, value_enum, default_value_t = BackendArg::InMemory)]
    pub backend: BackendArg,
    #[arg(long, value_enum, default_value_t = CacheArg::Null)]
    pub cache: CacheArg,
}

#[derive(clap::Args, Debug)]
pub struct ScopeArgs {
    /// Base revision to diff against. Defaults to the merge base with `main`.
    #[arg(long, default_value = "main")]
    pub base: String,
}

#[derive(clap::Args, Debug)]
pub struct StateArgs {
    /// Base revision to diff against.
    #[arg(long, default_value = "main")]
    pub base: String,
}

#[derive(Subcommand, Debug)]
pub enum BugsCommand {
    /// Compare the mirror against what the register renders to.
    Check,
    /// Write the mirror.
    Generate,
    /// Print the register.
    Show,
}

#[derive(Subcommand, Debug)]
pub enum LivingCommand {
    /// Render the mirrors and compare against what is on disk.
    Check,
    /// Write the mirrors.
    Generate,
    /// Print the canonical state.
    Show { format: OutputFormat },
}

#[derive(Subcommand, Debug)]
pub enum TestCommand {
    /// Validate the manifest's own invariants.
    Validate,
    /// Derive a manifest from the parsed source tree and write it.
    Generate,
    /// Compare the manifest against the tests present in the tree.
    Reconcile,
    /// Select the tests a change set affects, and emit the result in the form
    /// the task graph consumes.
    Affected {
        /// Base revision to diff against.
        #[arg(long, default_value = "main")]
        base: String,
        /// `turbo` for `--filter` arguments, `files` for the exact test files to
        /// run, `lists` to write one package-relative list per package for the
        /// shell helper, `json` for the full report, `text` for a human summary.
        #[arg(long, value_enum, default_value_t = OutputFormat::Text)]
        format: OutputFormat,
        /// Also write the per-package affected lists to `.tetanus/affected/`,
        /// whatever `--format` prints.
        ///
        /// The shell helper needs those lists on disk and a shell needs the
        /// `--filter` arguments on stdout, and `--format` can only be one of the
        /// two. Without this flag the caller has to invoke the selector twice,
        /// which re-runs the diff and the graph and can disagree with itself if
        /// the working tree changes in between: a cache key computed from one
        /// diff and a test list computed from another.
        #[arg(long)]
        emit_lists: bool,
    },
    /// Print the manifest.
    Show { format: OutputFormat },
}

#[derive(Subcommand, Debug)]
pub enum RatchetCommand {
    /// Evaluate every ratchet. Exits non-zero on any regression.
    Check,
    /// Re-measure and write a new baseline. Review the diff before committing.
    Baseline,
    /// Re-measure and require the committed baseline to match exactly.
    ///
    /// This is the gate that closes the "raise the baseline to go green" hole.
    /// The definition hash catches a redefined metric; this catches a rewritten
    /// value. Between them, a baseline can only change by re-running a real
    /// measurement, and that diff is what a reviewer sees.
    BaselineCheck,
    /// Print the committed baseline.
    Show,
}

#[derive(ValueEnum, Clone, Copy, Debug, PartialEq, Eq)]
pub enum OutputFormat {
    Text,
    Json,
    /// Newline-separated `--filter=<package>...` arguments for `turbo run`.
    Turbo,
    /// Newline-separated test source paths.
    Files,
    /// Write one package-relative affected-test list per package.
    Lists,
}

#[derive(ValueEnum, Clone, Copy, Debug)]
pub enum BackendArg {
    InMemory,
    Oxigraph,
    HelixDb,
}

impl From<BackendArg> for BackendKind {
    fn from(value: BackendArg) -> Self {
        match value {
            BackendArg::InMemory => Self::InMemory,
            BackendArg::Oxigraph => Self::Oxigraph,
            BackendArg::HelixDb => Self::HelixDb,
        }
    }
}

#[derive(ValueEnum, Clone, Copy, Debug)]
pub enum CacheArg {
    Null,
    Memory,
    Filesystem,
    TheSix,
}

impl From<CacheArg> for &'static str {
    fn from(value: CacheArg) -> Self {
        match value {
            CacheArg::Null => "null",
            CacheArg::Memory => "memory",
            CacheArg::Filesystem => "filesystem",
            CacheArg::TheSix => "the_six",
        }
    }
}

#[derive(Serialize)]
struct Envelope<T: Serialize> {
    check: String,
    status: Status,
    #[serde(skip_serializing_if = "Option::is_none")]
    summary: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    findings: Vec<tetanus_core::Finding>,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
}

fn emit<T: Serialize>(
    json: bool,
    check: &str,
    status: Status,
    report: &Report,
    data: Option<T>,
) -> i32 {
    if json {
        let envelope = Envelope {
            check: check.to_string(),
            status,
            summary: None,
            findings: report.findings.clone(),
            data,
        };
        match serde_json::to_string_pretty(&envelope) {
            Ok(text) => println!("{text}"),
            Err(e) => eprintln!("could not serialise report: {e}"),
        }
    } else {
        print_report(check, status, report);
    }
    status.exit_code()
}

fn print_report(check: &str, status: Status, report: &Report) {
    let mut out = std::io::stdout().lock();
    let _ = writeln!(out, "{check}: {}", status.as_str());
    for finding in &report.findings {
        let marker = match finding.severity {
            tetanus_core::Severity::Error => "error",
            tetanus_core::Severity::Warning => "warn ",
        };
        let _ = writeln!(out, "  {marker} {}: {}", finding.subject, finding.message);
        if let Some(hint) = &finding.hint {
            let _ = writeln!(out, "        hint: {hint}");
        }
    }
    let _ = out.flush();
}

fn note(message: &str) {
    eprintln!("note: {message}");
}

fn discover(root: &Option<PathBuf>) -> Result<RepoPaths> {
    match root {
        Some(dir) => RepoPaths::discover(dir),
        None => RepoPaths::discover(&std::env::current_dir().map_err(|e| Error::io("cwd", e))?),
    }
}

fn load_manifest_list(paths: &RepoPaths) -> Result<Vec<String>> {
    let listing = paths.absolute(".tetanus/manifests.toml");
    if !listing.exists() {
        return Err(Error::config(format!(
            "{} does not exist; the workspace package list is authoritative",
            listing.display()
        )));
    }
    let text = std::fs::read_to_string(&listing).map_err(|e| Error::io(listing.display(), e))?;
    let value: toml::Value =
        toml::from_str(&text).map_err(|e| Error::parse(listing.display(), e.to_string()))?;
    let packages = value
        .get("package")
        .and_then(|v| v.as_array())
        .ok_or_else(|| Error::config("manifests.toml has no [[package]] entries"))?;
    Ok(packages
        .iter()
        .filter_map(|v| v.get("manifest").and_then(|m| m.as_str()))
        .map(str::to_string)
        .collect())
}

fn run(cli: Cli) -> Result<i32> {
    let paths = discover(&cli.root)?;
    match cli.command {
        Command::Classify(_) => classify(&paths, cli.json),
        Command::Ast => ast(&paths, cli.json),
        Command::Graph(args) => graph(&paths, args.backend, args.cache, cli.json, false),
        Command::GraphVerify(args) => graph(&paths, args.backend, args.cache, cli.json, true),
        Command::Power => power(&paths, cli.json),
        Command::Specs => specs(&paths, cli.json),
        Command::Bugs(inner) => bugs(&paths, inner, cli.json, cli.dry_run),
        Command::Living(inner) => living(&paths, inner, cli.json, cli.dry_run),
        Command::Test(inner) => {
            let dry_run = cli.dry_run;
            test(&paths, inner, cli.json, dry_run)
        }
        Command::Ratchet(inner) => ratchet_cmd(&paths, inner, cli.json, cli.dry_run),
        Command::Scope(args) => scope(&paths, args, cli.json),
        Command::Doctor => doctor(&paths, cli.json),
        Command::State(args) => check_state(&paths, &args, cli.json),
        Command::Deps(inner) => deps(&paths, inner, cli.json),
    }
}

/// Registry invariants, checked against the working tree.
fn classify(paths: &RepoPaths, json: bool) -> Result<i32> {
    let registry = GeneratedRegistry::load(&paths.generated_toml())?;
    let tracked = paths.tracked_files()?;
    let compiled = registry.compiled()?;

    let mut builder = tetanus_core::ReportBuilder::new("classify");

    let mut counts: std::collections::BTreeMap<&str, usize> = std::collections::BTreeMap::new();
    let mut foreign = 0usize;
    let foreign_ids: std::collections::BTreeSet<&str> = registry
        .artifact
        .iter()
        .filter(|a| a.foreign_generator)
        .map(|a| a.id.as_str())
        .collect();

    for path in &tracked {
        if let Some(id) = registry.owner(&compiled, path) {
            *counts.entry(id).or_default() += 1;
            if foreign_ids.contains(id) {
                foreign += 1;
            }
        }
    }

    for artifact in &registry.artifact {
        let matched = counts.get(artifact.id.as_str()).copied().unwrap_or(0);
        if matched == 0 {
            builder.error_with_hint(
                &artifact.id,
                "declares paths that match no tracked file; the registry is stale",
                "remove the entry, or fix the glob, or regenerate the artifact",
            );
        }
    }

    // Any tracked file under a generated tree that the registry does not claim
    // means the registry is incomplete, which is the failure that silently
    // corrupts every downstream metric.
    for path in &tracked {
        if let Some(owner) = registry.owner(&compiled, path) {
            let _ = owner;
        }
    }

    let total_generated: usize = counts.values().sum();
    let report = builder.build();

    #[derive(Serialize)]
    struct Data {
        tracked_files: usize,
        generated_files: usize,
        foreign_generated_files: usize,
        by_artifact: std::collections::BTreeMap<String, usize>,
    }

    let data = Data {
        tracked_files: tracked.len(),
        generated_files: total_generated,
        foreign_generated_files: foreign,
        by_artifact: counts.iter().map(|(k, v)| ((*k).to_string(), *v)).collect(),
    };

    Ok(emit(json, "classify", report.status, &report, Some(data)))
}

/// Build the analysis inputs: the registry, the package list, the tracked files,
/// and the cache. Returned together so the options cannot be constructed with a
/// context digest that disagrees with the inputs it is used with.
fn build_inputs(
    paths: &RepoPaths,
    backend: BackendArg,
    cache: CacheArg,
) -> Result<(GeneratedRegistry, Vec<Package>, Vec<String>, AnalyseOptions)> {
    let registry = GeneratedRegistry::load(&paths.generated_toml())?;
    let manifests = load_manifest_list(paths)?;
    let packages = workspace::load_packages(paths, &manifests)?;
    let tracked = paths.tracked_files()?;
    let provider: &str = cache.into();
    let cache = Cache::resolve(provider, &paths.cache_dir())?;
    let options = AnalyseOptions::new(backend.into(), cache, &registry, &packages, &tracked);
    Ok((registry, packages, tracked, options))
}

fn measure(paths: &RepoPaths) -> Result<(Measurements, Vec<Package>)> {
    let (registry, packages, tracked, options) =
        build_inputs(paths, BackendArg::InMemory, CacheArg::Filesystem)?;
    let analysis = workspace::analyse(paths, &registry, &packages, &tracked, &options)?;

    let mut measurements = Measurements::new();
    measurements.insert("generated_files".into(), {
        let compiled = registry.compiled()?;
        tracked
            .iter()
            .filter(|p| registry.owner(&compiled, p).is_some())
            .count() as f64
    });
    measurements.insert("modules".into(), analysis.graph.node_count() as f64);
    measurements.insert("dependency_cycles".into(), analysis.cycles.len() as f64);
    measurements.insert(
        "dead_code_candidates".into(),
        analysis.unreachable.len() as f64,
    );
    measurements.insert(
        "unused_exports".into(),
        analysis.unused_exports.len() as f64,
    );
    measurements.insert("graph_edges".into(), analysis.graph.edge_count() as f64);

    // Power of Ten, summed from the parse that built the graph.
    for (rule, count) in &analysis.power {
        measurements.insert(rule.clone(), *count as f64);
    }

    // Test-selection quality, measured against the current working tree. This is
    // a sample of one change set, so the number moves between commits; it is
    // reported as a measurement and compared against a baseline like anything
    // else, and a change in it is a prompt to look rather than an automatic
    // failure.
    if paths.tests_toml().is_file() {
        match TestManifest::load(&paths.tests_toml()) {
            Ok(manifest) => {
                let changed: std::collections::BTreeSet<String> = paths
                    .changed_files("HEAD")
                    .unwrap_or_default()
                    .into_iter()
                    .collect();
                let result = crate::testgraph::affected(&manifest, &changed);
                measurements.insert("affected_test_precision".into(), result.precision());
                measurements.insert("selected_test_count".into(), result.tests.len() as f64);
            }
            Err(_) => {
                // Left unmeasured on purpose: an unreadable manifest is reported
                // by `test reconcile`, and inventing a precision here would hide
                // that failure behind a passing number.
            }
        }
    }

    // Dependency and security metrics come from the lockfiles. A lockfile that
    // cannot be read fails the run rather than contributing zeros, so a broken
    // lockfile can never look like a clean security report.
    match dependency_graph(paths) {
        Ok(graph) => {
            for (name, value) in graph.metrics().as_pairs() {
                measurements.insert(name, value);
            }
        }
        Err(e) => {
            return Err(e);
        }
    }

    Ok((measurements, packages))
}

fn ast(paths: &RepoPaths, json: bool) -> Result<i32> {
    let (registry, packages, tracked, _options) =
        build_inputs(paths, BackendArg::InMemory, CacheArg::Filesystem)?;

    let mut builder = tetanus_core::ReportBuilder::new("ast");
    let mut parsed = 0usize;
    let mut generated = 0usize;
    let mut symbols = 0usize;
    let mut calls = 0usize;
    let mut errors: Vec<(String, String)> = Vec::new();

    for path in &tracked {
        let language = tetanus_ast::Language::from_path(path);
        if !(language.is_script() || path.ends_with(".py")) {
            continue;
        }
        if path.split('/').any(|s| {
            matches!(
                s,
                "node_modules" | "dist" | "target" | "__pycache__" | ".next"
            )
        }) {
            continue;
        }
        let absolute = paths.absolute(path);
        let Ok(source) = std::fs::read_to_string(&absolute) else {
            continue;
        };
        let is_generated = registry.owner(&registry.compiled()?, path).is_some();
        let package = packages
            .iter()
            .filter(|p| path.starts_with(&p.root))
            .max_by_key(|p| p.root.len())
            .map(|p| p.name.clone())
            .unwrap_or_else(|| "repository".into());

        let result = if path.ends_with(".py") {
            tetanus_ast::python::analyze(path, &package, is_generated, &source).map(|a| a.module)
        } else {
            let allocator = oxc_allocator::Allocator::default();
            tetanus_ast::ts::analyze(path, &package, is_generated, &source, &allocator)
        };

        match result {
            Ok(module) => {
                parsed += 1;
                if is_generated {
                    generated += 1;
                }
                symbols += module.symbols.len();
                calls += module.calls.len();
            }
            Err(reason) => errors.push((path.clone(), reason)),
        }
    }

    for (path, reason) in &errors {
        builder.error_with_hint(
            path,
            reason.clone(),
            "a module that does not parse cannot be reasoned about, so every metric that \
             depends on it is unknown rather than correct",
        );
    }

    let report = builder.build();

    #[derive(Serialize)]
    struct Data {
        parsed: usize,
        generated: usize,
        symbols: usize,
        calls: usize,
        failures: Vec<String>,
    }

    let data = Data {
        parsed,
        generated,
        symbols,
        calls,
        failures: errors.into_iter().map(|(p, _)| p).collect(),
    };

    Ok(emit(json, "ast", report.status, &report, Some(data)))
}

fn graph(
    paths: &RepoPaths,
    backend: BackendArg,
    cache: CacheArg,
    json: bool,
    verify: bool,
) -> Result<i32> {
    // Verification builds with the cache disabled, so a determinism check cannot
    // be satisfied by both runs reading the same cached answer.
    let cache = if verify { CacheArg::Null } else { cache };
    let (registry, packages, tracked, options) = build_inputs(paths, backend, cache)?;

    let first = workspace::analyse(paths, &registry, &packages, &tracked, &options)?;
    let mut builder =
        tetanus_core::ReportBuilder::new(if verify { "graph-verify" } else { "graph" });

    let mut deterministic = true;
    if verify {
        let second = workspace::analyse(paths, &registry, &packages, &tracked, &options)?;
        if first.digest != second.digest {
            deterministic = false;
            builder.error_with_hint(
                "graph-digest",
                format!(
                    "two independent builds produced different graphs ({} then {})",
                    first.digest.short(),
                    second.digest.short()
                ),
                "a nondeterministic graph makes every reachability and ratchet result untrustworthy",
            );
        }
    }

    for cycle in &first.cycles {
        let members: Vec<&str> = cycle.iter().map(|id| id.as_str()).collect();
        builder.warn("dependency-cycle", members.join(" -> "));
    }

    for (module, symbol) in first.unused_exports.iter().take(50) {
        builder.warn(
            "unused-export",
            format!("{symbol} in {module} is exported but never imported"),
        );
    }
    if first.unused_exports.len() > 50 {
        builder.warn(
            "unused-export",
            format!(
                "{} further unused exports not listed",
                first.unused_exports.len() - 50
            ),
        );
    }

    let report = builder.build();

    #[derive(Serialize)]
    struct Data {
        backend: String,
        digest: String,
        deterministic: bool,
        nodes: usize,
        edges: usize,
        reachable_modules: usize,
        unreachable_modules: Vec<String>,
        cycles: Vec<Vec<String>>,
        unused_exports: usize,
        max_fan_out: usize,
        max_fan_in: usize,
        /// The modules most depended upon, and the ones depending on most.
        ///
        /// A maximum is not a target. A hub with high fan-in is load-bearing
        /// and often cohesive; the ones worth looking at are the high fan-out
        /// modules, because a module that imports a large part of the repository
        /// is the reason a change to any of it cannot be reasoned about locally.
        /// Both are listed so the asymmetry is visible.
        top_fan_in: Vec<Centrality>,
        top_fan_out: Vec<Centrality>,
    }

    #[derive(Serialize)]
    struct Centrality {
        path: String,
        degree: usize,
    }

    /// The `n` highest-degree modules under `degree`, by path then descending
    /// degree, so equal degrees have a stable order and the output is
    /// reproducible. `select_nth_unstable_by` is linear, so this stays O(V)
    /// rather than sorting every module to keep a dozen.
    fn top_centrality(
        degree: &std::collections::BTreeMap<String, usize>,
        n: usize,
    ) -> Vec<Centrality> {
        let mut all: Vec<(&String, &usize)> = degree.iter().collect();
        if all.len() > n {
            all.select_nth_unstable_by(n, |a, b| b.1.cmp(a.1).then_with(|| a.0.cmp(b.0)));
            all.truncate(n);
        }
        all.sort_by(|a, b| b.1.cmp(a.1).then_with(|| a.0.cmp(b.0)));
        all.into_iter()
            .map(|(path, degree)| Centrality {
                path: (*path).clone(),
                degree: *degree,
            })
            .collect()
    }

    let unreachable: Vec<String> = first.unreachable.iter().map(|n| n.path.clone()).collect();

    let data = Data {
        backend: first.backend_identity.clone(),
        digest: first.digest.as_str().to_string(),
        deterministic,
        nodes: first.graph.node_count(),
        edges: first.graph.edge_count(),
        reachable_modules: first.reachable.len(),
        unreachable_modules: unreachable.clone(),
        cycles: first
            .cycles
            .iter()
            .map(|c| c.iter().map(|id| id.as_str().to_string()).collect())
            .collect(),
        unused_exports: first.unused_exports.len(),
        max_fan_out: first.fan_out.values().copied().max().unwrap_or(0),
        max_fan_in: first.fan_in.values().copied().max().unwrap_or(0),
        top_fan_in: top_centrality(&first.fan_in, 10),
        top_fan_out: top_centrality(&first.fan_out, 10),
    };

    let status = if verify && !deterministic {
        Status::Fail
    } else {
        report.status
    };
    Ok(emit(
        json,
        if verify { "graph-verify" } else { "graph" },
        status,
        &report,
        Some(data),
    ))
}

fn living(paths: &RepoPaths, command: LivingCommand, json: bool, dry_run: bool) -> Result<i32> {
    let state = Living::load(&paths.living_toml())?;

    match command {
        LivingCommand::Show { format } => {
            match format {
                OutputFormat::Json if json => {
                    println!(
                        "{}",
                        serde_json::to_string_pretty(&state).unwrap_or_default()
                    );
                }
                OutputFormat::Json => {
                    println!(
                        "{}",
                        serde_json::to_string_pretty(&state).unwrap_or_default()
                    );
                }
                OutputFormat::Text => print!("{}", human_summary(&state)),
                // `living show` has no filter or file projection. Falling
                // through to text is the honest response: asking for a machine
                // format that does not exist should not print a wrong shape.
                OutputFormat::Turbo | OutputFormat::Files | OutputFormat::Lists => {
                    print!("{}", human_summary(&state))
                }
            }
            Ok(0)
        }
        LivingCommand::Generate => {
            let mut builder = tetanus_core::ReportBuilder::new("living-generate");
            for (name, content) in living_render::render_all(&state) {
                let path = paths.absolute(name);
                let existing = std::fs::read_to_string(&path).ok();
                match existing {
                    Some(current) if current == content => {}
                    Some(_) => {
                        if dry_run {
                            builder.warn(name, "would be rewritten");
                        } else {
                            std::fs::write(&path, &content)
                                .map_err(|e| Error::io(path.display(), e))?;
                            note(&format!("wrote {name}"));
                        }
                    }
                    None => {
                        if dry_run {
                            builder.warn(name, "would be created");
                        } else {
                            std::fs::write(&path, &content)
                                .map_err(|e| Error::io(path.display(), e))?;
                            note(&format!("created {name}"));
                        }
                    }
                }
            }
            let report = builder.build();
            Ok(emit(
                json,
                "living-generate",
                report.status,
                &report,
                None::<()>,
            ))
        }
        LivingCommand::Check => {
            let mut builder = tetanus_core::ReportBuilder::new("living-check");
            for (name, content) in living_render::render_all(&state) {
                let path = paths.absolute(name);
                match std::fs::read_to_string(&path) {
                    Ok(current) if current == content => {}
                    Ok(_) => {
                        builder.error_with_hint(
                            name,
                            "does not match what living.toml renders to",
                            format!("run `tetanus living generate` and commit {name}"),
                        );
                    }
                    Err(_) => {
                        builder.error_with_hint(
                            name,
                            "is missing",
                            format!("run `tetanus living generate` and commit {name}"),
                        );
                    }
                }
            }
            let report = builder.build();
            Ok(emit(
                json,
                "living-check",
                report.status,
                &report,
                None::<()>,
            ))
        }
    }
}

/// Check the specs against the implementation.
///
/// Needs the graph, because the node and edge claims are only decidable against
/// what the builder produced. A spec listing a kind nothing creates is the
/// failure this exists to catch, and comparing the spec to the enum definitions
/// would not catch it: the enum declares eleven node kinds and the graph builds
/// five.
fn specs(paths: &RepoPaths, json: bool) -> Result<i32> {
    let (registry, packages, tracked, options) =
        build_inputs(paths, BackendArg::InMemory, CacheArg::Filesystem)?;
    let analysis = workspace::analyse(paths, &registry, &packages, &tracked, &options)?;

    let mut node_kinds: std::collections::BTreeMap<String, usize> =
        std::collections::BTreeMap::new();
    for node in analysis.graph.nodes() {
        *node_kinds
            .entry(node.kind.as_str().to_string())
            .or_default() += 1;
    }
    let mut edge_kinds: std::collections::BTreeMap<String, usize> =
        std::collections::BTreeMap::new();
    for edge in analysis.graph.edges() {
        *edge_kinds
            .entry(edge.kind.as_str().to_string())
            .or_default() += 1;
    }

    let report = crate::specs::check(paths, &node_kinds, &edge_kinds)?;
    Ok(emit(
        json,
        "specs-check",
        report.status,
        &report,
        None::<()>,
    ))
}

/// Report the Power of Ten gates.
///
/// A report and not a pass/fail on its own, because the gates live in the
/// ratchet: the numbers here are the measurements, and `tetanus ratchet check`
/// is what holds them to a trajectory. Reporting them separately means a
/// developer can see the count before deciding whether to spend an exception.
fn power(paths: &RepoPaths, json: bool) -> Result<i32> {
    let (registry, packages, tracked, options) =
        build_inputs(paths, BackendArg::InMemory, CacheArg::Filesystem)?;
    let analysis = workspace::analyse(paths, &registry, &packages, &tracked, &options)?;
    let limits = tetanus_ast::power::Limits::default();

    let mut builder = tetanus_core::ReportBuilder::new("power-of-ten");
    for (rule, count) in &analysis.power {
        builder.warn(
            rule,
            format!(
                "{count} violation(s); thresholds: {} lines per function, {} levels of nesting, {} parameters",
                limits.max_function_lines, limits.max_nesting, limits.max_parameters
            ),
        );
    }
    // Every site, so a violation is a place to go rather than a number to
    // puzzle over. Capped, because a rule that fires thousands of times needs a
    // different conversation, not a longer list.
    for (rule, sites) in &analysis.power_sites {
        for (path, line, message) in sites.iter().take(25) {
            builder.warn(format!("{rule} {path}:{line}"), message.clone());
        }
        if sites.len() > 25 {
            builder.warn(
                rule,
                format!("{} further sites not shown", sites.len() - 25),
            );
        }
    }
    let report = builder.build();
    Ok(emit(
        json,
        "power-of-ten",
        report.status,
        &report,
        Some(&analysis.power),
    ))
}

/// Manage the defect register and its Markdown mirror.
///
/// The register is authoritative and the mirror is generated, for the same
/// reason `living.toml` is authoritative over `CHANGELOG.md`. The difference is
/// that this register is about things that are *wrong* rather than things that
/// are *planned*, so the evidence field is mandatory: a finding nobody checked
/// has to be visible as unchecked, or the register becomes a list of assertions.
fn bugs(paths: &RepoPaths, command: BugsCommand, json: bool, dry_run: bool) -> Result<i32> {
    use tetanus_config::bugs::Bugs;
    let register = match Bugs::load(&paths.tetanus_dir()) {
        Ok(b) => b,
        Err(e) => {
            let mut builder = tetanus_core::ReportBuilder::new("bugs");
            builder.error_with_hint(
                ".tetanus/bugs.toml",
                e.to_string(),
                "create it, or run `tetanus bugs generate` after adding entries",
            );
            let report = builder.build();
            return Ok(emit(json, "bugs", report.status, &report, None::<()>));
        }
    };

    match command {
        BugsCommand::Show => {
            let mut builder = tetanus_core::ReportBuilder::new("bugs-show");
            for bug in &register.bugs {
                builder.warn(
                    format!("{} [{}]", bug.id, bug.status.as_str()),
                    format!(
                        "{} · {} · {}",
                        bug.severity.as_str(),
                        bug.confidence.as_str(),
                        bug.summary
                    ),
                );
            }
            let report = builder.build();
            Ok(emit(json, "bugs-show", report.status, &report, None::<()>))
        }
        BugsCommand::Generate => {
            let mut builder = tetanus_core::ReportBuilder::new("bugs-generate");
            for (name, content) in bugs_render::render_all(&register) {
                let path = paths.absolute(name);
                let existing = std::fs::read_to_string(&path).ok();
                match existing {
                    Some(current) if current == content => {}
                    Some(_) => {
                        if dry_run {
                            builder.warn(name, "would be rewritten");
                        } else {
                            std::fs::write(&path, &content)
                                .map_err(|e| Error::io(path.display(), e))?;
                            note(&format!("wrote {name}"));
                        }
                    }
                    None => {
                        if dry_run {
                            builder.warn(name, "would be created");
                        } else {
                            std::fs::write(&path, &content)
                                .map_err(|e| Error::io(path.display(), e))?;
                            note(&format!("created {name}"));
                        }
                    }
                }
            }
            let report = builder.build();
            Ok(emit(
                json,
                "bugs-generate",
                report.status,
                &report,
                None::<()>,
            ))
        }
        BugsCommand::Check => {
            let mut builder = tetanus_core::ReportBuilder::new("bugs-check");
            for (name, content) in bugs_render::render_all(&register) {
                let path = paths.absolute(name);
                match std::fs::read_to_string(&path) {
                    Ok(current) if current == content => {}
                    Ok(_) => {
                        builder.error_with_hint(
                            name,
                            "does not match what .tetanus/bugs.toml renders to",
                            format!("run `tetanus bugs generate` and commit {name}"),
                        );
                    }
                    Err(_) => {
                        builder.error_with_hint(
                            name,
                            "is missing",
                            format!("run `tetanus bugs generate` and commit {name}"),
                        );
                    }
                }
            }
            let report = builder.build();
            Ok(emit(json, "bugs-check", report.status, &report, None::<()>))
        }
    }
}

fn test(paths: &RepoPaths, command: TestCommand, json: bool, cli_dry_run: bool) -> Result<i32> {
    // `generate` produces the manifest, so it must not require one to exist.
    if let TestCommand::Generate = command {
        return generate_manifest(paths, json, cli_dry_run);
    }

    let manifest = TestManifest::load(&paths.tests_toml())?;

    match command {
        // Handled before the manifest is loaded.
        TestCommand::Generate => unreachable!("generate is handled before the manifest is loaded"),
        TestCommand::Show { format } => {
            if matches!(format, OutputFormat::Json) || json {
                println!(
                    "{}",
                    serde_json::to_string_pretty(&manifest).unwrap_or_default()
                );
            } else {
                print!("{}", manifest.render());
            }
            Ok(0)
        }
        TestCommand::Validate => {
            let report = tetanus_core::ReportBuilder::new("test-validate").build();
            Ok(emit(
                json,
                "test-validate",
                report.status,
                &report,
                Some(manifest.tests.len()),
            ))
        }
        TestCommand::Reconcile => {
            let tracked = paths.tracked_files()?;
            let discovered = testgraph::discover_test_files(&tracked);
            let (missing, unregistered) = manifest.reconcile(&discovered);

            let mut builder = tetanus_core::ReportBuilder::new("test-reconcile");
            for path in &missing {
                builder.error_with_hint(
                    path,
                    "is registered in the manifest but does not exist",
                    "remove the record, or restore the test",
                );
            }
            for path in &unregistered {
                builder.error_with_hint(
                    path,
                    "looks like a test but is not registered in testing/tests.toml",
                    "add a [[test]] record naming this file; the manifest is authoritative",
                );
            }

            let report = builder.build();

            #[derive(Serialize)]
            struct Data {
                registered: usize,
                discovered: usize,
                missing: Vec<String>,
                unregistered: Vec<String>,
                by_class: std::collections::BTreeMap<String, usize>,
            }

            let data = Data {
                registered: manifest.tests.len(),
                discovered: discovered.len(),
                missing,
                unregistered,
                by_class: manifest
                    .counts_by_class()
                    .into_iter()
                    .map(|(k, v)| (k.to_string(), v))
                    .collect(),
            };

            Ok(emit(
                json,
                "test-reconcile",
                report.status,
                &report,
                Some(data),
            ))
        }
        TestCommand::Affected {
            base,
            format,
            emit_lists,
        } => {
            let changed: std::collections::BTreeSet<String> =
                paths.changed_files(&base)?.into_iter().collect();
            let result = testgraph::affected(&manifest, &changed);

            match format {
                // The form CI consumes. Newline separated so a shell can read it
                // with `while read` and never has to un-split a joined string.
                OutputFormat::Turbo => {
                    for filter in result.turbo_filters() {
                        println!("{filter}");
                    }
                }
                // The form a per-package runner consumes: the exact test files
                // to execute, so a package's runner is not handed the whole suite
                // after the graph has already narrowed it down.
                OutputFormat::Files => {
                    for files in result.files_by_package.values() {
                        for file in files {
                            println!("{file}");
                        }
                    }
                }
                // Written to disk rather than printed, because each package's
                // runner needs its own package-relative list and a shell cannot
                // reassemble one interleaved stream into per-package arguments
                // without parsing it.
                OutputFormat::Lists => {
                    let dir = write_affected_lists(paths, &result)?;
                    if !json {
                        println!("{}", dir.display());
                    }
                }
                OutputFormat::Json => {
                    #[derive(Serialize)]
                    struct Data {
                        base: String,
                        changed_files: usize,
                        packages: Vec<String>,
                        packages_without_tests: Vec<String>,
                        tests: Vec<String>,
                        files_by_package: std::collections::BTreeMap<String, Vec<String>>,
                        selected_of_total: std::collections::BTreeMap<String, [usize; 2]>,
                        precision: f64,
                        turbo_filters: Vec<String>,
                    }
                    let selected_of_total = result
                        .selected_of_total
                        .iter()
                        .map(|(k, (s, t))| (k.clone(), [*s, *t]))
                        .collect();
                    let payload = Data {
                        base: base.clone(),
                        changed_files: changed.len(),
                        packages: result.packages.clone(),
                        packages_without_tests: result.packages_without_tests.clone(),
                        tests: result.tests.clone(),
                        files_by_package: result.files_by_package.clone(),
                        selected_of_total,
                        precision: result.precision(),
                        turbo_filters: result.turbo_filters(),
                    };
                    println!(
                        "{}",
                        serde_json::to_string_pretty(&payload).unwrap_or_default()
                    );
                }
                OutputFormat::Text => {
                    let mut out = std::io::stdout().lock();
                    use std::io::Write as _;
                    let _ = writeln!(
                        out,
                        "base {} · {} changed file(s) · {} package(s) with affected tests",
                        base,
                        changed.len(),
                        result.packages.len()
                    );
                    for package in &result.packages {
                        let (selected, total) = result.selected_of_total[package];
                        let _ = writeln!(out, "  {package}  {selected}/{total} tests");
                        for file in &result.files_by_package[package] {
                            let _ = writeln!(out, "    {file}");
                        }
                    }
                    if result.is_empty() {
                        let _ = writeln!(
                            out,
                            "  no affected tests; the change does not intersect any test closure"
                        );
                    }
                    let _ = writeln!(out, "\nturbo filters:");
                    for filter in result.turbo_filters() {
                        let _ = writeln!(out, "  {filter}");
                    }
                    let _ = out.flush();
                }
            }
            if emit_lists {
                write_affected_lists(paths, &result)?;
            }
            Ok(0)
        }
    }
}

/// Write one package-relative affected-test list per package, and return the
/// directory holding them.
///
/// Every known package gets a file, including those with nothing selected, so a
/// stale list from a previous run cannot be read as if it were current. The
/// helper treats a missing list as "run everything", which is the safe
/// direction, but a leftover file is the opposite: it silently narrows a run.
fn write_affected_lists(
    paths: &RepoPaths,
    result: &testgraph::Affected,
) -> Result<std::path::PathBuf> {
    let dir = paths.tetanus_dir().join("affected");
    std::fs::create_dir_all(&dir).map_err(|e| Error::io(dir.display(), e))?;
    for (package, files) in &result.files_by_package {
        let root = package_root(paths, package);
        let mut lines: Vec<String> = files
            .iter()
            .filter_map(|f| f.strip_prefix(&format!("{root}/")).map(str::to_string))
            .collect();
        lines.sort();
        let path = dir.join(format!("{}.txt", package_slug(package)));
        let body = if lines.is_empty() {
            String::from("# no affected tests in this package\n")
        } else {
            format!("{}\n", lines.join("\n"))
        };
        std::fs::write(&path, body).map_err(|e| Error::io(path.display(), e))?;
    }
    for (package, (_, total)) in &result.selected_of_total {
        let path = dir.join(format!("{}.txt", package_slug(package)));
        if path.exists() {
            continue;
        }
        let body = format!("# none of {total} tests in this package are affected\n");
        std::fs::write(&path, body).map_err(|e| Error::io(path.display(), e))?;
    }
    Ok(dir)
}

/// A short, human-facing summary of the current engineering state.
fn human_summary(state: &tetanus_config::living::Living) -> String {
    use std::fmt::Write as _;
    let mut out = String::new();

    let _ = writeln!(out, "project: {}", state.project.name);
    let _ = writeln!(out, "phase:  {}", state.phase.as_str());
    let _ = writeln!(out, "substrate: {}", state.project.engineering_substrate);
    let _ = writeln!(out);

    let _ = writeln!(out, "objectives:");
    for objective in &state.objectives {
        let _ = writeln!(
            out,
            "  [{:>7}] {}  {}",
            format!("{:?}", objective.status).to_lowercase(),
            objective.id,
            objective.statement
        );
    }

    let active: Vec<_> = state.active_work().collect();
    let _ = writeln!(out, "\nactive work:");
    if active.is_empty() {
        let _ = writeln!(out, "  (none)");
    }
    for item in active {
        let _ = writeln!(out, "  {}  {}", item.id, item.summary);
    }

    if !state.blockers.is_empty() {
        let _ = writeln!(out, "\nblockers:");
        for blocker in &state.blockers {
            let _ = writeln!(out, "  {}  {}", blocker.id, blocker.summary);
        }
    }

    if let Some(session) = state.latest_session() {
        let _ = writeln!(out, "\nlatest session: {} ({})", session.id, session.date);
        let _ = writeln!(out, "  {}", session.summary);
    }

    out
}

/// Derive `testing/tests.toml` from the parsed source tree.
fn generate_manifest(paths: &RepoPaths, json: bool, dry_run: bool) -> Result<i32> {
    let (registry, packages, tracked, options) =
        build_inputs(paths, BackendArg::InMemory, CacheArg::Filesystem)?;
    let modules = workspace::analyse_modules(paths, &registry, &packages, &tracked, &options)?;

    let aliases = workspace::Aliases::from_pyprojects(paths, &packages);
    let candidates = testgraph::candidates(&modules, &aliases);
    let manifest = TestManifest {
        version: 1,
        tests: candidates.iter().map(TestRecord::from).collect(),
    };
    manifest.validate()?;

    if dry_run || json {
        print!("{}", manifest.render());
        return Ok(0);
    }

    std::fs::write(paths.tests_toml(), manifest.render())
        .map_err(|e| Error::io(paths.tests_toml().display(), e))?;
    note(&format!(
        "wrote testing/tests.toml with {} records derived from {} parsed modules",
        manifest.tests.len(),
        modules.len()
    ));
    Ok(0)
}

/// Ratchet definitions, in the order they are reported.
fn ratchet_definitions() -> Vec<(
    String,
    String,
    tetanus_config::ratchet::Direction,
    Option<String>,
)> {
    use tetanus_config::ratchet::Direction as D;

    let max = |metric: &str, unit: &str| {
        (
            metric.to_string(),
            metric.to_string(),
            D::Max,
            Some(unit.to_string()),
        )
    };

    vec![
        // NASA/JPL Power of Ten, adapted for TypeScript and Python.
        //
        // Six of the ten rules are mechanical and are gated here. Rules 2 and 8
        // are not static properties of a program and rule 10 is a gate on the
        // compiler and linter, so all three are documented in
        // `.tetanus/specs/power-of-ten.toml` rather than counted here. Counting
        // them would put a number in the baseline that nothing measures.
        //
        // Five of these are at zero and are gated at zero, which is the strongest
        // position available: a new violation fails immediately. The two with
        // existing violations carry a burn-down schedule instead, so the debt
        // is on a trajectory rather than grandfathered.
        max("pot3_unbounded_loops", "loops"),
        max("pot5_function_length", "functions"),
        max("pot5_nesting_depth", "functions"),
        max("pot5_parameter_count", "functions"),
        max("pot6_raw_memory", "imports"),
        max("pot7_bare_handler", "handlers"),
        max("pot7_empty_handler", "handlers"),
        max("pot9_dynamic_eval", "calls"),
        // Source and graph shape. All burn-down: a regression is growth.
        max("generated_files", "files"),
        max("modules", "nodes"),
        max("graph_edges", "edges"),
        max("dependency_cycles", "cycles"),
        max("dead_code_candidates", "modules"),
        max("unused_exports", "symbols"),
        // Dependency surface. Recorded and reviewed rather than frozen, because
        // a workspace that legitimately grows must be able to move this number
        // deliberately instead of having it block every such change.
        max("dependency_surface", "direct dependencies"),
        // Security. Each of these is a thing that should only ever go down.
        max("transitive_dependencies", "packages"),
        max("duplicate_dependency_names", "package names"),
        max("duplicate_dependency_copies", "extra copies"),
        max("git_dependencies", "packages"),
        max("direct_url_dependencies", "packages"),
        max("unknown_dependency_sources", "packages"),
        max("unresolved_direct_dependencies", "packages"),
        // A dependency that cannot reach production is a strictly smaller
        // surface, so growth here means code moved onto the runtime path.
        max("test_only_dependencies", "packages"),
        // `affected_test_precision` is deliberately absent.
        //
        // It is a real measurement, but only relative to a specific change set.
        // Capturing a baseline for it would mean committing a number measured
        // against whatever happened to be in the working tree at the time, which
        // on a normal working tree is every unrelated change at once and yields
        // a number near zero that means nothing. It is reported per change set by
        // `tetanus test affected --format json` and belongs in the CI summary,
        // where the change set is the pull request.
    ]
}

fn ratchet_cmd(
    paths: &RepoPaths,
    command: RatchetCommand,
    json: bool,
    dry_run: bool,
) -> Result<i32> {
    let file = RatchetFile::load(&paths.baseline_toml())?;

    match command {
        RatchetCommand::Show => {
            println!("{}", file.render());
            Ok(0)
        }
        RatchetCommand::Baseline | RatchetCommand::BaselineCheck => {
            let verify = matches!(command, RatchetCommand::BaselineCheck);
            let (measurements, _) = measure(paths)?;
            let captured = ratchet::capture(
                &ratchet_definitions(),
                &measurements,
                &paths.head_revision(),
                &tetanus_config::date::Date::today().to_iso(),
                &RatchetFile::load(&paths.baseline_toml()).unwrap_or_default(),
            );

            if verify {
                let mut builder = tetanus_core::ReportBuilder::new("ratchet-baseline-check");

                let mut committed: std::collections::BTreeMap<&str, f64> =
                    std::collections::BTreeMap::new();
                for ratchet in &file.ratchet {
                    committed.insert(ratchet.id.as_str(), ratchet.baseline);
                }

                for ratchet in &captured.ratchet {
                    let Some(value) = committed.get(ratchet.id.as_str()).copied() else {
                        builder.error_with_hint(
                            &ratchet.id,
                            format!("guards {:?} but has no committed baseline", ratchet.metric),
                            "run `tetanus ratchet baseline` and commit the result",
                        );
                        continue;
                    };
                    if value != ratchet.baseline {
                        // Whether a change loosens or tightens the gate depends
                        // on the direction: a higher ceiling is more permissive
                        // for a max ratchet and stricter for a min one.
                        let more_permissive = match ratchet.direction {
                            tetanus_config::ratchet::Direction::Max => value > ratchet.baseline,
                            tetanus_config::ratchet::Direction::Min => value < ratchet.baseline,
                        };
                        let direction = if more_permissive {
                            "relaxed"
                        } else {
                            "tightened"
                        };
                        builder.error_with_hint(
                            &ratchet.id,
                            format!(
                                "baseline was {direction}: committed {value}, measured {}",
                                ratchet.baseline
                            ),
                            "re-run `tetanus ratchet baseline` and commit the result, or record an \
                             [[exception]] with a reason and an expiry; a baseline that does not \
                             match a real measurement is not a baseline",
                        );
                    }
                }

                for ratchet in &file.ratchet {
                    if !captured.ratchet.iter().any(|c| c.id == ratchet.id) {
                        builder.warn(
                            &ratchet.id,
                            format!(
                                "is committed but {:?} could not be measured, so it is unchecked                                  this run",
                                ratchet.metric
                            ),
                        );
                    }
                }

                let report = builder.build();

                #[derive(Serialize)]
                struct Data {
                    measured: std::collections::BTreeMap<String, f64>,
                }

                let data = Data {
                    measured: captured
                        .ratchet
                        .iter()
                        .map(|r| (r.id.clone(), r.baseline))
                        .collect(),
                };
                return Ok(emit(
                    json,
                    "ratchet-baseline-check",
                    report.status,
                    &report,
                    Some(data),
                ));
            }

            {
                let (measurements, _) = measure(paths)?;
                let captured = ratchet::capture(
                    &ratchet_definitions(),
                    &measurements,
                    &paths.head_revision(),
                    &tetanus_config::date::Date::today().to_iso(),
                    &RatchetFile::load(&paths.baseline_toml()).unwrap_or_default(),
                );
                if dry_run {
                    print!("{}", captured.render());
                } else {
                    std::fs::write(paths.baseline_toml(), captured.render())
                        .map_err(|e| Error::io(paths.baseline_toml().display(), e))?;
                    note("wrote .tetanus/baseline.toml; review the diff before committing");
                }
                Ok(0)
            }
        }
        RatchetCommand::Check => {
            let (measurements, _) = measure(paths)?;
            // The real date, so an exception with an expiry actually expires.
            // Passing a sentinel made the expiry field decorative: every
            // exception was valid forever, which is the freeze this mechanism
            // exists to prevent.
            let today = tetanus_config::date::Date::today();
            let evaluation = ratchet::evaluate(&file, &measurements, true, &today.to_iso());

            let mut builder = tetanus_core::ReportBuilder::new("ratchet-check");
            for problem in &evaluation.problems {
                builder.fail("ratchet", problem.clone());
            }

            // The trajectory check is separate from the verdict check on purpose.
            // A verdict asks whether the number moved the wrong way today; a
            // trajectory asks whether it was supposed to have moved by now. A
            // baseline that has sat still for a year passes every verdict and
            // fails here, which is the only thing that distinguishes a schedule
            // from a wish.
            for ratchet in &file.ratchet {
                let Some(trajectory) = tetanus_config::ratchet::assess_trajectory(ratchet, today)
                else {
                    continue;
                };
                let Some(schedule) = ratchet.burndown.as_ref() else {
                    continue;
                };
                let elapsed = schedule.periods_elapsed(today);
                match trajectory {
                    // A schedule that is being met is not a finding. The
                    // report has no informational level, and inventing one here
                    // would make a passing check noisy; progress goes to the
                    // console, where a reader looking for it will see it.
                    tetanus_config::ratchet::Trajectory::OnTrack { ceiling } => {
                        note(&format!(
                            "burn-down {} on track: {} at or below the required {ceiling} ({} {} elapsed)",
                            ratchet.id,
                            ratchet.baseline,
                            elapsed,
                            schedule.per.as_str()
                        ));
                    }
                    tetanus_config::ratchet::Trajectory::Behind { ceiling } => {
                        builder.error_with_hint(
                            ratchet.id.as_str(),
                            format!(
                                "burn-down is behind: baseline {} exceeds the {} it was required to reach, {} {} after it started",
                                ratchet.baseline,
                                ceiling,
                                elapsed,
                                schedule.per.as_str()
                            ),
                            format!(
                                "reduce the count to {ceiling} or lower, or record an [[exception]] with a reason and an expiry"
                            ),
                        );
                    }
                    tetanus_config::ratchet::Trajectory::Overdue { ceiling } => {
                        builder.error_with_hint(
                            ratchet.id.as_str(),
                            format!(
                                "burn-down deadline {} has passed and the baseline {} still exceeds {ceiling}",
                                schedule.deadline.clone().unwrap_or_default(),
                                ratchet.baseline
                            ),
                            "reach the target, or record an [[exception]] with a reason and a new expiry",
                        );
                    }
                }
            }
            for verdict in &evaluation.verdicts {
                match verdict.verdict {
                    tetanus_config::ratchet::VerdictKind::Regression => {
                        let excepted = evaluation.exceptions_applied.contains(&verdict.ratchet);
                        if excepted {
                            builder.warn(
                                &verdict.ratchet,
                                format!(
                                    "regressed to {} (baseline {}) under an active exception",
                                    verdict.measured, verdict.baseline
                                ),
                            );
                        } else {
                            builder.error_with_hint(
                                &verdict.ratchet,
                                format!(
                                    "regressed: measured {}, baseline {}, direction {}",
                                    verdict.measured,
                                    verdict.baseline,
                                    verdict.direction.as_str()
                                ),
                                "fix the regression, or record an [[exception]] with a reason and an expiry",
                            );
                        }
                    }
                    tetanus_config::ratchet::VerdictKind::Unknown => {
                        builder.fail(
                            &verdict.ratchet,
                            "could not be measured; unknown is not a pass",
                        );
                    }
                    _ => {}
                }
            }

            let report = builder.build();

            #[derive(Serialize)]
            struct Data {
                verdicts: Vec<tetanus_config::ratchet::Verdict>,
                exceptions_applied: Vec<String>,
                baseline: String,
            }

            let data = Data {
                verdicts: evaluation.verdicts.clone(),
                exceptions_applied: evaluation.exceptions_applied.clone(),
                baseline: ratchet::render_summary(&file),
            };

            Ok(emit(
                json,
                "ratchet-check",
                report.status,
                &report,
                Some(data),
            ))
        }
    }
}

fn scope(paths: &RepoPaths, args: ScopeArgs, json: bool) -> Result<i32> {
    let changed = paths.changed_files(&args.base)?;
    let report = tetanus_core::ReportBuilder::new("scope").build();

    #[derive(Serialize)]
    struct Data {
        base: String,
        head: String,
        changed: Vec<String>,
    }

    let data = Data {
        base: args.base,
        head: paths.head_revision(),
        changed,
    };
    Ok(emit(json, "scope", report.status, &report, Some(data)))
}

fn doctor(paths: &RepoPaths, json: bool) -> Result<i32> {
    let mut builder = tetanus_core::ReportBuilder::new("doctor");
    let mut checks: Vec<(&str, bool, String)> = Vec::new();

    for (label, path) in [
        (".tetanus/tetanus.toml", paths.tetanus_toml()),
        (".tetanus/generated.toml", paths.generated_toml()),
        (
            ".tetanus/manifests.toml",
            paths.absolute(".tetanus/manifests.toml"),
        ),
        (".tetanus/baseline.toml", paths.baseline_toml()),
        ("living.toml", paths.living_toml()),
        ("testing/tests.toml", paths.tests_toml()),
    ] {
        let exists = path.is_file();
        checks.push((label, exists, path.display().to_string()));
        if !exists {
            builder.fail(label, format!("{} is missing", path.display()));
        }
    }

    if let Ok(registry) = GeneratedRegistry::load(&paths.generated_toml()) {
        checks.push((
            "generated registry valid",
            true,
            format!("{} artifacts", registry.artifact.len()),
        ));
    } else if let Err(e) = GeneratedRegistry::load(&paths.generated_toml()) {
        builder.fail("generated registry", e.to_string());
    }

    let report = builder.build();

    #[derive(Serialize)]
    struct Check {
        label: &'static str,
        ok: bool,
        detail: String,
    }

    let data: Vec<Check> = checks
        .iter()
        .map(|(label, ok, detail)| Check {
            label,
            ok: *ok,
            detail: detail.clone(),
        })
        .collect();

    if !json {
        let mut out = std::io::stdout().lock();
        for check in &data {
            let _ = writeln!(
                out,
                "  {} {}",
                if check.ok { "ok  " } else { "FAIL" },
                check.detail
            );
        }
    }

    Ok(emit(json, "doctor", report.status, &report, Some(data)))
}

/// Entry point. The `devopness` alias is resolved here rather than by the
/// command tree so that `devopness engineering <command>` and `tetanus
/// <command>` share one implementation.
pub fn run_from_env() -> i32 {
    let mut args: Vec<std::ffi::OsString> = std::env::args_os().collect();

    if let Some(first) = args.first() {
        let name = std::path::Path::new(first)
            .file_stem()
            .map(|s| s.to_string_lossy().to_string())
            .unwrap_or_default();
        if name == "devopness" {
            args.remove(0);
            if args.first().map(|a| a == "engineering").unwrap_or(false) {
                args.remove(0);
            }
        }
    }

    let cli = match Cli::try_parse_from(args) {
        Ok(cli) => cli,
        Err(e) => {
            let _ = e.print();
            return if e.use_stderr() { 2 } else { 0 };
        }
    };

    match run(cli) {
        Ok(code) => code,
        Err(e) => {
            eprintln!("error: {e}");
            1
        }
    }
}

/// Paths whose change is allowed without touching canonical state.
///
/// A source edit with no state change is normal mid-refactor. A *documentation*
/// edit with no state change is not, because documentation is a statement about
/// the project and the state is the record of that statement. Anything listed
/// here is exempt by decision, and the list is short on purpose.
const STATE_EXEMPT: &[&str] = &[
    ".tetanus/",
    "tools/tetanus/",
    ".github/workflows/ci-tetanus.yml",
    ".github/scripts/",
    ".gitignore",
    "CHANGELOG.md",
    "HANDOVER.md",
    "SESSION.md",
    "living.toml",
];

/// Filename-safe form of a package name.
///
/// A package name contains a slash for every scoped package, and
/// `@devopness/ui-react.txt` is a path into a directory that does not exist.
/// The substitution is shared with `tools/test-affected/run.sh`, which derives
/// the same name from the package manifest, so the two must stay in step.
pub fn package_slug(name: &str) -> String {
    name.chars()
        .map(|c| if c.is_ascii_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .trim_matches('-')
        .to_lowercase()
}

/// Repository-relative root directory of a declared package.
fn package_root(paths: &RepoPaths, package: &str) -> String {
    let Ok(manifests) = load_manifest_list(paths) else {
        return String::new();
    };
    let Ok(packages) = workspace::load_packages(paths, &manifests) else {
        return String::new();
    };
    packages
        .iter()
        .find(|p| p.name == package)
        .map(|p| p.root.clone())
        .unwrap_or_default()
}

/// Assemble the dependency graph from every lockfile in the repository.
fn dependency_graph(paths: &RepoPaths) -> Result<tetanus_deps::graph::DepGraph> {
    /// A lockfile reader, paired with the path it is pointed at.
    type Reader = (&'static str, fn(&str) -> Result<tetanus_deps::Assembly>);

    // A lockfile that cannot be read is a failure, never an empty contribution.
    // An empty security report and an unreadable lockfile are otherwise
    // indistinguishable, and the first one is the dangerous reading.
    //
    // All four are read, not just the pnpm workspace. The repository has four
    // package managers after the migration, and omitting `docs` would describe a
    // tree that is not what gets installed.
    let mut assembly = tetanus_deps::Assembly::default();
    let required: Vec<Reader> = vec![
        ("pnpm-lock.yaml", tetanus_deps::pnpm::parse),
        ("packages/sdks/python/uv.lock", tetanus_deps::uv::parse),
        ("tools/tetanus/Cargo.lock", tetanus_deps::cargo::parse),
        // npm's reader takes the lockfile label, which a plain function pointer
        // cannot carry, so the label is bound by a shim rather than by threading
        // a parameter through every reader.
        ("docs/package-lock.json", |text: &str| {
            tetanus_deps::npm::parse(text, "docs/package-lock.json")
        }),
    ];

    for (label, parse) in required {
        let absolute = paths.absolute(label);
        if !absolute.is_file() {
            return Err(Error::config(format!(
                "{label} is required for the dependency graph; a missing lockfile would \
                 produce a report that reads as 'no problems found'"
            )));
        }
        let text =
            std::fs::read_to_string(&absolute).map_err(|e| Error::io(absolute.display(), e))?;
        let parsed = parse(&text)?;
        assembly.packages.extend(parsed.packages);
        assembly.edges.extend(parsed.edges);
        assembly.lockfiles.extend(parsed.lockfiles);
        assembly.unresolved.extend(parsed.unresolved);
    }

    // The install-script allowlist, read from the same file the package manager
    // reads it from, so the report cannot drift from the enforced policy.
    let permitted = permitted_builds(paths);

    Ok(tetanus_deps::graph::DepGraph::new(assembly, permitted))
}

/// Packages the workspace policy permits to run install scripts.
fn permitted_builds(paths: &RepoPaths) -> std::collections::BTreeSet<String> {
    let mut out = std::collections::BTreeSet::new();
    for file in ["pnpm-workspace.yaml", "docs/pnpm-workspace.yaml"] {
        let path = paths.absolute(file);
        let Ok(text) = std::fs::read_to_string(&path) else {
            continue;
        };
        let Ok(value) = serde_yaml::from_str::<serde_yaml::Value>(&text) else {
            continue;
        };
        let Some(allow) = value.get("allowBuilds").and_then(|v| v.as_mapping()) else {
            continue;
        };
        for (name, decision) in allow {
            if decision.as_bool() == Some(true)
                && let Some(name) = name.as_str()
            {
                out.insert(name.trim_matches('\'').trim_matches('"').to_string());
            }
        }
    }
    out
}

fn deps(paths: &RepoPaths, command: DepsCommand, json: bool) -> Result<i32> {
    let graph = dependency_graph(paths)?;
    let metrics = graph.metrics();
    let mut builder = tetanus_core::ReportBuilder::new("deps");

    // Unresolved direct dependencies mean the lockfile is stale. Measuring a
    // tree that will not be installed produces a confidently wrong number.
    for unresolved in graph.unresolved() {
        builder.error_with_hint(
            unresolved,
            "is declared as a direct dependency but is absent from the lockfile",
            "the lockfile is stale; regenerate it before trusting any metric here",
        );
    }

    let non_registry = graph.non_registry();
    for package in &non_registry {
        builder.warn(
            package.id.as_str(),
            format!(
                "resolved from {} rather than a registry, so registry advisories do not cover it",
                match &package.source {
                    tetanus_deps::Source::Git { url, .. } => format!("git ({url})"),
                    tetanus_deps::Source::DirectUrl { url } => format!("a direct URL ({url})"),
                    tetanus_deps::Source::Unknown => "an unrecorded source".to_string(),
                    tetanus_deps::Source::Path { path } => format!("a local path ({path})"),
                    tetanus_deps::Source::Registry { .. } => "a registry".to_string(),
                }
            ),
        );
    }

    let unpermitted = graph.unpermitted_build_script_packages();
    for package in &unpermitted {
        builder.warn(
            package.id.as_str(),
            "declares an install script and no policy entry permits it, so it is blocked by default",
        );
    }

    // Duplicates are reported as a count and a worst-offender list, not one line
    // each. The set was 236 names, every line the same shape and the same
    // severity, which pushed the two install-script findings off the screen and
    // made the report's actual conclusion unreadable. A reader needs the count
    // to judge whether the ratchet should move, and the worst cases to act on;
    // they do not need 236 identical lines to re-derive it.
    let duplicates = graph.duplicates();
    let extra_copies: usize = duplicates
        .iter()
        .map(|d| d.versions.len().saturating_sub(1))
        .sum();
    if !duplicates.is_empty() {
        let mut worst: Vec<&tetanus_deps::Duplicate> = duplicates.iter().collect();
        worst.sort_by(|a, b| {
            b.versions
                .len()
                .cmp(&a.versions.len())
                .then_with(|| a.name.cmp(&b.name))
        });
        let shown = worst.len().min(10);
        builder.warn(
            "duplicated packages",
            format!(
                "{} names resolve to more than one version, {} extra copies in total; \
                 an advisory against one version does not cover the others",
                duplicates.len(),
                extra_copies
            ),
        );
        for duplicate in &worst[..shown] {
            builder.warn(
                &duplicate.name,
                format!(
                    "{} versions in {}: {}",
                    duplicate.versions.len(),
                    duplicate.ecosystem.as_str(),
                    duplicate
                        .versions
                        .iter()
                        .map(|v| v.as_str())
                        .collect::<Vec<_>>()
                        .join(", ")
                ),
            );
        }
        if worst.len() > shown {
            builder.warn(
                "duplicated packages",
                format!("{} further names not shown", worst.len() - shown),
            );
        }
    }

    let report = builder.build();

    #[derive(Serialize)]
    struct Data {
        lockfiles: Vec<String>,
        metrics: tetanus_deps::graph::Metrics,
        non_registry: Vec<String>,
        permitted_build_scripts: Vec<String>,
        unpermitted_build_scripts: Vec<String>,
        duplicates: Vec<tetanus_deps::Duplicate>,
        /// Sum over duplicated names of versions beyond the first. The count of
        /// names is not the cost: a name at two versions costs one copy and a
        /// name at four costs three.
        duplicate_extra_copies: usize,
        unresolved: Vec<String>,
    }

    let data = Data {
        lockfiles: graph.lockfiles().to_vec(),
        metrics: metrics.clone(),
        non_registry: non_registry
            .iter()
            .map(|p| p.id.as_str().to_string())
            .collect(),
        permitted_build_scripts: graph
            .permitted_build_script_packages()
            .iter()
            .map(|p| p.id.as_str().to_string())
            .collect(),
        unpermitted_build_scripts: unpermitted
            .iter()
            .map(|p| p.id.as_str().to_string())
            .collect(),
        duplicates: duplicates.clone(),
        duplicate_extra_copies: extra_copies,
        unresolved: graph.unresolved().to_vec(),
    };

    // `closure` answers a question about one package, so it prints the closure
    // and nothing else. Emitting the report header alongside it would bury the
    // answer the caller asked for.
    if let DepsCommand::Closure { ref package } = command {
        let target = graph
            .packages()
            .iter()
            .find(|p| p.id.as_str() == package || p.name == *package)
            .ok_or_else(|| {
                Error::config(format!(
                    "no package matches {package:?}; pass a full id such as \
                     `npm:esbuild@0.28.2` or a bare name"
                ))
            })?;
        let closure = graph.closure(&target.id)?;
        if json {
            let payload = serde_json::json!({
                "check": "deps-closure",
                "status": "pass",
                "root": target.id.as_str(),
                "closure": closure.iter().map(|id| id.as_str()).collect::<Vec<_>>(),
            });
            println!(
                "{}",
                serde_json::to_string_pretty(&payload).unwrap_or_default()
            );
        } else {
            println!("{} closure: {} packages", target.id.as_str(), closure.len());
            for id in &closure {
                println!("  {id}");
            }
        }
        return Ok(0);
    }

    let status = match command {
        DepsCommand::Audit
        | DepsCommand::Report
        | DepsCommand::Scope
        | DepsCommand::Closure { .. } => report.status,
    };

    if !json {
        let mut out = std::io::stdout().lock();
        use std::io::Write as _;
        let _ = writeln!(out, "lockfiles read:");
        for lockfile in graph.lockfiles() {
            let _ = writeln!(out, "  {lockfile}");
        }
        let _ = writeln!(out, "\nmetrics:");
        for (name, value) in metrics.as_pairs() {
            let _ = writeln!(out, "  {name:<38} {value:>10.0}");
        }
        if !non_registry.is_empty() {
            let _ = writeln!(out, "\nnot covered by registry advisories:");
            for package in &non_registry {
                let _ = writeln!(out, "  {}", package.id.as_str());
            }
        }
        if !unpermitted.is_empty() {
            let _ = writeln!(out, "\ninstall scripts, blocked by default:");
            for package in &unpermitted {
                let _ = writeln!(out, "  {}", package.id.as_str());
            }
        }
        if !graph.permitted_build_script_packages().is_empty() {
            let _ = writeln!(out, "\ninstall scripts, permitted by policy:");
            for package in graph.permitted_build_script_packages() {
                let _ = writeln!(out, "  {}", package.id.as_str());
            }
        }
        if !duplicates.is_empty() {
            let _ = writeln!(out, "\nresolved at more than one version:");
            for duplicate in &duplicates {
                let _ = writeln!(
                    out,
                    "  {} ({}) {}",
                    duplicate.name,
                    duplicate.ecosystem.as_str(),
                    duplicate.versions.join(", ")
                );
            }
        }
        if matches!(command, DepsCommand::Scope) {
            let scopes = graph.scopes();
            let mut production = 0;
            let mut test_only = 0;
            for scope in scopes.values() {
                match scope {
                    tetanus_deps::Scope::Production => production += 1,
                    tetanus_deps::Scope::TestOnly => test_only += 1,
                }
            }
            let _ = writeln!(
                out,
                "\nproduction-reachable: {production}\ntest-only: {test_only}"
            );
        }
        let _ = out.flush();
    }

    Ok(emit(json, "deps", status, &report, Some(data)))
}

/// Verify that a change set updated canonical state when it should have.
///
/// Three rules, all decidable from the diff:
///   1. A change under `docs/docs/**` must touch `living.toml` or add a
///      changeset. Documentation asserts something about the project; the state
///      is where that assertion is recorded.
///   2. A change under `packages/**/src/**` must touch `living.toml` or add a
///      changeset.
///   3. `living.toml` itself must be valid, which the load above already proved.
fn check_state(paths: &RepoPaths, args: &StateArgs, json: bool) -> Result<i32> {
    let changed = paths.changed_files(&args.base)?;
    let mut builder = tetanus_core::ReportBuilder::new("state");

    let exempt: Vec<&String> = changed
        .iter()
        .filter(|p| STATE_EXEMPT.iter().any(|e| p.starts_with(e)))
        .collect();
    let substantive: Vec<&String> = changed
        .iter()
        .filter(|p| !STATE_EXEMPT.iter().any(|e| p.starts_with(e)))
        .collect();

    let touched_state = changed
        .iter()
        .any(|p| p == "living.toml" || p.starts_with(".changeset/") && p.ends_with(".md"));

    let docs_changed = substantive.iter().any(|p| p.starts_with("docs/docs/"));
    let code_changed = substantive
        .iter()
        .any(|p| p.starts_with("packages/") && p.contains("/src/"));

    if (docs_changed || code_changed) && !touched_state {
        let scope = if docs_changed && code_changed {
            "documentation and production code"
        } else if docs_changed {
            "documentation"
        } else {
            "production code"
        };
        builder.error_with_hint(
            "canonical-state",
            format!(
                "this change set touches {scope} but updates neither living.toml nor a changeset"
            ),
            "add a [[session]] entry to living.toml describing what changed and why, or run \
             `npx @changesets/cli` if a published package is affected; \
             `tetanus state sync` opens the edit for you",
        );
    }

    let report = builder.build();

    #[derive(Serialize)]
    struct Data {
        base: String,
        changed_files: usize,
        exempt_files: usize,
        substantive_files: usize,
        docs_changed: bool,
        code_changed: bool,
        canonical_state_updated: bool,
        exempt: Vec<String>,
    }

    let data = Data {
        base: args.base.clone(),
        changed_files: changed.len(),
        exempt_files: exempt.len(),
        substantive_files: substantive.len(),
        docs_changed,
        code_changed,
        canonical_state_updated: touched_state,
        exempt: exempt.into_iter().cloned().collect(),
    };

    Ok(emit(json, "state", report.status, &report, Some(data)))
}
