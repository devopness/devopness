import type { PropsWithChildren, ReactNode } from "react";
import { memo } from "react";

import { Tooltip } from "src/components/Primitives/Tooltip";
import type { Icon as IconName } from "src/icons";
import { iconLoader } from "src/icons";
import { isDefined } from "src/components/type-guards";

import { TableCellIcon, TableCellValue, TableCellWrapper } from "./styled";

interface CellWrapperProps {
  icon?: IconName | Exclude<ReactNode, string>;
  value: ReactNode;
  iconSize?: number;
  iconColor?: string;
  iconBackgroundColor?: string;
  iconTooltip?: string;
}

function CellWrapper({
  icon,
  iconSize,
  value,
  iconBackgroundColor = "transparent",
  iconColor = "white",
  iconTooltip,
  children,
}: PropsWithChildren<CellWrapperProps>) {
  return (
    <TableCellWrapper>
      {children ? (
        <TableCellIcon $iconBackgroundColor={iconBackgroundColor}>{children}</TableCellIcon>
      ) : (
        icon && (
          <Tooltip
            title={iconTooltip ?? ""}
            disableHover={!isDefined(iconTooltip)}
            disableFocusListener={!isDefined(iconTooltip)}
            disableTouchListener={!isDefined(iconTooltip)}
            disableHoverListener={!isDefined(iconTooltip)}
          >
            <TableCellIcon $iconBackgroundColor={iconBackgroundColor}>
              {typeof icon === "string"
                ? iconLoader(icon as IconName, iconSize || 12, iconColor, 1, iconTooltip)
                : icon}
            </TableCellIcon>
          </Tooltip>
        )
      )}
      <TableCellValue>{value}</TableCellValue>
    </TableCellWrapper>
  );
}

export type { CellWrapperProps };
export { CellWrapper };
export default memo(CellWrapper);
