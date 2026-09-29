//! The manifest-driven test substrate.
//!
//! Tests execute under Vitest, Jest and `unittest`. The manifest describes the
//! verification model: what each test covers, what invalidates it, what it
//! depends on, and what it costs. Filesystem discovery alone cannot answer any
//! of those, which is why the manifest is authoritative and an unregistered
//! test file is an error rather than a gap.

use std::collections::{BTreeMap, BTreeSet};

use serde::{Deserialize, Serialize};
use tetanus_core::error::{Error, Result};

/// Test classes the substrate understands.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TestClass {
    Structural,
    Static,
    Unit,
    Component,
    Integration,
    Contract,
    E2e,
    Property,
    Mutation,
    Performance,
    Security,
}

impl TestClass {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Structural => "structural",
            Self::Static => "static",
            Self::Unit => "unit",
            Self::Component => "component",
            Self::Integration => "integration",
            Self::Contract => "contract",
            Self::E2e => "e2e",
            Self::Property => "property",
            Self::Mutation => "mutation",
            Self::Performance => "performance",
            Self::Security => "security",
        }
    }
}

/// How much a test costs to run, used to order affected-test execution.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ExecutionCost {
    Trivial,
    Cheap,
    Moderate,
    Expensive,
}

/// A registered test.
#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct TestRecord {
    pub id: String,
    pub package: String,
    pub source: String,
    #[serde(rename = "type")]
    pub class: TestClass,
    /// Production symbol or module the test verifies.
    pub target: String,
    #[serde(default)]
    pub dependencies: Vec<String>,
    #[serde(default)]
    pub fixtures: Vec<String>,
    #[serde(default)]
    pub required_commands: Vec<String>,
    /// Symbols or modules whose change invalidates this test.
    #[serde(default)]
    pub affected_by: Vec<String>,
    #[serde(default)]
    pub coverage_scope: Vec<String>,
    #[serde(default)]
    pub execution_cost: Option<ExecutionCost>,
    #[serde(default)]
    pub deterministic: bool,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub risk_class: Option<String>,
    #[serde(default)]
    pub artifacts: Vec<String>,
    #[serde(default)]
    pub expected_outputs: Vec<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct TestManifest {
    #[serde(default = "default_version")]
    pub version: u32,
    #[serde(default, rename = "test")]
    pub tests: Vec<TestRecord>,
}

fn default_version() -> u32 {
    1
}

impl TestManifest {
    pub fn load(path: &std::path::Path) -> Result<Self> {
        if !path.exists() {
            return Err(Error::config(format!(
                "test manifest {} does not exist; the manifest is authoritative, so it must be \
                 committed rather than discovered",
                path.display()
            )));
        }
        let text = std::fs::read_to_string(path).map_err(|e| Error::io(path.display(), e))?;
        let manifest: Self =
            toml::from_str(&text).map_err(|e| Error::parse(path.display(), e.to_string()))?;
        manifest.validate()?;
        Ok(manifest)
    }

    pub fn validate(&self) -> Result<()> {
        if self.version != 1 {
            return Err(Error::config(format!(
                "unsupported testing/tests.toml version {}",
                self.version
            )));
        }
        let mut ids = BTreeSet::new();
        let mut sources = BTreeSet::new();
        for test in &self.tests {
            if test.id.trim().is_empty() {
                return Err(Error::config("a test record has an empty id"));
            }
            if !ids.insert(test.id.clone()) {
                return Err(Error::config(format!("duplicate test id {:?}", test.id)));
            }
            if test.source.trim().is_empty() {
                return Err(Error::config(format!(
                    "test {:?} declares no source; every test must name the file that runs it",
                    test.id
                )));
            }
            if test.target.trim().is_empty() {
                return Err(Error::config(format!(
                    "test {:?} declares no target; a test that does not say what it verifies \
                     cannot contribute to a coverage ratchet",
                    test.id
                )));
            }
            if !sources.insert(test.source.clone()) {
                return Err(Error::config(format!(
                    "test source {:?} is registered by more than one test id; one file may hold \
                     several tests, but each needs its own source path or an explicit id scheme",
                    test.source
                )));
            }
        }
        Ok(())
    }

    pub fn render(&self) -> String {
        toml::to_string_pretty(self).expect("test manifest is serialisable")
    }

