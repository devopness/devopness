//! `theSix` cache provider.
//!
//! theSix is a policy-driven six-tier cache orchestrator. For Tetanus it plays
//! one role: a content-addressed store for parse results, sitting between the
//! AST front ends and the graph backend.
//!
//! Two API details drive the shape of this adapter, and both are the crate's
//! contract rather than a choice made here:
//!
//!   * `CacheManager` is async. `CacheProvider` is sync, because it is called
//!     from the middle of a synchronous analysis walk. The two are bridged by a
//!     dedicated current-thread runtime owned by this module, so the blocking is
//!     confined to one adapter and no runtime leaks into the rest of the system.
//!   * A cache miss is `Err(CacheError::Miss)`, not `Ok(None)`. A miss is a
//!     normal, expected outcome for a content-addressed cache, so it is mapped
//!     to `Ok(None)` rather than being allowed to surface as a failure.
//!
//! Tiers: L4 is a real `sled`-backed store; L0 through L3 and L5 are theSix's
//! stubs, which is where the crate leaves tiers that have no backend wired.
//! Enabling `redis` would give L3 a real backend. Neither is enabled by default:
//! an analysis run must not require a running server to be correct.
//!
//! L4 is used even though it cannot be read back cold, because a write that
//! cannot be read back is worse than no cache at all: it looks like it is
//! working.
//!
//! Correctness rule, unchanged from the trait: a hit must never return a stale
//! value. The key is the content digest of the input plus the parser version,
//! so a stale hit is unreachable by construction.
//!
//! ## What this provider can and cannot do
//!
//! theSix is a policy-driven, in-process, memory-first cache orchestrator. Its
//! `Cachelito` control index is process-local, and `CacheManager::get` consults
//! that index alone: if the entry is not `Ready` in `Cachelito`, it returns
//! `Miss` without ever asking a tier. There is no cold-start path that
//! enumerates what a lower tier already holds.
//!
//! This was measured, not assumed, and the results are worth recording:
//!
//! ```text
//! set via manager, then reopen manager, then get  -> Err(Miss)
//! set via manager, then reopen manager, get_or_fetch -> Err(Timeout)
//! set via manager, then reopen L4SledBackend, get   -> Ok(Some(bytes))
//! ```
//!
//! The bytes are on disk. The manager simply cannot reach them on a cold start.
//!
//! So this provider is a *within-run accelerator*, not the persistence layer. It
//! is genuinely useful for that: single-flight population prevents a
//! stampede when many callers miss the same key, policy routing is explicit
//! rather than positional, and tier health tracking can trip a circuit on a
//! failing tier instead of failing the whole analysis.
//!
//! It is not the provider that survives a restart. Cross-run persistence is the
//! [`crate::FilesystemCache`], which addresses entries by content digest and so
//! is trivially discoverable. `.tetanus/cache.toml` therefore defaults to
//! `filesystem`, and `the_six` is opt-in behind a cargo feature.

use std::path::Path;
use std::sync::Arc;

use tetanus_core::digest::Digest;
use tetanus_core::error::{Error, Result};

use crate::CacheProvider;

type Manager = thesix::CacheManager<String, Vec<u8>, ContentAddressedPolicy>;

/// Routes every operation to the persistent L4 tier.
///
/// `DefaultPolicy` sends writes to L1, which is a stub in this wiring, so every
/// entry would be discarded and the cache would be a no-op that still reported
/// hits. Policy selection is theSix's intended extension point, and this cache
/// has exactly one requirement that the default does not meet: a value written
/// under a content digest must still be there next run, or the graph stops being
/// reconstructable from repository state plus cache.
///
/// Promotion and demotion are deliberately not used. Tiering exists to trade
/// latency against capacity; a content-addressed store has no hot/cold split,
/// because "hot" is not a property of the key, it is a property of when it was
/// last read.
struct ContentAddressedPolicy;

impl thesix::CachePolicy<String, Vec<u8>> for ContentAddressedPolicy {
    fn select(
        &self,
        request: &thesix::CacheRequest<String, Vec<u8>>,
        _state: &thesix::CacheState,
        _identity: &thesix::IdentityContext,
    ) -> thesix::PolicyDecision {
        let mut decision = thesix::PolicyDecision::allow(thesix::TierId::L4);
        decision.operation = request.operation;
        decision
    }
}

/// Tenant identity recorded on every cache operation.
///
/// theSix keys policy decisions on an identity context. A repository analysis
/// has no user, so this is a fixed, non-privileged principal. It is a constant
/// rather than a random value because a random principal would make cache
/// entries unreachable between runs, which is the same as having no cache.
const PRINCIPAL: &str = "tetanus";
const TENANT: &str = "devopness";
const ROLES: [&str; 1] = ["tetanus"];

/// Debug is manual: `CacheManager` holds a tier registry and a pool, neither of
/// which implements `Debug`, and neither is useful to print.
impl std::fmt::Debug for TheSixCache {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("TheSixCache")
            .field("tiers", &"L4=sled, L0-L3/L5=stub")
            .finish()
    }
}

pub struct TheSixCache {
    manager: Arc<Manager>,
    context: thesix::CacheContext,
    runtime: tokio::runtime::Runtime,
}

