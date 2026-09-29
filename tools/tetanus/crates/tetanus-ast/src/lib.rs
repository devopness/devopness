//! Parsing and static analysis front ends.
//!
//! TypeScript and JavaScript go through oxc, the same parser family
//! `vite-plus` uses for linting. Python goes through `rustpython-parser`. Both
//! lower into [`model`], so every downstream analysis is language-agnostic.

pub mod line_index;
pub mod model;
pub mod power;
pub mod python;
pub mod ts;

pub use line_index::LineIndex;
pub use model::{CallRef, ImportForm, ImportRef, Language, ModuleAnalysis, Symbol, SymbolKind};
