import { ChangeEvent, useState } from "react";
import "./App.css";
import { parse } from "papaparse";
import { Table, CSVData, TableProps } from "./components";
import dayjs from "dayjs";

const isCSVDateNull = (date: string) => !date || date === "NULL";

function App() {
  const [tableData, setTableData] = useState<TableProps["data"]>([]);
  const [error, setError] = useState("");
  const throwError = (message: string) => {
    setTableData([]);
    setError(() => message);
  };
  const changeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    setError(() => "");
    const target = event.target;
    if (!target.files || target.files[0].type !== "text/csv") {
      throwError("Invalid File");
      return;
    }

    parse(target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CSVData;
        if (!data.length) {
          throwError("Empty CSV file");
        }
        try {
          const mutatedData = data
            .map((obj) => {
              const daysBetween = dayjs(
                isCSVDateNull(obj.DateTo) ? undefined : obj.DateTo
              ).diff(dayjs(obj.DateFrom), "days");
              return { ...obj, daysBetween };
            })
            .sort((a, b) => {
              return b.daysBetween - a.daysBetween;
            });
          const projectsId = new Set(data.map(({ ProjectID }) => ProjectID));
          const finalData = new Array(...projectsId).map((id) => {
            const employees = mutatedData.filter(
              ({ ProjectID }) => ProjectID !== id
            );
            return {
              empID1: employees[0].EmpID,
              empID2: employees[1].EmpID,
              projectID: id,
              totalDays: employees[0].daysBetween + employees[1].daysBetween,
            };
          });
          setTableData(finalData as TableProps["data"]);
        } catch (e) {
          throwError("Invalid File");
        }
      },
      error: (e) => {
        throwError(e.message);
      },
    });
  };
  return (
    <div className="wrapper">
      <input type="file" name="file" accept=".csv" onChange={changeHandler} />
      <Table data={tableData} />
      {error ? <span className="error">{error}</span> : null}
    </div>
  );
}

export default App;
