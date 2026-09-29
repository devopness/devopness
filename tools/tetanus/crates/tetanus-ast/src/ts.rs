//! TypeScript / JavaScript front end built on oxc.
//!
//! oxc is the same parser family `vite-plus` uses for linting, so the AST
//! Tetanus reasons about and the AST the linter sees come from one
//! implementation. The arena allocator makes the zero-copy requirement
//! structural rather than aspirational: every node borrowed below lives in the
//! caller's `Allocator` and nothing is cloned.
//!
//! Anything not statically determinable is simply absent from the result
//! rather than guessed. A callee that cannot be written down produces no call
//! edge, and the module is reported as having a dynamic boundary.

use std::collections::BTreeSet;

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    BindingPattern, ChainElement, Class, ClassElement, Declaration, ExportDefaultDeclarationKind,
    Expression, ImportDeclaration, ImportDeclarationSpecifier, ImportOrExportKind, Program,
    Statement,
};
use oxc_diagnostics::OxcDiagnostic;
use oxc_parser::{ParseOptions, Parser};
use oxc_span::SourceType;

use crate::line_index::LineIndex;
use crate::model::{CallRef, ImportForm, ImportRef, ModuleAnalysis, Symbol, SymbolKind};

/// Bump when extraction changes meaning, to invalidate cached parse results.
pub const PARSER_VERSION: &str = "oxc-0.151-tetanus-4";

pub struct ParsedModule<'a> {
    pub program: Program<'a>,
}

pub fn parse<'a>(
    allocator: &'a Allocator,
    source: &'a str,
    path: &str,
) -> Result<ParsedModule<'a>, String> {
    let source_type = SourceType::from_path(path)
        .map_err(|e| format!("could not determine source type for {path}: {e}"))?;

    let ret = Parser::new(allocator, source, source_type)
        .with_options(ParseOptions {
            allow_return_outside_function: true,
            ..ParseOptions::default()
        })
        .parse();

    if let Some(first) = ret.diagnostics.first() {
        return Err(format_error(first));
    }

    Ok(ParsedModule {
        program: ret.program,
    })
}

fn format_error(diagnostic: &OxcDiagnostic) -> String {
    let label = diagnostic
        .labels
        .first()
        .and_then(|l| l.label())
        .unwrap_or_default()
        .to_string();
    format!("{}: {label}", diagnostic.message)
}

pub fn is_relative(specifier: &str) -> bool {
    specifier.starts_with("./")
        || specifier.starts_with("../")
        || specifier.starts_with('/')
        || specifier == "."
        || specifier == ".."
}

pub fn is_test_path(specifier: &str) -> bool {
    specifier.contains(".spec.")
        || specifier.contains(".test.")
        || specifier.contains("/tests/")
        || specifier.contains("/__tests__/")
        || specifier.contains(".stories.")
        || specifier.contains("test-utils")
}

/// Every name an import declaration pulls from the module it names.
///
/// These are the names as the *source* module declares them. For a renamed import
/// that is the original: `import { HTTPMethod as Method }` pulls `HTTPMethod`.
/// Recording the local binding instead made every aliased import look as though
/// it consumed nothing, because the source's export is spelled the other way, and
/// the export was then reported as dead code.
///
/// A namespace import names nothing explicitly but still reaches every export, so
/// it is returned as a star and the caller marks the whole module consumed.
fn binding_names(decl: &ImportDeclaration) -> (Vec<String>, bool) {
    let mut names: BTreeSet<String> = BTreeSet::new();
    let mut star = false;
    for spec in decl.specifiers.iter().flatten() {
        match spec {
            ImportDeclarationSpecifier::ImportDefaultSpecifier(d) => {
                names.insert(d.local.name.to_string());
            }
            ImportDeclarationSpecifier::ImportNamespaceSpecifier(n) => {
                names.insert(n.local.name.to_string());
                star = true;
            }
            ImportDeclarationSpecifier::ImportSpecifier(i) => {
                names.insert(i.imported.name().to_string());
            }
        }
    }
    (names.into_iter().collect(), star)
}

