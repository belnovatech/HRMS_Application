import React, { useState } from "react";
import "./ReportsAnalytics.css";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import { exportToPDF } from "../../utils/exportPdf";
import { exportToExcel } from "../../utils/exportExcel";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ReportsAnalytics() {
  const [period, setPeriod] = useState("Last 6 months");
  const [department, setDepartment] = useState("All Departments");

  const employeeGrowthData = [
    { month: "Jan", employees: 98 },
    { month: "Feb", employees: 102 },
    { month: "Mar", employees: 105 },
    { month: "Apr", employees: 108 },
    { month: "May", employees: 112 },
    { month: "Jun", employees: 115 },
  ];

  const salaryData = [
    { dept: "Eng", salary: 95000 },
    { dept: "Sales", salary: 72000 },
    { dept: "HR", salary: 68000 },
    { dept: "Fin", salary: 85000 },
    { dept: "Mktg", salary: 70000 },
  ];

  const attendanceData = [
    { month: "Jan", attendance: 88 },
    { month: "Feb", attendance: 91 },
    { month: "Mar", attendance: 85 },
    { month: "Apr", attendance: 93 },
    { month: "May", attendance: 89 },
    { month: "Jun", attendance: 94 },
  ];

  return (
    <div className="reports-main">
      <Sidebar />

      <div className="reports-container">
        <Header
  title="Reports & Analytics"
  breadcrumb="Reports"
/>
      <div className="top-filters">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option>Last 6 months</option>
            <option>Last year</option>
            <option>Custom range</option>
          </select>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Marketing</option>
          </select>

          <button
            className="export-btn"
            onClick={exportToPDF}
          >
            Export PDF
          </button>

          <button
            className="export-btn"
            onClick={exportToExcel}
          >
            Export Excel
          </button>
        </div>

        <div
          id="reports-container"
          className="reports-grid"
        >
          {/* Employee Growth */}

          <div className="card chart-card">
            <h3>Employee Growth Trend</h3>

            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <LineChart data={employeeGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Salary */}

          <div className="card chart-card">
            <h3>Salary Distribution by Dept</h3>

            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="salary"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance */}

          <div className="card chart-card">
            <h3>Monthly Attendance %</h3>

            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Reports */}

          <div className="card quick-report-card">
            <h3>Quick Reports</h3>

            <div className="quick-grid">
              <button>Employee Report</button>
              <button>Attendance Report</button>
              <button>Leave Report</button>
              <button>Payroll Report</button>
              <button>Attrition Report</button>
              <button>Dept Performance</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}