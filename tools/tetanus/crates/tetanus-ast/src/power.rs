//! NASA/JPL "Power of Ten" rules, as mechanical gates for TypeScript and Python.
//!
//! The original is Robert Holzmann et al., *The Power of Ten: Rules for
//! Developing Safety Critical Code* (JPL). It is written for C, and porting all
//! ten rules to managed languages would be cargo-culting, so this module
//! implements the five that are static properties of a program and is explicit
//! about the ones that are not:
//!
//! - **Rule 2, fixed-size data structures.** Vacuous without manual memory
//!   management. A managed list grows; the rule has nothing to attach to.
//! - **Rule 8, correctness before optimization.** Not a property of a program.
//!   No static check can tell a necessary optimization from a premature one.
//! - **Rule 10, zero warnings.** Not an AST property either. It is a gate on the
//!   compiler and linter, which the task graph already runs. Claiming it here
//!   would credit this module with enforcement it does not perform.
//!
//! What remains, all mechanical:
//!
//! | Rule | Adapted to | Metric |
//! |---|---|---|
//! | 3 fixed bounds | a loop with no provable maximum | `pot3_unbounded_loops` |
//! | 5 small and simple | length, nesting, parameters | `pot5_function_length`, `pot5_nesting_depth`, `pot5_parameter_count` |
//! | 6 no pointers | Python modules exposing raw memory | `pot6_raw_memory` |
//! | 7 isolate errors | bare and empty handlers | `pot7_bare_handler`, `pot7_empty_handler` |
//! | 9 minimal features | runtime code evaluation | `pot9_dynamic_eval` |
//!
//! Thresholds live in [`Limits`] and are reported next to the counts, because a
//! gate whose limit is arbitrary is a gate that gets argued with instead of
//! obeyed.

use std::collections::BTreeMap;

use crate::line_index::LineIndex;
use crate::model::Language;

/// Metric names. Stable, because they appear in the committed baseline and
/// renaming one silently retires its history.
pub mod rule {
    pub const UNBOUNDED_LOOP: &str = "pot3_unbounded_loops";
    pub const FUNCTION_LENGTH: &str = "pot5_function_length";
    pub const NESTING: &str = "pot5_nesting_depth";
    pub const PARAMETERS: &str = "pot5_parameter_count";
    pub const RAW_MEMORY: &str = "pot6_raw_memory";
    pub const BARE_HANDLER: &str = "pot7_bare_handler";
    pub const EMPTY_HANDLER: &str = "pot7_empty_handler";
    pub const DYNAMIC_EVAL: &str = "pot9_dynamic_eval";

    /// Every metric, in report order.
    pub const ALL: &[&str] = &[
        UNBOUNDED_LOOP,
        FUNCTION_LENGTH,
        NESTING,
        PARAMETERS,
        RAW_MEMORY,
        BARE_HANDLER,
        EMPTY_HANDLER,
        DYNAMIC_EVAL,
    ];
}

#[derive(Debug, Clone, Copy)]
pub struct Limits {
    pub max_function_lines: u32,
    pub max_nesting: u32,
    pub max_parameters: usize,
}

impl Default for Limits {
    fn default() -> Self {
        Self {
            // JPL asks that a function fit on a page. Sixty lines is that page.
            max_function_lines: 60,
            // JPL asks for shallow nesting. Four is already generous.
            max_nesting: 4,
            // Past this a parameter list is doing a struct's job.
            max_parameters: 5,
        }
    }
}

/// What one module contributes to the Power of Ten totals: a count per metric,
/// and where each violation is. A count a developer cannot act on is a
/// scoreboard, not a gate, so the two travel together.
pub type ModuleCounts = (
    BTreeMap<String, usize>,
    BTreeMap<String, Vec<(u32, String)>>,
);

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Violation {
    pub rule: &'static str,
    pub path: String,
    pub line: u32,
    pub message: String,
}

