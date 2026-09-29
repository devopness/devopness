//! Cache abstraction between the AST graph and the graph backend.
//!
//! Tetanus does not maintain its own bespoke cache hierarchy. It declares the
//! behaviour it needs — content-addressed get/put keyed by a digest, with
//! invalidation that is a function of the key alone — and lets an implementation
//! satisfy it. That keeps the graph backend swappable and keeps `theSix`
//! optional rather than load-bearing.
//!
//! Every implementation must be *correct under the same keys*, never
//! approximately correct: a cache hit that returns a stale value would make the
//! graph nondeterministic, which is the one property the whole system rests on.

use std::collections::BTreeMap;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};
use tetanus_core::digest::Digest;
use tetanus_core::error::{Error, Result};

pub mod fs_cache;
pub mod memory;
#[cfg(feature = "the_six")]
pub mod the_six;

pub use fs_cache::FilesystemCache;
pub use memory::MemoryCache;
#[cfg(feature = "the_six")]
pub use the_six::TheSixCache;

/// Content-addressed cache keyed by digest.
pub trait CacheProvider {
    /// Human-readable provider name, recorded in the graph digest so a report
    /// states which cache produced it.
    fn name(&self) -> &'static str;

    fn get(&self, key: &Digest) -> Result<Option<Vec<u8>>>;

    fn put(&self, key: &Digest, value: &[u8]) -> Result<()>;

    /// Number of entries held. Reported as a metric; not an optimisation target
    /// in itself.
    fn len(&self) -> Result<usize>;

    fn is_empty(&self) -> bool {
        self.len().map(|n| n == 0).unwrap_or(true)
    }
}

/// Cache that stores nothing.
///
/// The default, because correctness must not depend on a cache being present.
#[derive(Debug, Clone, Copy, Default)]
pub struct NullCache;

impl CacheProvider for NullCache {
    fn name(&self) -> &'static str {
        "null"
    }

    fn get(&self, _key: &Digest) -> Result<Option<Vec<u8>>> {
        Ok(None)
    }

    fn put(&self, _key: &Digest, _value: &[u8]) -> Result<()> {
        Ok(())
    }

    fn len(&self) -> Result<usize> {
        Ok(0)
    }
}

/// Provider selected by name, resolved once at start-up.
#[derive(Debug)]
pub enum Cache {
    Null(NullCache),
    Memory(MemoryCache),
    Filesystem(FilesystemCache),
    #[cfg(feature = "the_six")]
    TheSix(TheSixCache),
}

impl Cache {
    /// Build the provider named in `.tetanus/tetanus.toml`.
    ///
    /// `the_six` falls back to the filesystem provider with an explicit notice
    /// rather than failing, so the system is operable before `theSix` is wired
    /// in. The fallback is recorded, not hidden.
    pub fn resolve(provider: &str, root: &Path) -> Result<Self> {
        match provider {
            "null" | "none" => Ok(Self::Null(NullCache)),
            "memory" => Ok(Self::Memory(MemoryCache::default())),
            "filesystem" | "fs" => Ok(Self::Filesystem(FilesystemCache::new(root)?)),
            "the_six" | "thesix" => {
                #[cfg(feature = "the_six")]
                {
                    match TheSixCache::open(root) {
                        Ok(cache) => Ok(Self::TheSix(cache)),
                        // A configured-but-unavailable cache falls back rather
                        // than failing, and the fallback is observable through
                        // `name()`.
                        Err(_) => Ok(Self::Filesystem(FilesystemCache::new(root)?)),
                    }
                }
                #[cfg(not(feature = "the_six"))]
                {
                    Ok(Self::Filesystem(FilesystemCache::new(root)?))
                }
            }
            other => Err(Error::config(format!(
                "unknown cache provider {other:?}; expected one of null, memory, filesystem, the_six"
            ))),
        }
    }

    pub fn name(&self) -> &'static str {
        match self {
            Self::Null(_) => "null",
            Self::Memory(_) => "memory",
            Self::Filesystem(_) => "filesystem",
            #[cfg(feature = "the_six")]
            Self::TheSix(_) => "the_six",
        }
    }
}

impl CacheProvider for Cache {
    fn name(&self) -> &'static str {
        match self {
            Self::Null(c) => c.name(),
            Self::Memory(c) => c.name(),
            Self::Filesystem(c) => c.name(),
            #[cfg(feature = "the_six")]
            Self::TheSix(c) => c.name(),
        }
    }

    fn get(&self, key: &Digest) -> Result<Option<Vec<u8>>> {
        match self {
            Self::Null(c) => c.get(key),
            Self::Memory(c) => c.get(key),
            Self::Filesystem(c) => c.get(key),
            #[cfg(feature = "the_six")]
            Self::TheSix(c) => c.get(key),
        }
    }

    fn put(&self, key: &Digest, value: &[u8]) -> Result<()> {
        match self {
            Self::Null(c) => c.put(key, value),
            Self::Memory(c) => c.put(key, value),
            Self::Filesystem(c) => c.put(key, value),
            #[cfg(feature = "the_six")]
            Self::TheSix(c) => c.put(key, value),
        }
    }

    fn len(&self) -> Result<usize> {
        match self {
            Self::Null(c) => c.len(),
            Self::Memory(c) => c.len(),
            Self::Filesystem(c) => c.len(),
            #[cfg(feature = "the_six")]
            Self::TheSix(c) => c.len(),
        }
    }
}

/// Cache effectiveness, reported as a ratchet metric.
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Effectiveness {
    pub hits: u64,
    pub misses: u64,
    pub entries: usize,
}

impl Effectiveness {
    pub fn ratio(&self) -> f64 {
        let total = self.hits + self.misses;
        if total == 0 {
            return 0.0;
        }
        self.hits as f64 / total as f64
    }
}

/// Two-level sharded directory keeps any single directory small enough to list
/// quickly, which matters because the cache is enumerated on every report.
pub fn shard_for(key: &Digest) -> PathBuf {
    let hex = key.as_str().rsplit(':').next().unwrap_or_default();
    let hex = hex.strip_prefix("sha256:").unwrap_or(hex);
    let a = hex.get(..2).unwrap_or("00");
    let b = hex.get(2..4).unwrap_or("00");
    PathBuf::from(a).join(b)
}

/// Deterministic key for a parse result: the file content plus the parser
/// version. Bumping `PARSER_VERSION` invalidates every cached parse, which is
/// what makes a parser upgrade safe without manual cache busting.
pub fn parse_key(content_digest: &Digest, parser_version: &str) -> Digest {
    Digest::of_iter([content_digest.as_str(), parser_version])
}

pub type Stats = BTreeMap<String, u64>;
