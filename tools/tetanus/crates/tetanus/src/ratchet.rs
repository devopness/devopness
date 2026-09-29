//! Ratchet evaluation: measure, compare against the baseline, classify.
//!
//! Two rules are enforced here rather than trusted:
//!
//! 1. A metric whose definition hash no longer matches its stored baseline is
//!    `Unknown`, not a pass. A redefined metric has no valid baseline.
//! 2. A metric that could not be measured is `Unknown`, and `Unknown` fails
//!    when `unknown_is_failure` is set. There is no path from "could not
//!    measure" to "pass".

use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};
use tetanus_config::ratchet::{Direction, Ratchet, RatchetFile, Verdict, VerdictKind};

/// One measured metric, before comparison.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Measurement {
    pub metric: String,
    pub value: f64,
    #[serde(default)]
    pub unit: Option<String>,
}

pub type Measurements = BTreeMap<String, f64>;

/// Outcome of evaluating every ratchet in the baseline.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Evaluation {
    pub verdicts: Vec<Verdict>,
    pub exceptions_applied: Vec<String>,
    pub problems: Vec<String>,
}

impl Evaluation {
    pub fn failures(&self) -> Vec<&Verdict> {
        self.verdicts
            .iter()
            .filter(|v| v.verdict.is_failure())
            .collect()
    }

    pub fn improvements(&self) -> Vec<&Verdict> {
        self.verdicts
            .iter()
            .filter(|v| v.verdict == VerdictKind::Improvement)
            .collect()
    }
}

/// Compare measurements against the committed baseline.
pub fn evaluate(
    file: &RatchetFile,
    measurements: &Measurements,
    unknown_is_failure: bool,
    today: &str,
) -> Evaluation {
    let mut verdicts: Vec<Verdict> = Vec::new();
    let mut exceptions_applied: Vec<String> = Vec::new();
    let mut problems: Vec<String> = file.validate_definition_hashes();

    for ratchet in &file.ratchet {
        let definition_ok = ratchet.metric_hash == ratchet.definition_hash();
        // The stale-definition problem is reported once, by
        // `validate_definition_hashes`, rather than again per ratchet below.
        if !definition_ok {
            verdicts.push(Verdict {
                ratchet: ratchet.id.clone(),
                metric: ratchet.metric.clone(),
                direction: ratchet.direction,
                baseline: ratchet.baseline,
                measured: f64::NAN,
                delta: f64::NAN,
                verdict: VerdictKind::Unknown,
            });
            continue;
        }
        let measured = measurements.get(&ratchet.metric).copied();

        let verdict = match (definition_ok, measured) {
            (false, _) => {
                problems.push(format!(
                    "ratchet {:?} guards {:?} but its definition hash no longer matches; \
                     the metric was redefined, so its baseline must be re-captured",
                    ratchet.id, ratchet.metric
                ));
                Verdict {
                    ratchet: ratchet.id.clone(),
                    metric: ratchet.metric.clone(),
                    direction: ratchet.direction,
                    baseline: ratchet.baseline,
                    measured: f64::NAN,
                    delta: f64::NAN,
                    verdict: VerdictKind::Unknown,
                }
            }
            (true, None) => {
                let problem = format!(
                    "ratchet {:?} guards metric {:?}, which was not measured; \
                     a metric that cannot be measured is never a pass",
                    ratchet.id, ratchet.metric
                );
                if unknown_is_failure {
                    problems.push(problem);
                }
                Verdict {
                    ratchet: ratchet.id.clone(),
                    metric: ratchet.metric.clone(),
                    direction: ratchet.direction,
                    baseline: ratchet.baseline,
                    measured: f64::NAN,
                    delta: f64::NAN,
                    verdict: VerdictKind::Unknown,
                }
            }
            (true, Some(value)) => ratchet.evaluate(value),
        };

        if verdict.verdict == VerdictKind::Regression {
            let active: Vec<_> = file
                .exceptions_for(&ratchet.id)
                .into_iter()
                .filter(|e| e.expires.as_str() > today)
                .collect();
            if !active.is_empty() {
                exceptions_applied.push(ratchet.id.clone());
            }
        }

        verdicts.push(verdict);
    }

    Evaluation {
        verdicts,
        exceptions_applied,
        problems,
    }
}

/// Build a baseline from a measurement run.
///
/// Only ratchets whose metric was actually measured are included. A ratchet
/// with no measurement is left out rather than baselined at zero, because a
/// fabricated baseline is exactly the thing this whole mechanism exists to
/// prevent.
pub fn capture(
    definitions: &[(String, String, Direction, Option<String>)],
    measurements: &Measurements,
    revision: &str,
    captured_at: &str,
    previous: &RatchetFile,
) -> RatchetFile {
    let mut ratchets: Vec<Ratchet> = definitions
        .iter()
        .filter_map(|(id, metric, direction, unit)| {
            let value = measurements.get(metric)?;
            // A target and a burn-down schedule are commitments, not measurements.
            // Re-baselining records what the number is now; it must not silently
            // discard where the number is going, or refreshing a baseline would
            // quietly forgive the schedule and there would be no way to tell
            // afterwards that it had been forgiven. Both are carried across, and
            // a schedule that the new baseline has already passed keeps its
            // original anchor so the debt cannot be restarted.
            let prior = previous.ratchet.iter().find(|r| &r.id == id);
            Some(Ratchet {
                id: id.clone(),
                metric: metric.clone(),
                metric_hash: Ratchet::definition_digest(metric, *direction)
                    .as_str()
                    .to_string(),
                direction: *direction,
                baseline: *value,
                tolerance: prior.map_or(0.0, |r| r.tolerance),
                target: prior.and_then(|r| r.target),
                burndown: prior.and_then(|r| r.burndown.clone()),
                unit: unit.clone(),
                measured_from: Some(revision.to_string()),
                captured_at: Some(captured_at.to_string()),
                description: prior.and_then(|r| r.description.clone()),
            })
        })
        .collect();

    ratchets.sort_by(|a, b| a.id.cmp(&b.id));

    RatchetFile {
        version: 1,
        ratchet: ratchets,
        exception: Vec::new(),
    }
}

/// Render a baseline for human review, flagging any ratchet whose recorded
/// value no longer matches its metric definition.
pub fn render_summary(file: &RatchetFile) -> String {
    let mut out = String::from("| Ratchet | Metric | Direction | Baseline | Definition |\n");
    out.push_str("| --- | --- | --- | --- | --- |\n");
    for ratchet in &file.ratchet {
        let definition = if ratchet.metric_hash == ratchet.definition_hash() {
            "current"
        } else {
            "**stale — re-capture required**"
        };
        out.push_str(&format!(
            "| `{}` | `{}` | {} | {} | {} |\n",
            ratchet.id,
            ratchet.metric,
            ratchet.direction.as_str(),
            ratchet.baseline,
            definition
        ));
    }
    out
}
