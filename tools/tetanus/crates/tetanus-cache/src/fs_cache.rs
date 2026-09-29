use std::path::Path;

use tetanus_core::digest::Digest;
use tetanus_core::error::{Error, Result};

use crate::{CacheProvider, shard_for};

/// Content-addressed store on disk.
///
/// The default cache. Requires no external service, survives across runs, and
/// cannot return a wrong value because the key is the content digest itself.
#[derive(Debug, Clone)]
pub struct FilesystemCache {
    root: std::path::PathBuf,
}

impl FilesystemCache {
    pub fn new(root: &Path) -> Result<Self> {
        std::fs::create_dir_all(root).map_err(|e| Error::io(root.display(), e))?;
        Ok(Self {
            root: root.to_path_buf(),
        })
    }

    pub fn root(&self) -> &Path {
        &self.root
    }

    fn entry_path(&self, key: &Digest) -> std::path::PathBuf {
        let hex = key.as_str().rsplit(':').next().unwrap_or("unknown");
        self.root.join(shard_for(key)).join(hex)
    }
}

impl CacheProvider for FilesystemCache {
    fn name(&self) -> &'static str {
        "filesystem"
    }

    fn get(&self, key: &Digest) -> Result<Option<Vec<u8>>> {
        match std::fs::read(self.entry_path(key)) {
            Ok(bytes) => Ok(Some(bytes)),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(None),
            Err(e) => Err(Error::io(self.entry_path(key).display(), e)),
        }
    }

    fn put(&self, key: &Digest, value: &[u8]) -> Result<()> {
        let path = self.entry_path(key);
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent).map_err(|e| Error::io(parent.display(), e))?;
        }
        std::fs::write(&path, value).map_err(|e| Error::io(path.display(), e))
    }

    fn len(&self) -> Result<usize> {
        let mut count = 0usize;
        for entry in walkdir::WalkDir::new(&self.root).into_iter().flatten() {
            if entry.file_type().is_file() {
                count += 1;
            }
        }
        Ok(count)
    }
}