impl TheSixCache {
    /// Open the cache, backing L4 with a `sled` store under `root`.
    pub fn open(root: &Path) -> Result<Self> {
        let store = root.join("thesix");
        std::fs::create_dir_all(&store).map_err(|e| Error::io(store.display(), e))?;

        let disk: Arc<dyn thesix::CacheTier<Vec<u8>>> = Arc::new(
            thesix::L4SledBackend::<Vec<u8>>::open(&store)
                .map_err(|e| Error::config(format!("could not open theSix L4 store: {e:?}")))?,
        );

        let tiers: Vec<Arc<dyn thesix::CacheTier<Vec<u8>>>> = vec![
            Arc::new(thesix::L0Stub::new()),
            Arc::new(thesix::L1Stub::new()),
            Arc::new(thesix::L2Stub::new()),
            Arc::new(thesix::L3Stub::new()),
            disk,
            Arc::new(thesix::L5Stub::new()),
        ];

        let pool = thesix::MemoryPool::new(1024)
            .map_err(|e| Error::config(format!("could not allocate theSix memory pool: {e:?}")))?;

        let manager = Arc::new(thesix::CacheManager::new(
            ContentAddressedPolicy,
            thesix::Cachelito::new(),
            thesix::TierRegistry::new(),
            tiers,
            pool,
        ));

        let context = thesix::CacheContext::new(thesix::IdentityContext::new(
            PRINCIPAL.to_string(),
            ROLES.iter().map(|r| (*r).to_string()).collect(),
            TENANT.to_string(),
        ));

        let runtime = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .map_err(|e| Error::config(format!("could not build theSix runtime: {e}")))?;

        Ok(Self {
            manager,
            context,
            runtime,
        })
    }

    fn is_miss(error: &thesix::CacheError) -> bool {
        matches!(error, thesix::CacheError::Miss)
    }
}

impl CacheProvider for TheSixCache {
    fn name(&self) -> &'static str {
        "the_six"
    }

    fn get(&self, key: &Digest) -> Result<Option<Vec<u8>>> {
        let manager = Arc::clone(&self.manager);
        let context = self.context.clone();
        let key = key.as_str().to_string();

        self.runtime.block_on(async move {
            match manager.get(&key, &context).await {
                Ok(value) => Ok(value),
                Err(e) if Self::is_miss(&e) => Ok(None),
                Err(e) => Err(Error::Other(format!("theSix get failed: {e:?}"))),
            }
        })
    }

    fn put(&self, key: &Digest, value: &[u8]) -> Result<()> {
        let manager = Arc::clone(&self.manager);
        let context = self.context.clone();
        let key = key.as_str().to_string();
        let value = value.to_vec();

        self.runtime.block_on(async move {
            manager
                .set(&key, value, &context)
                .await
                .map_err(|e| Error::Other(format!("theSix set failed: {e:?}")))
        })
    }

    fn len(&self) -> Result<usize> {
        // theSix exposes membership per key, not a cardinality. Reporting a
        // fabricated count would make the cache-effectiveness ratchet measure
        // its own assumption, so this reports what is actually knowable.
        Ok(0)
    }
}

#[cfg(all(test, feature = "the_six"))]
mod tests {
    use super::*;
    use crate::Cache;

    fn provider(dir: &Path) -> TheSixCache {
        TheSixCache::open(dir).expect("theSix cache opens")
    }

    #[test]
    fn round_trips_a_value() {
        let dir = tempfile::tempdir().expect("tempdir");
        let cache = provider(dir.path());

        assert_eq!(cache.get(&Digest::of_str("absent")).expect("get"), None);

        let key = Digest::of_str("payload");
        cache.put(&key, b"parsed module").expect("put");

        assert_eq!(
            cache.get(&key).expect("get"),
            Some(b"parsed module".to_vec())
        );
    }

    #[test]
    fn a_hit_matches_the_key_not_the_insertion_order() {
        let dir = tempfile::tempdir().expect("tempdir");
        let cache = provider(dir.path());

        let first = Digest::of_str("first");
        let second = Digest::of_str("second");
        cache.put(&first, b"one").expect("put");
        cache.put(&second, b"two").expect("put");

        assert_eq!(cache.get(&first).expect("get"), Some(b"one".to_vec()));
        assert_eq!(cache.get(&second).expect("get"), Some(b"two".to_vec()));
    }

    /// Pins the documented limitation, so a future change that quietly makes
    /// theSix durable, or that quietly makes this provider the default, has to
    /// confront the difference rather than discover it in production.
    #[test]
    fn does_not_survive_a_restart() {
        let dir = tempfile::tempdir().expect("tempdir");
        let key = Digest::of_str("persisted");

        {
            let cache = provider(dir.path());
            cache.put(&key, b"value").expect("put");
            assert_eq!(cache.get(&key).expect("get"), Some(b"value".to_vec()));
        }

        // A fresh manager misses, because Cachelito is process-local and get
        // never consults a tier for an entry its index does not know about.
        // The bytes are on disk; the manager cannot reach them.
        let reopened = provider(dir.path());
        assert_eq!(
            reopened.get(&key).expect("get"),
            None,
            "theSix is expected to be process-local; if this now passes, \
             theSix gained a cold-start path and the default provider in \
             .tetanus/cache.toml should be reconsidered"
        );
    }

    /// The value this provider is actually for: repeated reads inside one run.
    #[test]
    fn serves_repeated_reads_within_a_process() {
        let dir = tempfile::tempdir().expect("tempdir");
        let cache = provider(dir.path());
        let key = Digest::of_str("hot");

        assert_eq!(cache.get(&key).expect("get"), None);
        cache
            .put(&key, b"parsed once, read many times")
            .expect("put");
        for _ in 0..8 {
            assert_eq!(
                cache.get(&key).expect("get"),
                Some(b"parsed once, read many times".to_vec())
            );
        }
    }

    #[test]
    fn resolves_as_a_named_provider() {
        let dir = tempfile::tempdir().expect("tempdir");
        let cache = Cache::resolve("the_six", dir.path()).expect("resolve");
        assert_eq!(cache.name(), "the_six");
    }

    #[test]
    fn an_unknown_provider_is_a_configuration_error() {
        let dir = tempfile::tempdir().expect("tempdir");
        assert!(Cache::resolve("memcached", dir.path()).is_err());
    }
}
