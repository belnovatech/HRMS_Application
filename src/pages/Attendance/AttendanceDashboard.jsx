import AttendanceCards from "./components/AttendanceCards";
import AttendanceTable from "./components/AttendanceTable";

import "./AttendanceDashboard.css";

export default function AttendanceDashboard() {
  return (
    <div className="attendance-dashboard">

      <AttendanceCards />

      <div className="attendance-table-section">
        <div className="table-header">
          <h3>Today's Attendance — Jun 18, 2025</h3>

          <button className="export-btn">
            Export
          </button>
        </div>

        <AttendanceTable />
      </div>

    </div>
  );
}