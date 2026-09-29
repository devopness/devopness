//! Python front end built on `rustpython-parser`.
//!
//! The rules Tetanus applies to Python are adaptations of the same principles
//! used for TypeScript, not a transliteration of the C originals: bounded
//! control flow, explicit error paths, no silent swallowing, no global mutable
//! state. What that means mechanically is decidable from the AST: no bare
//! `except`, no empty `except` body, no `eval`/`exec`, every `global`/
//! `nonlocal` rebinding accounted for.
//!
//! The 0.4 visitor consumes nodes, so the walk is driven by handing each
//! statement body to the visitor rather than by recursion written here. That
//! keeps one recursion strategy instead of two.

use std::collections::BTreeSet;

use rustpython_ast::Visitor;
use rustpython_ast::{
    Alias, Constant, Expr, ExprCall, Stmt, StmtAnnAssign, StmtAssign, StmtClassDef,
    StmtFunctionDef, StmtGlobal, StmtImport, StmtImportFrom, StmtNonlocal, StmtTry,
};
use rustpython_ast::{ExceptHandler, ExceptHandlerExceptHandler};

use crate::line_index::LineIndex;
use crate::model::{CallRef, ImportForm, ImportRef, ModuleAnalysis, Symbol, SymbolKind};

/// Bump when extraction changes meaning, to invalidate cached parse results.
pub const PARSER_VERSION: &str = "rustpython-0.4-tetanus-5";

/// A statically decidable rule violation.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct Finding {
    pub line: u32,
    pub rule: &'static str,
    pub message: String,
}

fn dotted(expr: &Expr) -> Option<String> {
    match expr {
        Expr::Name(name) => Some(name.id.to_string()),
        Expr::Attribute(attr) => Some(format!("{}.{}", dotted(&attr.value)?, attr.attr)),
        _ => None,
    }
}

fn is_relative(specifier: &str) -> bool {
    specifier.starts_with('.')
}

fn is_test_path(specifier: &str) -> bool {
    specifier.contains("test") || specifier.ends_with("conftest")
}

fn alias_name(alias: &Alias) -> String {
    match &alias.asname {
        Some(asname) => asname.as_str().to_string(),
        None => alias.name.as_str().to_string(),
    }
}

/// The name the module being imported from actually declares.
///
/// `from .x import y as z` binds `z` locally but pulls `y` from the module, and
/// `y` is the name that module exports. Consumption is recorded against the
/// source, so an aliased import is not mistaken for an unused export.
fn alias_source_name(alias: &Alias) -> String {
    alias.name.as_str().to_string()
}

fn binding_names(target: &Expr) -> Vec<String> {
    let mut names = Vec::new();
    match target {
        Expr::Name(name) => names.push(name.id.as_str().to_string()),
        Expr::Tuple(tuple) => {
            for element in &tuple.elts {
                names.extend(binding_names(element));
            }
        }
        Expr::List(list) => {
            for element in &list.elts {
                names.extend(binding_names(element));
            }
        }
        Expr::Starred(starred) => names.extend(binding_names(&starred.value)),
        _ => {}
    }
    names
}

struct PyVisitor {
    lines: LineIndex,
    imports: Vec<ImportRef>,
    symbols: Vec<Symbol>,
    calls: Vec<CallRef>,
    findings: Vec<Finding>,
    test_only: bool,
    scope: Vec<String>,
}

impl PyVisitor {
    fn new(source: &str) -> Self {
        Self {
            lines: LineIndex::new(source),
            imports: Vec::new(),
            symbols: Vec::new(),
            calls: Vec::new(),
            findings: Vec::new(),
            test_only: false,
            scope: Vec::new(),
        }
    }

    fn line(&self, offset: u32) -> u32 {
        self.lines.line_of(offset)
    }

    fn push_symbol(&mut self, name: &str, kind: SymbolKind, line: u32) {
        let at_module_scope = self.scope.is_empty();
        let qualified_name = if at_module_scope {
            name.to_string()
        } else {
            format!("{}.{name}", self.scope.join("."))
        };
        self.symbols.push(Symbol {
            name: name.to_string(),
            qualified_name,
            kind,
            line,
            // Only module-level names are importable. A variable inside a
            // function is not an export no matter how it is named, and treating
            // it as one drowns the real signal in thousands of false positives.
            exported: at_module_scope && !name.starts_with('_'),
            statically_referenced: true,
        });
    }