impl Violation {
    fn new(rule: &'static str, path: &str, line: u32, message: String) -> Self {
        Self {
            rule,
            path: path.to_string(),
            line,
            message,
        }
    }
}

/// Count violations per metric across modules.
///
/// Zero-initialised for every rule, including the ones nothing violates: a
/// metric that is absent from the report must not be read as unmeasured.
pub fn count(
    modules: &[(String, Language, String)],
    limits: Limits,
) -> BTreeMap<&'static str, usize> {
    let mut counts: BTreeMap<&'static str, usize> = rule::ALL.iter().map(|r| (*r, 0)).collect();
    for (path, language, source) in modules {
        for violation in analyse(path, *language, source, limits) {
            *counts.entry(violation.rule).or_default() += 1;
        }
    }
    counts
}

/// Counts and locations for one module, as recorded on its cached analysis.
pub fn count_one(path: &str, language: Language, source: &str) -> ModuleCounts {
    let mut counts: BTreeMap<String, usize> =
        rule::ALL.iter().map(|r| (r.to_string(), 0)).collect();
    let mut sites: BTreeMap<String, Vec<(u32, String)>> = BTreeMap::new();
    for violation in analyse(path, language, source, Limits::default()) {
        *counts.entry(violation.rule.to_string()).or_default() += 1;
        sites
            .entry(violation.rule.to_string())
            .or_default()
            .push((violation.line, violation.message));
    }
    (counts, sites)
}

pub fn analyse(path: &str, language: Language, source: &str, limits: Limits) -> Vec<Violation> {
    match language {
        // The Power of Ten rules are defined for C and adapted here for the two
        // languages the repository is written in. Other languages are not
        // silently treated as compliant: they produce no findings because there
        // is no adapted rule to apply, and the gate says so rather than
        // reporting a count it did not measure.
        Language::TypeScript | Language::Tsx | Language::JavaScript | Language::Jsx => {
            ts::analyse(path, source, limits)
        }
        Language::Python => python::analyse(path, source, limits),
        _ => Vec::new(),
    }
}

mod python {
    use super::*;
    use rustpython_ast::{Constant, ExceptHandler, Expr, Ranged, Stmt};

    /// Modules that hand out raw memory addresses. The managed-language reading
    /// of the C rule against pointers: the pointer is still reachable, it just
    /// has to be asked for by name, which is enough to make it a deliberate act
    /// rather than an accident.
    const RAW_MEMORY: &[&str] = &["ctypes", "cffi", "_ctypes"];

    pub fn analyse(path: &str, source: &str, limits: Limits) -> Vec<Violation> {
        let Ok(body) = crate::python::parse_suite(source, path) else {
            return Vec::new();
        };
        let index = LineIndex::new(source);
        let mut out = Vec::new();
        for stmt in &body {
            walk(path, stmt, &index, limits, &mut out);
        }
        out
    }