/// Every name bound by a pattern, including destructured and defaulted parts.
pub fn flatten_pattern(pattern: &BindingPattern) -> Vec<String> {
    let mut out = Vec::new();
    match pattern {
        BindingPattern::BindingIdentifier(ident) => out.push(ident.name.to_string()),
        BindingPattern::ObjectPattern(obj) => {
            for prop in &obj.properties {
                out.extend(flatten_pattern(&prop.value));
            }
            if let Some(rest) = &obj.rest {
                out.extend(flatten_pattern(&rest.argument));
            }
        }
        BindingPattern::ArrayPattern(arr) => {
            for element in arr.elements.iter().flatten() {
                out.extend(flatten_pattern(element));
            }
            if let Some(rest) = &arr.rest {
                out.extend(flatten_pattern(&rest.argument));
            }
        }
        BindingPattern::AssignmentPattern(assign) => out.extend(flatten_pattern(&assign.left)),
    }
    out
}

/// Dotted name of a call target, or `None` when it cannot be written down
/// statically.
pub fn callee_name(expr: &Expression) -> Option<String> {
    match expr {
        Expression::Identifier(ident) => Some(ident.name.to_string()),
        Expression::StaticMemberExpression(member) => {
            let base = callee_name(&member.object)?;
            Some(format!("{base}.{}", member.property.name))
        }
        Expression::ComputedMemberExpression(member) => {
            let base = callee_name(&member.object)?;
            match &member.expression {
                Expression::StringLiteral(lit) => Some(format!("{base}.{}", lit.value)),
                _ => Some(base),
            }
        }
        Expression::ChainExpression(chain) => match &chain.expression {
            ChainElement::CallExpression(call) => callee_name(&call.callee),
            ChainElement::TSNonNullExpression(inner) => callee_name(&inner.expression),
            ChainElement::StaticMemberExpression(member) => {
                let base = callee_name(&member.object)?;
                Some(format!("{base}.{}", member.property.name))
            }
            ChainElement::ComputedMemberExpression(member) => callee_name(&member.object),
            ChainElement::PrivateFieldExpression(_) => None,
        },
        _ => None,
    }
}

struct Collector {
    lines: LineIndex,
    imports: Vec<ImportRef>,
    reexports: Vec<ImportRef>,
    exports: Vec<String>,
    symbols: Vec<Symbol>,
    calls: Vec<CallRef>,
    test_only: bool,
}

impl Collector {
    fn new(source: &str) -> Self {
        Self {
            lines: LineIndex::new(source),
            imports: Vec::new(),
            reexports: Vec::new(),
            exports: Vec::new(),
            symbols: Vec::new(),
            calls: Vec::new(),
            test_only: false,
        }
    }

    fn line(&self, span: oxc_span::Span) -> u32 {
        self.lines.line_of(span.start)
    }

    fn push_symbol(
        &mut self,
        name: &str,
        scope: &[String],
        kind: SymbolKind,
        span: oxc_span::Span,
        exported: bool,
    ) {
        let line = self.line(span);
        self.symbols.push(Symbol {
            name: name.to_string(),
            qualified_name: if scope.is_empty() {
                name.to_string()
            } else {
                format!("{}.{name}", scope.join("."))
            },
            kind,
            line,
            exported,
            statically_referenced: true,
        });
    }

