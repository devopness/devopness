use std::fmt;

use serde::{Deserialize, Serialize};

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("configuration error: {0}")]
    Config(String),

    #[error("io error at {path}: {source}")]
    Io {
        path: String,
        #[source]
        source: std::io::Error,
    },

    #[error("parse error in {path}: {message}")]
    Parse { path: String, message: String },

    #[error("invariant violated: {0}")]
    Invariant(String),

    #[error("nondeterminism detected: {0}")]
    Nondeterminism(String),

    #[error("drift detected: {0}")]
    Drift(String),

    #[error("{0}")]
    Other(String),
}

impl Error {
    pub fn io(path: impl std::fmt::Display, source: std::io::Error) -> Self {
        Self::Io {
            path: path.to_string(),
            source,
        }
    }

    pub fn config(message: impl Into<String>) -> Self {
        Self::Config(message.into())
    }

    pub fn parse(path: impl std::fmt::Display, message: impl Into<String>) -> Self {
        Self::Parse {
            path: path.to_string(),
            message: message.into(),
        }
    }
}

#[derive(Debug)]
pub struct Report {
    pub check: String,
    pub status: Status,
    pub findings: Vec<Finding>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Status {
    Pass,
    Fail,
    Unknown,
}

impl Status {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Pass => "pass",
            Self::Fail => "fail",
            Self::Unknown => "unknown",
        }
    }

    pub fn exit_code(self) -> i32 {
        match self {
            Self::Pass => 0,
            Self::Fail | Self::Unknown => 1,
        }
    }
}

impl fmt::Display for Status {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Finding {
    pub severity: Severity,
    pub subject: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hint: Option<String>,
}

#[derive(Debug, Clone)]
pub struct ReportBuilder {
    check: String,
    findings: Vec<Finding>,
}

impl ReportBuilder {
    pub fn new(check: impl Into<String>) -> Self {
        Self {
            check: check.into(),
            findings: Vec::new(),
        }
    }

    pub fn fail(&mut self, subject: impl Into<String>, message: impl Into<String>) -> &mut Self {
        self.findings.push(Finding {
            severity: Severity::Error,
            subject: subject.into(),
            message: message.into(),
            hint: None,
        });
        self
    }

    pub fn warn(&mut self, subject: impl Into<String>, message: impl Into<String>) -> &mut Self {
        self.findings.push(Finding {
            severity: Severity::Warning,
            subject: subject.into(),
            message: message.into(),
            hint: None,
        });
        self
    }

    pub fn error_with_hint(
        &mut self,
        subject: impl Into<String>,
        message: impl Into<String>,
        hint: impl Into<String>,
    ) -> &mut Self {
        self.findings.push(Finding {
            severity: Severity::Error,
            subject: subject.into(),
            message: message.into(),
            hint: Some(hint.into()),
        });
        self
    }

    pub fn build(self) -> Report {
        let status = if self.findings.iter().any(|f| f.severity == Severity::Error) {
            Status::Fail
        } else {
            Status::Pass
        };
        Report {
            check: self.check,
            status,
            findings: self.findings,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Severity {
    Warning,
    Error,
}
