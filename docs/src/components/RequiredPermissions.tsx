import React, { useMemo } from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { formatPermissionHumanReadable } from "../utils/permissions";

/**
 * Type definition for the front matter with required permissions
 */
type DocFrontMatter = {
  required_permissions?: `${string}:${string}`[];
};

/**
 * Component to render required permissions on human readable format
 * Extracts required permissions from document front matter and displays them as list
 */
const RequiredPermissions: React.FC = () => {
  // Safely type the frontMatter and extract permissions
  const { frontMatter } = useDoc() as { frontMatter: DocFrontMatter };

  // Extract and validate permissions
  const permissions = useMemo(() => {
    // Check if permissions exist in frontmatter with type-safe access
    const permissions = frontMatter.required_permissions ?? [];
    return permissions.filter(
      (permission): permission is `${string}:${string}` =>
        typeof permission === "string" && permission.trim() !== ""
    );
  }, [frontMatter]);

  // If no valid permissions, return null
  if (permissions.length === 0) {
    return null;
  }

  // Map permissions to human readable format
  const formattedPermissions = permissions.map((permission) =>
    formatPermissionHumanReadable(permission)
  );

  return (
    <div className="required-permissions">
      <h4 className="required-permissions-title">Required Permissions</h4>
      <p>
        <strong>NOTE</strong>: To complete the steps in this post, the user
        needs to have the following permissions in the environment:
      </p>

      <table>
        <tr>
          <th>Resource Type</th>
          <th>Permission</th>
        </tr>
        {formattedPermissions.map((formattedPermission) => (
          <tr key={formattedPermission.resource_type}>
            <td>{formattedPermission.resource_type}</td>
            <td>{formattedPermission.permission}</td>
          </tr>
        ))}
      </table>

      <p>
        For instructions on how to grant user permissions in an environment, see{" "}
        <a href="/docs/environments/team-memberships/add-team-membership">
          Add team to an Environment
        </a>
      </p>
    </div>
  );
};

export default RequiredPermissions;
