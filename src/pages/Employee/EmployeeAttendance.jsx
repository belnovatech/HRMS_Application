import React, { useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import { FiClock } from "react-icons/fi";

export default function EmployeeAttendance() {
  const { todayAttendance, toggleCheckInOut } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  const attendanceHistory = [
    { date: "2026-09-01", day: "Tuesday", checkIn: todayAttendance.checkInTime, checkOut: todayAttendance.checkOutTime, hours: todayAttendance.workingHours, status: todayAttendance.status },
    { date: "2026-08-31", day: "Monday", checkIn: "09:00 AM", checkOut: "06:15 PM", hours: "9h 15m", status: "Present" },
    { date: "2026-08-28", day: "Friday", checkIn: "09:10 AM", checkOut: "06:00 PM", hours: "8h 50m", status: "Present" },
    { date: "2026-08-27", day: "Thursday", checkIn: "09:30 AM", checkOut: "06:30 PM", hours: "9h 00m", status: "WFH" },
    { date: "2026-08-26", day: "Wednesday", checkIn: "09:02 AM", checkOut: "06:10 PM", hours: "9h 08m", status: "Present" },
  ];

  return (
    <EmployeeLayout title="My Attendance" breadcrumb="Attendance">
      <div className="page-header-block">
        <h2>Attendance Record & Check-in Logs</h2>
        <p>Review your monthly attendance history, working hours, and punch status.</p>
      </div>

      <div className="enterprise-card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-header-flex">
          <div>
            <h3>Mark Today's Attendance</h3>
            <p>Status: <strong style={{ color: "#2563eb" }}>{todayAttendance.status}</strong> ({todayAttendance.workingHours})</p>
          </div>
          <button className="check-out-toggle-btn" style={{ width: "auto", padding: "0.6rem 1.25rem" }} onClick={toggleCheckInOut}>
            <FiClock /> {todayAttendance.checkedIn && todayAttendance.checkOutTime === "—" ? "Mark Check Out" : "Mark Check In"}
          </button>
        </div>
      </div>

      <div className="enterprise-card">
        <div className="card-header-flex" style={{ marginBottom: "1.25rem" }}>
          <h3>Attendance Log History</h3>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: "0.4rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          />
        </div>

        <div className="table-responsive-wrapper">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>DAY</th>
                <th>CHECK IN</th>
                <th>CHECK OUT</th>
                <th>TOTAL HOURS</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map((item, idx) => (
                <tr key={idx}>
                  <td><strong>{item.date}</strong></td>
                  <td>{item.day}</td>
                  <td>{item.checkIn}</td>
                  <td>{item.checkOut}</td>
                  <td>{item.hours}</td>
                  <td>
                    <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </EmployeeLayout>
  );
}
