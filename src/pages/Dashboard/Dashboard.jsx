import React, { useEffect, useState, useMemo } from "react";
import "./Dashboard.css";
import HRLayout from "../../layouts/HRLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUsers,
  FiCheckCircle,
  FiX,
  FiCalendar,
  FiAlertCircle,
  FiDollarSign,
} from "react-icons/fi";

import PayrollChart from "../../components/Charts/PayrollChart/PayrollChart";
import LeaveChart from "../../components/Charts/LeaveTrend/LeaveChart";
import AttendanceChart from "../../components/Charts/AttendanceChart/Attendancechart";
import DepartmentChart from "../../components/Charts/DepartmentChart/DepartmentChart";
import api from "../../api/axiosInstance";

export default function Dashboard() {
  const navigate = useNavigate();
  const { teamMembers = [], leaveRequests = [], holidays = [] } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchSummary = async () => {
      try {
        const res = await api.get("/dashboard/summary");
        if (active) setSummary(res.data);
      } catch (err) {
        if (active) setSummary(null);
      }
    };
    fetchSummary();
    return () => { active = false; };
  }, []);

  const totalEmployees = summary?.total_employees?.count ?? teamMembers.length;
  const activeEmployees = summary?.active_employees?.count ?? teamMembers.filter(m => m.status !== "Inactive").length;
  const pendingApprovalsCount = leaveRequests.filter(r => r.status === "Pending").length;
  const approvedLeaveCount = leaveRequests.filter(r => r.status === "Approved").length;

  const stats = [
    {
      title: "TOTAL EMPLOYEES",
      value: String(totalEmployees),
      change: "Active in system",
      icon: <FiUsers />,
      bg: "#eaf2ff",
      color: "#2563eb",
    },
    {
      title: "ACTIVE EMPLOYEES",
      value: String(activeEmployees),
      change: "Currently Active",
      icon: <FiCheckCircle />,
      bg: "#eaf8ed",
      color: "#22c55e",
    },
    {
      title: "ON LEAVE / ABSENT",
      value: String(approvedLeaveCount),
      change: "Approved leaves",
      icon: <FiX />,
      bg: "#fdecec",
      color: "#ef4444",
    },
    {
      title: "PENDING APPROVALS",
      value: String(pendingApprovalsCount),
      change: pendingApprovalsCount > 0 ? "Needs action" : "All clear",
      icon: <FiAlertCircle />,
      bg: "#f3efff",
      color: "#8b5cf6",
    },
    {
      title: "DEPARTMENTS",
      value: String(new Set(teamMembers.map(m => m.department || "General")).size || 1),
      change: "Active branches",
      icon: <FiCalendar />,
      bg: "#fff6e6",
      color: "#f59e0b",
    },
    {
      title: "MONTHLY PAYROLL",
      value: `₹${((totalEmployees * 55000) / 100000).toFixed(1)}L`,
      change: "Estimated gross",
      icon: <FiDollarSign />,
      bg: "#eaf2ff",
      color: "#2563eb",
    },
  ];

  const recentLeaves = useMemo(() => {
    return leaveRequests.slice(0, 4);
  }, [leaveRequests]);

  return (
    <HRLayout title="Executive Dashboard" breadcrumb="Dashboard">
      <div className="dashboard-content-wrapper">
        {/* STATS */}
        <div className="stats-grid">
          {stats.map((item, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-info">
                <span>{item.title}</span>
                <h2>{item.value}</h2>
                <p>{item.change}</p>
              </div>
              <div
                className="stat-icon"
                style={{ background: item.bg, color: item.color }}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Attendance + Department Charts */}
        <div className="chart-row">
          <div className="chart-card large">
            <h3>Attendance Trend</h3>
            <AttendanceChart />
          </div>
          <div className="chart-card">
            <h3>Dept. Distribution</h3>
            <DepartmentChart />
          </div>
        </div>

        {/* Payroll + Leave Charts */}
        <div className="chart-row">
          <div className="chart-card">
            <h3>Payroll Expenses (₹ Lakhs)</h3>
            <PayrollChart />
          </div>
          <div className="chart-card">
            <h3>Leave Trends</h3>
            <LeaveChart />
          </div>
        </div>

        {/* BOTTOM WIDGETS SECTION */}
        <div className="bottom-row">
          <div className="widget">
            <h3>Quick Actions</h3>
            <div className="quick-grid">
              <div className="quick-card" onClick={() => navigate("/hr/employees/add")}>
                <FiUsers />
                <span>Add Employee</span>
              </div>
              <div className="quick-card" onClick={() => navigate("/hr/payroll")}>
                <FiDollarSign />
                <span>Run Payroll</span>
              </div>
              <div className="quick-card" onClick={() => navigate("/hr/leave-management")}>
                <FiCalendar />
                <span>Approve Leave</span>
              </div>
              <div className="quick-card" onClick={() => navigate("/hr/biometric-sync")}>
                <FiAlertCircle />
                <span>Sync Biometric</span>
              </div>
            </div>
          </div>

          <div className="widget">
            <h3>Holidays & Events</h3>
            <div className="holiday-section">
              <h4>Upcoming Holidays</h4>
              {holidays.length > 0 ? (
                holidays.slice(0, 3).map((h, idx) => (
                  <div className="holiday-item" key={h.id || idx}>
                    <span>{h.date ? new Date(h.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</span>
                    <span>{h.name}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: "#64748b", fontSize: "13px", padding: "8px 0" }}>No upcoming holidays scheduled.</div>
              )}
            </div>
          </div>

          <div className="widget">
            <h3>Recent Activity</h3>
            {recentLeaves.length > 0 ? (
              recentLeaves.map((req, idx) => (
                <div className="activity-item" key={req.id || idx}>
                  <strong>Leave {req.status || "Pending"}</strong>
                  <p>{req.employeeName || req.employee || "Employee"} applied for {req.leaveType || "Leave"}</p>
                  <span>{req.appliedOn || "Recently"}</span>
                </div>
              ))
            ) : (
              <div style={{ color: "#64748b", fontSize: "13px", padding: "12px 0" }}>No recent activity records.</div>
            )}
          </div>
        </div>
      </div>
    </HRLayout>
  );
}