    /// Record a `from ... import ...`, where `star` marks the `import *` form.
    ///
    /// A star names nothing explicitly but reaches every export of the target, so
    /// it is carried on the reference rather than left implicit. Without it the
    /// target's exports cannot be matched against anything and a module imported
    /// wholesale reads as having no reachable exports.
    fn record_import_with(&mut self, specifier: String, names: Vec<String>, star: bool) {
        if is_test_path(&specifier) {
            self.test_only = true;
        }
        let internal = is_relative(&specifier);
        self.imports.push(ImportRef {
            internal,
            specifier,
            form: ImportForm::Static,
            names,
            star,
        });
    }

    fn record_scope_binding(&mut self, name: &str, line: u32) {
        let scope = match self.scope.last() {
            Some(s) => format!("function {s}"),
            None => "module scope".to_string(),
        };
        self.findings.push(Finding {
            line,
            rule: "no-global-mutable-state",
            message: format!(
                "{scope} rebinds `{name}` through global/nonlocal; shared mutable state must be passed explicitly"
            ),
        });
    }

    /// `ExceptHandler` is a single-variant wrapper in rustpython-ast 0.4.
    fn unwrap_handler(handler: &ExceptHandler) -> &ExceptHandlerExceptHandler {
        match handler {
            ExceptHandler::ExceptHandler(inner) => inner,
        }
    }

    fn check_handler(&mut self, handler: &ExceptHandler, line: u32) {
        let handler = Self::unwrap_handler(handler);
        if handler.type_.is_none() {
            self.findings.push(Finding {
                line,
                rule: "no-bare-except",
                message:
                    "bare `except:` catches every exception, including ones not meant to be handled"
                        .to_string(),
            });
        }
        if handler.body.is_empty() {
            self.findings.push(Finding {
                line,
                rule: "no-silent-exception",
                message: "`except` block is empty; the error is discarded".to_string(),
            });
        }
    }
}

impl Visitor for PyVisitor {
    fn visit_stmt_import(&mut self, node: StmtImport) {
        for alias in &node.names {
            self.record_import_with(
                alias.name.as_str().to_string(),
                vec![alias_name(alias)],
                false,
            );
        }
    }

    fn visit_stmt_import_from(&mut self, node: StmtImportFrom) {
        let level = node.level.map(|l| l.to_usize()).unwrap_or(0);
        let specifier = match &node.module {
            Some(module) if level > 0 => format!("{}{}", ".".repeat(level), module.as_str()),
            Some(module) => module.as_str().to_string(),
            None => ".".repeat(level),
        };
        let mut names: Vec<String> = Vec::new();
        let mut star = false;
        for alias in &node.names {
            if alias.name.as_str() == "*" {
                // `from .x import *` names nothing but reaches everything.
                star = true;
            } else {
                names.push(alias_source_name(alias));
            }
        }
        self.record_import_with(specifier, names, star);
    }

    fn visit_stmt_function_def(&mut self, node: StmtFunctionDef) {
        let line = self.line(node.range.start().into());
        self.push_symbol(node.name.as_str(), SymbolKind::Function, line);
        self.scope.push(node.name.as_str().to_string());
        for stmt in node.body {
            self.visit_stmt(stmt);
        }
        self.scope.pop();
    }

    fn visit_stmt_class_def(&mut self, node: StmtClassDef) {
        let line = self.line(node.range.start().into());
        self.push_symbol(node.name.as_str(), SymbolKind::Class, line);
        self.scope.push(node.name.as_str().to_string());
        for stmt in node.body {
            self.visit_stmt(stmt);
        }
        self.scope.pop();
    }

    fn visit_stmt_assign(&mut self, node: StmtAssign) {
        let line = self.line(node.range.start().into());
        for target in &node.targets {
            for name in binding_names(target) {
                self.push_symbol(&name, SymbolKind::Variable, line);
            }
        }
        self.generic_visit_stmt_assign(node);
    }

    fn visit_stmt_ann_assign(&mut self, node: StmtAnnAssign) {
        let line = self.line(node.range.start().into());
        if let Expr::Name(target) = &*node.target {
            self.push_symbol(target.id.as_str(), SymbolKind::Variable, line);
        }
        self.generic_visit_stmt_ann_assign(node);
    }

    fn visit_stmt_global(&mut self, node: StmtGlobal) {
        let line = self.line(node.range.start().into());
        for name in &node.names {
            self.record_scope_binding(name.as_str(), line);
        }
    }

