import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = () => {
  const reportData = [
    {
      Department: "Engineering",
      Salary: 95000,
      Attendance: "94%",
    },
    {
      Department: "Sales",
      Salary: 72000,
      Attendance: "91%",
    },
    {
      Department: "HR",
      Salary: 68000,
      Attendance: "89%",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(reportData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(fileData, "ReportsAnalytics.xlsx");
};