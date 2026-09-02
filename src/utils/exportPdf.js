import { downloadReportPdf } from "./pdfGenerator";

export const exportToPDF = async (title = "Reports & Analytics", filename = "ReportsAnalytics.pdf") => {
  const reportTableHtml = document.getElementById("reports-container");
  if (!reportTableHtml) return;

  // Extract table data if available
  const table = reportTableHtml.querySelector("table");
  if (table) {
    const headers = Array.from(table.querySelectorAll("th")).map((th) => th.innerText);
    const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
      Array.from(tr.querySelectorAll("td")).map((td) => td.innerText)
    );
    await downloadReportPdf(title, "Sep 2026", headers, rows, filename);
  } else {
    await downloadReportPdf(title, "Sep 2026", ["Report Data"], [["Analytics Data Export"]], filename);
  }
};