    fn visit_stmt_nonlocal(&mut self, node: StmtNonlocal) {
        let line = self.line(node.range.start().into());
        for name in &node.names {
            self.record_scope_binding(name.as_str(), line);
        }
    }

    fn visit_stmt_try(&mut self, node: StmtTry) {
        let line = self.line(node.range.start().into());
        for handler in &node.handlers {
            self.check_handler(handler, line);
        }
        for stmt in node.body {
            self.visit_stmt(stmt);
        }
        for handler in node.handlers {
            for stmt in Self::unwrap_handler(&handler).body.clone() {
                self.visit_stmt(stmt);
            }
        }
        for stmt in node.orelse {
            self.visit_stmt(stmt);
        }
        for stmt in node.finalbody {
            self.visit_stmt(stmt);
        }
    }

    fn visit_expr_call(&mut self, node: ExprCall) {
        if let Some(name) = dotted(&node.func) {
            if name == "eval" || name == "exec" {
                self.findings.push(Finding {
                    line: self.line(node.range.start().into()),
                    rule: "no-dynamic-execution",
                    message: format!("`{name}()` executes code at runtime"),
                });
            }
            self.calls.push(CallRef {
                callee: name,
                line: self.line(node.range.start().into()),
            });
        }
        self.generic_visit_expr_call(node);
    }
}

fn dedup_sorted<T: Ord>(items: &mut Vec<T>) {
    items.sort();
    items.dedup();
}

pub(crate) fn parse_suite(source: &str, path: &str) -> Result<Vec<Stmt>, String> {
    use rustpython_parser::Parse;
    <rustpython_ast::Suite as Parse>::parse(source, path)
        .map_err(|e| format!("{path}: could not parse Python module: {e}"))
}

/// Which names a module exposes to importers.
fn public_names(body: &[Stmt]) -> Vec<String> {
    // A module that declares `__all__` is stating its public surface outright, and
    // that statement outranks every heuristic. Without this, every module-level
    // name looked exported, because Python has no `export` keyword, so a private
    // helper used only by its own module read as an unused export. `T` in
    // `core/response.py` is the clearest case: a TypeVar, used by the generic
    // class in that same file, in a module whose `__all__` lists one name and
    // not it.
    if let Some(all) = dunder_all(body) {
        let mut names: Vec<String> = all.into_iter().collect();
        dedup_sorted(&mut names);
        return names;
    }

    let mut names: Vec<String> = Vec::new();
    for stmt in body {
        match stmt {
            Stmt::FunctionDef(f) if !f.name.as_str().starts_with('_') => {
                names.push(f.name.as_str().to_string())
            }
            Stmt::ClassDef(c) if !c.name.as_str().starts_with('_') => {
                names.push(c.name.as_str().to_string())
            }
            Stmt::Assign(node) => {
                for target in &node.targets {
                    for name in binding_names(target) {
                        if !name.starts_with('_') {
                            names.push(name);
                        }
                    }
                }
            }
            _ => {}
        }
    }
    dedup_sorted(&mut names);
    names
}

/// The literal string contents of a module-level `__all__`, if it declares one.
///
/// Only a literal list or tuple of string constants counts. `__all__ += [...]`
/// or a computed value is deliberately not followed: a name that cannot be read
/// statically is not evidence either way, and guessing would put private names
/// back into the public surface.
fn dunder_all(body: &[Stmt]) -> Option<BTreeSet<String>> {
    let value = body.iter().find_map(|stmt| match stmt {
        Stmt::Assign(a) => match a.targets.first()? {
            Expr::Name(t) if t.id.as_str() == "__all__" => Some(a.value.as_ref()),
            _ => None,
        },
        Stmt::AnnAssign(a) => match &*a.target {
            Expr::Name(t) if t.id.as_str() == "__all__" => a.value.as_deref(),
            _ => None,
        },
        _ => None,
    })?;

    let items = match value {
        Expr::List(l) => &l.elts,
        Expr::Tuple(t) => &t.elts,
        _ => return None,
    };

    let mut out = BTreeSet::new();
    for item in items {
        match item {
            Expr::Constant(c) => match &c.value {
                Constant::Str(s) => {
                    out.insert(s.clone());
                }
                _ => return None,
            },
            _ => return None,
        }
    }
    Some(out)
}

