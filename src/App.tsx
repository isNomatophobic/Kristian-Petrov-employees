import { ChangeEvent, useState } from "react";
import "./App.css";
import { parse } from "papaparse";
import { Table, CSVData, TableProps, Socials } from "./components";
import dayjs from "dayjs";

const formatCSVDateNull = (date: string) =>
  !date || date === "NULL" ? dayjs() : date;

const calculateTimeDiff = (emp1: CSVData[0], emp2: CSVData[0]) => {
  const intervalStart = dayjs(emp1.DateFrom).isAfter(dayjs(emp2.DateFrom))
    ? emp1.DateFrom
    : emp2.DateFrom;

  const emp1DateTo = formatCSVDateNull(emp1.DateTo);
  const emp2DateTo = formatCSVDateNull(emp2.DateTo);

  const intervalEnd = dayjs(emp1DateTo).isAfter(dayjs(emp2DateTo))
    ? emp2DateTo
    : emp1DateTo;

  if (dayjs(intervalEnd).isBefore(intervalStart)) return;
  return dayjs(intervalEnd).diff(intervalStart);
};

const getLongerWorkingUserPair = (data: CSVData, projectsId: Set<string>) => {
  const employeeIdPairs: Record<string, Record<string, number>> = {};
  new Array(...projectsId).reduce(
    (projects: Record<string, CSVData>, projectId) => {
      const empWithinProject = data.filter(
        (emp) => emp.ProjectID === projectId
      );
      empWithinProject.forEach((emp1) => {
        empWithinProject.forEach((emp2) => {
          if (emp1.EmpID === emp2.EmpID) return;
          const timeDiff = calculateTimeDiff(emp1, emp2);
          if (!timeDiff) return;
          employeeIdPairs[emp1.EmpID] = {
            ...employeeIdPairs[emp1.EmpID],
            [emp2.EmpID]: timeDiff,
          };
        });
      });

      return (projects[projectId] = empWithinProject), projects;
    },
    {}
  );
  const mostTimeTogether = Object.keys(employeeIdPairs).reduce(
    (finalObj, employee1) => {
      const mostTimeCollaboratedUser = Object.keys(
        employeeIdPairs[employee1]
      ).reduce(
        (obj, employee2) => {
          const timeCollaborated = employeeIdPairs[employee1][employee2];
          if (timeCollaborated > obj.timeCollaborated)
            return { id: employee2, timeCollaborated };
          return obj;
        },
        { id: "", timeCollaborated: 0 }
      );
      if (mostTimeCollaboratedUser.timeCollaborated > finalObj.timeCollaborated)
        return {
          employee1: employee1,
          employee2: mostTimeCollaboratedUser.id,
          timeCollaborated: mostTimeCollaboratedUser.timeCollaborated,
        };

      return finalObj;
    },
    { employee1: "", employee2: "", timeCollaborated: 0 }
  );
  return mostTimeTogether;
};

/*This function can be omitted by doing this while getLongerWorkingUserPair is running,
sacrificing speed for the sake of readability and separation*/

const formatLongerWorkingPair = (
  data: CSVData,
  pair: ReturnType<typeof getLongerWorkingUserPair>,
  projectsId: Set<string>
) => {
  const t = new Array(...projectsId).flatMap((projectID) => {
    const allEmp = data.filter((emp) => emp.ProjectID === projectID);
    const pairEmp = allEmp.filter(
      (emp) => emp.EmpID === pair.employee1 || emp.EmpID === pair.employee2
    );

    if (pairEmp.length !== 2) return [];

    const timeTotal = calculateTimeDiff(pairEmp[0], pairEmp[1]);
    if (!timeTotal) return [];
    return {
      projectID,
      totalDays: Math.floor(timeTotal / (24 * 60 * 60 * 1000)),
    };
  }, {});
  return t;
};
function App() {
  const [tableData, setTableData] = useState<TableProps>({ data: [] });
  const [error, setError] = useState("");
  const throwError = (message: string) => {
    setTableData({ data: [] });
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
          const projectsId = new Set(data.map(({ ProjectID }) => ProjectID));
          const longestWorkingPair = getLongerWorkingUserPair(data, projectsId);

          formatLongerWorkingPair(data, longestWorkingPair, projectsId);

          setTableData({
            empID1: longestWorkingPair.employee1,
            empID2: longestWorkingPair.employee2,
            data: formatLongerWorkingPair(data, longestWorkingPair, projectsId),
          });
        } catch (e) {
          console.log(e);
          throwError("Invalid File");
        }
      },
      error: (e) => {
        throwError(e.message);
      },
    });
  };
  return (
    <div id="main" className="wrapper">
      <input type="file" name="file" accept=".csv" onChange={changeHandler} />
      <Table {...tableData} />
      {error ? <span className="error">Error: {error}</span> : null}
      <Socials />
    </div>
  );
}

export default App;
