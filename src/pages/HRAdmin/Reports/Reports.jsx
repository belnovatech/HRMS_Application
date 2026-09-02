import React, { useMemo, useState } from "react";
import "./Reports.css";
import HRLayout from "../../../layouts/HRLayout";
import { getCompanyPdfHeaderHtml } from "../../../utils/pdfGenerator";
import {
  FiBarChart2,
  FiDownload,
  FiFilter,
  FiFileText,
  FiUsers,
  FiCalendar,
  FiBriefcase,
  FiTrendingDown,
  FiDollarSign,
  FiClock,
  FiX,
  FiCheck,
} from "react-icons/fi";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const INITIAL_REPORTS = [
  {
    id: "employee",
    title: "Employee Report",
    icon: "users",
    description: "Employee master data, department, designation and employment details.",
    period: "1,248 records",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "employee-report",
  },
  {
    id: "attendance",
    title: "Attendance Report",
    icon: "attendance",
    description: "Attendance status, working hours, late arrivals, overtime and WFH records.",
    period: "Sep 2026",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "attendance-report",
  },
  {
    id: "leave",
    title: "Leave Report",
    icon: "leave",
    description: "Leave requests, approvals, leave types, balances and utilization.",
    period: "353 requests",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "leave-report",
  },
  {
    id: "payroll",
    title: "Payroll Report",
    icon: "payroll",
    description: "Gross pay, deductions, net salary, tax and payroll processing data.",
    period: "Aug 2026",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "payroll-report",
  },
  {
    id: "salary",
    title: "Salary Report",
    icon: "salary",
    description: "Salary structure, basic pay, allowances, deductions and compensation.",
    period: "All employees",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "salary-report",
  },
  {
    id: "overtime",
    title: "Overtime Report",
    icon: "overtime",
    description: "Overtime hours, employee-wise overtime and payable overtime amounts.",
    period: "23 employees",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "overtime-report",
  },
  {
    id: "department",
    title: "Department Report",
    icon: "department",
    description: "Department headcount, staffing, attendance and workforce distribution.",
    period: "7 departments",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "department-report",
  },
  {
    id: "attrition",
    title: "Attrition Report",
    icon: "attrition",
    description: "Employee exits, joining trends, retention and attrition analysis.",
    period: "YTD 2026",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "attrition-report",
  },
];

