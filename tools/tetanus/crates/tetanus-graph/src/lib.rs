//! Graph storage abstraction.
//!
//! The backend interface deliberately exposes only Tetanus's own types. No
//! HelixDB or Oxigraph type appears in [`GraphBackend`] or in anything built on
//! it, so the two are interchangeable and neither leaks upward.
//!
//! The graph is always reconstructable from repository state. No backend is
//! authoritative for project state, and a backend may be swapped or removed
//! without changing a single metric.

use serde::{Deserialize, Serialize};
use tetanus_core::digest::Digest;
use tetanus_core::error::Result;
use tetanus_core::graph::{Edge, Graph, Node};

/// Optionality of a backend. A backend that is unavailable degrades to
/// `in_memory` and says so, rather than failing the run.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BackendKind {
    InMemory,
    Oxigraph,
    HelixDb,
}

impl BackendKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::InMemory => "in_memory",
            Self::Oxigraph => "oxigraph",
            Self::HelixDb => "helixdb",
        }
    }
}

impl std::str::FromStr for BackendKind {
    type Err = tetanus_core::error::Error;

    fn from_str(value: &str) -> std::result::Result<Self, Self::Err> {
        match value {
            "in_memory" | "memory" => Ok(Self::InMemory),
            "oxigraph" => Ok(Self::Oxigraph),
            "helixdb" | "helix_db" | "helix" => Ok(Self::HelixDb),
            other => Err(tetanus_core::error::Error::config(format!(
                "unknown graph backend {other:?}; expected in_memory, oxigraph or helixdb"
            ))),
        }
    }
}

/// Insertion and query surface the analysis engine needs.
pub trait GraphBackend {
    fn kind(&self) -> BackendKind;

    /// Provider identity including version, folded into the graph digest so a
    /// report states exactly which backend produced it.
    fn identity(&self) -> String;

    fn insert_node(&mut self, node: Node) -> Result<bool>;

    fn insert_edge(&mut self, edge: Edge) -> Result<bool>;

    /// Resolve to a plain [`Graph`] for the deterministic algorithms.
    ///
    /// Backends that add no semantics beyond storage may return their own
    /// graph directly. Backends that do add semantics must ensure the export is
    /// order-independent, because every algorithm downstream assumes it.
    fn export(&self) -> Result<Graph>;

    fn stats(&self) -> Result<BackendStats>;
}

#[derive(Debug, Clone, Copy, Default, Serialize, Deserialize)]
pub struct BackendStats {
    pub nodes: usize,
    pub edges: usize,
}

/// The default backend. Holds the graph in process memory and nothing else.
#[derive(Debug, Clone, Default)]
pub struct InMemoryBackend {
    graph: Graph,
}

impl InMemoryBackend {
    pub fn new() -> Self {
        Self::default()
    }
}

impl GraphBackend for InMemoryBackend {
    fn kind(&self) -> BackendKind {
        BackendKind::InMemory
    }

    fn identity(&self) -> String {
        format!("in_memory/tetanus-{}", env!("CARGO_PKG_VERSION"))
    }

    fn insert_node(&mut self, node: Node) -> Result<bool> {
        Ok(self.graph.add_node(node))
    }

    fn insert_edge(&mut self, edge: Edge) -> Result<bool> {
        Ok(self.graph.add_edge(edge))
    }

    fn export(&self) -> Result<Graph> {
        Ok(self.graph.clone())
    }

    fn stats(&self) -> Result<BackendStats> {
        Ok(BackendStats {
            nodes: self.graph.node_count(),
            edges: self.graph.edge_count(),
        })
    }
}

/// Oxigraph-backed alternative.
///
/// Compile-time gated so the default build carries no native dependency and no
/// runtime server. Enable with `--features oxigraph`. It is an in-process RDF
/// store, so it satisfies the same ephemeral, reconstructable contract as
/// [`InMemoryBackend`] while exercising a real graph engine.
#[cfg(feature = "oxigraph")]
#[derive(Debug)]
pub struct OxigraphBackend {
    store: oxigraph::store::Store,
    pending: std::collections::BTreeMap<EdgeId, Edge>,
    node_count: usize,
}

#[cfg(feature = "oxigraph")]
impl OxigraphBackend {
    pub fn open() -> Result<Self> {
        Ok(Self {
            store: oxigraph::store::Store::new().map_err(|e| {
                tetanus_core::error::Error::config(format!("could not open oxigraph store: {e}"))
            })?,
            pending: BTreeMap::new(),
            node_count: 0,
        })
    }
}

/// Resolve the configured backend, falling back to [`InMemoryBackend`].
pub fn resolve(requested: BackendKind) -> Result<Box<dyn GraphBackend>> {
    match requested {
        BackendKind::InMemory => Ok(Box::new(InMemoryBackend::new())),
        BackendKind::Oxigraph => {
            #[cfg(feature = "oxigraph")]
            {
                Ok(Box::new(OxigraphBackend::open()?))
            }
            #[cfg(not(feature = "oxigraph"))]
            {
                Ok(Box::new(Fallback {
                    requested,
                    reason: "built without the oxigraph feature".to_string(),
                    inner: InMemoryBackend::new(),
                }))
            }
        }
        BackendKind::HelixDb => {
            #[cfg(feature = "helixdb")]
            {
                let _ = requested;
            }
            Ok(Box::new(Fallback {
                requested,
                reason: "helix-db 3.0.0 as published exposes no embedded client; \
                             the ephemeral in_memory backend is used instead"
                    .to_string(),
                inner: InMemoryBackend::new(),
            }))
        }
    }
}

/// Reports which backend was actually used.
///
/// The requested backend and the effective backend are both recorded. A run that
/// silently fell back must be visible in its output, otherwise a report claims
/// graph-engine coverage it does not have.
pub struct Fallback {
    requested: BackendKind,
    reason: String,
    inner: InMemoryBackend,
}

impl std::fmt::Debug for Fallback {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("Fallback")
            .field("requested", &self.requested)
            .field("reason", &self.reason)
            .finish()
    }
}

impl GraphBackend for Fallback {
    fn kind(&self) -> BackendKind {
        BackendKind::InMemory
    }

    fn identity(&self) -> String {
        format!(
            "in_memory (requested {}, unavailable: {})",
            self.requested.as_str(),
            self.reason
        )
    }

    fn insert_node(&mut self, node: Node) -> Result<bool> {
        self.inner.insert_node(node)
    }

    fn insert_edge(&mut self, edge: Edge) -> Result<bool> {
        self.inner.insert_edge(edge)
    }

    fn export(&self) -> Result<Graph> {
        self.inner.export()
    }

    fn stats(&self) -> Result<BackendStats> {
        self.inner.stats()
    }
}

/// Node and edge counts plus the deterministic digest, for report headers.
pub fn describe(backend: &dyn GraphBackend) -> Result<Summary> {
    let graph = backend.export()?;
    let stats = backend.stats()?;
    Ok(Summary {
        backend: backend.kind().as_str().to_string(),
        identity: backend.identity(),
        nodes: stats.nodes,
        edges: stats.edges,
        digest: graph.digest(),
    })
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Summary {
    pub backend: String,
    pub identity: String,
    pub nodes: usize,
    pub edges: usize,
    pub digest: Digest,
}

pub use tetanus_core::graph::EdgeKind as GraphEdgeKind;
pub use tetanus_core::id::NodeId as GraphNodeId;