    fn statement(&mut self, statement: &Statement, scope: &mut Vec<String>, collect_symbols: bool) {
        match statement {
            Statement::ImportDeclaration(decl) => {
                let specifier = decl.source.value.to_string();
                if is_test_path(&specifier) {
                    self.test_only = true;
                }
                let (names, star) = binding_names(decl);
                let form = if decl.import_kind == ImportOrExportKind::Type {
                    ImportForm::TypeOnly
                } else if names.is_empty() {
                    ImportForm::SideEffect
                } else {
                    ImportForm::Static
                };
                self.imports.push(ImportRef {
                    internal: is_relative(&specifier),
                    specifier,
                    form,
                    names,
                    star,
                });
            }
            Statement::ExportAllDeclaration(decl) => {
                let specifier = decl.source.value.to_string();
                self.reexports.push(ImportRef {
                    internal: is_relative(&specifier),
                    specifier,
                    form: ImportForm::Reexport,
                    names: Vec::new(),
                    star: true,
                });
            }
            Statement::ExportFromDeclaration(decl) => {
                let specifier = decl.source.value.to_string();
                // `local` is the name the target module declares, `exported` is
                // the name this barrel exposes it under. Consumption is recorded
                // against what the target declares, so a re-export that renames
                // still marks the original symbol as reachable.
                let names: Vec<String> = decl
                    .specifiers
                    .iter()
                    .map(|s| s.local.name().to_string())
                    .collect();
                self.reexports.push(ImportRef {
                    internal: is_relative(&specifier),
                    specifier,
                    form: if decl.export_kind == ImportOrExportKind::Type {
                        ImportForm::TypeOnly
                    } else {
                        ImportForm::Reexport
                    },
                    names,
                    star: false,
                });
            }
            Statement::ExportNamedDeclaration(decl) => {
                for spec in &decl.specifiers {
                    self.exports.push(spec.exported.name().to_string());
                }
            }
            Statement::ExportDeclaration(decl) => {
                self.declaration(&decl.declaration, scope, collect_symbols, true);
            }
            Statement::ExportDefaultDeclaration(decl) => {
                self.exports.push("default".to_string());
                match &decl.declaration {
                    ExportDefaultDeclarationKind::FunctionDeclaration(f) => {
                        if let Some(id) = &f.id {
                            let name = id.name.to_string();
                            self.push_symbol(&name, scope, SymbolKind::Function, f.span, true);
                        }
                        if let Some(body) = &f.body {
                            let name =
                                f.id.as_ref()
                                    .map(|id| id.name.to_string())
                                    .unwrap_or_else(|| "default".to_string());
                            scope.push(name);
                            for inner in &body.statements {
                                self.statement(inner, scope, true);
                            }
                            scope.pop();
                        }
                    }
                    ExportDefaultDeclarationKind::ClassDeclaration(c) => {
                        if let Some(id) = &c.id {
                            let name = id.name.to_string();
                            self.push_symbol(&name, scope, SymbolKind::Class, c.span, true);
                        }
                        self.class_body(c, scope);
                    }
                    ExportDefaultDeclarationKind::TSInterfaceDeclaration(i) => {
                        self.push_symbol(&i.id.name, scope, SymbolKind::Interface, i.span, true);
                    }
                    other => {
                        if let Some(expr) = other.as_expression() {
                            self.expression(expr);
                        }
                    }
                }
            }
            Statement::ExpressionStatement(expr) => self.expression(&expr.expression),
            other => {
                if collect_symbols && let Some(decl) = other.as_declaration() {
                    self.declaration(decl, scope, true, false);
                }
            }
        }
    }

    fn class_body(&mut self, class: &Class<'_>, scope: &mut Vec<String>) {
        let Some(id) = &class.id else { return };
        let class_name = id.name.to_string();
        scope.push(class_name);
        for member in &class.body.body {
            match member {
                ClassElement::MethodDefinition(method) => {
                    let name = method.key.name().map(|n| n.into_owned());
                    if let Some(name) = &name {
                        self.push_symbol(name, scope, SymbolKind::Method, method.span, false);
                    }
                    if let (Some(name), Some(body)) = (name, &method.value.body) {
                        scope.push(name);
                        for inner in &body.statements {
                            self.statement(inner, scope, true);
                        }
                        scope.pop();
                    }
                }
                ClassElement::PropertyDefinition(prop) => {
                    if let Some(name) = prop.key.name() {
                        self.push_symbol(
                            name.as_ref(),
                            scope,
                            SymbolKind::Property,
                            prop.span,
                            false,
                        );
                    }
                }
                _ => {}
            }
        }
        scope.pop();
    }

