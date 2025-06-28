import React from "react";
import Link from "@docusaurus/Link";
import { useDocById } from "@docusaurus/plugin-content-docs/client";

type MentionPostProps = {
  /** Path to the document being mentioned */
  path: string;
};

/**
 * Component that creates a link to another documentation page
 * Handles normalization of doc IDs and provides error states
 *
 * @example
 * ```jsx
 * <MentionPost path="/docs/projects/add-project" />
 * ```
 */
export default function MentionPost({ path }: MentionPostProps) {
  const doc = useDocById(path.replace(/^\/docs\//, ""));

  if (!doc) {
    console.warn(`Document "${path}" not found`);
    return <Link to="#">ERROR</Link>;
  }

  /**
   * Remove the `index` suffix from the path if it exists
   */
  const normalizedPath = `/docs/${doc.id}`.replace(/index$/, "");

  return <Link to={normalizedPath}>{doc.title}</Link>;
}
