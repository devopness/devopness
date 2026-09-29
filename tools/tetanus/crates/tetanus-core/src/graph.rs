use std::collections::{BTreeMap, BTreeSet};

use serde::{Deserialize, Serialize};

use crate::id::{EdgeId, NodeId};

/// Kinds of node in the engineering graph.
///
/// The set is intentionally closed. Adding a kind is a schema change and must
/// be reflected in `.tetanus/specs/graph.toml` in the same change.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NodeKind {
    Repository,
    Package,
    Module,
    Symbol,
    Function,
    Test,
    Task,
    Dependency,
    Metric,
    Ratchet,
    Decision,
}

impl NodeKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Repository => "repository",
            Self::Package => "package",
            Self::Module => "module",
            Self::Symbol => "symbol",
            Self::Function => "function",
            Self::Test => "test",
            Self::Task => "task",
            Self::Dependency => "dependency",
            Self::Metric => "metric",
            Self::Ratchet => "ratchet",
            Self::Decision => "decision",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EdgeKind {
    Contains,
    Imports,
    Exports,
    Calls,
    DependsOn,
    Covers,
    AffectedBy,
    Violates,
    GeneratedFrom,
    Reexports,
}

impl EdgeKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Contains => "contains",
            Self::Imports => "imports",
            Self::Exports => "exports",
            Self::Calls => "calls",
            Self::DependsOn => "depends_on",
            Self::Covers => "covers",
            Self::AffectedBy => "affected_by",
            Self::Violates => "violates",
            Self::GeneratedFrom => "generated_from",
            Self::Reexports => "reexports",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub struct Node {
    pub id: NodeId,
    pub kind: NodeKind,
    pub name: String,
    /// Repository-relative path with forward slashes. Empty for nodes that are
    /// not file-backed (a ratchet, for example).
    pub path: String,
    pub generated: bool,
    pub attributes: BTreeMap<String, String>,
}

impl Node {
    pub fn new(kind: NodeKind, scope: &str, name: impl Into<String>) -> Self {
        let name = name.into();
        Self {
            id: NodeId::new(kind.as_str(), scope, &name),
            kind,
            name,
            path: String::new(),
            generated: false,
            attributes: BTreeMap::new(),
        }
    }

    pub fn with_path(mut self, path: impl Into<String>) -> Self {
        self.path = path.into();
        self
    }

    pub fn with_generated(mut self, generated: bool) -> Self {
        self.generated = generated;
        self
    }

    pub fn with_attr(mut self, key: impl Into<String>, value: impl Into<String>) -> Self {
        self.attributes.insert(key.into(), value.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub struct Edge {
    pub id: EdgeId,
    pub kind: EdgeKind,
    pub from: NodeId,
    pub to: NodeId,
}

impl Edge {
    pub fn new(kind: EdgeKind, from: &NodeId, to: &NodeId) -> Self {
        Self {
            id: EdgeId::new(kind.as_str(), from, to),
            kind,
            from: from.clone(),
            to: to.clone(),
        }
    }
}

pub type EdgeList = Vec<Edge>;

/// Directed multigraph keyed by [`NodeId`].
///
/// Both nodes and adjacency are held in [`BTreeMap`], never a `HashMap`,
/// because iteration order of a hash map is not stable across runs and would
/// make serialized output nondeterministic.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct Graph {
    nodes: BTreeMap<NodeId, Node>,
    out: BTreeMap<NodeId, BTreeSet<(EdgeKind, NodeId)>>,
    inc: BTreeMap<NodeId, BTreeSet<(EdgeKind, NodeId)>>,
    edges: BTreeMap<EdgeId, Edge>,
}

impl Graph {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn add_node(&mut self, node: Node) -> bool {
        let id = node.id.clone();
        let inserted = self.nodes.insert(id.clone(), node).is_none();
        self.out.entry(id.clone()).or_default();
        self.inc.entry(id).or_default();
        inserted
    }

    pub fn add_edge(&mut self, edge: Edge) -> bool {
        if !self.nodes.contains_key(&edge.from) || !self.nodes.contains_key(&edge.to) {
            return false;
        }
        self.out
            .entry(edge.from.clone())
            .or_default()
            .insert((edge.kind, edge.to.clone()));
        self.inc
            .entry(edge.to.clone())
            .or_default()
            .insert((edge.kind, edge.from.clone()));
        self.edges.insert(edge.id.clone(), edge).is_none()
    }

    pub fn node(&self, id: &NodeId) -> Option<&Node> {
        self.nodes.get(id)
    }

    pub fn nodes(&self) -> impl Iterator<Item = &Node> {
        self.nodes.values()
    }

    pub fn edges(&self) -> impl Iterator<Item = &Edge> {
        self.edges.values()
    }

    pub fn node_count(&self) -> usize {
        self.nodes.len()
    }

    pub fn edge_count(&self) -> usize {
        self.edges.len()
    }

    pub fn successors(&self, id: &NodeId, kind: EdgeKind) -> Vec<&NodeId> {
        self.out
            .get(id)
            .map(|set| {
                set.iter()
                    .filter(|(k, _)| *k == kind)
                    .map(|(_, to)| to)
                    .collect()
            })
            .unwrap_or_default()
    }

    pub fn predecessors(&self, id: &NodeId, kind: EdgeKind) -> Vec<&NodeId> {
        self.inc
            .get(id)
            .map(|set| {
                set.iter()
                    .filter(|(k, _)| *k == kind)
                    .map(|(_, from)| from)
                    .collect()
            })
            .unwrap_or_default()
    }

    pub fn out_degree(&self, id: &NodeId) -> usize {
        self.out.get(id).map_or(0, BTreeSet::len)
    }

    pub fn in_degree(&self, id: &NodeId) -> usize {
        self.inc.get(id).map_or(0, BTreeSet::len)
    }

    /// Adjacency restricted to one edge kind, as an ordered list.
    pub fn adjacency(&self, kind: EdgeKind) -> BTreeMap<&NodeId, Vec<&NodeId>> {
        let mut result: BTreeMap<&NodeId, Vec<&NodeId>> = BTreeMap::new();
        for id in self.nodes.keys() {
            let targets = self.successors(id, kind);
            if !targets.is_empty() {
                result.insert(id, targets);
            }
        }
        result
    }

    /// Deterministic fingerprint of graph structure.
    ///
    /// Two builds over identical source state must produce the same digest.
    /// `tetanus graph verify` builds the graph twice and compares digests, which
    /// is the mechanical form of the determinism requirement.
    pub fn digest(&self) -> crate::digest::Digest {
        let mut parts: Vec<String> = Vec::with_capacity(self.nodes.len() + self.edges.len());
        for node in self.nodes.values() {
            parts.push(format!(
                "n|{}|{}|{}|{}|{}",
                node.id,
                node.kind.as_str(),
                node.name,
                node.path,
                node.generated
            ));
        }
        for edge in self.edges.values() {
            parts.push(format!(
                "e|{}|{}|{}|{}",
                edge.id,
                edge.kind.as_str(),
                edge.from,
                edge.to
            ));
        }
        parts.sort();
        crate::digest::Digest::of_iter(parts.iter().map(String::as_str))
    }
}
