import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

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
    <div className="attendance-layout">
      <Sidebar />

      <div className="attendance-main">
        <Header
  title="Attendance"
  breadcrumb="Attendance"
/>

        <div className="attendance-container">


          <div className="attendance-tabs">
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
                activeTab === "daily" ? "active" : ""
              }`}
              onClick={() => setActiveTab("daily")}
            >
              Daily
            </button>

            <button
              className={`tab-btn ${
                activeTab === "shifts" ? "active" : ""
              }`}
              onClick={() => setActiveTab("shifts")}
            >
              Shifts
            </button>

            <button
              className={`tab-btn ${
                activeTab === "overtime" ? "active" : ""
              }`}
              onClick={() => setActiveTab("overtime")}
            >
              Overtime
            </button>
          </div>

          <div className="attendance-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}