    fn walk(path: &str, stmt: &Stmt, index: &LineIndex, limits: Limits, out: &mut Vec<Violation>) {
        let line = index.line_of(stmt.start().into());

        match stmt {
            // Rule 3: `while True` is unbounded unless something inside can leave.
            Stmt::While(w) => {
                if is_true(&w.test) && !has_break(&w.body) {
                    out.push(Violation::new(
                        rule::UNBOUNDED_LOOP,
                        path,
                        line,
                        "`while True` with no break: no provable maximum iteration count"
                            .to_string(),
                    ));
                }
                for child in &w.body {
                    walk(path, child, index, limits, out);
                }
            }
            Stmt::For(f) => {
                for child in &f.body {
                    walk(path, child, index, limits, out);
                }
            }
            Stmt::If(i) => {
                for child in i.body.iter().chain(i.orelse.iter()) {
                    walk(path, child, index, limits, out);
                }
            }
            Stmt::With(w) => {
                for child in &w.body {
                    walk(path, child, index, limits, out);
                }
            }
            // Rules 5 and 7.
            Stmt::Try(t) => {
                for child in &t.body {
                    walk(path, child, index, limits, out);
                }
                for child in &t.orelse {
                    walk(path, child, index, limits, out);
                }
                for child in &t.finalbody {
                    walk(path, child, index, limits, out);
                }
                for handler in &t.handlers {
                    let ExceptHandler::ExceptHandler(handler) = handler;
                    // The handler's own line, not the `try`'s. A finding about a
                    // handler that points at the `try` sends the reader to the
                    // wrong place, and the handler can be a long way from the
                    // statement that opened the block.
                    let handler_line = index.line_of(handler.start().into());
                    if handler.type_.is_none() {
                        out.push(Violation::new(
                            rule::BARE_HANDLER,
                            path,
                            handler_line,
                            "bare `except:` catches BaseException, including KeyboardInterrupt and SystemExit".to_string(),
                        ));
                    }
                    if is_noop_body(&handler.body) {
                        out.push(Violation::new(
                            rule::EMPTY_HANDLER,
                            path,
                            handler_line,
                            "handler body does nothing: the error is detected and then discarded"
                                .to_string(),
                        ));
                    }
                    for child in &handler.body {
                        walk(path, child, index, limits, out);
                    }
                }
            }
            // Rule 5: length, parameters, nesting.
            Stmt::FunctionDef(f) => {
                let start = f.start().into();
                let lines = index
                    .line_of(f.end().into())
                    .saturating_sub(index.line_of(start));
                if lines > limits.max_function_lines {
                    out.push(Violation::new(
                        rule::FUNCTION_LENGTH,
                        path,
                        index.line_of(start),
                        format!(
                            "`{}` spans {lines} lines, over the {}-line limit",
                            f.name.as_str(),
                            limits.max_function_lines
                        ),
                    ));
                }
                let params = f.args.args.len() + f.args.posonlyargs.len();
                if params > limits.max_parameters {
                    out.push(Violation::new(
                        rule::PARAMETERS,
                        path,
                        index.line_of(start),
                        format!(
                            "`{}` takes {params} parameters, over the limit of {}",
                            f.name.as_str(),
                            limits.max_parameters
                        ),
                    ));
                }
                let depth = nesting(&f.body);
                if depth > limits.max_nesting {
                    out.push(Violation::new(
                        rule::NESTING,
                        path,
                        index.line_of(start),
                        format!(
                            "`{}` nests {depth} levels, over the limit of {}",
                            f.name.as_str(),
                            limits.max_nesting
                        ),
                    ));
                }
                for child in &f.body {
                    walk(path, child, index, limits, out);
                }
            }
            Stmt::ClassDef(c) => {
                for child in &c.body {
                    walk(path, child, index, limits, out);
                }
            }
            // Rules 6 and 9.
            Stmt::Import(i) => {
                for alias in &i.names {
                    if RAW_MEMORY.contains(&alias.name.as_str()) {
                        out.push(Violation::new(
                            rule::RAW_MEMORY,
                            path,
                            line,
                            format!(
                                "`{}` exposes raw memory, which rule 6 forbids in managed code",
                                alias.name.as_str()
                            ),
                        ));
                    }
                }
            }
            // `from cffi import FFI`: the names are the symbols brought in, so
            // the module being reached for is on the statement, not the alias.
            Stmt::ImportFrom(i) => {
                if let Some(module) = &i.module {
                    if RAW_MEMORY.contains(&module.as_str()) {
                        out.push(Violation::new(
                            rule::RAW_MEMORY,
                            path,
                            line,
                            format!(
                                "`{}` exposes raw memory, which rule 6 forbids in managed code",
                                module.as_str()
                            ),
                        ));
                    }
                }
            }
            Stmt::Expr(e) => {
                if let Expr::Call(call) = &*e.value {
                    if let Some(name) = dotted_name(&call.func) {
                        if matches!(name.as_str(), "eval" | "exec" | "__import__") {
                            out.push(Violation::new(
                                rule::DYNAMIC_EVAL,
                                path,
                                line,
                                format!("`{name}` evaluates code at runtime, which rule 9 forbids"),
                            ));
                        }
                    }
                }
            }
            _ => {}
        }
    }

