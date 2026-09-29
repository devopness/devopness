//! Language-independent intermediate representation of a parsed source file.
//!
//! The TS and Python front ends both lower into these types, so reachability,
//! dead-code detection and the test graph never branch on language. Anything
//! a front end cannot determine statically is recorded as `Unknown` rather than
//! guessed.

use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, BTreeSet};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Language {
    TypeScript,
    Tsx,
    JavaScript,
    Jsx,
    Python,
    Rust,
    Toml,
    Markdown,
    Yaml,
    Json,
    Other,
}

impl Language {
    pub fn from_path(path: &str) -> Self {
        let name = path.rsplit('/').next().unwrap_or(path);
        match name.rsplit('.').next().unwrap_or("") {
            "ts" | "mts" | "cts" => Self::TypeScript,
            "tsx" => Self::Tsx,
            "js" | "mjs" | "cjs" => Self::JavaScript,
            "jsx" => Self::Jsx,
            "py" | "pyi" => Self::Python,
            "rs" => Self::Rust,
            "toml" => Self::Toml,
            "md" | "mdx" => Self::Markdown,
            "yaml" | "yml" => Self::Yaml,
            "json" => Self::Json,
            _ => Self::Other,
        }
    }

    pub fn is_script(self) -> bool {
        matches!(
            self,
            Self::TypeScript | Self::Tsx | Self::JavaScript | Self::Jsx
        )
    }

    pub fn as_str(self) -> &'static str {
        match self {
            Self::TypeScript => "typescript",
            Self::Tsx => "tsx",
            Self::JavaScript => "javascript",
            Self::Jsx => "jsx",
            Self::Python => "python",
            Self::Rust => "rust",
            Self::Toml => "toml",
            Self::Markdown => "markdown",
            Self::Yaml => "yaml",
            Self::Json => "json",
            Self::Other => "other",
        }
    }
}

/// How a module reference was written, which determines how much can be
/// resolved statically.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ImportForm {
    /// `import ... from 'x'` / `from x import y`
    Static,
    /// `import type { T } from 'x'`, erased at runtime
    TypeOnly,
    /// `export ... from 'x'`
    Reexport,
    /// `import('x')`, `await import('x')`
    Dynamic,
    /// `import 'x'` with no bindings: kept for side effects
    SideEffect,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub struct ImportRef {
    /// The specifier exactly as written.
    pub specifier: String,
    pub form: ImportForm,
    /// Names pulled from the target module, sorted. These are the names as the
    /// *target* declares them, not the names the importing file binds them to.
    ///
    /// That distinction is the whole point: `import { HTTPMethod as Method }`
    /// pulls `HTTPMethod` from the target. Recording the local binding instead
    /// made every aliased import look like it consumed nothing, because the
    /// target's export is spelled the other way. Empty for side-effect imports.
    pub names: Vec<String>,
    /// True when the specifier is relative and therefore resolvable inside the
    /// repository. Bare specifiers cross a package boundary.
    pub internal: bool,
    /// True when this reference takes the target's names wholesale rather than a
    /// named subset: `export * from './x'`, `export * as ns from './x'`, and
    /// `import * as ns from './x'`.
    ///
    /// Without this the target's exports cannot be matched against anything,
    /// because a star form names nothing explicitly. A barrel that re-exports a
    /// module wholesale still makes every one of its exports reachable, and
    /// treating that as "unused" reported public API as dead code.
    pub star: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SymbolKind {
    Function,
    Method,
    Class,
    Interface,
    TypeAlias,
    Enum,
    Variable,
    Constant,
    Property,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub struct Symbol {
    /// Name as written, without qualification.
    pub name: String,
    /// Dotted path from the module root, e.g. `ApiBaseService.request`.
    pub qualified_name: String,
    pub kind: SymbolKind,
    pub line: u32,
    pub exported: bool,
    /// False when the declaration is only reachable through a name that could
    /// not be resolved statically.
    pub statically_referenced: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub struct CallRef {
    pub callee: String,
    pub line: u32,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ModuleAnalysis {
    pub path: String,
    pub language: Language,
    /// Package the module belongs to, derived from workspace membership.
    pub package: String,
    pub generated: bool,
    pub imports: Vec<ImportRef>,
    pub exports: Vec<String>,
    pub reexports: Vec<ImportRef>,
    pub symbols: Vec<Symbol>,
    pub calls: Vec<CallRef>,
    /// Power of Ten violations found in this module, by metric.
    ///
    /// Recorded on the module rather than computed in a second pass so the count
    /// comes from the parse that already happened: the tree is walked once and
    /// both the facts and the rule findings come out of it. It travels with the
    /// cached unit, so a cached module reports the same counts as a freshly
    /// parsed one.
    pub power: BTreeMap<String, usize>,
    /// Each violation's line and message, by metric, so a count can be acted on.
    pub power_sites: BTreeMap<String, Vec<(u32, String)>>,
    /// True when the module states its public surface outright rather than it
    /// being inferred from name shape.
    ///
    /// Python is the case that needs this: it has no `export` keyword, so every
    /// module-level name looks exported, and a module that writes `__all__` is
    /// making an explicit claim about what is public. A name in a declared
    /// surface is the package telling us it intends to expose it, so a consumer
    /// outside the repository is the expected reader and the absence of an
    /// internal import is not evidence of anything.
    pub declared_surface: bool,
    /// True when the module is a package entry point.
    pub entrypoint: bool,
    /// True when the module is only reachable from tests.
    pub test_only: bool,
}

impl ModuleAnalysis {
    /// Names this module makes available to importers, combining its own
    /// exports with what it re-exports.
    pub fn exported_names(&self) -> BTreeSet<&str> {
        let mut names: BTreeSet<&str> = self.exports.iter().map(String::as_str).collect();
        names.extend(
            self.reexports
                .iter()
                .flat_map(|r| r.names.iter().map(String::as_str)),
        );
        names
    }

    /// Every external specifier this module depends on.
    pub fn external_specifiers(&self) -> BTreeSet<&str> {
        let mut out: BTreeSet<&str> = self
            .imports
            .iter()
            .filter(|i| !i.internal)
            .map(|i| i.specifier.as_str())
            .collect();
        out.extend(
            self.reexports
                .iter()
                .filter(|i| !i.internal)
                .map(|i| i.specifier.as_str()),
        );
        out
    }
}