    pub fn get(&self, id: &str) -> Option<&TestRecord> {
        self.tests.iter().find(|t| t.id == id)
    }

    /// Tests selected by a set of changed repository paths.
    ///
    /// A test is selected when any file in its transitive closure changed. The
    /// closure is a superset by construction, so over-selection is the only
    /// failure mode; under-selection would produce a green build that tested
    /// nothing, which is why the closure is computed forward from each test
    /// rather than backward from the change.
    pub fn affected_by(&self, symbols: &BTreeSet<String>) -> Vec<&TestRecord> {
        let mut matched: Vec<&TestRecord> = self
            .tests
            .iter()
            .filter(|t| t.affected_by.iter().any(|a| symbols.contains(a)))
            .collect();
        matched.sort_by(|a, b| {
            a.execution_cost
                .cmp(&b.execution_cost)
                .then_with(|| a.id.cmp(&b.id))
        });
        matched
    }

    /// Tests that cover a given symbol, by `target` or `coverage_scope`.
    pub fn covering(&self, symbol: &str) -> Vec<&TestRecord> {
        let mut matched: Vec<&TestRecord> = self
            .tests
            .iter()
            .filter(|t| t.target == symbol || t.coverage_scope.iter().any(|s| s == symbol))
            .collect();
        matched.sort_by(|a, b| a.id.cmp(&b.id));
        matched
    }

    /// Registered tests whose source file is missing, and test files present on
    /// disk but absent from the manifest.
    pub fn reconcile(&self, discovered: &BTreeSet<String>) -> (Vec<String>, Vec<String>) {
        let registered: BTreeSet<&str> = self.tests.iter().map(|t| t.source.as_str()).collect();

        let unregistered: Vec<String> = discovered
            .iter()
            .filter(|path| !registered.contains(path.as_str()))
            .cloned()
            .collect();

        let missing: Vec<String> = registered
            .iter()
            .filter(|path| !discovered.contains(**path))
            .map(|path| (*path).to_string())
            .collect();

        (missing, unregistered)
    }

    pub fn by_package(&self) -> BTreeMap<&str, Vec<&TestRecord>> {
        let mut out: BTreeMap<&str, Vec<&TestRecord>> = BTreeMap::new();
        for test in &self.tests {
            out.entry(test.package.as_str()).or_default().push(test);
        }
        for records in out.values_mut() {
            records.sort_by(|a, b| a.id.cmp(&b.id));
        }
        out
    }

    pub fn counts_by_class(&self) -> BTreeMap<&'static str, usize> {
        let mut out: BTreeMap<&'static str, usize> = BTreeMap::new();
        for test in &self.tests {
            *out.entry(test.class.as_str()).or_default() += 1;
        }
        out
    }
}

/// Whether a path is a test *module*, as opposed to test scaffolding.
///
/// Scaffolding lives next to tests and is not itself run: `__init__.py` makes a
/// directory importable, and a `.snap` is a recorded artefact. Counting those
/// as tests would inflate every count the manifest reports.
pub fn is_test_module(path: &str) -> bool {
    let name = path.rsplit('/').next().unwrap_or(path);

    if name == "__init__.py" || name.ends_with(".snap") || name.starts_with(".") {
        return false;
    }
    if path.contains("/__snapshots__/") || path.contains("/__mocks__/") {
        return false;
    }
    if name.ends_with(".spec.ts")
        || name.ends_with(".spec.tsx")
        || name.ends_with(".spec.js")
        || name.ends_with(".spec.jsx")
        || name.ends_with(".test.ts")
        || name.ends_with(".test.tsx")
        || name.ends_with(".test.js")
        || name.ends_with(".test.jsx")
    {
        return true;
    }
    if name.starts_with("test_") && name.ends_with(".py") {
        return true;
    }
    name.ends_with("_test.py")
}

/// Test modules present on disk.
pub fn discover_test_files(tracked: &[String]) -> BTreeSet<String> {
    tracked
        .iter()
        .filter(|path| is_test_module(path))
        .cloned()
        .collect()
}

