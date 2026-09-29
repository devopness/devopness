//! Just enough date arithmetic to run a burn-down schedule.
//!
//! Deliberately not a date library. A burn-down needs to turn two `YYYY-MM-DD`
//! strings into a whole number of elapsed days and periods, and a dependency
//! that does that would be larger than the code that uses it. What is here is
//! exact for the proleptic Gregorian calendar and testable at the boundaries,
//! which is the standard a scheduling check has to meet: an off-by-one here
//! silently forgives or manufactures a missed step.
//!
//! Times of day are deliberately absent. A schedule that resets at midnight
//! local time makes enforcement depend on the machine, so a day is a day.

/// Days from the Unix epoch to `y-m-d`, or `None` if the date is not real.
///
/// Howard Hinnant's `days_from_civil`, which is exact for the whole range this
/// could plausibly see and does not accumulate error the way stepping month by
/// month would.
pub fn days_from_civil(y: i64, m: i64, d: i64) -> Option<i64> {
    if !(1..=12).contains(&m) || d < 1 {
        return None;
    }
    let leap = |year: i64| year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    let mut days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if leap(y) {
        days_in_month[1] = 29;
    }
    if d > days_in_month[(m - 1) as usize] {
        return None;
    }
    // Shift to a March-based year so the leap day lands at the end and never
    // has to be special-cased partway through.
    let y = if m <= 2 { y - 1 } else { y };
    let era = if y >= 0 { y } else { y - 399 } / 400;
    let yoe = y - era * 400;
    let mp = (m + 9) % 12;
    let doy = (153 * mp + 2) / 5 + d - 1;
    let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    Some(era * 146_097 + doe - 719_468)
}

/// A parsed `YYYY-MM-DD`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Date {
    pub year: i64,
    pub month: i64,
    pub day: i64,
}

impl Date {
    pub fn parse(text: &str) -> Option<Self> {
        let mut parts = text.split('-');
        let year = parts.next()?.parse().ok()?;
        let month = parts.next()?.parse().ok()?;
        let day = parts.next()?.parse().ok()?;
        if parts.next().is_some() || text.len() != 10 {
            return None;
        }
        days_from_civil(year, month, day)?;
        Some(Self { year, month, day })
    }

    /// `YYYY-MM-DD`, the form every date in the configuration uses.
    pub fn to_iso(self) -> String {
        format!("{:04}-{:02}-{:02}", self.year, self.month, self.day)
    }

    /// Midnight UTC on this date, as whole days since the epoch.
    pub fn epoch_day(self) -> i64 {
        days_from_civil(self.year, self.month, self.day).unwrap_or(0)
    }

    /// Today in UTC. The only clock this crate reads.
    ///
    /// UTC rather than local so a schedule does not depend on where the check
    /// runs: the same day is the same day on every machine.
    pub fn today() -> Self {
        let secs = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_secs() as i64)
            .unwrap_or(0);
        from_epoch_day(secs.div_euclid(86_400))
    }
}

fn from_epoch_day(days: i64) -> Date {
    let z = days + 719_468;
    let era = if z >= 0 { z } else { z - 146_096 } / 146_097;
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    Date {
        year: if m <= 2 { y + 1 } else { y },
        month: m,
        day: d,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn iso_round_trips() {
        for text in ["1970-01-01", "2026-09-27", "2099-12-31"] {
            assert_eq!(Date::parse(text).unwrap().to_iso(), text);
        }
    }

    #[test]
    fn round_trips_through_the_epoch() {
        for text in ["1970-01-01", "2000-02-29", "2026-09-27", "2100-03-01"] {
            let d = Date::parse(text).expect("valid");
            assert_eq!(from_epoch_day(d.epoch_day()), d, "{text} round trip");
        }
    }

    #[test]
    fn known_epoch_days_are_exact() {
        assert_eq!(days_from_civil(1970, 1, 1), Some(0));
        assert_eq!(days_from_civil(1970, 1, 2), Some(1));
        assert_eq!(days_from_civil(2000, 3, 1), Some(11017));
    }

    #[test]
    fn rejects_impossible_dates() {
        for text in [
            "2026-02-30",
            "2026-13-01",
            "2026-00-10",
            "2026-1-01",
            "20260101",
            "2026-01-01x",
            "",
        ] {
            assert!(Date::parse(text).is_none(), "{text} should not parse");
        }
    }

    #[test]
    fn century_rules_hold() {
        // 1900 is not a leap year, 2000 is.
        assert!(Date::parse("1900-02-29").is_none());
        assert!(Date::parse("2000-02-29").is_some());
    }

    #[test]
    fn a_leap_day_does_not_shift_the_month_length() {
        let a = Date::parse("2024-02-28").unwrap().epoch_day();
        let b = Date::parse("2024-03-01").unwrap().epoch_day();
        assert_eq!(b - a, 2, "29 Feb exists in 2024");
    }
}