const REPORT_DATA = {
  employee: [
    ["Employee ID", "Employee Name", "Department", "Designation", "Employment Status"],
    ["EMP1001", "Rahul Kumar", "Engineering", "Software Engineer", "Active"],
    ["EMP1002", "Priya Sharma", "HR", "HR Executive", "Active"],
    ["EMP1003", "Arjun Reddy", "Engineering", "Senior Engineer", "Active"],
    ["EMP1004", "Sneha Rao", "HR", "HR Manager", "Active"],
    ["EMP1005", "Vikram Singh", "Operations", "Operations Lead", "Active"],
  ],
  attendance: [
    ["Employee ID", "Employee Name", "Date", "Check In", "Check Out", "Working Hours", "Status"],
    ["EMP1001", "Rahul Kumar", "Sep 01, 2026", "09:42 AM", "06:38 PM", "8h 56m", "Present"],
    ["EMP1002", "Priya Sharma", "Sep 01, 2026", "09:12 AM", "06:15 PM", "9h 03m", "Present"],
    ["EMP1003", "Arjun Reddy", "Sep 01, 2026", "10:15 AM", "06:45 PM", "8h 30m", "Late"],
    ["EMP1004", "Sneha Rao", "Sep 01, 2026", "09:05 AM", "06:20 PM", "8h 55m", "Present"],
    ["EMP1005", "Vikram Singh", "Sep 01, 2026", "-", "-", "0h", "Absent"],
  ],
  leave: [
    ["Request ID", "Employee", "Leave Type", "From", "To", "Days", "Reason", "Status"],
    ["LV301", "Meena Pillai", "Casual Leave", "Sep 05", "Sep 07", "3", "Personal work", "Pending"],
    ["LV302", "Rohan Das", "Sick Leave", "Aug 29", "Aug 30", "2", "Fever and cold", "Approved"],
    ["LV303", "Kavya Nair", "Earned Leave", "Sep 10", "Sep 14", "5", "Family vacation", "Pending"],
    ["LV304", "Kiran Reddy", "Casual Leave", "Sep 02", "Sep 03", "2", "Personal", "Approved"],
    ["LV305", "Deepika Iyer", "Sick Leave", "Aug 27", "Aug 27", "1", "Medical appointment", "Rejected"],
  ],
  payroll: [
    ["Employee ID", "Employee", "Basic", "HRA", "Allowances", "Gross", "Deductions", "Net Salary"],
    ["EMP1001", "Rahul Kumar", "₹35,000", "₹14,000", "₹8,000", "₹59,000", "₹6,500", "₹52,500"],
    ["EMP1002", "Priya Sharma", "₹28,000", "₹11,200", "₹6,000", "₹46,700", "₹5,160", "₹41,540"],
    ["EMP1003", "Arjun Reddy", "₹55,000", "₹22,000", "₹12,000", "₹94,000", "₹12,100", "₹81,900"],
    ["EMP1004", "Sneha Rao", "₹40,000", "₹16,000", "₹9,000", "₹67,500", "₹8,000", "₹59,500"],
    ["EMP1005", "Vikram Singh", "₹80,000", "₹32,000", "₹18,000", "₹1,40,000", "₹19,400", "₹1,20,600"],
  ],
  salary: [
    ["Employee ID", "Employee", "Department", "Basic Salary", "Allowances", "Gross Salary"],
    ["EMP1001", "Rahul Kumar", "Engineering", "₹35,000", "₹24,000", "₹59,000"],
    ["EMP1002", "Priya Sharma", "HR", "₹28,000", "₹17,200", "₹46,700"],
    ["EMP1003", "Arjun Reddy", "Engineering", "₹55,000", "₹34,000", "₹94,000"],
    ["EMP1004", "Sneha Rao", "HR", "₹40,000", "₹27,500", "₹67,500"],
    ["EMP1005", "Vikram Singh", "Operations", "₹80,000", "₹50,000", "₹1,40,000"],
  ],
  overtime: [
    ["Employee ID", "Employee", "Department", "Overtime Hours", "Rate", "Payable Amount"],
    ["EMP1001", "Rahul Kumar", "Engineering", "8h 30m", "₹450/hr", "₹3,825"],
    ["EMP1002", "Priya Sharma", "HR", "5h 00m", "₹350/hr", "₹1,750"],
    ["EMP1003", "Arjun Reddy", "Engineering", "10h 15m", "₹650/hr", "₹6,662"],
    ["EMP1004", "Sneha Rao", "HR", "4h 30m", "₹500/hr", "₹2,250"],
    ["EMP1005", "Vikram Singh", "Operations", "7h 00m", "₹700/hr", "₹4,900"],
  ],
  department: [
    ["Department", "Headcount", "Active", "On Leave", "Attendance Rate"],
    ["Engineering", "420", "411", "9", "94.6%"],
    ["Human Resources", "92", "90", "2", "96.2%"],
    ["Finance", "115", "112", "3", "95.1%"],
    ["Product", "176", "170", "6", "93.8%"],
    ["Operations", "305", "294", "11", "91.9%"],
    ["Sales", "98", "94", "4", "92.8%"],
    ["Marketing", "42", "41", "1", "95.7%"],
  ],
  attrition: [
    ["Month", "Opening Headcount", "New Joiners", "Exits", "Closing Headcount", "Attrition Rate"],
    ["Jan 2026", "1,110", "28", "15", "1,123", "1.3%"],
    ["Feb 2026", "1,123", "25", "12", "1,136", "1.1%"],
    ["Mar 2026", "1,136", "30", "14", "1,152", "1.2%"],
    ["Apr 2026", "1,152", "27", "10", "1,169", "0.9%"],
    ["May 2026", "1,169", "24", "9", "1,184", "0.8%"],
    ["Jun 2026", "1,184", "22", "11", "1,195", "0.9%"],
    ["Jul 2026", "1,195", "35", "12", "1,218", "1.0%"],
    ["Aug 2026", "1,218", "40", "10", "1,248", "0.8%"],
  ],
};

const ICONS = {
  users: FiUsers,
  attendance: FiCalendar,
  leave: FiBriefcase,
  payroll: FiDollarSign,
  salary: FiBarChart2,
  overtime: FiClock,
  department: FiBriefcase,
  attrition: FiTrendingDown,
};