    fn is_true(expr: &Expr) -> bool {
        matches!(expr, Expr::Constant(c) if c.value == Constant::Bool(true))
    }

    /// A body that only passes, or only carries a docstring.
    fn is_noop_body(body: &[Stmt]) -> bool {
        !body.is_empty()
            && body.iter().all(|s| match s {
                Stmt::Pass(_) => true,
                Stmt::Expr(e) => {
                    matches!(&*e.value, Expr::Constant(c) if matches!(c.value, Constant::Str(..)))
                }
                _ => false,
            })
    }

    /// Deepest chain of control flow. Only compound statements count: a function
    /// inside an `if` is not nested control flow in the sense the rule means,
    /// and counting it would report every guard clause in the repository.
    fn nesting(body: &[Stmt]) -> u32 {
        body.iter().map(nest_of).max().unwrap_or(0)
    }

    fn nest_of(stmt: &Stmt) -> u32 {
        match stmt {
            Stmt::If(i) => 1 + nesting(&i.body).max(nesting(&i.orelse)),
            Stmt::For(f) => 1 + nesting(&f.body),
            Stmt::While(w) => 1 + nesting(&w.body),
            Stmt::Match(m) => 1 + m.cases.iter().map(|c| nesting(&c.body)).max().unwrap_or(0),
            Stmt::Try(t) => {
                let in_body = nesting(&t.body);
                let in_handler = t
                    .handlers
                    .iter()
                    .map(|h| match h {
                        ExceptHandler::ExceptHandler(h) => nesting(&h.body),
                    })
                    .max()
                    .unwrap_or(0);
                1 + in_body.max(in_handler).max(nesting(&t.orelse))
            }
            _ => 0,
        }
    }

    fn has_break(body: &[Stmt]) -> bool {
        body.iter().any(|s| match s {
            Stmt::Break(_) => true,
            Stmt::If(i) => has_break(&i.body) || has_break(&i.orelse),
            Stmt::With(w) => has_break(&w.body),
            Stmt::For(f) => has_break(&f.body),
            Stmt::While(w) => has_break(&w.body),
            Stmt::Try(t) => {
                has_break(&t.body)
                    || t.handlers.iter().any(|h| match h {
                        ExceptHandler::ExceptHandler(h) => has_break(&h.body),
                    })
                    || has_break(&t.orelse)
            }
            Stmt::Match(m) => m.cases.iter().any(|c| has_break(&c.body)),
            _ => false,
        })
    }

    fn dotted_name(expr: &Expr) -> Option<String> {
        match expr {
            Expr::Name(n) => Some(n.id.to_string()),
            Expr::Attribute(a) => Some(format!("{}.{}", dotted_name(&a.value)?, a.attr)),
            _ => None,
        }
    }
}

mod ts {
    use super::*;
    use oxc_ast::ast::{Expression, Statement as S};
    use oxc_span::GetSpan;

    pub fn analyse(path: &str, source: &str, limits: Limits) -> Vec<Violation> {
        let allocator = oxc_allocator::Allocator::default();
        let Ok(parsed) = crate::ts::parse(&allocator, source, path) else {
            return Vec::new();
        };
        let index = LineIndex::new(source);
        let mut out = Vec::new();
        for statement in &parsed.program.body {
            walk(path, statement, &index, limits, &mut out);
        }
        out
    }

