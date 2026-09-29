use std::fmt;

use serde::{Deserialize, Serialize};

const NODE_PREFIX: &str = "n";
const EDGE_PREFIX: &str = "e";
const SYMBOL_PREFIX: &str = "s";

/// Identifier of a graph node.
///
/// Derived from semantic coordinates via BLAKE3 so that two builds over
/// identical source state produce identical identifiers regardless of the
/// order in which nodes were discovered.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct NodeId(String);

impl NodeId {
    pub fn new(kind: &str, scope: &str, name: &str) -> Self {
        Self(format!("{NODE_PREFIX}:{kind}:{scope}:{name}"))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for NodeId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

/// Identifier of a graph edge. Endpoints are part of the identity so that a
/// rebuilt graph cannot silently produce a different edge set.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct EdgeId(String);

impl EdgeId {
    pub fn new(kind: &str, from: &NodeId, to: &NodeId) -> Self {
        Self(format!("{EDGE_PREFIX}:{kind}:{from}->{to}"))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for EdgeId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

/// Identifier of a declaration inside a module.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct SymbolId(String);

impl SymbolId {
    pub fn new(package: &str, module: &str, name: &str) -> Self {
        Self(format!("{SYMBOL_PREFIX}:{package}:{module}#{name}"))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for SymbolId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn node_id_is_order_independent() {
        let a = NodeId::new("symbol", "sdk-js", "ApiBaseService");
        let b = NodeId::new("symbol", "sdk-js", "ApiBaseService");
        assert_eq!(a, b);
        assert_ne!(a, NodeId::new("symbol", "sdk-js", "ApiResponse"));
    }

    #[test]
    fn edge_id_depends_on_direction() {
        let a = NodeId::new("module", "sdk-js", "a.ts");
        let b = NodeId::new("module", "sdk-js", "b.ts");
        assert_ne!(
            EdgeId::new("imports", &a, &b),
            EdgeId::new("imports", &b, &a)
        );
    }
}
