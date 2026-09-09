import type { Column } from "react-table";

export interface RowData {
  age: string;
  id: number;
  progress: string;
  name: string;
  firstName?: string;
  lastName: string;
}

export const mockedTableData: RowData[] = [
  { id: 1, age: "26", progress: "50%", name: "test", lastName: "José" },
  {
    id: 2,
    age: "87",
    progress: "10%",
    name: "Emerson",
    lastName: "Soares",
  },
  { id: 3, age: "16", progress: "23%", name: "Gabriel", lastName: "Gomes" },
  {
    id: 4,
    age: "54",
    progress: "83%",
    name: "Augusto",
    lastName: "Santos",
  },
  { id: 5, age: "28", progress: "49%", name: "Eneias", lastName: "Souza" },
  {
    id: 6,
    age: "62",
    progress: "50%",
    name: "test",
    lastName: "last name",
  },
  { id: 7, age: "45", progress: "78%", name: "André", lastName: "Bonfim" },
];

export const mockedTableColumns: Column<RowData>[] = [
  { Header: "ID", accessor: "id" },
  { Header: "Name", accessor: "name" },
  { Header: "Last Name", accessor: "lastName" },
  { Header: "Age", accessor: "age" },
  { Header: "Progress", accessor: "progress" },
];