    fn walk(path: &str, stmt: &S, index: &LineIndex, limits: Limits, out: &mut Vec<Violation>) {
        let line = index.line_of(stmt.span().start);

        match stmt {
            // Rule 3: a loop with no provable maximum.
            S::WhileStatement(w) if is_literal_true(&w.test) && !has_break(&w.body) => {
                out.push(Violation::new(
                    rule::UNBOUNDED_LOOP,
                    path,
                    line,
                    "`while (true)` with no break: no provable maximum iteration count".to_string(),
                ));
            }
            S::ForStatement(f) if f.test.is_none() => {
                out.push(Violation::new(
                    rule::UNBOUNDED_LOOP,
                    path,
                    line,
                    "`for (;;)` has no condition: no provable maximum iteration count".to_string(),
                ));
            }
            // Rule 9. Checked in both places the call can appear: a bare
            // expression statement, and a declarator, which is where
            // `const f = new Function(..)` actually lives.
            S::ExpressionStatement(e) => dynamic_eval(path, line, &e.expression, out),
            S::VariableDeclaration(d) => {
                for declarator in &d.declarations {
                    if let Some(init) = &declarator.init {
                        dynamic_eval(path, line, init, out);
                    }
                }
            }
            // Rule 7: an empty catch discards the error it just detected.
            S::TryStatement(t) => {
                if let Some(handler) = &t.handler {
                    if handler.body.body.is_empty() {
                        // The catch clause's own position, not the `try`'s.
                        out.push(Violation::new(
                            rule::EMPTY_HANDLER,
                            path,
                            index.line_of(handler.body.span().start),
                            "empty catch block: the error is detected and then discarded"
                                .to_string(),
                        ));
                    }
                }
            }
            // Rule 5: function shape, measured on the declaration.
            S::FunctionDeclaration(f) => {
                let name =
                    f.id.as_ref()
                        .map(|i| i.name.to_string())
                        .unwrap_or_else(|| "<anonymous>".to_string());
                let start = stmt.span().start;
                let lines = index.line_of(stmt.span().end).saturating_sub(line);
                let params = f.params.items.len();
                let depth = f
                    .body
                    .as_ref()
                    .map(|b| nesting_slice(&b.statements))
                    .unwrap_or(0);
                if lines > limits.max_function_lines {
                    out.push(Violation::new(
                        rule::FUNCTION_LENGTH,
                        path,
                        index.line_of(start),
                        format!(
                            "`{name}` spans {lines} lines, over the {}-line limit",
                            limits.max_function_lines
                        ),
                    ));
                }
                if params > limits.max_parameters {
                    out.push(Violation::new(
                        rule::PARAMETERS,
                        path,
                        index.line_of(start),
                        format!(
                            "`{name}` takes {params} parameters, over the limit of {}",
                            limits.max_parameters
                        ),
                    ));
                }
                if depth > limits.max_nesting {
                    out.push(Violation::new(
                        rule::NESTING,
                        path,
                        index.line_of(start),
                        format!(
                            "`{name}` nests {depth} levels, over the limit of {}",
                            limits.max_nesting
                        ),
                    ));
                }
            }
            _ => {}
        }

        for child in children(stmt) {
            walk(path, child, index, limits, out);
        }
    }

    fn dynamic_eval(path: &str, line: u32, expr: &Expression, out: &mut Vec<Violation>) {
        if let Some(name) = callee_name(expr) {
            if matches!(name.as_str(), "eval" | "Function") {
                out.push(Violation::new(
                    rule::DYNAMIC_EVAL,
                    path,
                    line,
                    format!("`{name}` evaluates code at runtime, which rule 9 forbids"),
                ));
            }
        }
    }

    /// Deepest chain of control flow. Only compound statements count: a function
    /// declared inside an `if` is not nested control flow in the sense the rule
    /// means, and counting it would report every guard clause in the repository.
    fn nesting_of(body: &S) -> u32 {
        match body {
            S::BlockStatement(b) => b.body.iter().map(nesting_of).max().unwrap_or(0),
            S::IfStatement(i) => {
                1 + nesting_of(&i.consequent).max(nesting_opt(i.alternate.as_ref()))
            }
            S::ForStatement(f) => 1 + nesting_of(&f.body),
            S::WhileStatement(w) => 1 + nesting_of(&w.body),
            S::DoWhileStatement(d) => 1 + nesting_of(&d.body),
            S::WithStatement(w) => 1 + nesting_of(&w.body),
            S::LabeledStatement(l) => 1 + nesting_of(&l.body),
            S::SwitchStatement(s) => {
                1 + s
                    .cases
                    .iter()
                    .flat_map(|c| c.consequent.iter())
                    .map(nesting_of)
                    .max()
                    .unwrap_or(0)
            }
            S::TryStatement(t) => {
                let in_handler = t
                    .handler
                    .as_ref()
                    .map(|h| nesting_slice(&h.body.body))
                    .unwrap_or(0);
                1 + nesting_slice(&t.block.body).max(in_handler)
            }
            _ => 0,
        }
    }

