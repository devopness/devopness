//! Stable, content-addressed identifiers and graph primitives.
//!
//! Every identifier in Tetanus is derived from a deterministic tuple of
//! semantic coordinates (kind, package, qualified name, path). Identifiers are
//! never sequential counters, because sequential counters make graph output
//! depend on traversal order and would break the determinism invariant that
//! `tetanus graph verify` enforces.

pub mod analysis;
pub mod digest;
pub mod error;
pub mod graph;
pub mod id;

pub use digest::{ContentDigest, Digest};
pub use error::{Error, Finding, Report, ReportBuilder, Result, Severity, Status};
pub use graph::{Edge, EdgeKind, EdgeList, Graph, Node, NodeKind};
pub use id::{EdgeId, NodeId, SymbolId};
