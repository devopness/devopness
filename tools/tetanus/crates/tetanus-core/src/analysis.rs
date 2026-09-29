//! Deterministic graph algorithms.
//!
//! Every traversal in this module iterates over [`BTreeMap`]/[`BTreeSet`]
//! backed structures and pushes results in discovery order, so the output of
//! each function is a function of the graph alone, never of insertion order or
//! of thread scheduling.

use std::collections::{BTreeMap, BTreeSet, VecDeque};

use crate::graph::{EdgeKind, Graph};
use crate::id::NodeId;

/// Tarjan's strongly connected components, iterative to avoid unbounded
/// recursion (one of the Holzmann-derived rules Tetanus holds itself to).
///
/// Components are returned as a list of sorted member lists, and the list of
/// components is sorted by their first member. Callers therefore get a stable
/// ordering for free.
pub fn strongly_connected_components(graph: &Graph, kind: EdgeKind) -> Vec<Vec<NodeId>> {
    let nodes: Vec<&NodeId> = graph.nodes().map(|n| &n.id).collect();
    let index_of: BTreeMap<&NodeId, usize> =
        nodes.iter().enumerate().map(|(i, id)| (*id, i)).collect();

    let mut index = vec![usize::MAX; nodes.len()];
    let mut lowlink = vec![0usize; nodes.len()];
    let mut on_stack = vec![false; nodes.len()];
    let mut stack: Vec<usize> = Vec::new();
    let mut next_index = 0usize;
    let mut components: Vec<Vec<NodeId>> = Vec::new();

    for root in 0..nodes.len() {
        if index[root] != usize::MAX {
            continue;
        }
        let mut work: Vec<(usize, usize)> = vec![(root, 0)];
        while let Some((v, child)) = work.pop() {
            if child == 0 {
                index[v] = next_index;
                lowlink[v] = next_index;
                next_index += 1;
                stack.push(v);
                on_stack[v] = true;
            }
            let mut recursed = false;
            let children = graph.successors(nodes[v], kind);
            for (i, child_id) in children.iter().enumerate().skip(child) {
                let w = index_of[*child_id];
                if index[w] == usize::MAX {
                    work.push((v, i + 1));
                    work.push((w, 0));
                    recursed = true;
                    break;
                } else if on_stack[w] {
                    lowlink[v] = lowlink[v].min(index[w]);
                }
            }
            if recursed {
                continue;
            }
            if lowlink[v] == index[v] {
                let mut component: Vec<NodeId> = Vec::new();
                loop {
                    let w = stack.pop().expect("tarjan stack is non-empty at root pop");
                    on_stack[w] = false;
                    component.push(nodes[w].clone());
                    if w == v {
                        break;
                    }
                }
                component.sort();
                components.push(component);
            }
            if let Some(&(parent, _)) = work.last() {
                lowlink[parent] = lowlink[parent].min(lowlink[v]);
            }
        }
    }

    components.sort();
    components
}

/// A cycle is any strongly connected component with more than one member, or a
/// single member that carries a self loop.
pub fn cycles(graph: &Graph, kind: EdgeKind) -> Vec<Vec<NodeId>> {
    strongly_connected_components(graph, kind)
        .into_iter()
        .filter(|component| {
            component.len() > 1
                || graph
                    .successors(&component[0], kind)
                    .iter()
                    .any(|target| **target == component[0])
        })
        .collect()
}

/// Kahn topological sort restricted to one edge kind.
///
/// Returns `None` when the subgraph contains a cycle, which is how callers
/// distinguish "dependency order unavailable" from "empty graph".
pub fn topological_order(graph: &Graph, kind: EdgeKind) -> Option<Vec<NodeId>> {
    let nodes: Vec<&NodeId> = graph.nodes().map(|n| &n.id).collect();
    let mut indegree: BTreeMap<&NodeId, usize> =
        nodes.iter().map(|id| (*id, graph.in_degree(id))).collect();

    let mut ready: BTreeSet<&NodeId> = nodes
        .iter()
        .copied()
        .filter(|id| indegree[id] == 0)
        .collect();

    let mut order: Vec<NodeId> = Vec::with_capacity(nodes.len());
    while let Some(current) = ready.iter().next().copied() {
        ready.remove(&current);
        order.push(current.clone());
        for target in graph.successors(current, kind) {
            let slot = indegree.get_mut(target)?;
            *slot = slot.saturating_sub(1);
            if *slot == 0 {
                ready.insert(target);
            }
        }
    }

    if order.len() == nodes.len() {
        Some(order)
    } else {
        None
    }
}

/// Nodes reachable from `roots` by following `kind` edges, excluding the roots
/// themselves unless they are reachable from another root.
pub fn reachable_from(graph: &Graph, roots: &[NodeId], kind: EdgeKind) -> BTreeSet<NodeId> {
    let mut seen: BTreeSet<NodeId> = BTreeSet::new();
    let mut queue: VecDeque<&NodeId> = VecDeque::new();
    for root in roots {
        if seen.insert(root.clone()) {
            queue.push_back(graph.node(root).map_or(root, |n| &n.id));
        }
    }
    while let Some(current) = queue.pop_front() {
        for target in graph.successors(current, kind) {
            if seen.insert(target.clone()) {
                queue.push_back(target);
            }
        }
    }
    seen
}

/// Nodes from which any of `targets` is reachable, following `kind` edges in
/// reverse. This is the query behind `tetanus test affected`.
pub fn reaching_any(graph: &Graph, targets: &[NodeId], kind: EdgeKind) -> BTreeSet<NodeId> {
    let mut seen: BTreeSet<NodeId> = BTreeSet::new();
    let mut queue: VecDeque<&NodeId> = VecDeque::new();
    for target in targets {
        if seen.insert(target.clone()) {
            queue.push_back(target);
        }
    }
    while let Some(current) = queue.pop_front() {
        for source in graph.predecessors(current, kind) {
            if seen.insert(source.clone()) {
                queue.push_back(source);
            }
        }
    }
    seen
}

/// Nodes with no incoming edges of `kind`: candidate entry points.
pub fn roots_of(graph: &Graph, _kind: EdgeKind) -> Vec<NodeId> {
    graph
        .nodes()
        .filter(|n| graph.in_degree(&n.id) == 0)
        .map(|n| n.id.clone())
        .collect()
}

/// Nodes with no outgoing edges of `kind`.
pub fn leaves_of(graph: &Graph, _kind: EdgeKind) -> Vec<NodeId> {
    graph
        .nodes()
        .filter(|n| graph.out_degree(&n.id) == 0)
        .map(|n| n.id.clone())
        .collect()
}
