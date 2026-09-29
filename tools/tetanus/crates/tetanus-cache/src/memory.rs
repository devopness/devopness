use std::collections::BTreeMap;
use std::sync::RwLock;
use std::sync::atomic::{AtomicU64, Ordering};

use tetanus_core::digest::Digest;
use tetanus_core::error::Result;

use crate::CacheProvider;

/// Process-local cache. Bounded so a long-running analysis cannot grow without
/// limit.
#[derive(Debug, Default)]
pub struct MemoryCache {
    entries: RwLock<BTreeMap<String, Vec<u8>>>,
    hits: AtomicU64,
    misses: AtomicU64,
    capacity: usize,
}

impl MemoryCache {
    pub fn with_capacity(capacity: usize) -> Self {
        Self {
            entries: RwLock::new(BTreeMap::new()),
            hits: AtomicU64::new(0),
            misses: AtomicU64::new(0),
            capacity,
        }
    }

    pub fn effectiveness(&self) -> crate::Effectiveness {
        crate::Effectiveness {
            hits: self.hits.load(Ordering::Relaxed),
            misses: self.misses.load(Ordering::Relaxed),
            entries: self.entries.read().map(|e| e.len()).unwrap_or(0),
        }
    }
}

impl CacheProvider for MemoryCache {
    fn name(&self) -> &'static str {
        "memory"
    }

    fn get(&self, key: &Digest) -> Result<Option<Vec<u8>>> {
        let found = self
            .entries
            .read()
            .ok()
            .and_then(|entries| entries.get(key.as_str()).cloned());
        match found {
            Some(_) => {
                self.hits.fetch_add(1, Ordering::Relaxed);
                Ok(found)
            }
            None => {
                self.misses.fetch_add(1, Ordering::Relaxed);
                Ok(None)
            }
        }
    }

    fn put(&self, key: &Digest, value: &[u8]) -> Result<()> {
        let Ok(mut entries) = self.entries.write() else {
            return Ok(());
        };
        if entries.len() >= self.capacity && !entries.contains_key(key.as_str()) {
            if let Some(oldest) = entries.keys().next().cloned() {
                entries.remove(&oldest);
            }
        }
        entries.insert(key.as_str().to_string(), value.to_vec());
        Ok(())
    }

    fn len(&self) -> Result<usize> {
        Ok(self.entries.read().map(|e| e.len()).unwrap_or(0))
    }
}
