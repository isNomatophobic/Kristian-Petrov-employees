export type Data = {
  EmpID: string;
  ProjectID: string;
  DateFrom: string;
  DateTo: string;
};
export type CSVData = Data[];
type TableData = {
  projectID: Data["ProjectID"];
  totalDays: number;
};

const headers: {
  [key in keyof TableData | keyof Omit<TableProps, "data">]?: string;
} = {
  empID1: "Employee ID #1",
  empID2: "Employee ID #2",
  projectID: "Project ID",
  totalDays: "Days Worked",
};

export interface TableProps {
  data: TableData[];
  empID1?: Data["EmpID"];
  empID2?: Data["EmpID"];
}
const Table = ({ data, empID1, empID2 }: TableProps) => {
  if (!data.length || !empID1 || !empID2) return null;

  return (
    <div id="table-wrapper" className="table-wrapper">
      <div className="table-row table-headers">
        {Object.keys(headers).map((key) => (
          <div className="table-cell" key={key}>
            {headers[key as keyof TableData]}
          </div>
        ))}
      </div>
      {data.map((row, rowI) => {
        return (
          <div
            className={`table-row ${rowI % 2 == 0 ? "" : "row-grey"}`}
            key={`row-${rowI}`}
          >
            <div className="table-cell" key={`row-${rowI}-cell-emp1`}>
              {empID1}
            </div>
            <div className="table-cell" key={`row-${rowI}-cell-emp2`}>
              {empID2}
            </div>
            {Object.values(row).map((cell, i) => (
              <div className="table-cell" key={`row-${rowI}-cell-${i}`}>
                {cell}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
export default Table;