    fn declaration(
        &mut self,
        decl: &Declaration<'_>,
        scope: &mut Vec<String>,
        collect_symbols: bool,
        exported: bool,
    ) {
        match decl {
            Declaration::FunctionDeclaration(f) => {
                let name = f.id.as_ref().map(|id| id.name.to_string());
                if collect_symbols && let Some(name) = name.as_ref() {
                    self.push_symbol(name, scope, SymbolKind::Function, f.span, exported);
                }
                if let Some(body) = &f.body {
                    scope.push(name.unwrap_or_else(|| "default".to_string()));
                    for inner in &body.statements {
                        self.statement(inner, scope, true);
                    }
                    scope.pop();
                }
            }
            Declaration::ClassDeclaration(c) => {
                if collect_symbols && let Some(id) = &c.id {
                    let name = id.name.to_string();
                    self.push_symbol(&name, scope, SymbolKind::Class, c.span, exported);
                }
                self.class_body(c, scope);
            }
            Declaration::VariableDeclaration(var) => {
                if !collect_symbols {
                    return;
                }
                let kind = if var.kind.is_const() {
                    SymbolKind::Constant
                } else {
                    SymbolKind::Variable
                };
                for declarator in &var.declarations {
                    let span = declarator.span;
                    for name in flatten_pattern(&declarator.id) {
                        self.push_symbol(&name, scope, kind, span, exported);
                    }
                }
            }
            Declaration::TSInterfaceDeclaration(i) => {
                if collect_symbols {
                    self.push_symbol(&i.id.name, scope, SymbolKind::Interface, i.span, exported);
                }
            }
            Declaration::TSTypeAliasDeclaration(t) => {
                if collect_symbols {
                    self.push_symbol(&t.id.name, scope, SymbolKind::TypeAlias, t.span, exported);
                }
            }
            Declaration::TSEnumDeclaration(e) => {
                if collect_symbols {
                    self.push_symbol(&e.id.name, scope, SymbolKind::Enum, e.span, exported);
                }
            }
            Declaration::TSNamespaceDeclaration(n) if collect_symbols => {
                self.push_symbol(&n.id.name, scope, SymbolKind::Class, n.span, exported);
            }
            _ => {}
        }
    }

    fn expression(&mut self, expr: &Expression<'_>) {
        match expr {
            Expression::CallExpression(call) => {
                if let Some(callee) = callee_name(&call.callee) {
                    self.calls.push(CallRef {
                        callee,
                        line: self.line(call.span),
                    });
                }
            }
            Expression::ImportExpression(dynamic) => {
                if let Expression::StringLiteral(lit) = &dynamic.source {
                    let specifier = lit.value.to_string();
                    if is_test_path(&specifier) {
                        self.test_only = true;
                    }
                    self.imports.push(ImportRef {
                        internal: is_relative(&specifier),
                        specifier,
                        form: ImportForm::Dynamic,
                        names: Vec::new(),
                        star: false,
                    });
                }
            }
            _ => {}
        }
    }
}

fn dedup_sorted<T: Ord>(items: &mut Vec<T>) {
    items.sort();
    items.dedup();
}

/// Parse and analyse one script module.
pub fn analyze(
    path: &str,
    package: &str,
    generated: bool,
    source: &str,
    allocator: &Allocator,
) -> Result<ModuleAnalysis, String> {
    let parsed = parse(allocator, source, path)?;

    let mut collector = Collector::new(source);
    let mut scope: Vec<String> = Vec::new();
    for statement in &parsed.program.body {
        collector.statement(statement, &mut scope, true);
    }

    let mut imports = collector.imports;
    let mut reexports = collector.reexports;
    let mut exports = collector.exports;
    let mut symbols = collector.symbols;
    let mut calls = collector.calls;
    dedup_sorted(&mut imports);
    dedup_sorted(&mut reexports);
    dedup_sorted(&mut exports);
    dedup_sorted(&mut symbols);
    dedup_sorted(&mut calls);

    let power_counts =
        crate::power::count_one(path, crate::model::Language::from_path(path), source);

    Ok(ModuleAnalysis {
        path: path.to_string(),
        language: crate::model::Language::from_path(path),
        package: package.to_string(),
        generated,
        imports,
        exports,
        reexports,
        symbols,
        calls,
        power: power_counts.0,
        power_sites: power_counts.1,
        declared_surface: false,
        entrypoint: false,
        test_only: collector.test_only,
    })
}
