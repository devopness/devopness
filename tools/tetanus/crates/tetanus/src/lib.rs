//! Tetanus: the internal engineering substrate for the Devopness repository.
//!
//! Not a product. Not published. It reads repository state, builds a
//! deterministic graph of it, and enforces the invariants declared in
//! `.tetanus/`.

pub mod bugs_render;
pub mod cli;
pub mod living_render;
pub mod ratchet;
pub mod specs;
pub mod testgraph;
pub mod workspace;
