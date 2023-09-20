import { ChangeEvent } from "react";
import "./App.css";
import { parse } from "papaparse";

type Data = {
  EmpID: string;
  ProjectID: string;
  DateFrom: string;
  DateTo: string;
};
function App() {
  const changeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const dataArray = await new Promise<Data[]>((resolve, reject) => {
      if (!target.files) return [];
      parse(target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as Data[]);
        },
        error: () => {
          reject();
        },
      });
    });
    console.log(dataArray);
  };
  return (
    <div>
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={changeHandler}
        style={{ display: "block", margin: "10px auto" }}
      />
    </div>
  );
}

export default App;