/// A parsed module together with the rule violations found in it.
#[derive(Debug, Clone)]
pub struct PythonAnalysis {
    pub module: ModuleAnalysis,
    pub findings: Vec<Finding>,
}

/// Parse and analyse one Python module.
pub fn analyze(
    path: &str,
    package: &str,
    generated: bool,
    source: &str,
) -> Result<PythonAnalysis, String> {
    let body = parse_suite(source, path)?;

    let mut visitor = PyVisitor::new(source);
    for stmt in &body {
        visitor.visit_stmt(stmt.clone());
    }

    let mut imports = visitor.imports;
    dedup_sorted(&mut imports);
    let mut symbols = visitor.symbols;
    dedup_sorted(&mut symbols);
    let mut calls = visitor.calls;
    dedup_sorted(&mut calls);
    let mut findings = visitor.findings;
    dedup_sorted(&mut findings);

    let declared = dunder_all(&body).is_some();
    let exports = public_names(&body);
    let test_only = visitor.test_only;

    // The public surface decides `exported`, so a module that declares `__all__`
    // gets its own statement rather than a name-shape heuristic applied twice.
    // `public_names` is the single source of truth for both.
    let public: BTreeSet<&str> = exports.iter().map(String::as_str).collect();
    if !public.is_empty() {
        for symbol in &mut symbols {
            if !public.contains(symbol.name.as_str()) {
                symbol.exported = false;
            }
        }
    }
    dedup_sorted(&mut symbols);

    let power_counts = crate::power::count_one(path, crate::model::Language::Python, source);

    Ok(PythonAnalysis {
        module: ModuleAnalysis {
            path: path.to_string(),
            language: crate::model::Language::Python,
            package: package.to_string(),
            generated,
            imports,
            exports,
            reexports: Vec::new(),
            symbols,
            calls,
            power: power_counts.0,
            power_sites: power_counts.1,
            declared_surface: declared,
            entrypoint: false,
            test_only,
        },
        findings,
    })
}

/// Static rule findings for a Python module, reported as ratchet metrics.
pub fn findings(path: &str, source: &str) -> Vec<Finding> {
    analyze(path, "", false, source)
        .map(|a| a.findings)
        .unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn analysis_of(source: &str) -> ModuleAnalysis {
        analyze("pkg/mod.py", "pkg", false, source)
            .expect("parses")
            .module
    }

    #[test]
    fn dunder_all_defines_the_public_surface() {
        let m = analysis_of(
            "T = TypeVar(\"T\")\n__all__ = [\"Public\"]\n\nclass Public: ...\ndef _private(): ...\ndef helper(): ...\n",
        );
        let exported: Vec<&str> = m
            .symbols
            .iter()
            .filter(|s| s.exported)
            .map(|s| s.name.as_str())
            .collect();
        assert_eq!(exported, vec!["Public"], "only __all__ is public");
        assert_eq!(m.exports, vec!["Public".to_string()]);
    }

    #[test]
    fn dunder_all_falls_back_when_absent() {
        let m = analysis_of("class Public: ...\ndef _private(): ...\n");
        let exported: Vec<&str> = m
            .symbols
            .iter()
            .filter(|s| s.exported)
            .map(|s| s.name.as_str())
            .collect();
        assert_eq!(exported, vec!["Public"], "underscore rule still applies");
    }

    #[test]
    fn dunder_all_rejects_a_computed_list() {
        let m = analysis_of("__all__ = [name for name in dir()]\nclass Public: ...\n");
        let exported: Vec<&str> = m
            .symbols
            .iter()
            .filter(|s| s.exported)
            .map(|s| s.name.as_str())
            .collect();
        assert_eq!(
            exported,
            vec!["Public"],
            "an unreadable __all__ must not shrink the surface"
        );
    }

    #[test]
    fn relative_import_records_the_source_name() {
        // `from .base_service import X as Y` pulls `X`; recording `Y` made every
        // aliased import look like it consumed nothing.
        let m = analysis_of("from .base_service import Thing as Alias\n");
        assert_eq!(m.imports[0].names, vec!["Thing".to_string()]);
    }

    #[test]
    fn star_import_is_flagged() {
        // `from .x import *` reaches every export while naming nothing, so it
        // must be recorded as a star or the target looks like it has no
        // reachable exports at all.
        let m = analysis_of("from .x import *\n");
        assert!(m.imports[0].star, "import * reaches every export");
    }
}
