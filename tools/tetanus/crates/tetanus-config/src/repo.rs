//! Repository path resolution and tracked-file enumeration.

use std::path::{Path, PathBuf};
use std::process::Command;

use tetanus_core::error::{Error, Result};

/// Resolved locations of everything Tetanus reads or writes.
#[derive(Debug, Clone)]
pub struct RepoPaths {
    pub root: PathBuf,
}

impl RepoPaths {
    /// Walk upwards from `start` looking for `.tetanus/tetanus.toml`.
    pub fn discover(start: &Path) -> Result<Self> {
        let mut current = start.canonicalize().unwrap_or_else(|_| start.to_path_buf());
        loop {
            if current.join(".tetanus/tetanus.toml").is_file() {
                return Ok(Self { root: current });
            }
            if !current.pop() {
                return Err(Error::config(format!(
                    "no .tetanus/tetanus.toml found at or above {}",
                    start.display()
                )));
            }
        }
    }

    pub fn tetanus_dir(&self) -> PathBuf {
        self.root.join(".tetanus")
    }

    pub fn tetanus_toml(&self) -> PathBuf {
        self.tetanus_dir().join("tetanus.toml")
    }

    pub fn generated_toml(&self) -> PathBuf {
        self.tetanus_dir().join("generated.toml")
    }

    pub fn baseline_toml(&self) -> PathBuf {
        self.tetanus_dir().join("baseline.toml")
    }

    pub fn specs_dir(&self) -> PathBuf {
        self.tetanus_dir().join("specs")
    }

    pub fn spec(&self, name: &str) -> PathBuf {
        self.specs_dir().join(format!("{name}.toml"))
    }

    pub fn living_toml(&self) -> PathBuf {
        self.root.join("living.toml")
    }

    pub fn tests_toml(&self) -> PathBuf {
        self.root.join("testing/tests.toml")
    }

    pub fn cache_dir(&self) -> PathBuf {
        self.tetanus_dir().join("cache")
    }

    pub fn graph_out(&self) -> PathBuf {
        self.tetanus_dir().join("graph.json")
    }

    /// Repository-relative, forward-slash path.
    pub fn relative(&self, path: &Path) -> String {
        let relative = path.strip_prefix(&self.root).unwrap_or(path);
        crate::normalise(&relative.to_string_lossy())
    }

    pub fn absolute(&self, relative: &str) -> PathBuf {
        self.root.join(relative)
    }

    /// Files tracked by git, newline separated, excluding submodules.
    ///
    /// Git is the authority on what exists in the repository; walking the
    /// filesystem instead would pick up build output and untracked scratch
    /// files and make the graph depend on local state.
    pub fn tracked_files(&self) -> Result<Vec<String>> {
        let output = Command::new("git")
            .arg("-C")
            .arg(&self.root)
            .args([
                "ls-files",
                "-z",
                "--cached",
                "--others",
                "--exclude-standard",
            ])
            .output()
            .map_err(|e| Error::io("git ls-files".to_string(), e))?;

        if !output.status.success() {
            return Err(Error::Other(format!(
                "git ls-files failed: {}",
                String::from_utf8_lossy(&output.stderr).trim()
            )));
        }

        let mut files: Vec<String> = String::from_utf8_lossy(&output.stdout)
            .split('\0')
            .filter(|s| !s.is_empty())
            .map(crate::normalise)
            .collect();
        files.sort();
        files.dedup();
        Ok(files)
    }

    /// Files tracked by git that differ from `base`, plus untracked files.
    pub fn changed_files(&self, base: &str) -> Result<Vec<String>> {
        let merge_base = self.merge_base(base)?;
        let output = Command::new("git")
            .arg("-C")
            .arg(&self.root)
            .args(["diff", "--name-only", "-z", &merge_base])
            .output()
            .map_err(|e| Error::io("git diff".to_string(), e))?;

        if !output.status.success() {
            return Err(Error::Other(format!(
                "cannot determine what changed against '{merge_base}': {}. \
                 An unresolvable base means the affected set is unknown, and an unknown \
                 affected set must never be read as an empty one: that would skip every \
                 affected check and report success.",
                String::from_utf8_lossy(&output.stderr).trim()
            )));
        }

        let mut files: Vec<String> = String::from_utf8_lossy(&output.stdout)
            .split('\0')
            .filter(|s| !s.is_empty())
            .map(crate::normalise)
            .collect();
        files.sort();
        files.dedup();
        Ok(files)
    }

    /// Git revision currently checked out, used to pin baselines.
    pub fn head_revision(&self) -> String {
        Command::new("git")
            .arg("-C")
            .arg(&self.root)
            .args(["rev-parse", "HEAD"])
            .output()
            .ok()
            .filter(|o| o.status.success())
            .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
            .unwrap_or_else(|| "unknown".to_string())
    }

    fn merge_base(&self, base: &str) -> Result<String> {
        let output = Command::new("git")
            .arg("-C")
            .arg(&self.root)
            .args(["merge-base", "HEAD", base])
            .output()
            .map_err(|e| Error::io("git merge-base".to_string(), e))?;

        if !output.status.success() {
            return Ok(base.to_string());
        }
        Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
    }
}