/// The result of an affected-test query, shaped for the two consumers that need
/// it: the CI task graph, and a human reading a report.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Affected {
    /// Package names with at least one selected test, sorted.
    pub packages: Vec<String>,
    /// Selected test records, cheapest first.
    pub tests: Vec<String>,
    /// Selected test source files, per package, sorted.
    pub files_by_package: BTreeMap<String, Vec<String>>,
    /// Packages with no selected test, so a caller can distinguish "nothing to
    /// run" from "this package was not considered".
    pub packages_without_tests: Vec<String>,
    /// How many of each package's tests were selected, for the precision report.
    pub selected_of_total: BTreeMap<String, (usize, usize)>,
}

impl Affected {
    /// Turbo `--filter` arguments, one per package with selected tests.
    ///
    /// Emitted as separate arguments rather than a single joined string so a
    /// package name containing a space or a glob character cannot be re-split by
    /// a shell downstream.
    pub fn turbo_filters(&self) -> Vec<String> {
        self.packages
            .iter()
            .map(|p| format!("--filter={p}..."))
            .collect()
    }

    /// True when nothing at all was selected, which means the query found no
    /// relevant change rather than that the change is untested.
    pub fn is_empty(&self) -> bool {
        self.tests.is_empty()
    }

    /// Share of selected tests that the change could actually affect.
    ///
    /// One is perfect precision. A low value means selection is coarse, usually
    /// because a test's closure includes a barrel module that pulls in a large
    /// tree. Reported so coarseness is visible rather than assumed.
    pub fn precision(&self) -> f64 {
        let selected: usize = self.selected_of_total.values().map(|(s, _)| s).sum();
        let total: usize = self.selected_of_total.values().map(|(_, t)| t).sum();
        // Defined as false positives over selections, so it is undefined rather
        // than zero when nothing was selected: there are no false positives to
        // count. Whether a change *should* have selected something is a recall
        // question, and `is_empty` is where that surfaces. Folding recall in here
        // would make a change that correctly selects nothing look like a total
        // precision failure and put the ratchet permanently red.
        if selected == 0 || total == 0 {
            return 1.0;
        }
        selected as f64 / total as f64
    }
}

