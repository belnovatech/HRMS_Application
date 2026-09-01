import { useState } from "react";
import HRLayout from "../../layouts/HRLayout";

import LeaveDashboard from "./LeaveDashboard";
import ApplyLeave from "./ApplyLeave";
import Approvals from "./Approvals";
import Calendar from "./Calendar";
import Policy from "./Policy";

import "./LeaveManagement.css";

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <LeaveDashboard />;
      case "apply":
        return <ApplyLeave />;
      case "approvals":
        return <Approvals />;
      case "calendar":
        return <Calendar />;
      case "policy":
        return <Policy />;
      default:
        return <LeaveDashboard />;
    }
  };

  return (
    <HRLayout title="Leave Management" breadcrumb="Leave Management">
      <div className="leave-management-page-container">
        <div className="leave-management-tabs">
          <button
            className={`leave-tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`leave-tab-btn ${activeTab === "apply" ? "active" : ""}`}
            onClick={() => setActiveTab("apply")}
          >
            Apply
          </button>
          <button
            className={`leave-tab-btn ${activeTab === "approvals" ? "active" : ""}`}
            onClick={() => setActiveTab("approvals")}
          >
            Approvals
          </button>
          <button
            className={`leave-tab-btn ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar
          </button>
          <button
            className={`leave-tab-btn ${activeTab === "policy" ? "active" : ""}`}
            onClick={() => setActiveTab("policy")}
          >
            Policy
          </button>
        </div>

        <div className="leave-content">
          {renderContent()}
        </div>
      </div>
    </HRLayout>
  );
}