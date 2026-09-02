import React, { useState } from "react";
import "./AttendanceTrend.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function AttendanceTrend() {
  const [activeTab, setActiveTab] = useState("attendance");

  const attendanceData = [
    { day: "Mon", Present: 1086, Absent: 72, Late: 30 },
    { day: "Tue", Present: 1095, Absent: 65, Late: 25 },
    { day: "Wed", Present: 1072, Absent: 82, Late: 35 },
    { day: "Thu", Present: 1102, Absent: 58, Late: 22 },
    { day: "Fri", Present: 1080, Absent: 75, Late: 40 },
    { day: "Sat", Present: 820, Absent: 340, Late: 15 },
  ];

  const growthData = [
    { day: "Mon", Hires: 12, Departures: 2, Total: 1240 },
    { day: "Tue", Hires: 14, Departures: 1, Total: 1242 },
    { day: "Wed", Hires: 15, Departures: 3, Total: 1244 },
    { day: "Thu", Hires: 18, Departures: 1, Total: 1246 },
    { day: "Fri", Hires: 20, Departures: 2, Total: 1248 },
    { day: "Sat", Hires: 5, Departures: 0, Total: 1248 },
  ];

  const payrollData = [
    { day: "Mon", Disbursed: 45.2, Pending: 3.5, Tax: 6.2 },
    { day: "Tue", Disbursed: 46.0, Pending: 2.7, Tax: 6.5 },
    { day: "Wed", Disbursed: 47.1, Pending: 1.6, Tax: 6.8 },
    { day: "Thu", Disbursed: 48.2, Pending: 0.5, Tax: 7.0 },
    { day: "Fri", Disbursed: 48.7, Pending: 0.0, Tax: 7.2 },
    { day: "Sat", Disbursed: 48.7, Pending: 0.0, Tax: 7.2 },
  ];

  return (
    <div className="hradmin-dashboard-trend-card">
      <div className="hradmin-dashboard-trend-header">
        <div className="hradmin-dashboard-trend-title-block">
          <h3 className="hradmin-dashboard-card-title">Attendance Trend</h3>
          <span className="hradmin-dashboard-card-subtitle">This week</span>
        </div>

        <div className="hradmin-dashboard-segmented-tabs">
          <button
            type="button"
            className={`hradmin-dashboard-tab-btn ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            Attendance
          </button>
          <button
            type="button"
            className={`hradmin-dashboard-tab-btn ${activeTab === "growth" ? "active" : ""}`}
            onClick={() => setActiveTab("growth")}
          >
            Growth
          </button>
          <button
            type="button"
            className={`hradmin-dashboard-tab-btn ${activeTab === "payroll" ? "active" : ""}`}
            onClick={() => setActiveTab("payroll")}
          >
            Payroll
          </button>
        </div>
      </div>

      <div className="hradmin-dashboard-chart-container">
        <ResponsiveContainer width="100%" height={260}>
          {activeTab === "attendance" ? (
            <BarChart data={attendanceData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[0, 1200]} ticks={[0, 300, 600, 900, 1200]} />
              <Tooltip contentStyle={{ background: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="Present" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Absent" fill="#f87171" radius={[6, 6, 0, 0]} maxBarSize={16} />
              <Bar dataKey="Late" fill="#fbbf24" radius={[6, 6, 0, 0]} maxBarSize={16} />
            </BarChart>
          ) : activeTab === "growth" ? (
            <BarChart data={growthData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
              <Bar dataKey="Hires" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Departures" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={16} />
            </BarChart>
          ) : (
            <BarChart data={payrollData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
              <Bar dataKey="Disbursed" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Pending" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={16} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
