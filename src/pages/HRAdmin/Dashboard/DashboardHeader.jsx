import React from "react";
import "./DashboardHeader.css";
import { FiBarChart2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="hradmin-dashboard-header">
      <div className="hradmin-dashboard-header-text">
        <h1 className="hradmin-dashboard-header-title">
          Good Morning, Admin <span className="hradmin-dashboard-header-wave">👋</span>
        </h1>
        <p className="hradmin-dashboard-header-subtitle">
          Here's what's happening across your organization today · {formattedDate}
        </p>
      </div>

      <div className="hradmin-dashboard-header-actions">
        <button
          type="button"
          className="hradmin-dashboard-btn-reports"
          onClick={() => navigate("/hr/reports")}
        >
          <FiBarChart2 className="hradmin-dashboard-btn-icon" />
          <span>View Reports</span>
        </button>
      </div>
    </div>
  );
}
