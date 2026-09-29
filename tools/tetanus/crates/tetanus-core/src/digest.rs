use blake3::Hasher;
use serde::{Deserialize, Serialize};

/// Fixed-width hex digest used for content addressing and metric definition
/// pinning.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct Digest(String);

impl Digest {
    pub fn of_bytes(bytes: &[u8]) -> Self {
        let mut hasher = Hasher::new();
        hasher.update(bytes);
        Self(format!("sha256:{}", hasher.finalize().to_hex()))
    }

    pub fn of_str(value: &str) -> Self {
        Self::of_bytes(value.as_bytes())
    }

    /// Hash an ordered list of parts with an unambiguous separator, so that
    /// `["ab", "c"]` and `["a", "bc"]` never collide.
    pub fn of_iter<'a>(parts: impl IntoIterator<Item = &'a str>) -> Self {
        let mut hasher = Hasher::new();
        for part in parts {
            hasher.update(part.as_bytes());
            hasher.update(&[0x1f]);
        }
        Self(format!("sha256:{}", hasher.finalize().to_hex()))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }

    pub fn short(&self) -> &str {
        let hex = self.0.rsplit(':').next().unwrap_or(&self.0);
        &hex[..hex.len().min(12)]
    }
}

impl std::fmt::Display for Digest {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.0)
    }
}

/// A digest together with the byte length it was computed over, so a cached
/// artifact can be validated without rehashing the whole payload.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ContentDigest {
    pub digest: Digest,
    pub len_bytes: u64,
}

impl ContentDigest {
    pub fn new(bytes: &[u8]) -> Self {
        Self {
            digest: Digest::of_bytes(bytes),
            len_bytes: bytes.len() as u64,
        }
    }
}
