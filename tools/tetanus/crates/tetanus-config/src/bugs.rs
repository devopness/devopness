//! `bugs.toml` — the authoritative register of known defects.
//!
//! `BUGS.md` is a projection of this file, rendered from it and drift-checked
//! against it, for the same reason `CHANGELOG.md` is a projection of
//! `living.toml`: a register that exists in two places is a register that
//! disagrees with itself.
//!
//! This is deliberately *not* `.github/SECURITY.md`. That file is a reporting
//! policy: it tells a finder where to disclose a vulnerability, and it points at
//! an external site. A vulnerability in a dependency is reported to whoever
//! publishes it. A finding in this repository's own source is tracked here,
//! because it is this repository's to fix and nobody upstream will.
//!
//! Every entry records how it was verified, and a finding the analysis could not
//! confirm is recorded as `unconfirmed` rather than dropped. A dead-code report
//! is a prompt to look, so the record has to survive the looking.

use std::collections::BTreeSet;
use std::path::Path;

use serde::{Deserialize, Serialize};
use tetanus_core::error::{Error, Result};

/// What kind of thing this is, which decides who can act on it.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Kind {
    /// A symbol the analysis believes nothing reaches.
    DeadCode,
    /// A structural problem in the module graph.
    Structure,
    /// A defect in the analysis itself, so its findings cannot be trusted.
    Analyzer,
    /// A build or runtime failure reproducible on demand.
    Build,
    /// A weakness in the dependency or install surface.
    SupplyChain,
}

impl Kind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::DeadCode => "dead-code",
            Self::Structure => "structure",
            Self::Analyzer => "analyzer",
            Self::Build => "build",
            Self::SupplyChain => "supply-chain",
        }
    }
}

/// Whether a human confirmed the finding by reading the code, as opposed to it
/// being an unverified report from the analysis.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Confidence {
    /// Reported by the analysis and not yet checked.
    Unconfirmed,
    /// Checked against every reference in the repository; the finding stands.
    Confirmed,
    /// Checked, and the analysis was wrong. Kept so the same false report is
    /// not filed again, and so the analyzer fix is traceable to what it caused.
    Refuted,
}

impl Confidence {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Unconfirmed => "unconfirmed",
            Self::Confirmed => "confirmed",
            Self::Refuted => "refuted",
        }
    }
}

/// How much a finding is allowed to cost the repository.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Severity {
    /// Wrong output. Anything downstream of it is suspect.
    High,
    /// Wrong or absent signal, but nothing downstream breaks.
    Medium,
    /// Worth knowing, no consequence yet.
    Low,
}

impl Severity {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::High => "high",
            Self::Medium => "medium",
            Self::Low => "low",
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Bug {
    pub id: String,
    pub kind: Kind,
    pub severity: Severity,
    pub confidence: Confidence,
    pub status: BugStatus,
    pub summary: String,
    /// What was observed, and how. Kept separate from `summary` because the
    /// summary is what a reader skims and the evidence is what they check.
    pub evidence: String,
    /// Why it is not being fixed now, when that is the case.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rationale: Option<String>,
    pub location: BTreeSet<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum BugStatus {
    Open,
    Fixed,
    Accepted,
}

impl BugStatus {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Open => "open",
            Self::Fixed => "fixed",
            Self::Accepted => "accepted",
        }
    }
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Bugs {
    #[serde(default)]
    pub version: u32,
    #[serde(default, rename = "bug")]
    pub bugs: Vec<Bug>,
}

#[derive(Debug)]
pub enum BugsError {
    DuplicateId(String),
}

impl std::fmt::Display for BugsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::DuplicateId(id) => write!(f, "duplicate bug id `{id}`"),
        }
    }
}

impl std::error::Error for BugsError {}

impl Bugs {
    /// The invariants a hand-edited register has to satisfy.
    ///
    /// Checked on load so an invalid register cannot reach a mirror: a `BUGS.md`
    /// rendered from a register with two entries sharing an id would read as one
    /// finding and quietly lose the other.
    pub fn validate(&self) -> std::result::Result<(), BugsError> {
        let mut seen = BTreeSet::new();
        for bug in &self.bugs {
            if !seen.insert(bug.id.as_str()) {
                return Err(BugsError::DuplicateId(bug.id.clone()));
            }
        }
        Ok(())
    }

    pub fn load(path: &Path) -> Result<Self> {
        let text = std::fs::read_to_string(path.join("bugs.toml"))
            .map_err(|e| Error::io(path.join("bugs.toml").display(), e))?;
        let bugs: Self =
            toml::from_str(&text).map_err(|e| Error::config(format!(".tetanus/bugs.toml: {e}")))?;
        bugs.validate()
            .map_err(|e| Error::config(format!(".tetanus/bugs.toml: {e}")))?;
        Ok(bugs)
    }

    pub fn count(&self, status: BugStatus) -> usize {
        self.bugs.iter().filter(|b| b.status == status).count()
    }
}
