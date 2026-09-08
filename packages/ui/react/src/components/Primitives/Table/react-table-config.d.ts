import type {
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedRowProps,
} from "react-table";

declare module "react-table" {
  interface TableOptions<D extends object> extends UseExpandedOptions<D> {
    [key: string]: unknown;
  }

  interface TableInstance<D extends object> extends UseExpandedInstanceProps<D> {}

  interface Row<D extends object> extends UseExpandedRowProps<D> {}

  interface ColumnInstance<D extends object> {
    alignColumn?: "left" | "center" | "right";
  }
}
