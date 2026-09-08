import { fireEvent, render, within } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TableRowDragDrop } from "./TableRowDragDrop";
import { mockedTableColumns, mockedTableData } from "./TableRowDragDrop.sample-data";

type OnDrop = (param: { fromIndex: number; toIndex: number }) => string;

interface TableProps {
  onDrop: OnDrop;
  columns: typeof mockedTableColumns;
  data: typeof mockedTableData;
  onDrag(data: boolean): void;
}

const renderTestsList = (tableProps: Partial<TableProps>): RenderResult & { props: TableProps } => {
  const onDrop = vi.fn();
  const onDrag = vi.fn();
  const props: TableProps = {
    onDrop,
    columns: mockedTableColumns,
    data: mockedTableData,
    onDrag,
    ...tableProps,
  };

  return {
    ...render(
      <TableRowDragDrop
        columns={props.columns}
        data={props.data}
        onDrop={props.onDrop}
        onDrag={props.onDrag}
      />,
    ),
    props,
  };
};

function dragAndDrop(source: Element, destination: Element) {
  fireEvent.dragStart(source);
  fireEvent.dragEnter(destination);
  fireEvent.drop(destination);
  fireEvent.dragLeave(destination);
  fireEvent.dragEnd(source);
}

describe("drag and drop table", () => {
  it("drags the first row and drops it in the second row", () => {
    const component = renderTestsList({});
    const draggableNodes = component.getAllByLabelText("drag row");
    const rows = component.container.getElementsByTagName("tr");
    dragAndDrop(draggableNodes[0], rows[2]);

    expect(component.props.onDrop).toHaveBeenNthCalledWith(
      1,
      { fromIndex: 0, toIndex: 1 },
      expect.anything(),
    );
  });

  it("drags the last row and drops it in the first row", () => {
    const component = renderTestsList({});
    const draggableNodes = component.getAllByLabelText("drag row");
    const rows = component.container.getElementsByTagName("tr");
    const lastDraggableNode = draggableNodes[draggableNodes.length - 1];
    dragAndDrop(lastDraggableNode, rows[1]);

    expect(component.props.onDrop).toHaveBeenNthCalledWith(
      1,
      {
        fromIndex: draggableNodes.length - 1,
        toIndex: 0,
      },
      expect.anything(),
    );
  });

  it("renders all header cells", () => {
    const component = renderTestsList({});
    const tableHeader = component.container.getElementsByTagName("thead")[0];

    mockedTableColumns.forEach(({ Header }) => {
      expect(within(tableHeader).getByText(Header as string)).toBeTruthy();
    });
  });
});
