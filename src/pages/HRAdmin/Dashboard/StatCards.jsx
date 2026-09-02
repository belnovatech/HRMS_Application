import React from "react";
import "./StatCards.css";
import { useAuth } from "../../../context/AuthContext";
import {
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiCalendar
} from "react-icons/fi";

export default function StatCards() {
  const { leaveRequests = [] } = useAuth();

  const pendingApprovalsCount = leaveRequests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedLeaveCount = leaveRequests.filter(
    (request) => request.status === "Approved"
  ).length;

  const cards = [
    {
      id: "total-employees",
      title: "Total Employees",
      value: "1,248",
      badgeText: "+12 this month",
      badgeType: "positive-pill",
      icon: <FiUsers />,
      iconBg: "#eff6ff",
      iconColor: "#3b82f6"
    },
    {
      id: "present-today",
      title: "Present Today",
      value: "1,086",
      badgeText: "↗ 87.0%",
      badgeType: "positive-pill",
      icon: <FiClock />,
      iconBg: "#ecfdf5",
      iconColor: "#10b981"
    },
    {
      id: "absent-today",
      title: "Absent Today",
      value: "72",
      badgeText: "↘ -5 vs avg",
      badgeType: "negative-pill",
      icon: <FiAlertCircle />,
      iconBg: "#fef2f2",
      iconColor: "#ef4444"
    },
    {
      id: "on-leave",
      title: "On Leave",
      value: String(90 + approvedLeaveCount),
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
      value: "₹48.7L",
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
