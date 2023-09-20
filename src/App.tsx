import { ChangeEvent, useState } from "react";
import "./App.css";
import { parse } from "papaparse";
import { Table, CSVData } from "./components";

function App() {
  const [tableData, setTableData] = useState<CSVData>([]);

  const changeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (!target.files) return [];
    parse(target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        //resolve(results.data as TableData[]);
        setTableData(results.data as CSVData);
      },
      error: (e) => {
        console.log(e);
      },
    });
  };
  return (
    <div id="wrapper">
      <input type="file" name="file" accept=".csv" onChange={changeHandler} />
      <Table data={tableData} />
    </div>
  );
}

export default App;
