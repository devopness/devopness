//! Checking the subsystem specs against the implementation.
//!
//! `.tetanus/specs/*.toml` is the declared contract for each subsystem, and
//! nothing else in the toolchain reads it. `living check`, `bugs check` and
//! `classify` each have a drift check; the specs had none, so a spec was only as
//! true as the last time somebody read it against the code.
//!
//! Eight claims were found false that way, and seven of the eight had been
//! written or changed in the same piece of work as the drift itself. A discipline
//! that only fires when somebody thinks to look is not a discipline.
//!
//! What is checked here is deliberately limited to claims that are mechanically
//! decidable. A spec that says a rule "should" be written is documentation, and
//! this module does not pretend otherwise. What it does check:
//!
//!   * every spec parses, and declares a version and a subsystem
//!   * every gated metric is declared in some spec, and every declared gated
//!     metric has a baseline
//!   * the Power of Ten thresholds in the spec equal the ones in the code
//!   * no rule the spec declares as *not* gated is quietly gating something
//!   * the node and edge kinds a spec claims match the kinds actually built
//!
//! The last one is why this needs the graph. A spec listing a kind the builder
//! never creates is the exact failure that was found: a reader goes looking for
//! nodes that cannot exist.

use std::collections::{BTreeMap, BTreeSet};
use std::path::Path;

use tetanus_core::error::{Error, Report, ReportBuilder, Result};

/// One spec, reduced to the parts this module checks.
struct Spec {
    version: u32,
    subsystem: String,
    gated_metrics: BTreeSet<String>,
    described_metrics: BTreeSet<String>,
    pending_metrics: BTreeSet<String>,
    declared_nodes: BTreeSet<String>,
    absent_nodes: BTreeSet<String>,
    declared_edges: BTreeSet<String>,
    unused_edges: BTreeSet<String>,
    not_gated: BTreeSet<String>,
    thresholds: BTreeMap<String, i64>,
}

/// Check every spec against the implementation.
pub fn check(
    paths: &tetanus_config::repo::RepoPaths,
    node_kinds: &BTreeMap<String, usize>,
    edge_kinds: &BTreeMap<String, usize>,
) -> Result<Report> {
    let mut builder = ReportBuilder::new("specs-check");

    // Under `.tetanus/`, alongside the baseline and the generated registry,
    // not at the repository root.
    let dir = paths.tetanus_dir().join("specs");
    let specs = match load_specs(&dir) {
        Ok(specs) => specs,
        Err(e) => {
            builder.error_with_hint(
                ".tetanus/specs",
                e.to_string(),
                "the specs directory is the declared contract for every subsystem",
            );
            return Ok(builder.build());
        }
    };

    if specs.is_empty() {
        builder.error_with_hint(
            ".tetanus/specs",
            "contains no specs",
            "a subsystem with no spec has no declared contract",
        );
        return Ok(builder.build());
    }

    let baseline =
        tetanus_config::ratchet::RatchetFile::load(&paths.baseline_toml()).unwrap_or_default();

    // A gate nobody declared is drift in the other direction: the baseline is
    // enforcing something no spec describes, so a reader of the specs cannot
    // tell what the gates are. Checked once against the union of every spec,
    // because a metric may legitimately be declared by whichever subsystem owns
    // it rather than by all of them.
    let declared_anywhere: BTreeSet<String> = specs
        .iter()
        .flat_map(|(_, spec)| {
            spec.gated_metrics
                .iter()
                .chain(spec.described_metrics.iter())
                .chain(spec.pending_metrics.iter())
                .cloned()
                .collect::<BTreeSet<String>>()
        })
        .collect();
    for ratchet in &baseline.ratchet {
        if !declared_anywhere.contains(&ratchet.metric) {
            builder.warn(
                format!("baseline.toml:{}", ratchet.id),
                format!(
                    "gated as {:?} but no spec declares the metric `{}`",
                    ratchet.direction.as_str(),
                    ratchet.metric
                ),
            );
        }
    }

    for (path, spec) in &specs {
        if spec.version == 0 {
            builder.fail(
                path,
                "declares version = 0; a spec with no version cannot be migrated",
            );
        }
        if spec.subsystem.is_empty() {
            builder.fail(path, "declares no [subsystem] name");
        }

        // The reverse: a spec promising a gate that does not exist.
        for metric in &spec.gated_metrics {
            if !baseline.ratchet.iter().any(|r| &r.metric == metric) {
                builder.fail(
                    format!("{path}:metrics"),
                    format!("declares `{metric}` as a gate but it has no baseline"),
                );
            }
        }

        // A rule the spec says is not gated must not have a baseline, or the
        // spec is describing an intention while the pipeline enforces something.
        for rule in &spec.not_gated {
            if baseline.ratchet.iter().any(|r| r.metric == *rule) {
                builder.fail(
                    format!("{path}:not_gated"),
                    format!("`{rule}` is declared as not gated but has a baseline"),
                );
            }
        }

        // The Power of Ten thresholds are a contract with the code, not a
        // preference written down twice. A spec saying 60 lines while the
        // analyzer enforces 120 is a gate nobody can reason about, and nothing
        // else would notice.
        if spec.subsystem == "power-of-ten" {
            let actual = tetanus_ast::power::Limits::default();
            let expected: [(&str, i64); 3] = [
                ("max_function_lines", actual.max_function_lines as i64),
                ("max_nesting", actual.max_nesting as i64),
                ("max_parameters", actual.max_parameters as i64),
            ];
            for (field, code_value) in expected {
                match spec.thresholds.get(field) {
                    None => {
                        builder.fail(
                            format!("{path}:thresholds"),
                            format!("declares no `{field}`; the analyzer enforces {code_value}"),
                        );
                    }
                    Some(declared) if *declared != code_value => {
                        builder.fail(
                            format!("{path}:thresholds"),
                            format!(
                                "`{field}` is {declared} in the spec but {code_value} in \
                                 tetanus_ast::power::Limits::default()"
                            ),
                        );
                    }
                    Some(_) => {}
                }
            }
        }

        // Node and edge kinds: the spec against what was actually built.
        for kind in &spec.declared_nodes {
            if !node_kinds.contains_key(kind) {
                builder.fail(
                    format!("{path}:nodes"),
                    format!("declares node kind `{kind}`, which the graph does not build"),
                );
            }
        }
        for kind in &spec.absent_nodes {
            if node_kinds.contains_key(kind) {
                builder.fail(
                    format!("{path}:nodes_absent"),
                    format!(
                        "records `{kind}` as absent, but the graph now builds it; \
                         the spec is behind the code"
                    ),
                );
            }
        }
        for kind in &spec.declared_edges {
            if !edge_kinds.contains_key(kind) {
                builder.fail(
                    format!("{path}:edges"),
                    format!("declares edge kind `{kind}`, which the graph does not build"),
                );
            }
        }
        for kind in &spec.unused_edges {
            if edge_kinds.contains_key(kind) {
                builder.fail(
                    format!("{path}:edges_defined_but_unused_here"),
                    format!("records `{kind}` as unused here, but the graph now builds it"),
                );
            }
        }
    }

    Ok(builder.build())
}