const CHARTS = {
  Headcount: [1123, 1136, 1152, 1169, 1184, 1195, 1218, 1248],
  Attrition: [1.3, 1.1, 1.2, 0.9, 0.8, 0.9, 1.0, 0.8],
  Leave: [46, 49, 53, 56, 59, 61, 60, 62],
  Payroll: [42, 44, 43, 45, 45, 46, 47, 49],
};

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function makeCsv(rows) {
  return rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
}

function downloadBlob(content, fileName, type = "text/plain;charset=utf-8;") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function makeExcelHtml(title, rows) {
  const body = rows
    .map(
      (row, index) =>
        `<tr>${row
          .map(
            (cell) =>
              `<${index === 0 ? "th" : "td"}>${String(cell ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")}</${index === 0 ? "th" : "td"}>`
          )
          .join("")}</tr>`
    )
    .join("");

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          body{font-family:Arial,sans-serif;padding:24px;color:#222}
          h1{font-size:20px}
          table{border-collapse:collapse;width:100%}
          th,td{border:1px solid #d9dee7;padding:8px;text-align:left}
          th{background:#eef3fb;font-weight:700}
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>${body}</table>
      </body>
    </html>
  `;
}

function makePdfHtml(title, rows) {
  const body = rows
    .map(
      (row, index) =>
        `<tr>${row
          .map(
            (cell) =>
              `<${index === 0 ? "th" : "td"}>${String(cell ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")}</${index === 0 ? "th" : "td"}>`
          )
          .join("")}</tr>`
    )
    .join("");

  const headerHtml = getCompanyPdfHeaderHtml({
    documentTitle: title,
    period: "2026"
  });

  return `
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 16mm; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color:#202630; background: #ffffff; padding: 10px; }
          table { width:100%; border-collapse:collapse; margin-top:15px; }
          th,td { border:1px solid #d9dee7; padding:8px; font-size:11px; text-align:left; }
          th { background:#eef3fb; font-weight:700; }
        </style>
      </head>
      <body>
        ${headerHtml}
        <table>${body}</table>
        <script>window.onload=function(){window.print();};</script>
      </body>
    </html>
  `;
}

export default function Reports() {
  const [activeMetric, setActiveMetric] = useState("Headcount");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState("All");
  const [department, setDepartment] = useState("All Departments");
  const [period, setPeriod] = useState("2026");
  const [format, setFormat] = useState("All Formats");
  const [toast, setToast] = useState("");

  const filteredReports = useMemo(() => {
    return INITIAL_REPORTS.filter((report) => {
      const typeMatches =
        selectedReport === "All" || report.id === selectedReport;
      const formatMatches =
        format === "All Formats" || report.formats.includes(format);
      return typeMatches && formatMatches;
    });
  }, [selectedReport, format]);

  const chartValues = CHARTS[activeMetric];
  const chartMin = Math.min(...chartValues);
  const chartMax = Math.max(...chartValues);
  const chartRange = chartMax - chartMin || 1;

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const getRows = (reportId) => REPORT_DATA[reportId] || [];

  const downloadReport = (report, outputFormat) => {
    const rows = getRows(report.id);
    const fileName = `${report.fileName}-${period}`;

    if (outputFormat === "CSV") {
      downloadBlob(makeCsv(rows), `${fileName}.csv`, "text/csv;charset=utf-8;");
      showToast(`${report.title} CSV downloaded.`);
      return;
    }

    if (outputFormat === "Excel") {
      downloadBlob(
        makeExcelHtml(report.title, rows),
        `${fileName}.xls`,
        "application/vnd.ms-excel;charset=utf-8;"
      );
      showToast(`${report.title} Excel file downloaded.`);
      return;
    }

    const printWindow = window.open("", "_blank", "width=1100,height=750");
    if (!printWindow) {
      showToast("Please allow pop-ups to generate the PDF.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(makePdfHtml(report.title, rows));
    printWindow.document.close();
    showToast(`${report.title} PDF print dialog opened.`);
  };

  const exportAll = () => {
    const rows = [
      [
        "Report",
        "Period",
        "Metric",
        "Value",
      ],
      ["Employee Report", period, "Total Records", "1,248"],
      ["Attendance Report", "Sep 2026", "Attendance Rate", "87.2%"],
      ["Leave Report", "Sep 2026", "Leave Requests", "353"],
      ["Payroll Report", "Aug 2026", "Total Gross", "₹4.07L"],
      ["Salary Report", period, "Employees", "1,248"],
      ["Overtime Report", period, "Employees with Overtime", "23"],
      ["Department Report", period, "Departments", "7"],
      ["Attrition Report", "YTD 2026", "Attrition Rate", "3.2%"],
    ];

    downloadBlob(
      makeCsv(rows),
      `hrms-reports-export-${period}.csv`,
      "text/csv;charset=utf-8;"
    );
    showToast("All HR reports exported as CSV.");
  };

  const downloadAnalytics = (metric = activeMetric) => {
    const rows = [
      ["Month", metric],
      ...MONTHS.map((month, index) => [month, CHARTS[metric][index]]),
    ];

    downloadBlob(
      makeCsv(rows),
      `analytics-${metric.toLowerCase()}-${period}.csv`,
      "text/csv;charset=utf-8;"
    );
    showToast(`${metric} analytics downloaded.`);
  };

  const applyFilters = () => {
    setFiltersOpen(false);
    showToast(
      `Filters applied: ${department}, ${period}${
        format !== "All Formats" ? `, ${format}` : ""
      }.`
    );
  };

  const clearFilters = () => {
    setSelectedReport("All");
    setDepartment("All Departments");
    setPeriod("2026");
    setFormat("All Formats");
    setFiltersOpen(false);
    showToast("Report filters cleared.");
  };

  const renderReportIcon = (type) => {
    const Icon = ICONS[type] || FiFileText;
    return <Icon />;
  };

  return (
    <HRLayout title="Reports & Analytics" breadcrumb="Reports">
      <div className="bel-reports-page">
        <header className="bel-reports-header">
          <div>
            <h1>Reports &amp; Analytics</h1>
            <p>Data-driven insights for your organization</p>
          </div>

          <div className="bel-reports-header-actions">
            <div className="bel-reports-filter-wrap">
              <button
                type="button"
                className={`bel-reports-filter-button ${filtersOpen ? "is-active" : ""}`}
                onClick={() => setFiltersOpen((value) => !value)}
              >
                <FiFilter />
                Filters
              </button>

              {filtersOpen && (
                <div className="bel-reports-filter-panel">
                  <div className="bel-reports-filter-title">
                    <div>
                      <strong>Report Filters</strong>
                      <span>Choose the data scope you want to export.</span>
                    </div>
                    <button type="button" onClick={() => setFiltersOpen(false)}>
                      <FiX />
                    </button>
                  </div>

                  <label>
                    Report Type
                    <select
                      value={selectedReport}
                      onChange={(event) => setSelectedReport(event.target.value)}
                    >
                      <option value="All">All Reports</option>
                      {INITIAL_REPORTS.map((report) => (
                        <option value={report.id} key={report.id}>
                          {report.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Department
                    <select
                      value={department}
                      onChange={(event) => setDepartment(event.target.value)}
                    >
                      <option>All Departments</option>
                      <option>Engineering</option>
                      <option>Human Resources</option>
                      <option>Finance</option>
                      <option>Product</option>
                      <option>Operations</option>
                      <option>Sales</option>
                      <option>Marketing</option>
                    </select>
                  </label>

                  <label>
                    Period
                    <select
                      value={period}
                      onChange={(event) => setPeriod(event.target.value)}
                    >
                      <option>2026</option>
                      <option>2025</option>
                      <option>2024</option>
                    </select>
                  </label>

                  <label>
                    Download Format
                    <select
                      value={format}
                      onChange={(event) => setFormat(event.target.value)}
                    >
                      <option>All Formats</option>
                      <option>PDF</option>
                      <option>Excel</option>
                      <option>CSV</option>
                    </select>
                  </label>

                  <div className="bel-reports-filter-actions">
                    <button type="button" onClick={clearFilters}>
                      Clear
                    </button>
                    <button type="button" className="primary" onClick={applyFilters}>
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="bel-reports-export-all"
              onClick={exportAll}
            >
              <FiDownload />
              Export All
            </button>
          </div>
        </header>

        <section className="bel-reports-grid">
          {filteredReports.map((report) => (
            <article className="bel-report-card" key={report.id}>
              <div className={`bel-report-card-icon bel-report-icon-${report.icon}`}>
                {renderReportIcon(report.icon)}
              </div>

              <button
                type="button"
                className="bel-report-quick-download"
                title={`Download ${report.title} as CSV`}
                onClick={() => downloadReport(report, "CSV")}
              >
                <FiDownload />
              </button>

              <div className="bel-report-card-content">
                <h2>{report.title}</h2>
                <p>{report.period}</p>
                <small>{report.description}</small>
              </div>

              <div className="bel-report-card-footer">
                <div className="bel-report-format-list">
                  {report.formats.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => downloadReport(report, item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="bel-report-download-main"
                  onClick={() =>
                    downloadReport(
                      report,
                      format === "All Formats" ? "CSV" : format
                    )
                  }
                >
                  <FiDownload />
                  Download
                </button>
              </div>
            </article>
          ))}
        </section>

        {filteredReports.length === 0 && (
          <div className="bel-reports-empty">
            <FiFileText />
            <strong>No reports match the selected filters.</strong>
            <button type="button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}

        <section className="bel-reports-analytics-card">
          <div className="bel-reports-analytics-header">
            <div>
              <h2>Analytics Overview</h2>
              <p>January — August {period}</p>
            </div>

            <div className="bel-reports-metric-tabs">
              {Object.keys(CHARTS).map((metric) => (
                <button
                  type="button"
                  key={metric}
                  className={activeMetric === metric ? "is-active" : ""}
                  onClick={() => setActiveMetric(metric)}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>

          <div className="bel-reports-chart">
            <div className="bel-reports-chart-ylabels">
              <span>{Math.round(chartMax)}</span>
              <span>{Math.round(chartMin + chartRange * 0.66)}</span>
              <span>{Math.round(chartMin + chartRange * 0.33)}</span>
              <span>{Math.round(chartMin)}</span>
            </div>

            <div className="bel-reports-chart-area">
              <div className="bel-reports-grid-lines">
                <span />
                <span />
                <span />
                <span />
              </div>

              <svg
                className="bel-reports-line-svg"
                viewBox="0 0 800 270"
                preserveAspectRatio="none"
                role="img"
                aria-label={`${activeMetric} analytics chart`}
              >
                <defs>
                  <linearGradient id="belReportsChartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopOpacity="0.18" />
                    <stop offset="100%" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <polygon
                  points={`0,270 ${chartValues
                    .map((value, index) => {
                      const x = (index / (chartValues.length - 1)) * 800;
                      const y = 18 + ((chartMax - value) / chartRange) * 210;
                      return `${x},${y}`;
                    })
                    .join(" ")} 800,270`}
                  fill="url(#belReportsChartFill)"
                />

                <polyline
                  points={chartValues
                    .map((value, index) => {
                      const x = (index / (chartValues.length - 1)) * 800;
                      const y = 18 + ((chartMax - value) / chartRange) * 210;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {chartValues.map((value, index) => {
                  const x = (index / (chartValues.length - 1)) * 800;
                  const y = 18 + ((chartMax - value) / chartRange) * 210;
                  return (
                    <g key={`${activeMetric}-${index}`}>
                      <circle cx={x} cy={y} r="5" fill="#fff" stroke="currentColor" strokeWidth="3" />
                      <title>{`${MONTHS[index]}: ${value}`}</title>
                    </g>
                  );
                })}
              </svg>

              <div className="bel-reports-chart-months">
                {MONTHS.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bel-reports-analytics-footer">
            <div className="bel-reports-kpi">
              <span>Attendance Rate</span>
              <strong>87.2%</strong>
              <small><b>+1.4%</b> vs last month</small>
            </div>

            <div className="bel-reports-kpi">
              <span>Attrition Rate</span>
              <strong>3.2%</strong>
              <small><b>-0.8%</b> YTD 2026</small>
            </div>

            <div className="bel-reports-kpi">
              <span>Leave Utilization</span>
              <strong>62%</strong>
              <small className="warning"><b>+5%</b> of total balance</small>
            </div>

            <button
              type="button"
              className="bel-reports-analytics-download"
              onClick={() => downloadAnalytics()}
            >
              <FiDownload />
              Download Analytics
            </button>
          </div>
        </section>

        <div className="bel-reports-access-note">
          <FiCheck />
          <span>
            Reports contain HR-authorized organizational data. Payroll and salary
            exports should only be accessible to users with the appropriate HR/Finance permissions.
          </span>
        </div>

        {toast && (
          <div className="bel-reports-toast">
            <FiCheck />
            {toast}
          </div>
        )}
      </div>
    </HRLayout>
  );
}
