import React, { useState, useMemo } from "react";
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
import { useAuth } from "../../../context/AuthContext";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AttendanceTrend() {
  const { attendanceRecords = [], teamMembers = [] } = useAuth();
  const [activeTab, setActiveTab] = useState("attendance");

  const totalEmployees = teamMembers.length || 2;

  const attendanceData = useMemo(() => {
    return DAYS_OF_WEEK.map((day) => {
      const recordsForDay = attendanceRecords.filter((r) => {
        if (!r.date) return false;
        const d = new Date(`${r.date}T00:00:00`);
        return !Number.isNaN(d.getTime()) && d.toLocaleDateString("en-US", { weekday: "short" }) === day;
      });

      const present = recordsForDay.filter((r) => r.status === "Present" || r.checkIn).length;
      const absent = recordsForDay.filter((r) => r.status === "Absent").length;
      const late = recordsForDay.filter((r) => r.status === "Late").length;

      return {
        day,
        Present: present || (recordsForDay.length === 0 ? totalEmployees : present),
        Absent: absent,
        Late: late,
      };
    });
  }, [attendanceRecords, totalEmployees]);

  const growthData = useMemo(() => {
    return DAYS_OF_WEEK.map((day) => ({
      day,
      Hires: 0,
      Departures: 0,
      Total: totalEmployees,
    }));
  }, [totalEmployees]);

  const payrollData = useMemo(() => {
    return DAYS_OF_WEEK.map((day) => ({
      day,
      Disbursed: 0,
      Pending: 0,
    }));
  }, []);

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
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="Present" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Absent" fill="#f87171" radius={[6, 6, 0, 0]} maxBarSize={16} />
              <Bar dataKey="Late" fill="#fbbf24" radius={[6, 6, 0, 0]} maxBarSize={16} />
            </BarChart>
          ) : activeTab === "growth" ? (
            <BarChart data={growthData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
              <Bar dataKey="Hires" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Departures" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={16} />
            </BarChart>
          ) : (
            <BarChart data={payrollData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
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
