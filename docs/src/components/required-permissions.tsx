import { formatPermissionHumanReadable } from '@/utils/permissions';

interface RequiredPermissionsProps {
  permissions: string[];
}

/**
 * Renders a required permissions table for documentation pages.
 * Reads the `required_permissions` frontmatter field and displays
 * each permission in a human-readable format using the static permissions data.
 */
export function RequiredPermissions({ permissions }: RequiredPermissionsProps) {
  const valid = permissions.filter((p) => typeof p === 'string' && p.trim() !== '');
  if (valid.length === 0) return null;

  const formatted = valid.map((p) => formatPermissionHumanReadable(p));

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Required Permissions</h2>
      <p className="text-sm text-fd-muted-foreground mb-4">
        To complete the steps in this guide, the user needs the following permissions in the
        environment:
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium">Resource Type</th>
            <th className="text-left py-2 font-medium">Permission</th>
          </tr>
        </thead>
        <tbody>
          {formatted.map((fp) => (
            <tr key={`${fp.resource_type}-${fp.permission}`} className="border-b">
              <td className="py-2">{fp.resource_type}</td>
              <td className="py-2">{fp.permission}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-fd-muted-foreground mt-4">
        For instructions on how to grant user permissions in an environment, see{' '}
        <a href="/docs/environments/team-memberships/add-team-membership" className="underline">
          Add team to an Environment
        </a>
      </p>
    </div>
  );
}
