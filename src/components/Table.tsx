export type Data = {
  EmpID: string;
  ProjectID: string;
  DateFrom: string;
  DateTo: string;
};
export type CSVData = Data[];
type TableData = {
  empID1: Data["EmpID"];
  empID2: Data["EmpID"];
  projectID: Data["ProjectID"];
  totalDays: number;
};

const headers: {
  [key in keyof TableData]?: string;
} = {
  empID1: "Employee ID #1",
  empID2: "Employee ID #2",
  projectID: "Project ID",
  totalDays: "Days Worked",
};

export interface TableProps {
  data: TableData[];
}
const Table = ({ data }: TableProps) => {
  if (!data.length) return null;

  return (
    <div id="table-wrapper" className="table-wrapper">
      <div className="table-row">
        {Object.keys(headers).map((key) => (
          <div className="table-cell">{headers[key]}</div>
        ))}
      </div>
      {data.map((row) => {
        return (
          <div className="table-row">
            {Object.values(row).map((cell) => (
              <div className="table-cell">{cell}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
export default Table;
