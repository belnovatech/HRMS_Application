import React, { useMemo, useState, useEffect, useCallback } from "react";
import "./Reports.css";
import HRLayout from "../../../layouts/HRLayout";
import api from "../../../api/axiosInstance";
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

import { useAuth } from "../../../context/AuthContext";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const INITIAL_REPORTS = [
  {
    id: "employee",
    title: "Employee Report",
    icon: "users",
    description: "Employee master data, department, designation and employment details.",
    period: "Master records",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "employee-report",
  },
  {
    id: "attendance",
    title: "Attendance Report",
    icon: "attendance",
    description: "Attendance status, working hours, late arrivals, overtime and WFH records.",
    period: "Current Period",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "attendance-report",
  },
  {
    id: "leave",
    title: "Leave Report",
    icon: "leave",
    description: "Leave requests, approvals, leave types, balances and utilization.",
    period: "All requests",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "leave-report",
  },
  {
    id: "payroll",
    title: "Payroll Report",
    icon: "payroll",
    description: "Gross pay, deductions, net salary, tax and payroll processing data.",
    period: "Current Month",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "payroll-report",
  },
  {
    id: "salary",
    title: "Salary Report",
    icon: "salary",
    description: "Salary structure, basic pay, allowances, deductions and compensation.",
    period: "All active staff",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "salary-report",
  },
  {
    id: "overtime",
    title: "Overtime Report",
    icon: "overtime",
    description: "Overtime hours, employee-wise overtime and payable overtime amounts.",
    period: "Current cycle",
    formats: ["PDF", "Excel", "CSV"],
    fileName: "overtime-report",
  },
  {
    id: "department",
    title: "Department Report",
    icon: "department",
    description: "Department headcount, staffing, attendance and workforce distribution.",
    period: "All departments",
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

const DEFAULT_REPORT_DATA = {
  employee: [
    ["Employee ID", "Employee Name", "Department", "Designation", "Employment Status"],
  ],
  attendance: [
    ["Employee ID", "Employee Name", "Date", "Check In", "Check Out", "Working Hours", "Status"],
  ],
  leave: [
    ["Request ID", "Employee", "Leave Type", "From", "To", "Days", "Reason", "Status"],
  ],
  payroll: [
    ["Employee ID", "Employee", "Basic", "HRA", "Allowances", "Gross", "Deductions", "Net Salary"],
  ],
  salary: [
    ["Employee ID", "Employee", "Department", "Basic Salary", "Allowances", "Gross Salary"],
  ],
  overtime: [
    ["Employee ID", "Employee", "Department", "Overtime Hours", "Rate", "Payable Amount"],
  ],
  department: [
    ["Department", "Headcount", "Active", "On Leave", "Attendance Rate"],
  ],
  attrition: [
    ["Month", "Opening Headcount", "New Joiners", "Exits", "Closing Headcount", "Attrition Rate"],
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
  const { teamMembers = [], leaveRequests = [], attendanceRecords = [] } = useAuth();
  const [activeMetric, setActiveMetric] = useState("Headcount");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState("All");
  const [department, setDepartment] = useState("All Departments");
  const [period, setPeriod] = useState("2026");
  const [format, setFormat] = useState("All Formats");
  const [toast, setToast] = useState("");
  const [liveReportData, setLiveReportData] = useState(DEFAULT_REPORT_DATA);

  const fetchReportsData = useCallback(async () => {
    try {
      const [empRes, attRes] = await Promise.allSettled([
        api.get("/Reports/employees"),
        api.get("/Reports/attendance")
      ]);

      setLiveReportData((prev) => {
        const next = { ...prev };
        if (empRes.status === "fulfilled" && Array.isArray(empRes.value?.data) && empRes.value.data.length > 0) {
          const header = ["Employee ID", "Employee Name", "Department", "Designation", "Employment Status"];
          const rows = empRes.value.data.map((e) => [
            e.employeeNumber || e.id,
            `${e.firstName || ""} ${e.lastName || ""}`.trim() || e.name || "Employee",
            e.department || "Engineering",
            e.designation || e.role || "Staff",
            e.status || "Active"
          ]);
          next.employee = [header, ...rows];
        } else if (teamMembers.length > 0) {
          const header = ["Employee ID", "Employee Name", "Department", "Designation", "Employment Status"];
          const rows = teamMembers.map((e) => [
            e.employeeId || e.id || "—",
            e.name || "Employee",
            e.department || "Engineering",
            e.role || "Staff",
            e.status || "Active"
          ]);
          next.employee = [header, ...rows];
          next.salary = [
            ["Employee ID", "Employee", "Department", "Basic Salary", "Allowances", "Gross Salary"],
            ...teamMembers.map((e) => [e.employeeId || e.id || "—", e.name || "Employee", e.department || "Engineering", "₹45,000", "₹15,000", "₹60,000"])
          ];
          next.payroll = [
            ["Employee ID", "Employee", "Basic", "HRA", "Allowances", "Gross", "Deductions", "Net Salary"],
            ...teamMembers.map((e) => [e.employeeId || e.id || "—", e.name || "Employee", "₹35,000", "₹14,000", "₹6,000", "₹55,000", "₹5,500", "₹49,500"])
          ];
        }

        if (attRes.status === "fulfilled" && Array.isArray(attRes.value?.data) && attRes.value.data.length > 0) {
          const header = ["Employee ID", "Employee Name", "Date", "Status", "Working Hours"];
          const rows = attRes.value.data.map((a) => [
            a.employeeId,
            a.employeeName || "Employee",
            a.date || "Today",
            a.status || "Present",
            a.workingHours || "8h 30m"
          ]);
          next.attendance = [header, ...rows];
        } else if (attendanceRecords.length > 0) {
          const header = ["Employee ID", "Employee Name", "Date", "Status", "Working Hours"];
          const rows = attendanceRecords.map((a) => [
            a.employeeId || "EMP001",
            a.employeeName || "Employee",
            a.date || "Today",
            a.status || "Present",
            a.workingHours || "8h 00m"
          ]);
          next.attendance = [header, ...rows];
        }

        if (leaveRequests.length > 0) {
          const header = ["Request ID", "Employee", "Leave Type", "From", "To", "Days", "Reason", "Status"];
          const rows = leaveRequests.map((l) => [
            l.id || "LV001",
            l.employeeName || l.employeeId || "Employee",
            l.leaveType || "Leave",
            l.startDate || "—",
            l.endDate || "—",
            l.days || 1,
            l.reason || "Personal",
            l.status || "Pending"
          ]);
          next.leave = [header, ...rows];
        }

        return next;
      });
    } catch (err) {
      console.warn("Reports fetch error:", err.message);
    }
  }, [teamMembers, attendanceRecords, leaveRequests]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

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

  const getRows = (reportId) => liveReportData[reportId] || DEFAULT_REPORT_DATA[reportId] || [];

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
