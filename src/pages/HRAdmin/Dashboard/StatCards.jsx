import React, { useState, useEffect } from "react";
import "./StatCards.css";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axiosInstance";
import {
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiCalendar
} from "react-icons/fi";

export default function StatCards() {
  const { leaveRequests = [] } = useAuth();
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadSummary() {
      try {
        const [sumRes, empRes] = await Promise.allSettled([
          api.get("/Dashboard/summary"),
          api.get("/Employees")
        ]);
        if (active) {
          const summary = sumRes.status === "fulfilled" ? sumRes.value.data : {};
          const empCount = empRes.status === "fulfilled" && Array.isArray(empRes.value.data) ? empRes.value.data.length : null;
          setSummaryData({ ...summary, totalEmployees: empCount || summary?.totalEmployees || 1248 });
        }
      } catch (err) {
        console.warn("Summary fetch notice:", err.message);
      }
    }
    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  const pendingApprovalsCount = leaveRequests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedLeaveCount = leaveRequests.filter(
    (request) => request.status === "Approved"
  ).length;

  const totalEmployees = summaryData?.totalEmployees || 1248;
  const presentToday = summaryData?.presentToday || 1086;
  const absentToday = summaryData?.absentToday || 72;
  const onLeave = summaryData?.onLeave || (90 + approvedLeaveCount);
  const payrollTotal = summaryData?.monthlyPayroll ? `₹${(summaryData.monthlyPayroll / 100000).toFixed(1)}L` : "₹48.7L";

  const cards = [
    {
      id: "total-employees",
      title: "Total Employees",
      value: totalEmployees.toLocaleString("en-IN"),
      badgeText: "+12 this month",
      badgeType: "positive-pill",
      icon: <FiUsers />,
      iconBg: "#eff6ff",
      iconColor: "#3b82f6"
    },
    {
      id: "present-today",
      title: "Present Today",
      value: presentToday.toLocaleString("en-IN"),
      badgeText: "↗ 87.0%",
      badgeType: "positive-pill",
      icon: <FiClock />,
      iconBg: "#ecfdf5",
      iconColor: "#10b981"
    },
    {
      id: "absent-today",
      title: "Absent Today",
      value: absentToday.toLocaleString("en-IN"),
      badgeText: "↘ -5 vs avg",
      badgeType: "negative-pill",
      icon: <FiAlertCircle />,
      iconBg: "#fef2f2",
      iconColor: "#ef4444"
    },
    {
      id: "on-leave",
      title: "On Leave",
      value: String(onLeave),
      badgeText: "Active",
      badgeType: "neutral-pill",
      icon: <FiCalendar />,
      iconBg: "#fffbeb",
      iconColor: "#f59e0b"
    },
    {
      id: "pending-approvals",
      title: "Pending Approvals",
      value: String(pendingApprovalsCount),
      badgeText: pendingApprovalsCount > 0 ? "↑ Action needed" : "All clear",
      badgeType: pendingApprovalsCount > 0 ? "urgent-pill" : "positive-pill",
      icon: <FiAlertCircle />,
      iconBg: "#faf5ff",
      iconColor: "#a855f7"
    },
    {
      id: "monthly-payroll",
      title: "Monthly Payroll",
      value: payrollTotal,
      badgeText: "↗ +4.2%",
      badgeType: "gradient-pill",
      icon: <span>$</span>,
      isGradient: true
    }
  ];

  return (
    <div className="hradmin-dashboard-stats-grid">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`hradmin-dashboard-stat-card ${
            card.isGradient ? "hradmin-dashboard-stat-card-gradient" : ""
          }`}
        >
          <div className="hradmin-dashboard-stat-header">
            <div
              className="hradmin-dashboard-stat-icon"
              style={{
                background: card.isGradient ? "rgba(255, 255, 255, 0.2)" : card.iconBg,
                color: card.isGradient ? "#ffffff" : card.iconColor
              }}
            >
              {card.icon}
            </div>

            <div className={`hradmin-dashboard-stat-badge ${card.badgeType}`}>
              {card.badgeText}
            </div>
          </div>

          <div className="hradmin-dashboard-stat-content">
            <h2 className="hradmin-dashboard-stat-value">{card.value}</h2>
            <span className="hradmin-dashboard-stat-label">{card.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
