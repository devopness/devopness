//! Ratchet burn-down semantics.
//!
//! The anti-regression guarantee is structural rather than social:
//!
//! 1. Every ratchet stores a `metric_hash` — the digest of its *definition*.
//!    Redefining what a metric means changes the hash, which invalidates the
//!    stored baseline and forces a re-baseline. A metric cannot be quietly
//!    redefined to make a regression disappear.
//! 2. A baseline may only be relaxed through an explicit `[[exception]]` that
//!    carries a reason and an expiry.
//! 3. A metric that could not be collected is `Unknown`, and `Unknown` is a
//!    failure. There is no path from "could not measure" to "pass".

use std::collections::BTreeMap;
use std::path::Path;

use serde::{Deserialize, Serialize};
use tetanus_core::digest::Digest;
use tetanus_core::error::{Error, Result};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Direction {
    /// A regression is a decrease. Coverage, test count, precision.
    Min,
    /// A regression is an increase. Duration, complexity, dependency count.
    Max,
}

impl Direction {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Min => "min",
            Self::Max => "max",
        }
    }
}

impl std::str::FromStr for Direction {
    type Err = Error;

    fn from_str(value: &str) -> Result<Self> {
        match value {
            "min" => Ok(Self::Min),
            "max" => Ok(Self::Max),
            other => Err(Error::config(format!(
                "unknown ratchet direction {other:?}; expected \"min\" or \"max\""
            ))),
        }
    }
}

/// One tracked metric and its committed baseline.
/// The unit a burn-down step is measured in.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Period {
    Day,
    Week,
    Month,
    Quarter,
}

impl Period {
    /// Nominal length in days.
    ///
    /// Months are given their nominal length rather than their real one. A
    /// schedule measured in calendar months has to be predictable when written
    /// down, and using 28 days for a "month" would under-charge a long month
    /// while using 31 would over-charge a short one. Thirty is the flat rate, and
    /// the deadline is the backstop for the drift that leaves.
    pub fn days(self) -> i64 {
        match self {
            Self::Day => 1,
            Self::Week => 7,
            Self::Month => 30,
            Self::Quarter => 90,
        }
    }

    pub fn as_str(self) -> &'static str {
        match self {
            Self::Day => "day",
            Self::Week => "week",
            Self::Month => "month",
            Self::Quarter => "quarter",
        }
    }
}

/// A commitment that a baseline must reach a target by a deadline, at a fixed
/// rate.
///
/// Without this a ratchet is a freeze: it stops new violations and then holds
/// the existing ones forever. `baseline` says where the number may not go, and
/// says nothing about it ever having to move. That is enough to adopt a rule
/// over existing code and not enough to pay off the debt the rule found, which
/// is the situation that makes a large legacy count worthless as a gate.
///
/// The schedule is anchored to `from` and `started_at`, not to the current
/// `baseline`. Anchoring to the baseline would make progress self-defeating:
/// lowering the baseline would restart the clock and hand the debt another full
/// schedule, so the fastest way to fail would also be the only way to pass.
#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Burndown {
    /// The ceiling when the schedule began. Immutable: see the type docs.
    pub from: f64,
    /// How much the ceiling falls per period. Must be positive.
    pub step: f64,
    #[serde(default = "default_period")]
    pub per: Period,
    /// `YYYY-MM-DD` the schedule began.
    pub started_at: String,
    /// `YYYY-MM-DD` by which the target must be met. Optional, but a schedule
    /// without one can be extended indefinitely, which is the freeze again.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deadline: Option<String>,
}

fn default_period() -> Period {
    Period::Week
}

impl Burndown {
    /// The ceiling this ratchet must satisfy on `today`.
    ///
    /// Never falls below the ratchet's target: a schedule that overshoots must
    /// not demand the impossible, and the target is the floor of the commitment.
    pub fn ceiling_on(&self, today: crate::date::Date, target: Option<f64>) -> f64 {
        let start = match crate::date::Date::parse(&self.started_at) {
            Some(d) => d.epoch_day(),
            // Validated on load, so unreachable in practice. Defaulting to the
            // start keeps an unvalidated schedule from demanding an arbitrary
            // reduction rather than silently passing.
            None => return self.from,
        };
        let elapsed_days = (today.epoch_day() - start).max(0);
        let periods = elapsed_days / self.per.days();
        let required = self.from - self.step * periods as f64;
        match target {
            Some(t) => required.max(t),
            None => required,
        }
    }

