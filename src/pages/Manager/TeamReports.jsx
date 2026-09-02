import React, { useMemo, useState } from "react";
import ManagerLayout from "../../layouts/ManagerLayout";
import { useAuth } from "../../context/AuthContext";
import { downloadReportPdf } from "../../utils/pdfGenerator";

import {
  FiDownload,
  FiFilter,
  FiBarChart2,
  FiX,
  FiChevronDown,
} from "react-icons/fi";

import "./TeamReports.css";


export default function TeamReports() {
  const { teamMembers = [] } = useAuth();

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [activeChart, setActiveChart] = useState("headcount");

  const [showFilters, setShowFilters] = useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState("all");

  const [selectedPeriod, setSelectedPeriod] =
    useState("2026");

  // const [selectedReport, setSelectedReport] =
  //   useState(null);


  /*
   * =========================================================
   * REPORT DATA
   * =========================================================
   */

  const reportCards = [
    {
      id: "employee",
      icon: "👥",
      title: "Employee Report",
      subtitle: `${teamMembers.length || 1248} records`,
    },
    {
      id: "attendance",
      icon: "⏰",
      title: "Attendance Report",
      subtitle: "Sep 2026",
    },
    {
      id: "leave",
      icon: "🌴",
      title: "Leave Report",
      subtitle: "353 requests",
    },
    {
      id: "payroll",
      icon: "💰",
      title: "Payroll Report",
      subtitle: "Aug 2026",
    },
    {
      id: "salary",
      icon: "📊",
      title: "Salary Report",
      subtitle: "All employees",
    },
    {
      id: "overtime",
      icon: "⚡",
      title: "Overtime Report",
      subtitle: `${teamMembers.length || 23} employees`,
    },
    {
      id: "department",
      icon: "🏢",
      title: "Department Report",
      subtitle: "7 departments",
    },
    {
      id: "attrition",
      icon: "📉",
      title: "Attrition Report",
      subtitle: "YTD 2026",
    },
  ];


  /*
   * =========================================================
   * DEPARTMENTS
   * =========================================================
   */

  const departments = useMemo(() => {
    const values = teamMembers
      .map((member) => member.department)
      .filter(Boolean);

    return [...new Set(values)];
  }, [teamMembers]);


  /*
   * =========================================================
   * FILTERED TEAM
   * =========================================================
   */

  const filteredMembers = useMemo(() => {
    if (selectedDepartment === "all") {
      return teamMembers;
    }

    return teamMembers.filter(
      (member) =>
        member.department === selectedDepartment
    );
  }, [teamMembers, selectedDepartment]);


  /*
   * =========================================================
   * ANALYTICS DATA
   * =========================================================
   */

  const chartData = {
    headcount: {
      label: "Headcount",
      values: [
        1108,
        1138,
        1162,
        1185,
        1198,
        1212,
        1234,
        1250,
      ],
    },

    attrition: {
      label: "Attrition",
      values: [
        4.8,
        4.5,
        4.1,
        3.9,
        3.7,
        3.5,
        3.3,
        3.2,
      ],
    },

    leave: {
      label: "Leave",
      values: [
        42,
        55,
        49,
        64,
        58,
        71,
        62,
        67,
      ],
    },

    payroll: {
      label: "Payroll",
      values: [
        72,
        78,
        81,
        84,
        88,
        91,
        94,
        98,
      ],
    },
  };


  const currentChart = chartData[activeChart];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
  ];


  /*
   * =========================================================
   * CHART CALCULATION
   * =========================================================
   */

  const chartWidth = 760;
  const chartHeight = 245;

  const chartPaddingLeft = 38;
  const chartPaddingRight = 12;
  const chartPaddingTop = 15;
  const chartPaddingBottom = 32;

  const usableWidth =
    chartWidth -
    chartPaddingLeft -
    chartPaddingRight;

  const usableHeight =
    chartHeight -
    chartPaddingTop -
    chartPaddingBottom;

  const values = currentChart.values;

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const range =
    maxValue - minValue === 0
      ? 1
      : maxValue - minValue;

  const points = values.map((value, index) => {
    const x =
      chartPaddingLeft +
      (index / (values.length - 1)) *
        usableWidth;

    const y =
      chartPaddingTop +
      usableHeight -
      ((value - minValue) / range) *
        usableHeight;

    return {
      x,
      y,
      value,
    };
  });


  const linePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const areaPoints = [
    `${points[0].x},${chartHeight - chartPaddingBottom}`,
    ...points.map(
      (point) => `${point.x},${point.y}`
    ),
    `${points[points.length - 1].x},${
      chartHeight - chartPaddingBottom
    }`,
  ].join(" ");


  /*
   * =========================================================
   * EXPORT CSV
   * =========================================================
   */

  const downloadCSV = (
    reportName = "team-report"
  ) => {
    const rows = filteredMembers.map((member) => ({
      ID: member.id || "",
      Name: member.name || "",
      Designation: member.designation || "",
      Department: member.department || "",
      Email: member.email || "",
      Phone: member.phone || "",
      Status: member.status || "",
      Performance:
        member.performance || "",
    }));

    /*
     * If no AuthContext members exist,
     * create a sample report row.
     */
    if (!rows.length) {
      rows.push({
        ID: "EMP001",
        Name: "Arjun Mehta",
        Designation: "Senior Engineer",
        Department: "Engineering",
        Email: "arjun@belnova.com",
        Phone: "+91 98765 43210",
        Status: "Present",
        Performance: "94%",
      });
    }

    const headers = Object.keys(rows[0]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = String(
              row[header] ?? ""
            ).replace(/"/g, '""');

            return `"${value}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${reportName}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  /*
   * =========================================================
   * REPORT ACTION
   * =========================================================
   */

  const handleReportDownload = (
    report,
    format
  ) => {
    if (format === "CSV") {
      downloadCSV(
        `${report.title
          .toLowerCase()
          .replace(/\s+/g, "-")}`
      );
      return;
    }

    if (format === "PDF") {
      const headers = ["Employee ID", "Name", "Department", "Designation", "Status"];
      const rows = filteredMembers.map((m) => [m.id || "EMP-1001", m.name || "Arjun Mehta", m.department || "Engineering", m.designation || "Senior Engineer", m.status || "Active"]);
      downloadReportPdf(report.title, selectedPeriod, headers, rows, `${report.title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
      return;
    }

    alert(
      `${report.title} ${format} export selected.`
    );
  };


  /*
   * =========================================================
   * CLEAR FILTERS
   * =========================================================
   */

  const clearFilters = () => {
    setSelectedDepartment("all");
    setSelectedPeriod("2026");
  };


  /*
   * =========================================================
   * RESET FILTERS WHEN CLOSING
   * =========================================================
   */

  const hasActiveFilters =
    selectedDepartment !== "all" ||
    selectedPeriod !== "2026";


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <ManagerLayout
      title="Team Reports"
      breadcrumb="Team Reports"
    >
      <div className="teamreports-page">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="teamreports-header">

          <div className="teamreports-heading">

            <h1>Reports & Analytics</h1>

            <p>
              Data-driven insights for your organization
            </p>

          </div>


          <div className="teamreports-header-actions">

            <button
              type="button"
              className={`teamreports-filter-button ${
                showFilters
                  ? "teamreports-filter-active"
                  : ""
              }`}
              onClick={() =>
                setShowFilters(!showFilters)
              }
            >
              <FiFilter size={14} />

              <span>Filters</span>
            </button>


            <button
              type="button"
              className="teamreports-export-all"
              onClick={() =>
                downloadCSV("team-reports")
              }
            >
              <FiDownload size={14} />

              <span>Export All</span>
            </button>

          </div>

        </div>


        {/* ==================================================
            FILTER PANEL
        ================================================== */}

        {showFilters && (

          <div className="teamreports-filter-panel">

            <div className="teamreports-filter-heading">

              <div>

                <strong>
                  Report Filters
                </strong>

                <span>
                  Customize the data displayed
                </span>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(false)
                }
                className="teamreports-filter-close"
              >
                <FiX size={15} />
              </button>

            </div>


            <div className="teamreports-filter-controls">

              <div className="teamreports-filter-field">

                <label>
                  Department
                </label>

                <div className="teamreports-select-wrap">

                  <select
                    value={selectedDepartment}
                    onChange={(event) =>
                      setSelectedDepartment(
                        event.target.value
                      )
                    }
                  >

                    <option value="all">
                      All Departments
                    </option>

                    {departments.map(
                      (department) => (
                        <option
                          value={department}
                          key={department}
                        >
                          {department}
                        </option>
                      )
                    )}

                  </select>

                  <FiChevronDown
                    size={13}
                  />

                </div>

              </div>


              <div className="teamreports-filter-field">

                <label>
                  Reporting Period
                </label>

                <div className="teamreports-select-wrap">

                  <select
                    value={selectedPeriod}
                    onChange={(event) =>
                      setSelectedPeriod(
                        event.target.value
                      )
                    }
                  >
                    <option value="2026">
                      2026
                    </option>

                    <option value="2025">
                      2025
                    </option>

                    <option value="2024">
                      2024
                    </option>
                  </select>

                  <FiChevronDown
                    size={13}
                  />

                </div>

              </div>


              {hasActiveFilters && (

                <button
                  type="button"
                  className="teamreports-clear-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              )}

            </div>

          </div>

        )}


        {/* ==================================================
            REPORT CARDS
        ================================================== */}

        <div className="teamreports-card-grid">

          {reportCards.map((report) => (

            <div
              className="teamreports-report-card"
              key={report.id}
            >

              <div className="teamreports-report-top">

                <span className="teamreports-report-icon">
                  {report.icon}
                </span>

                <button
                  type="button"
                  className="teamreports-mini-download"
                  title={`Download ${report.title}`}
                  onClick={() =>
                    downloadCSV(
                      report.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    )
                  }
                >
                  <FiDownload size={12} />
                </button>

              </div>


              <div className="teamreports-report-content">

                <h3>
                  {report.title}
                </h3>

                <p>
                  {report.subtitle}
                </p>

              </div>


              <div className="teamreports-format-list">

                {["PDF", "Excel", "CSV"].map(
                  (format) => (

                    <button
                      type="button"
                      key={format}
                      onClick={() =>
                        handleReportDownload(
                          report,
                          format
                        )
                      }
                    >
                      {format}
                    </button>

                  )
                )}

              </div>

            </div>

          ))}

        </div>


        {/* ==================================================
            ANALYTICS
        ================================================== */}

        <section className="teamreports-analytics-card">

          <div className="teamreports-analytics-header">

            <div>

              <h2>
                Analytics Overview
              </h2>

              <p>
                January — August 2026
              </p>

            </div>


            <div className="teamreports-chart-tabs">

              {[
                "headcount",
                "attrition",
                "leave",
                "payroll",
              ].map((tab) => (

                <button
                  type="button"
                  key={tab}
                  className={
                    activeChart === tab
                      ? "teamreports-chart-tab-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveChart(tab)
                  }
                >
                  {tab.charAt(0).toUpperCase() +
                    tab.slice(1)}
                </button>

              ))}

            </div>

          </div>


          {/* ==================================================
              CHART
          ================================================== */}

          <div className="teamreports-chart-container">

            <svg
              className="teamreports-chart"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              role="img"
              aria-label={`${currentChart.label} analytics chart`}
            >

              <defs>

                <linearGradient
                  id="teamreportsChartGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#3b82f6"
                    stopOpacity="0.20"
                  />

                  <stop
                    offset="100%"
                    stopColor="#3b82f6"
                    stopOpacity="0.01"
                  />

                </linearGradient>

              </defs>


              {/* Grid */}

              {[0, 1, 2, 3, 4].map(
                (line) => {

                  const y =
                    chartPaddingTop +
                    (usableHeight / 4) *
                      line;

                  return (
                    <line
                      key={line}
                      x1={chartPaddingLeft}
                      y1={y}
                      x2={
                        chartWidth -
                        chartPaddingRight
                      }
                      y2={y}
                      stroke="#e9edf2"
                      strokeDasharray="2 4"
                    />
                  );
                }
              )}


              {/* Area */}

              <polygon
                points={areaPoints}
                fill="url(#teamreportsChartGradient)"
              />


              {/* Line */}

              <polyline
                points={linePoints}
                fill="none"
                stroke="#287cf4"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />


              {/* Points */}

              {points.map(
                (point, index) => (

                  <g key={index}>

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="3.7"
                      fill="#ffffff"
                      stroke="#287cf4"
                      strokeWidth="2"
                    />

                    <title>
                      {months[index]}{" "}
                      {currentChart.label}:{" "}
                      {point.value}
                    </title>

                  </g>

                )
              )}


              {/* Month Labels */}

              {months.map(
                (month, index) => {

                  const x =
                    chartPaddingLeft +
                    (index /
                      (months.length - 1)) *
                      usableWidth;

                  return (
                    <text
                      key={month}
                      x={x}
                      y={
                        chartHeight -
                        10
                      }
                      textAnchor="middle"
                      className="teamreports-chart-label"
                    >
                      {month}
                    </text>
                  );
                }
              )}

            </svg>

          </div>

        </section>


        {/* ==================================================
            METRIC CARDS
        ================================================== */}

        <div className="teamreports-metrics-grid">

          {/* Attendance */}

          <div className="teamreports-metric-card">

            <span className="teamreports-metric-label">
              Attendance Rate
            </span>

            <strong className="teamreports-metric-value">
              87.2%
            </strong>

            <div className="teamreports-metric-change teamreports-change-positive">

              <span>
                +1.4%
              </span>

              <small>
                vs last month
              </small>

            </div>

          </div>


          {/* Attrition */}

          <div className="teamreports-metric-card">

            <span className="teamreports-metric-label">
              Attrition Rate
            </span>

            <strong className="teamreports-metric-value">
              3.2%
            </strong>

            <div className="teamreports-metric-change teamreports-change-positive">

              <span>
                -0.8%
              </span>

              <small>
                YTD 2026
              </small>

            </div>

          </div>


          {/* Leave */}

          <div className="teamreports-metric-card">

            <span className="teamreports-metric-label">
              Leave Utilization
            </span>

            <strong className="teamreports-metric-value">
              62%
            </strong>

            <div className="teamreports-metric-change teamreports-change-warning">

              <span>
                +5%
              </span>

              <small>
                of total balance
              </small>

            </div>

          </div>

        </div>


        {/* ==================================================
            FILTER RESULT INFORMATION
        ================================================== */}

        {selectedDepartment !== "all" && (

          <div className="teamreports-filter-result">

            <FiBarChart2 size={15} />

            <span>
              Showing reports for{" "}
              <strong>
                {selectedDepartment}
              </strong>{" "}
              department
            </span>

          </div>

        )}

      </div>
    </ManagerLayout>
  );
}