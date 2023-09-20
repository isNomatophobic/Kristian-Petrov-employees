import { ChangeEvent, useState } from "react";
import "./App.css";
import { parse } from "papaparse";
import { Table, CSVData, TableProps } from "./components";
import dayjs from "dayjs";

function App() {
  const [tableData, setTableData] = useState<TableProps["data"]>([]);

  const changeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (!target.files) return [];
    parse(target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CSVData;
        const mutatedData = data
          .map((obj) => {
            const daysBetween = dayjs(obj.DateTo ? obj.DateTo : undefined).diff(
              dayjs(obj.DateFrom),
              "days"
            );
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
      },
      error: (e) => {
        console.log(e);
      },
    });
  };
  return (
    <div className="wrapper">
      <input type="file" name="file" accept=".csv" onChange={changeHandler} />
      <Table data={tableData} />
    </div>
  );
}

export default App;