fn load_specs(dir: &Path) -> Result<Vec<(String, Spec)>> {
    let mut out = Vec::new();
    let entries = std::fs::read_dir(dir).map_err(|e| Error::io(dir.display(), e))?;
    let mut seen: BTreeMap<String, String> = BTreeMap::new();
    for entry in entries.flatten() {
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) != Some("toml") {
            continue;
        }
        let name = path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or_default()
            .to_string();
        let text = std::fs::read_to_string(&path).map_err(|e| Error::io(path.display(), e))?;
        let value: toml::Value =
            toml::from_str(&text).map_err(|e| Error::config(format!("{name}: {e}")))?;
        let spec = read_spec(&value);
        if let Some(previous) = seen.insert(spec.subsystem.clone(), name.clone()) {
            return Err(Error::config(format!(
                "{name} declares subsystem {:?}, already declared by {previous}",
                spec.subsystem
            )));
        }
        out.push((name, spec));
    }
    out.sort_by(|a, b| a.0.cmp(&b.0));
    Ok(out)
}

fn read_spec(value: &toml::Value) -> Spec {
    let table = |key: &str| value.get(key).and_then(toml::Value::as_table);
    let version = value
        .get("version")
        .and_then(toml::Value::as_integer)
        .unwrap_or(0) as u32;
    let subsystem = table("subsystem")
        .and_then(|t| t.get("name"))
        .and_then(toml::Value::as_str)
        .unwrap_or_default()
        .to_string();

    // Two shapes appear under `[metrics]` across the specs, and both are real:
    //
    //   ratchet.toml    name = { direction = "max", unit = "..." }
    //   security.toml   name = "a description of what is measured"
    //
    // Treating only the first as a metric would have made this check silently
    // ignore `security.toml` entirely, which is the opposite of what a drift
    // check is for. So both are read, and the difference is preserved rather
    // than flattened: a `direction` is a claim to be a gate and is checked
    // against the baseline, while a description is a claim only to be measured.
    //
    // Prose flags in the same table, such as
    // `unmeasurable_metrics_are_not_ratcheted = true`, and the
    // `[metrics.pending]` sub-table, are neither, and are excluded.
    let shaped = |key: &str, want_direction: bool| -> BTreeSet<String> {
        table(key)
            .map(|t| {
                t.iter()
                    .filter(|(_, v)| match v {
                        toml::Value::Table(m) => want_direction && m.contains_key("direction"),
                        toml::Value::String(_) => !want_direction,
                        _ => false,
                    })
                    .map(|(k, _)| k.clone())
                    .collect()
            })
            .unwrap_or_default()
    };
    // A list of names, read from *inside* the named table. `nodes_absent` is a
    // key of `[nodes]`, not a table of its own; looking for a top-level
    // `[nodes_absent]` found nothing and left the check silently inert, which
    // the unit test for this caught.
    let listed_in = |section: &str, key: &str| -> BTreeSet<String> {
        table(section)
            .and_then(|t| t.get(key))
            .and_then(toml::Value::as_array)
            .map(|a| {
                a.iter()
                    .filter_map(toml::Value::as_str)
                    .map(String::from)
                    .collect()
            })
            .unwrap_or_default()
    };
    let true_keys = |key: &str| -> BTreeSet<String> {
        table(key)
            .map(|t| {
                t.iter()
                    .filter(|(_, v)| v.as_bool() == Some(true))
                    .map(|(k, _)| k.clone())
                    .collect()
            })
            .unwrap_or_default()
    };

    // `[metrics.pending]` and `[not_gated]` both hold `name = "reason"` pairs, so
    // their keys are the names.
    let pending_metrics = table("metrics")
        .and_then(|t| t.get("pending"))
        .and_then(toml::Value::as_table)
        .map(|t| t.keys().cloned().collect())
        .unwrap_or_default();

    Spec {
        version,
        subsystem,
        // A claim to be gated, and so required to have a baseline.
        gated_metrics: shaped("metrics", true)
            .difference(&pending_metrics)
            .cloned()
            .collect(),
        // A claim only to be measured. Counts as declared for the union check
        // so a metric `security.toml` describes is not reported as undeclared.
        described_metrics: shaped("metrics", false),
        pending_metrics,
        declared_nodes: true_keys("nodes"),
        absent_nodes: listed_in("nodes", "nodes_absent"),
        declared_edges: true_keys("edges"),
        unused_edges: listed_in("edges", "edges_defined_but_unused_here"),
        // `[not_gated]` is a table of `name = "reason"`, so the names are its
        // keys. It is not an array like `nodes_absent`.
        not_gated: table("not_gated")
            .map(|t| t.keys().cloned().collect())
            .unwrap_or_default(),
        thresholds: table("thresholds")
            .map(|t| {
                t.iter()
                    .filter_map(|(k, v)| v.as_integer().map(|n| (k.clone(), n)))
                    .collect()
            })
            .unwrap_or_default(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn spec_of(text: &str) -> Spec {
        read_spec(&toml::from_str(text).expect("valid toml"))
    }

    #[test]
    fn both_metric_shapes_are_read() {
        // `ratchet.toml` and `security.toml` use incompatible shapes for
        // `[metrics]`. Reading only one would silently ignore half the specs.
        let s = spec_of(
            r#"
version = 1
[subsystem]
name = "x"
[metrics]
gated = { direction = "max", unit = "files" }
described = "a description of what is measured"
prose_flag = true
[metrics.pending]
later = "not yet"
"#,
        );
        assert_eq!(s.gated_metrics, BTreeSet::from(["gated".to_string()]));
        assert_eq!(
            s.described_metrics,
            BTreeSet::from(["described".to_string()])
        );
        assert_eq!(s.pending_metrics, BTreeSet::from(["later".to_string()]));
    }

    #[test]
    fn prose_flags_are_not_metrics() {
        // Otherwise the check fails on its own vocabulary.
        let s = spec_of(
            r#"
version = 1
[subsystem]
name = "x"
[metrics]
unmeasurable_metrics_are_not_ratcheted = true
real = { direction = "min" }
"#,
        );
        assert_eq!(s.gated_metrics, BTreeSet::from(["real".to_string()]));
        assert!(s.described_metrics.is_empty());
    }

    #[test]
    fn not_gated_is_a_table_so_its_keys_are_the_rule_names() {
        let s = spec_of(
            r#"
version = 1
[subsystem]
name = "x"
[not_gated]
rule_2 = "vacuous without manual allocation"
rule_8 = "not a static property"
"#,
        );
        assert_eq!(
            s.not_gated,
            BTreeSet::from(["rule_2".to_string(), "rule_8".to_string()])
        );
    }

    #[test]
    fn thresholds_are_read_as_integers() {
        let s = spec_of(
            r#"
version = 1
[subsystem]
name = "power-of-ten"
[thresholds]
max_function_lines = 60
max_nesting = 4
max_parameters = 5
"#,
        );
        assert_eq!(s.thresholds.get("max_function_lines"), Some(&60));
        assert_eq!(s.thresholds.get("max_nesting"), Some(&4));
    }

    #[test]
    fn node_and_edge_lists_are_separated_by_shape() {
        // `[nodes]` is a table of booleans; `nodes_absent` is a list of names.
        let s = spec_of(
            r#"
version = 1
[subsystem]
name = "graph"
[nodes]
module = true
symbol = false
nodes_absent = ["task", "metric"]
[edges]
imports = true
edges_defined_but_unused_here = ["calls"]
"#,
        );
        assert_eq!(s.declared_nodes, BTreeSet::from(["module".to_string()]));
        assert_eq!(
            s.absent_nodes,
            BTreeSet::from(["task".to_string(), "metric".to_string()])
        );
        assert_eq!(s.declared_edges, BTreeSet::from(["imports".to_string()]));
        assert_eq!(s.unused_edges, BTreeSet::from(["calls".to_string()]));
    }

    #[test]
    fn a_missing_version_reads_as_zero_so_it_is_reported() {
        let s = spec_of("[subsystem]\nname = \"x\"\n");
        assert_eq!(s.version, 0);
    }
}