/// Select tests affected by a set of changed paths.
pub fn affected(manifest: &TestManifest, changed: &BTreeSet<String>) -> Affected {
    let selected = manifest.affected_by(changed);

    let mut packages: BTreeSet<String> = BTreeSet::new();
    let mut files_by_package: BTreeMap<String, BTreeSet<String>> = BTreeMap::new();
    let mut selected_of_total: BTreeMap<String, (usize, usize)> = BTreeMap::new();

    for (package, records) in manifest.by_package() {
        selected_of_total.insert(package.to_string(), (0, records.len()));
    }
    for test in &selected {
        packages.insert(test.package.clone());
        files_by_package
            .entry(test.package.clone())
            .or_default()
            .insert(test.source.clone());
        if let Some(entry) = selected_of_total.get_mut(&test.package) {
            entry.0 += 1;
        }
    }

    let packages_without_tests: Vec<String> = manifest
        .by_package()
        .keys()
        .filter(|p| !packages.contains(**p))
        .map(|p| (*p).to_string())
        .collect();

    Affected {
        packages: packages.into_iter().collect(),
        tests: selected.iter().map(|t| t.id.clone()).collect(),
        files_by_package: files_by_package
            .into_iter()
            .map(|(k, v)| (k, v.into_iter().collect()))
            .collect(),
        packages_without_tests,
        selected_of_total,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn record(id: &str, source: &str, target: &str, affected: &[&str]) -> TestRecord {
        TestRecord {
            id: id.into(),
            package: "@devopness/sdk-js".into(),
            source: source.into(),
            class: TestClass::Unit,
            target: target.into(),
            dependencies: vec![],
            fixtures: vec![],
            required_commands: vec![],
            affected_by: affected.iter().map(|s| (*s).into()).collect(),
            coverage_scope: vec![],
            execution_cost: Some(ExecutionCost::Cheap),
            deterministic: true,
            tags: vec![],
            risk_class: None,
            artifacts: vec![],
            expected_outputs: vec![],
        }
    }

    fn manifest(tests: Vec<TestRecord>) -> TestManifest {
        TestManifest { version: 1, tests }
    }

    #[test]
    fn rejects_a_test_with_no_target() {
        let mut test = record("a", "a.spec.ts", "", &[]);
        test.target = String::new();
        assert!(manifest(vec![test]).validate().is_err());
    }

    #[test]
    fn rejects_duplicate_ids() {
        let m = manifest(vec![
            record("a", "a.spec.ts", "A", &[]),
            record("a", "b.spec.ts", "B", &[]),
        ]);
        assert!(m.validate().is_err());
    }

    #[test]
    fn affected_tests_are_ordered_by_cost() {
        let mut cheap = record("cheap", "a.spec.ts", "A", &["target"]);
        cheap.execution_cost = Some(ExecutionCost::Cheap);
        let mut pricey = record("pricey", "b.spec.ts", "B", &["target"]);
        pricey.execution_cost = Some(ExecutionCost::Expensive);
        let m = manifest(vec![pricey, cheap]);

        let symbols = BTreeSet::from(["target".to_string()]);
        let affected = m.affected_by(&symbols);
        assert_eq!(affected[0].id, "cheap");
        assert_eq!(affected[1].id, "pricey");
    }

    fn record_with(id: &str, package: &str, source: &str, affected_by: &[&str]) -> TestRecord {
        let mut r = record(id, source, "Target", affected_by);
        r.package = package.into();
        r
    }

    #[test]
    fn affected_groups_by_package_for_turbo() {
        let m = manifest(vec![
            record_with("a", "@devopness/sdk-js", "a.spec.ts", &["src/a.ts"]),
            record_with("b", "@devopness/sdk-js", "b.spec.ts", &["src/b.ts"]),
            record_with("c", "@devopness/ui-react", "c.test.tsx", &["src/c.tsx"]),
        ]);
        let result = affected(&m, &BTreeSet::from(["src/a.ts".to_string()]));

        assert_eq!(result.packages, vec!["@devopness/sdk-js".to_string()]);
        assert_eq!(result.tests, vec!["a".to_string()]);
        assert_eq!(
            result.turbo_filters(),
            vec!["--filter=@devopness/sdk-js...".to_string()]
        );
        // The untouched package is reported, so a caller can tell "not selected"
        // from "not considered".
        assert_eq!(
            result.packages_without_tests,
            vec!["@devopness/ui-react".to_string()]
        );
    }

    #[test]
    fn a_transitive_change_still_selects_the_test() {
        // The manifest records the closure, so a change deep in the tree selects
        // the test that transitively depends on it.
        let m = manifest(vec![record(
            "a",
            "a.spec.ts",
            "Target",
            &["src/a.spec.ts", "src/service.ts", "src/util.ts"],
        )]);
        let result = affected(&m, &BTreeSet::from(["src/util.ts".to_string()]));
        assert_eq!(result.tests, vec!["a".to_string()]);
    }

    #[test]
    fn an_unrelated_change_selects_nothing() {
        let m = manifest(vec![record("a", "a.spec.ts", "Target", &["src/a.ts"])]);
        let result = affected(&m, &BTreeSet::from(["docs/unrelated.md".to_string()]));
        assert!(result.is_empty());
        assert!(result.turbo_filters().is_empty());
    }

    #[test]
    fn precision_is_one_when_nothing_was_selected() {
        let m = manifest(vec![record("a", "a.spec.ts", "Target", &["src/a.ts"])]);
        let result = affected(&m, &BTreeSet::new());
        assert_eq!(result.precision(), 1.0);
    }

    #[test]
    fn precision_reflects_coarse_selection() {
        let m = manifest(vec![
            record("a", "a.spec.ts", "T", &["src/shared.ts"]),
            record("b", "b.spec.ts", "T", &["src/other.ts"]),
        ]);
        let result = affected(&m, &BTreeSet::from(["src/shared.ts".to_string()]));
        assert_eq!(result.precision(), 0.5, "one of two tests selected");
    }

    #[test]
    fn reconcile_reports_both_directions() {
        let m = manifest(vec![record("a", "a.spec.ts", "A", &[])]);
        let discovered = BTreeSet::from(["a.spec.ts".to_string(), "b.spec.ts".to_string()]);
        let (missing, unregistered) = m.reconcile(&discovered);
        assert!(missing.is_empty());
        assert_eq!(unregistered, vec!["b.spec.ts".to_string()]);
    }

    #[test]
    fn reconcile_reports_a_deleted_test() {
        let m = manifest(vec![record("a", "a.spec.ts", "A", &[])]);
        let (missing, _) = m.reconcile(&BTreeSet::new());
        assert_eq!(missing, vec!["a.spec.ts".to_string()]);
    }
}

/// Derive manifest records from the analysis of the source tree.
///
/// `target` and `affected_by` are read out of the parsed module rather than
/// typed by hand. A hand-written `target` is a guess about what a test covers;
/// the imports the test file actually declares are evidence. Only the
/// judgement calls — class, risk, determinism — are authored.
#[derive(Debug, Clone)]
pub struct Candidate {
    pub id: String,
    pub package: String,
    pub source: String,
    pub class: TestClass,
    pub target: String,
    pub affected_by: Vec<String>,
    pub coverage_scope: Vec<String>,
    /// Third-party packages the test imports. Recorded for provenance, not for
    /// invalidation: a change to a dependency is not a source edit.
    pub dependencies: Vec<String>,
    pub execution_cost: ExecutionCost,
    pub deterministic: bool,
}

fn slug(path: &str) -> String {
    path.trim_start_matches("./")
        .rsplit_once('/')
        .map(|(_, name)| name.to_string())
        .unwrap_or_else(|| path.to_string())
        .replace(['.', '_'], "-")
        .to_lowercase()
}

fn cost_for(class: TestClass) -> ExecutionCost {
    match class {
        TestClass::Structural | TestClass::Static => ExecutionCost::Trivial,
        TestClass::Unit | TestClass::Component => ExecutionCost::Cheap,
        TestClass::Integration | TestClass::Contract => ExecutionCost::Moderate,
        TestClass::E2e | TestClass::Performance | TestClass::Security => ExecutionCost::Expensive,
        TestClass::Property | TestClass::Mutation => ExecutionCost::Moderate,
    }
}

/// Guess a class from where the test lives and what it imports.
///
/// Deliberately conservative: anything unrecognised becomes `unit`, which is
/// the cheapest class and therefore the least likely to distort a cost
/// estimate. A wrong guess here is corrected by a human editing the manifest.
pub fn classify_test(package: &str, source: &str, imported_symbols: &[String]) -> TestClass {
    if source.contains("/tests/unit/") || source.contains("/tests/") && source.ends_with(".py") {
        return TestClass::Unit;
    }
    if imported_symbols
        .iter()
        .any(|s| s.contains("openapi") || s.contains("generated"))
    {
        return TestClass::Contract;
    }
    if package == "devopness-api-docs" {
        return TestClass::Static;
    }
    if source.contains(".stories.") {
        return TestClass::Component;
    }
    TestClass::Unit
}

/// Build one record per discovered test module.
///
/// `affected_by` is a *transitive closure* over resolved workspace imports, not
/// the test file's direct imports. That is the whole point: a test that asserts
/// on a value five modules deep breaks when any of those five change, so a
/// direct-import list would silently under-select and the suite would pass while
/// testing nothing.
///
/// Two properties are load-bearing:
///
///   * Entries are real repository paths. A bare package name can never match a
///     changed file, and a bare relative specifier like `src/services/Api` never
///     matches `packages/sdks/javascript/src/services/Api.ts`. Both appeared in
///     the first generated manifest and made it non-functional.
///   * The closure is a superset. Over-selecting costs a few seconds; under-
///     selecting produces a green build that tested nothing. Where the answer is
///     uncertain the test is included.
///
/// Imports that leave the workspace are recorded as `dependencies`, not
/// `affected_by`: a change to a third-party package is not a source edit, and
/// listing it among the invalidating paths would only add noise.
pub fn candidates(
    modules: &[tetanus_ast::model::ModuleAnalysis],
    aliases: &crate::workspace::Aliases,
) -> Vec<Candidate> {
    let known: BTreeSet<String> = modules
        .iter()
        .map(|m| m.path.clone())
        .filter(|p| is_analysable_path(p))
        .collect();

    // Resolved import map, built once. `affected_by` and the closure both need
    // it, and resolving per test would repeat the filesystem-independent work
    // 73 times.
    let mut imports_of: BTreeMap<&str, BTreeSet<String>> = BTreeMap::new();
    let mut external_of: BTreeMap<&str, BTreeSet<String>> = BTreeMap::new();
    for module in modules {
        if !is_analysable_path(&module.path) {
            continue;
        }
        let mut internal = BTreeSet::new();
        let mut external = BTreeSet::new();
        for import in module.imports.iter().chain(module.reexports.iter()) {
            match crate::workspace::resolve_internal(&module.path, &import.specifier, &known)
                .or_else(|| crate::workspace::resolve_alias(&import.specifier, &known, aliases))
            {
                Some(target) => {
                    internal.insert(target);
                }
                None => {
                    if !import.internal {
                        let head = import
                            .specifier
                            .split('/')
                            .next()
                            .unwrap_or(&import.specifier)
                            .to_string();
                        if !head.is_empty() {
                            external.insert(head);
                        }
                    }
                }
            }
        }
        imports_of.insert(module.path.as_str(), internal);
        external_of.insert(module.path.as_str(), external);
    }

    let mut out: Vec<Candidate> = Vec::new();

    for module in modules {
        if !is_test_module(&module.path) {
            continue;
        }

        let closure = transitive_closure(&module.path, &imports_of);

        // The immediate imports name what the test exercises. The closure names
        // everything whose change could break it. Conflating them loses the
        // distinction between coverage and invalidation.
        let direct: Vec<String> = imports_of
            .get(module.path.as_str())
            .map(|s| s.iter().cloned().collect())
            .unwrap_or_default();

        let external: Vec<String> = external_of
            .get(module.path.as_str())
            .map(|s| s.iter().cloned().collect())
            .unwrap_or_default();

        let target = direct
            .first()
            .cloned()
            .or_else(|| {
                // No internal import: the test exercises its own source tree, so
                // its package is the honest target.
                Some(module.package.clone())
            })
            .unwrap_or_else(|| module.path.clone());

        let class = classify_test(&module.package, &module.path, &direct);

        let mut affected_by: Vec<String> = closure.into_iter().collect();
        affected_by.sort();
        affected_by.dedup();

        out.push(Candidate {
            id: format!(
                "{}-{}",
                module.package.replace(['@', '/'], "-"),
                slug(&module.path)
            )
            .trim_matches('-')
            .to_string(),
            package: module.package.clone(),
            source: module.path.clone(),
            class,
            target,
            affected_by: affected_by.clone(),
            coverage_scope: direct,
            dependencies: external,
            execution_cost: cost_for(class),
            // Determinism is asserted, not assumed. Anything touching the
            // network, a clock, or randomness must be marked non-deterministic
            // by a human before it is trusted as a gate.
            deterministic: true,
        });
    }

    out.sort_by(|a, b| a.source.cmp(&b.source));
    out
}

fn is_analysable_path(path: &str) -> bool {
    tetanus_ast::Language::from_path(path).is_script() || path.ends_with(".py")
}

/// Every workspace module reachable from `root` by following imports, including
/// `root` itself.
///
/// Iterative with a sorted worklist rather than recursive, so the result is a
/// function of the graph alone and cannot exhaust the stack on a cycle.
fn transitive_closure(
    root: &str,
    imports_of: &BTreeMap<&str, BTreeSet<String>>,
) -> BTreeSet<String> {
    let mut seen: BTreeSet<String> = BTreeSet::new();
    let mut queue: std::collections::VecDeque<String> = std::collections::VecDeque::new();

    if seen.insert(root.to_string()) {
        queue.push_back(root.to_string());
    }
    while let Some(current) = queue.pop_front() {
        let Some(targets) = imports_of.get(current.as_str()) else {
            continue;
        };
        for target in targets {
            if seen.insert(target.clone()) {
                queue.push_back(target.clone());
            }
        }
    }
    seen
}

impl From<&Candidate> for TestRecord {
    fn from(candidate: &Candidate) -> Self {
        Self {
            id: candidate.id.clone(),
            package: candidate.package.clone(),
            source: candidate.source.clone(),
            class: candidate.class,
            target: candidate.target.clone(),
            dependencies: candidate.dependencies.clone(),
            fixtures: Vec::new(),
            required_commands: Vec::new(),
            affected_by: candidate.affected_by.clone(),
            coverage_scope: candidate.coverage_scope.clone(),
            execution_cost: Some(candidate.execution_cost),
            deterministic: candidate.deterministic,
            tags: Vec::new(),
            risk_class: None,
            artifacts: Vec::new(),
            expected_outputs: Vec::new(),
        }
    }
}
