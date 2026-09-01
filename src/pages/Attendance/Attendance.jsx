import { useState } from "react";
import HRLayout from "../../layouts/HRLayout";

import AttendanceDashboard from "./AttendanceDashboard";
import DailyAttendance from "./DailyAttendance";
import Shifts from "./Shifts";
import Overtime from "./Overtime";

import "./Attendance.css";

export default function Attendance() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AttendanceDashboard />;
      case "daily":
        return <DailyAttendance />;
      case "shifts":
        return <Shifts />;
      case "overtime":
        return <Overtime />;
      default:
        return <AttendanceDashboard />;
    }
  };

  return (
    <HRLayout title="Attendance Management" breadcrumb="Attendance">
      <div className="attendance-page-container">
        <div className="attendance-tabs">
          <button
            className={`attendance-tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`attendance-tab-btn ${activeTab === "daily" ? "active" : ""}`}
            onClick={() => setActiveTab("daily")}
          >
            Daily
          </button>
          <button
            className={`attendance-tab-btn ${activeTab === "shifts" ? "active" : ""}`}
            onClick={() => setActiveTab("shifts")}
          >
            Shifts
          </button>
          <button
            className={`attendance-tab-btn ${activeTab === "overtime" ? "active" : ""}`}
            onClick={() => setActiveTab("overtime")}
          >
            Overtime
          </button>
        </div>

        <div className="attendance-content">
          {renderContent()}
        </div>
      </div>
    </HRLayout>
  );
}