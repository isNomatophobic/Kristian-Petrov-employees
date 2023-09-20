export type Data = {
  EmpID: string;
  ProjectID: string;
  DateFrom: string;
  DateTo: string;
};
export type CSVData = Data[];
interface TableProps {
  data: CSVData;
}
const Table = ({ data }: TableProps) => {
  console.log(data);
  return <>table</>;
};
export default Table;
