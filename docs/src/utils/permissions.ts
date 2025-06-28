// response from https://api-docs.devopness.com/#tag/Static-Data-Permissions/operation/listStaticPermissions
import staticPermissions from "../_data/static_permissions.json";

/**
 * Formats Devopness API permission to human readable
 * @param unformattedPermission Devopness API permission
 * @return human readable formatted Devopness API permission
 */
export const formatPermissionHumanReadable = (
  unformattedPermission: string
) => {
  const trimmedPermission = unformattedPermission.trim();
  const [resource_type, permission] = trimmedPermission.split(":");
  const defaultValue = {
    resource_type: resource_type
      .split("-")
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join(" "),
    permission: permission
      .split("_")
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join(" "),
  };

  const validPermissionFormat = /^([a-z\-]+:[a-z\_]+)$/;
  // NOTE: a valid permission should follow the rules below:
  // - only lowercase letters
  // - should include a resource-type (left) and permission_type (right) separated by ':'
  // - resource-type should be separated by '-'
  // - permission_type should be separated by '_'

  const isPermissionFormatValid = trimmedPermission.match(
    validPermissionFormat
  );
  if (!isPermissionFormatValid) return defaultValue;

  const staticResource = staticPermissions.find(
    ({ resource_type: static_resource_type }) =>
      static_resource_type == resource_type
  );

  const foundStaticResource = staticResource;
  if (!foundStaticResource) return defaultValue;

  defaultValue.resource_type = staticResource.human_readable;
  const staticPermission = staticResource.permissions.find(
    ({ name: static_permission_name }) => static_permission_name == permission
  );

  const foundStaticPermission = staticPermission;
  if (!foundStaticPermission) return defaultValue;

  defaultValue.permission = staticPermission.human_readable;
  return defaultValue;
};