    /// Complete periods that have elapsed, for reporting.
    pub fn periods_elapsed(&self, today: crate::date::Date) -> i64 {
        let Some(start) = crate::date::Date::parse(&self.started_at) else {
            return 0;
        };
        ((today.epoch_day() - start.epoch_day()).max(0)) / self.per.days()
    }

    pub fn deadline_date(&self) -> Option<crate::date::Date> {
        self.deadline.as_deref().and_then(crate::date::Date::parse)
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Ratchet {
    pub id: String,
    pub metric: String,
    /// Digest of the metric definition. See module docs.
    pub metric_hash: String,
    pub direction: Direction,
    pub baseline: f64,
    /// Allowed movement in the non-regressing direction before a violation.
    #[serde(default)]
    pub tolerance: f64,
    #[serde(default)]
    pub target: Option<f64>,
    /// The schedule this baseline is committed to reaching its target by.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub burndown: Option<Burndown>,
    #[serde(default)]
    pub unit: Option<String>,
    /// Git revision the baseline was captured at.
    #[serde(default)]
    pub measured_from: Option<String>,
    #[serde(default)]
    pub captured_at: Option<String>,
    #[serde(default)]
    pub description: Option<String>,
}

impl Ratchet {
    /// Digest pinning the definition of the metric this ratchet guards.
    ///
    /// Derived from the metric name and its declared semantics, so two
    /// ratchets over the same metric share a hash and cannot drift apart
    /// silently.
    pub fn definition_digest(metric: &str, direction: Direction) -> Digest {
        Digest::of_iter([metric, direction.as_str(), "tetanus-ratchet-v1"])
    }

    pub fn definition_hash(&self) -> String {
        Self::definition_digest(&self.metric, self.direction)
            .as_str()
            .to_string()
    }

    /// Compare a measurement against the baseline.
    ///
    /// `tolerance` widens the acceptable band rather than producing a fourth
    /// verdict, so the taxonomy stays closed at improvement / regression /
    /// invariant. Movement inside the band is `Invariant` even if it went the
    /// wrong way, because the ratchet has explicitly said that this much
    /// movement is acceptable.
    pub fn evaluate(&self, measured: f64) -> Verdict {
        let delta = measured - self.baseline;
        let bound = self.baseline
            + match self.direction {
                Direction::Min => -self.tolerance,
                Direction::Max => self.tolerance,
            };

        let regressed = match self.direction {
            Direction::Max => measured > bound,
            Direction::Min => measured < bound,
        };
        let verdict = if regressed {
            VerdictKind::Regression
        } else if delta > 0.0 {
            match self.direction {
                Direction::Min => VerdictKind::Improvement,
                Direction::Max => VerdictKind::Invariant,
            }
        } else if delta < 0.0 {
            match self.direction {
                Direction::Min => VerdictKind::Invariant,
                Direction::Max => VerdictKind::Improvement,
            }
        } else {
            VerdictKind::Invariant
        };

        Verdict {
            ratchet: self.id.clone(),
            metric: self.metric.clone(),
            direction: self.direction,
            baseline: self.baseline,
            measured,
            delta,
            verdict,
        }
    }
}

/// An explicitly accepted deviation from a ratchet baseline.
#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Exception {
    pub ratchet: String,
    pub reason: String,
    /// RFC 3339 date after which the exception stops applying and the
    /// underlying regression fails again.
    pub expires: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum VerdictKind {
    Improvement,
    Regression,
    Invariant,
    Unknown,
    Exception,
}

impl VerdictKind {
    pub fn is_failure(self) -> bool {
        matches!(self, Self::Regression | Self::Unknown)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Verdict {
    pub ratchet: String,
    pub metric: String,
    pub direction: Direction,
    pub baseline: f64,
    pub measured: f64,
    pub delta: f64,
    pub verdict: VerdictKind,
}

/// A burn-down schedule has to be executable, not merely present.
///
/// Every field here can be written in a way that looks like a commitment and
/// enforces nothing, and each check below closes one of those. A schedule that
/// cannot be evaluated is rejected at load rather than at check time, so a
/// malformed one can never be observed as a pass.
fn validate_burndown(id: &str, schedule: &Burndown, target: Option<f64>) -> Result<()> {
    if schedule.step.is_nan() || schedule.step <= 0.0 {
        return Err(Error::config(format!(
            "ratchet {id:?} has a burn-down step of {}; a step of zero or less never reduces anything",
            schedule.step
        )));
    }
    let Some(start) = crate::date::Date::parse(&schedule.started_at) else {
        return Err(Error::config(format!(
            "ratchet {id:?} has a burn-down started_at of {:?}, which is not a YYYY-MM-DD date",
            schedule.started_at
        )));
    };
    let today = crate::date::Date::today();
    if start.epoch_day() > today.epoch_day() {
        return Err(Error::config(format!(
            "ratchet {id:?} has a burn-down that starts on {}, which is in the future",
            schedule.started_at
        )));
    }
    if schedule.deadline.is_none() {
        return Err(Error::config(format!(
            "ratchet {id:?} has a burn-down with no deadline; a schedule that can be extended without limit is a freeze, not a burn-down"
        )));
    }
    let Some(deadline) = schedule.deadline_date() else {
        return Err(Error::config(format!(
            "ratchet {id:?} has a burn-down deadline of {:?}, which is not a YYYY-MM-DD date",
            schedule.deadline.clone().unwrap_or_default()
        )));
    };
    if deadline.epoch_day() < start.epoch_day() {
        return Err(Error::config(format!(
            "ratchet {id:?} has a burn-down deadline {} before its start {}",
            schedule.deadline.clone().unwrap_or_default(),
            schedule.started_at
        )));
    }
    // A schedule with no target has nothing to burn down to, and no deadline
    // can be extended without limit, which is the freeze this type exists to
    // replace.
    let Some(goal) = target else {
        return Err(Error::config(format!(
            "ratchet {id:?} has a burn-down but no target for it to reach"
        )));
    };
    if goal > schedule.from {
        return Err(Error::config(format!(
            "ratchet {id:?} burns down from {} to a target of {goal}, which is not an improvement",
            schedule.from
        )));
    }
    // The schedule has to be able to finish. Discovering it cannot on the
    // deadline is discovering it too late.
    let available = deadline.epoch_day() - start.epoch_day();
    let periods = (available / schedule.per.days()).max(1);
    let reachable = schedule.from - schedule.step * periods as f64;
    if reachable > goal {
        return Err(Error::config(format!(
            "ratchet {id:?} cannot reach its target of {goal}: from {} at {} per {} over {} days it only reaches {reachable}, so it misses by {}",
            schedule.from,
            schedule.step,
            schedule.per.as_str(),
            available,
            reachable - goal
        )));
    }
    Ok(())
}

/// The outcome of comparing a ratchet against its burn-down schedule today.
#[derive(Debug, Clone, PartialEq)]
pub enum Trajectory {
    /// The baseline is at or below what the schedule requires.
    OnTrack { ceiling: f64 },
    /// The baseline is above the current ceiling. A step was missed.
    Behind { ceiling: f64 },
    /// The deadline has passed and the ceiling is still unmet.
    Overdue { ceiling: f64 },
}

/// Compare a ratchet against its schedule, or `None` when it has no schedule.
pub fn assess_trajectory(ratchet: &Ratchet, today: crate::date::Date) -> Option<Trajectory> {
    let schedule = ratchet.burndown.as_ref()?;
    let ceiling = schedule.ceiling_on(today, ratchet.target);
    if ratchet.baseline > ceiling {
        let overdue = schedule
            .deadline_date()
            .is_some_and(|d| today.epoch_day() > d.epoch_day());
        return Some(if overdue {
            Trajectory::Overdue { ceiling }
        } else {
            Trajectory::Behind { ceiling }
        });
    }
    Some(Trajectory::OnTrack { ceiling })
}

/// The committed `.tetanus/baseline.toml`.
#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct RatchetFile {
    #[serde(default = "default_version")]
    pub version: u32,
    #[serde(default)]
    pub ratchet: Vec<Ratchet>,
    #[serde(default)]
    pub exception: Vec<Exception>,
}

fn default_version() -> u32 {
    1
}

impl RatchetFile {
    pub fn load(path: &Path) -> Result<Self> {
        if !path.exists() {
            return Ok(Self {
                version: 1,
                ratchet: Vec::new(),
                exception: Vec::new(),
            });
        }
        let text =
            std::fs::read_to_string(path).map_err(|e| Error::io(path.display().to_string(), e))?;
        let file: Self = toml::from_str(&text)
            .map_err(|e| Error::parse(path.display().to_string(), e.to_string()))?;
        file.validate()?;
        Ok(file)
    }

    pub fn render(&self) -> String {
        toml::to_string_pretty(self).expect("ratchet file is serialisable")
    }

    pub fn validate(&self) -> Result<()> {
        if self.version != 1 {
            return Err(Error::config(format!(
                "unsupported baseline.toml version {}",
                self.version
            )));
        }
        let mut seen = std::collections::BTreeSet::new();
        for ratchet in &self.ratchet {
            if !seen.insert(ratchet.id.clone()) {
                return Err(Error::config(format!(
                    "duplicate ratchet id {:?} in baseline",
                    ratchet.id
                )));
            }
            if ratchet.tolerance < 0.0 {
                return Err(Error::config(format!(
                    "ratchet {:?} has a negative tolerance",
                    ratchet.id
                )));
            }
            if let Some(target) = ratchet.target {
                let progressed = match ratchet.direction {
                    Direction::Min => target > ratchet.baseline,
                    Direction::Max => target < ratchet.baseline,
                };
                if !progressed {
                    return Err(Error::config(format!(
                        "ratchet {:?} has a target ({target}) that is not beyond its baseline ({}) in the {} direction",
                        ratchet.id,
                        ratchet.baseline,
                        ratchet.direction.as_str()
                    )));
                }
            }
            if let Some(schedule) = &ratchet.burndown {
                validate_burndown(&ratchet.id, schedule, ratchet.target)?;
            }
        }
        for exception in &self.exception {
            if exception.reason.trim().is_empty() {
                return Err(Error::config(format!(
                    "exception for ratchet {:?} has an empty reason",
                    exception.ratchet
                )));
            }
            if exception.expires.trim().is_empty() {
                return Err(Error::config(format!(
                    "exception for ratchet {:?} has no expiry; exceptions must expire",
                    exception.ratchet
                )));
            }
            if !self.ratchet.iter().any(|r| r.id == exception.ratchet) {
                return Err(Error::config(format!(
                    "exception references unknown ratchet {:?}",
                    exception.ratchet
                )));
            }
        }
        Ok(())
    }

    pub fn exceptions_for(&self, ratchet_id: &str) -> Vec<&Exception> {
        self.exception
            .iter()
            .filter(|e| e.ratchet == ratchet_id)
            .collect()
    }

    /// Map of ratchet id to its stored metric definition hash.
    pub fn definition_hashes(&self) -> BTreeMap<&str, &str> {
        self.ratchet
            .iter()
            .map(|r| (r.id.as_str(), r.metric_hash.as_str()))
            .collect()
    }

    /// Reject baselines whose metric definition no longer matches.
    ///
    /// This is the check that stops "lower the baseline to go green" from
    /// working by changing what the metric counts.
    pub fn validate_definition_hashes(&self) -> Vec<String> {
        let mut problems = Vec::new();
        for ratchet in &self.ratchet {
            let expected = ratchet.definition_hash();
            if ratchet.metric_hash != expected {
                problems.push(format!(
                    "ratchet {:?} guards metric {:?} but its recorded definition hash {} does not match the current definition {}; \
                     the metric was redefined, so its baseline must be re-captured rather than reused",
                    ratchet.id, ratchet.metric, ratchet.metric_hash, expected
                ));
            }
        }
        problems
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn ratchet(direction: Direction, baseline: f64) -> Ratchet {
        Ratchet {
            id: "unused_exports".into(),
            metric: "unused_exports".into(),
            metric_hash: Ratchet::definition_digest("unused_exports", direction)
                .as_str()
                .to_string(),
            direction,
            baseline,
            tolerance: 0.0,
            target: None,
            burndown: None,
            unit: None,
            measured_from: None,
            captured_at: None,
            description: None,
        }
    }

    #[test]
    fn max_direction_treats_increase_as_regression() {
        let r = ratchet(Direction::Max, 100.0);
        assert_eq!(r.evaluate(100.0).verdict, VerdictKind::Invariant);
        assert_eq!(r.evaluate(90.0).verdict, VerdictKind::Improvement);
        assert_eq!(r.evaluate(101.0).verdict, VerdictKind::Regression);
    }

    #[test]
    fn min_direction_treats_decrease_as_regression() {
        let r = ratchet(Direction::Min, 80.0);
        assert_eq!(r.evaluate(80.0).verdict, VerdictKind::Invariant);
        assert_eq!(r.evaluate(85.0).verdict, VerdictKind::Improvement);
        assert_eq!(r.evaluate(79.0).verdict, VerdictKind::Regression);
    }

    #[test]
    fn tolerance_absorbs_small_movement_without_relabelling_it() {
        let mut r = ratchet(Direction::Max, 100.0);
        r.tolerance = 2.0;
        assert_eq!(r.evaluate(98.0).verdict, VerdictKind::Improvement);
        assert_eq!(r.evaluate(101.0).verdict, VerdictKind::Invariant);
        assert_eq!(r.evaluate(103.0).verdict, VerdictKind::Regression);

        let mut r = ratchet(Direction::Min, 100.0);
        r.tolerance = 2.0;
        assert_eq!(r.evaluate(102.0).verdict, VerdictKind::Improvement);
        assert_eq!(r.evaluate(99.0).verdict, VerdictKind::Invariant);
        assert_eq!(r.evaluate(97.0).verdict, VerdictKind::Regression);
    }

    #[test]
    fn delta_is_reported_against_the_baseline() {
        let r = ratchet(Direction::Max, 100.0);
        assert_eq!(r.evaluate(90.0).delta, -10.0);
        let r = ratchet(Direction::Min, 100.0);
        assert_eq!(r.evaluate(110.0).delta, 10.0);
    }

    #[test]
    fn redefining_a_metric_invalidates_the_baseline() {
        let mut r = ratchet(Direction::Max, 100.0);
        r.metric_hash = Digest::of_str("a different definition")
            .as_str()
            .to_string();
        let file = RatchetFile {
            version: 1,
            ratchet: vec![r],
            exception: vec![],
        };
        let problems = file.validate_definition_hashes();
        assert_eq!(problems.len(), 1);
        assert!(problems[0].contains("redefined"));
    }

    #[test]
    fn exception_without_expiry_is_rejected() {
        let file = RatchetFile {
            version: 1,
            ratchet: vec![ratchet(Direction::Max, 1.0)],
            exception: vec![Exception {
                ratchet: "unused_exports".into(),
                reason: "known false positives".into(),
                expires: "  ".into(),
            }],
        };
        assert!(file.validate().is_err());
    }

    #[test]
    fn target_must_be_beyond_the_baseline() {
        let mut r = ratchet(Direction::Max, 100.0);
        r.target = Some(120.0);
        let file = RatchetFile {
            version: 1,
            ratchet: vec![r],
            exception: vec![],
        };
        assert!(file.validate().is_err());
    }
}

#[cfg(test)]
mod burndown_tests {
    use super::*;
    use crate::date::Date;

    fn schedule(from: f64, step: f64, started: &str, deadline: &str) -> Burndown {
        Burndown {
            from,
            step,
            per: Period::Week,
            started_at: started.to_string(),
            deadline: Some(deadline.to_string()),
        }
    }

    #[test]
    fn ceiling_falls_by_one_step_per_period() {
        let s = schedule(100.0, 10.0, "2026-01-05", "2026-12-31");
        // 2026-01-05 is a Monday; the anchor is that day.
        assert_eq!(
            s.ceiling_on(Date::parse("2026-01-05").unwrap(), Some(0.0)),
            100.0
        );
        assert_eq!(
            s.ceiling_on(Date::parse("2026-01-12").unwrap(), Some(0.0)),
            90.0
        );
        assert_eq!(
            s.ceiling_on(Date::parse("2026-01-19").unwrap(), Some(0.0)),
            80.0
        );
    }

    #[test]
    fn a_partial_period_does_not_reduce() {
        // Forgiving a step for a few days is how a schedule quietly stops
        // meaning anything, so the reduction lands on the period boundary.
        let s = schedule(100.0, 10.0, "2026-01-05", "2026-12-31");
        let six_days = Date::parse("2026-01-11").unwrap();
        assert_eq!(s.ceiling_on(six_days, Some(0.0)), 100.0);
    }

    #[test]
    fn ceiling_never_falls_below_the_target() {
        // A schedule that overshoots must not demand the impossible.
        let s = schedule(20.0, 10.0, "2026-01-05", "2026-12-31");
        let far = Date::parse("2027-06-01").unwrap();
        assert_eq!(s.ceiling_on(far, Some(0.0)), 0.0);
    }

    #[test]
    fn progress_does_not_restart_the_clock() {
        // The reason the schedule anchors to `from` rather than to `baseline`:
        // a baseline lowered by hand must not buy another full schedule.
        let s = schedule(100.0, 10.0, "2026-01-05", "2026-12-31");
        let later = Date::parse("2026-02-02").unwrap();
        // Four weeks elapsed, so 60 is required regardless of what anyone
        // claims the current baseline is.
        assert_eq!(s.ceiling_on(later, Some(0.0)), 60.0);
    }

    #[test]
    fn a_schedule_without_a_deadline_is_rejected() {
        let mut s = schedule(100.0, 10.0, "2026-01-05", "2026-12-31");
        s.deadline = None;
        let err = validate_burndown("x", &s, Some(0.0)).unwrap_err();
        assert!(err.to_string().contains("no deadline"), "got: {err}");
    }

    #[test]
    fn a_zero_step_is_rejected() {
        let s = schedule(100.0, 0.0, "2026-01-05", "2026-12-31");
        let err = validate_burndown("x", &s, Some(0.0)).unwrap_err();
        assert!(err.to_string().contains("never reduces"), "got: {err}");
    }

    #[test]
    fn an_unreachable_target_is_rejected_at_load() {
        // 100 falling 1 per week over 8 weeks reaches 92, not 0.
        let s = schedule(100.0, 1.0, "2026-01-05", "2026-03-01");
        let err = validate_burndown("x", &s, Some(0.0)).unwrap_err();
        assert!(err.to_string().contains("cannot reach"), "got: {err}");
    }

    #[test]
    fn a_burndown_without_a_target_is_rejected() {
        let s = schedule(100.0, 10.0, "2026-01-05", "2026-12-31");
        let err = validate_burndown("x", &s, None).unwrap_err();
        assert!(err.to_string().contains("no target"), "got: {err}");
    }

    #[test]
    fn trajectory_distinguishes_on_track_from_behind_and_overdue() {
        let mut r = Ratchet {
            id: "r".into(),
            metric: "m".into(),
            metric_hash: "h".into(),
            direction: Direction::Max,
            baseline: 100.0,
            tolerance: 0.0,
            target: Some(0.0),
            burndown: None,
            unit: None,
            measured_from: None,
            captured_at: None,
            description: None,
        };
        r.burndown = Some(schedule(100.0, 10.0, "2026-01-05", "2026-03-01"));

        let two_weeks = Date::parse("2026-01-19").unwrap();
        // 100 is fine on day zero, behind at two weeks.
        assert!(matches!(
            assess_trajectory(&r, Date::parse("2026-01-05").unwrap()),
            Some(Trajectory::OnTrack { .. })
        ));
        assert!(matches!(
            assess_trajectory(&r, two_weeks),
            Some(Trajectory::Behind { .. })
        ));
        // And overdue once the deadline has gone, still unmet.
        assert!(matches!(
            assess_trajectory(&r, Date::parse("2026-04-01").unwrap()),
            Some(Trajectory::Overdue { .. })
        ));
        // Reaching the target clears the schedule even after the deadline:
        // the debt was paid, so the deadline has nothing left to enforce.
        r.baseline = 0.0;
        assert!(matches!(
            assess_trajectory(&r, Date::parse("2026-04-01").unwrap()),
            Some(Trajectory::OnTrack { .. })
        ));
    }
}