    /// Deepest nesting across a list of statements.
    fn nesting_slice(body: &[S]) -> u32 {
        body.iter().map(nesting_of).max().unwrap_or(0)
    }

    /// `if (x) ... else ...` is optional, and an absent branch nests nothing.
    fn nesting_opt(body: Option<&S>) -> u32 {
        body.map(nesting_of).unwrap_or(0)
    }

    /// The statements a body statement directly contains, so the walk descends
    /// without needing a generated visitor.
    fn children<'a>(stmt: &'a S<'a>) -> Vec<&'a S<'a>> {
        match stmt {
            S::BlockStatement(b) => b.body.iter().collect(),
            S::IfStatement(i) => {
                let mut out: Vec<&S> = vec![&i.consequent];
                out.extend(i.alternate.as_ref());
                out
            }
            S::ForStatement(f) => vec![&f.body],
            S::WhileStatement(w) => vec![&w.body],
            S::DoWhileStatement(d) => vec![&d.body],
            S::WithStatement(w) => vec![&w.body],
            S::LabeledStatement(l) => vec![&l.body],
            S::TryStatement(t) => {
                let mut out: Vec<&S> = Vec::new();
                out.extend(t.block.body.iter());
                if let Some(h) = &t.handler {
                    out.extend(h.body.body.iter());
                }
                if let Some(fin) = &t.finalizer {
                    out.extend(fin.body.iter());
                }
                out
            }
            _ => Vec::new(),
        }
    }

    fn is_literal_true(expr: &Expression) -> bool {
        matches!(expr, Expression::BooleanLiteral(b) if b.value)
    }

    fn has_break(body: &S) -> bool {
        match body {
            S::BreakStatement(_) => true,
            S::BlockStatement(b) => b.body.iter().any(has_break),
            S::IfStatement(i) => {
                has_break(&i.consequent) || i.alternate.as_ref().is_some_and(has_break)
            }
            S::ForStatement(f) => has_break(&f.body),
            S::WhileStatement(w) => has_break(&w.body),
            S::DoWhileStatement(d) => has_break(&d.body),
            S::WithStatement(w) => has_break(&w.body),
            S::LabeledStatement(l) => has_break(&l.body),
            S::TryStatement(t) => t
                .handler
                .as_ref()
                .is_some_and(|h| h.body.body.iter().any(has_break)),
            _ => false,
        }
    }

    fn callee_name(expr: &Expression) -> Option<String> {
        match expr {
            Expression::CallExpression(c) => match &c.callee {
                Expression::Identifier(i) => Some(i.name.to_string()),
                _ => None,
            },
            Expression::NewExpression(n) => match &n.callee {
                Expression::Identifier(i) => Some(i.name.to_string()),
                _ => None,
            },
            _ => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::Language;

    fn ts(source: &str) -> Vec<Violation> {
        analyse("a.ts", Language::TypeScript, source, Limits::default())
    }

    fn py(source: &str) -> Vec<Violation> {
        analyse("a.py", Language::Python, source, Limits::default())
    }

    fn rules(v: &[Violation]) -> Vec<&'static str> {
        v.iter().map(|x| x.rule).collect()
    }

    #[test]
    fn unbounded_while_true_is_reported() {
        assert!(rules(&ts("while (true) { work() }")).contains(&rule::UNBOUNDED_LOOP));
        assert!(rules(&py("while True:\n    work()\n")).contains(&rule::UNBOUNDED_LOOP));
    }

    #[test]
    fn a_while_true_with_a_break_is_bounded() {
        assert!(!rules(&ts("while (true) { if (x) break }")).contains(&rule::UNBOUNDED_LOOP));
        assert!(
            !rules(&py("while True:\n    if x:\n        break\n")).contains(&rule::UNBOUNDED_LOOP)
        );
    }

    #[test]
    fn a_bounded_while_is_not_reported() {
        assert!(!rules(&ts("while (i < n) { i++ }")).contains(&rule::UNBOUNDED_LOOP));
    }

    #[test]
    fn for_without_a_condition_is_reported() {
        assert!(rules(&ts("for (;;) { work() }")).contains(&rule::UNBOUNDED_LOOP));
    }

    #[test]
    fn nested_control_flow_is_measured() {
        // Five levels against a limit of four.
        let deep = "function f() {\n  if (a) {\n    for (;;) {\n      if (b) {\n        while (x) {\n          if (c) {\n          }\n        }\n      }\n    }\n  }\n}\n";
        assert!(rules(&ts(deep)).contains(&rule::NESTING));
    }

    #[test]
    fn a_guard_clause_is_not_nesting() {
        // A function inside an `if` is a declaration, not nested control flow.
        let src =
            "function f() {\n  if (a) {\n    function g() { return 1 }\n    return g()\n  }\n}\n";
        assert!(!rules(&ts(src)).contains(&rule::NESTING));
    }

    #[test]
    fn too_many_parameters_is_reported() {
        let src = "function f(a, b, c, d, e, f, g) { return a }";
        assert!(rules(&ts(src)).contains(&rule::PARAMETERS));
        assert!(!rules(&ts("function f(a, b) { return a }")).contains(&rule::PARAMETERS));
    }

    #[test]
    fn dynamic_evaluation_is_reported() {
        assert!(rules(&ts("eval('x')")).contains(&rule::DYNAMIC_EVAL));
        assert!(rules(&ts("const f = new Function('x')")).contains(&rule::DYNAMIC_EVAL));
        assert!(rules(&py("eval('1')")).contains(&rule::DYNAMIC_EVAL));
        assert!(rules(&py("exec('x')")).contains(&rule::DYNAMIC_EVAL));
    }

    #[test]
    fn raw_memory_modules_are_reported() {
        assert!(rules(&py("import ctypes")).contains(&rule::RAW_MEMORY));
        assert!(rules(&py("from cffi import FFI")).contains(&rule::RAW_MEMORY));
        assert!(!rules(&py("import json")).contains(&rule::RAW_MEMORY));
    }

    #[test]
    fn bare_and_empty_handlers_are_reported() {
        assert!(rules(&py("try:\n    x()\nexcept:\n    pass\n")).contains(&rule::BARE_HANDLER));
        assert!(
            rules(&py("try:\n    x()\nexcept ValueError:\n    pass\n"))
                .contains(&rule::EMPTY_HANDLER)
        );
        assert!(rules(&ts("try { x() } catch (e) {}")).contains(&rule::EMPTY_HANDLER));
    }

    #[test]
    fn a_handling_handler_is_not_reported() {
        let src = "try:\n    x()\nexcept ValueError:\n    log(e)\n";
        let found = rules(&py(src));
        assert!(!found.contains(&rule::BARE_HANDLER));
        assert!(!found.contains(&rule::EMPTY_HANDLER));
    }

    #[test]
    fn every_rule_is_counted_even_at_zero() {
        // An absent metric must not read as unmeasured.
        let counts = count(
            &[("a.ts".into(), Language::TypeScript, "const x = 1".into())],
            Limits::default(),
        );
        for r in rule::ALL {
            assert_eq!(counts.get(r), Some(&0), "{r} missing from the count");
        }
    }
}
