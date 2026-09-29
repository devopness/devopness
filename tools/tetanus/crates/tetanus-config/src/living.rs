//! `living.toml` — the single authoritative representation of engineering
//! state.
//!
//! `CHANGELOG.md`, `HANDOVER.md` and `SESSION.md` are projections of this file.
//! They are rendered from it and drift-checked against it. A human editing one
//! of those Markdown files by hand is editing generated output, and
//! `tetanus living check` will say so.

use std::collections::BTreeMap;
use std::path::Path;

use serde::{Deserialize, Serialize};
use tetanus_core::error::{Error, Result};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Phase {
    #[default]
    Discovery,
    Foundation,
    Analysis,
    Enforcement,
    Steady,
}

impl Phase {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Discovery => "discovery",
            Self::Foundation => "foundation",
            Self::Analysis => "analysis",
            Self::Enforcement => "enforcement",
            Self::Steady => "steady",
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Objective {
    pub id: String,
    pub statement: String,
    #[serde(default)]
    pub status: ObjectiveStatus,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ObjectiveStatus {
    #[default]
    Pending,
    Active,
    Done,
    Blocked,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum WorkStatus {
    #[default]
    Active,
    Done,
    Blocked,
    Dropped,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct WorkItem {
    pub id: String,
    pub summary: String,
    #[serde(default)]
    pub status: WorkStatus,
    #[serde(default)]
    pub scope: Vec<String>,
    #[serde(default)]
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Session {
    pub id: String,
    pub date: String,
    pub summary: String,
    #[serde(default)]
    pub scope: Vec<String>,
    #[serde(default)]
    pub touched: Vec<String>,
    #[serde(default)]
    pub ratchet_outcome: BTreeMap<String, String>,
    #[serde(default)]
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Decision {
    pub id: String,
    pub title: String,
    pub status: String,
    pub rationale: String,
    #[serde(default)]
    pub consequences: Vec<String>,
    #[serde(default)]
    pub date: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Blocker {
    pub id: String,
    pub summary: String,
    #[serde(default)]
    pub owner: Option<String>,
    #[serde(default)]
    pub since: Option<String>,
}

/// The canonical engineering state.
#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Living {
    #[serde(default = "default_version")]
    pub version: u32,
    pub project: Project,
    #[serde(default)]
    pub phase: Phase,
    #[serde(default, rename = "objective")]
    pub objectives: Vec<Objective>,
    #[serde(default, rename = "work")]
    pub work: Vec<WorkItem>,
    #[serde(default, rename = "blocker")]
    pub blockers: Vec<Blocker>,
    #[serde(default, rename = "decision")]
    pub decisions: Vec<Decision>,
    #[serde(default, rename = "session")]
    pub session: Vec<Session>,
    #[serde(default)]
    pub artifacts: BTreeMap<String, ArtifactState>,
    #[serde(default)]
    pub handover: Handover,
}

fn default_version() -> u32 {
    1
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Project {
    pub name: String,
    pub cli_name: String,
    pub engineering_substrate: String,
    #[serde(default)]
    pub description: Option<String>,
}

impl Default for Project {
    fn default() -> Self {
        Self {
            name: "devopness".into(),
            cli_name: "devopness".into(),
            engineering_substrate: "tetanus".into(),
            description: None,
        }
    }
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct ArtifactState {
    pub generated_from: String,
    #[serde(default)]
    pub file_count: Option<u64>,
    #[serde(default)]
    pub line_count: Option<u64>,
    #[serde(default)]
    pub updated: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Handover {
    #[serde(default)]
    pub current_focus: Option<String>,
    #[serde(default)]
    pub next_actions: Vec<String>,
    #[serde(default)]
    pub open_questions: Vec<String>,
    #[serde(default)]
    pub cautions: Vec<String>,
}

impl Living {
    pub fn load(path: &Path) -> Result<Self> {
        let text =
            std::fs::read_to_string(path).map_err(|e| Error::io(path.display().to_string(), e))?;
        let living: Self = toml::from_str(&text)
            .map_err(|e| Error::parse(path.display().to_string(), e.to_string()))?;
        living.validate()?;
        Ok(living)
    }

    pub fn validate(&self) -> Result<()> {
        if self.version != 1 {
            return Err(Error::config(format!(
                "unsupported living.toml version {}",
                self.version
            )));
        }
        if self.project.cli_name != "devopness" {
            return Err(Error::config(format!(
                "living.toml declares cli_name {:?}; the user-facing CLI name is \"devopness\" and must not change",
                self.project.cli_name
            )));
        }
        if self.project.engineering_substrate != "tetanus" {
            return Err(Error::config(format!(
                "living.toml declares engineering_substrate {:?}; expected \"tetanus\"",
                self.project.engineering_substrate
            )));
        }
        if self.objectives.is_empty() {
            return Err(Error::config(
                "living.toml declares no objectives; canonical state must record what the project is for",
            ));
        }

        let mut ids = std::collections::BTreeSet::new();
        for item in &self.objectives {
            if !ids.insert(format!("objective:{}", item.id)) {
                return Err(Error::config(format!(
                    "duplicate objective id {:?}",
                    item.id
                )));
            }
        }
        for item in &self.work {
            if !ids.insert(format!("work:{}", item.id)) {
                return Err(Error::config(format!(
                    "duplicate work item id {:?}",
                    item.id
                )));
            }
        }
        for session in &self.session {
            if !ids.insert(format!("session:{}", session.id)) {
                return Err(Error::config(format!(
                    "duplicate session id {:?}",
                    session.id
                )));
            }
        }
        for decision in &self.decisions {
            if !ids.insert(format!("decision:{}", decision.id)) {
                return Err(Error::config(format!(
                    "duplicate decision id {:?}",
                    decision.id
                )));
            }
        }

        for work in &self.work {
            let explained = work
                .notes
                .as_deref()
                .is_some_and(|notes| notes.to_lowercase().contains("block"));
            if work.status == WorkStatus::Blocked && !explained {
                // A blocked item with no explanation is a silent blocker.
                return Err(Error::config(format!(
                    "work item {:?} is blocked but records no reason",
                    work.id
                )));
            }
        }
        Ok(())
    }

    pub fn render(&self) -> String {
        toml::to_string_pretty(self).expect("living state is serialisable")
    }

    pub fn active_work(&self) -> impl Iterator<Item = &WorkItem> {
        self.work.iter().filter(|w| w.status == WorkStatus::Active)
    }

    pub fn latest_session(&self) -> Option<&Session> {
        self.session.iter().max_by(|a, b| a.date.cmp(&b.date))
    }
}
