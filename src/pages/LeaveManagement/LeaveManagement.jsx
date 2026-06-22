import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

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
    <div className="leave-layout">
      <Sidebar />

      <div className="leave-main">
        <Header />

        <div className="leave-container">
          <div className="leave-breadcrumb">
            <span>Home</span>
            <span className="separator">›</span>
            <span>Leave</span>
          </div>

          <h1 className="leave-title">
            Leave Management
          </h1>

          <div className="leave-tabs">
            <button
              className={`tab-btn ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>

            <button
              className={`tab-btn ${
                activeTab === "apply" ? "active" : ""
              }`}
              onClick={() => setActiveTab("apply")}
            >
              Apply
            </button>

            <button
              className={`tab-btn ${
                activeTab === "approvals" ? "active" : ""
              }`}
              onClick={() => setActiveTab("approvals")}
            >
              Approvals
            </button>

            <button
              className={`tab-btn ${
                activeTab === "calendar" ? "active" : ""
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              Calendar
            </button>

            <button
              className={`tab-btn ${
                activeTab === "policy" ? "active" : ""
              }`}
              onClick={() => setActiveTab("policy")}
            >
              Policy
            </button>
          </div>

          <div className="leave-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}