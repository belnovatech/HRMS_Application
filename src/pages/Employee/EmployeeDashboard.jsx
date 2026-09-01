import React, { useState } from "react";
import "./EmployeeDashboard.css";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import {
  FiCalendar,
  FiClock,
  FiDownload,
  FiFileText,
  FiUpload,
  FiArrowRight,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const {
    user,
    todayAttendance,
    toggleCheckInOut,
    leaveBalances,
    holidays,
    payslips,
  } = useAuth();

  const [showPayslipModal, setShowPayslipModal] = useState(false);

  const latestPayslip = payslips?.[0] || {
    month: "August 2026",
    grossSalary: "₹60,000",
    deductions: "₹11,500",
    netSalary: "₹48,500",
  };

  const safeLeaveBalances = leaveBalances || {
    casual: { available: 6, used: 6, total: 12 },
    sick: { available: 4, used: 8, total: 12 },
    earned: { available: 12, used: 6, total: 18 },
  };

  const safeAttendance = todayAttendance || {
    checkedIn: true,
    checkInTime: "09:42 AM",
    checkOutTime: "—",
    workingHours: "04h 32m",
    status: "Present",
  };

  const safeHolidays = holidays || [
    {
      id: 1,
      date: "2026-09-07",
      name: "Ganesh Chaturthi",
      day: "Monday",
      type: "Holiday",
    },
    {
      id: 2,
      date: "2026-10-02",
      name: "Gandhi Jayanti",
      day: "Friday",
      type: "Holiday",
    },
    {
      id: 3,
      date: "2026-10-20",
      name: "Diwali",
      day: "Tuesday",
      type: "Holiday",
    },
  ];

  const recentAttendance = [
    { date: "Sep 1", checkIn: "09:42 AM", checkOut: "06:38 PM", hours: "8h 56m", status: "Present" },
    { date: "Aug 31", checkIn: "09:30 AM", checkOut: "06:30 PM", hours: "9h 00m", status: "Present" },
    { date: "Aug 30", checkIn: "10:15 AM", checkOut: "06:45 PM", hours: "8h 30m", status: "Late" },
    { date: "Aug 29", checkIn: "—", checkOut: "—", hours: "—", status: "Leave" },
    { date: "Aug 28", checkIn: "09:38 AM", checkOut: "06:40 PM", hours: "9h 02m", status: "Present" },
  ];

  const announcements = [
    { title: "September Holiday Schedule", category: "HR", time: "1h ago" },
    { title: "New Work From Home Policy", category: "Policy", time: "2d ago" },
    { title: "Payroll Processed — August 2026", category: "Payroll", time: "1d ago" },
    { title: "Company Anniversary Celebration", category: "Events", time: "3d ago" },
  ];

  const getMonth = (dateString) =>
    new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
    });

  const getDay = (dateString) =>
    new Date(`${dateString}T00:00:00`).getDate();

  const leaveItems = [
    {
      key: "casual",
      label: "Casual Leave",
      data: safeLeaveBalances.casual,
      tone: "blue",
    },
    {
      key: "sick",
      label: "Sick Leave",
      data: safeLeaveBalances.sick,
      tone: "purple",
    },
    {
      key: "earned",
      label: "Earned Leave",
      data: safeLeaveBalances.earned,
      tone: "green",
    },
  ];

  return (
    <EmployeeLayout title="Dashboard" breadcrumb="Employee Dashboard">
      <div className="hrms-dashboard">
        {/* Header */}
        <section className="hrms-dashboard-header">
          <div className="hrms-profile-card">
            <div
              className="hrms-profile-avatar"
              style={{ background: user?.avatarBg || "#4f46e5" }}
            >
              {user?.avatar || "RK"}
            </div>

            <div className="hrms-profile-copy">
              <div className="hrms-profile-name-row">
                <h1>{user?.name || "Rahul Kumar"}</h1>
                <button
                  type="button"
                  className="hrms-profile-link"
                  onClick={() => navigate("/employee/profile")}
                >
                  Profile <FiChevronRight />
                </button>
              </div>

              <p className="hrms-profile-role">
                {user?.designation || "Senior Software Engineer"}
              </p>
              <p className="hrms-profile-department">
                {user?.department || "Engineering"} •{" "}
                {user?.employeeId || "EMP001"}
              </p>
              <p className="hrms-profile-reports">
                Reports to: <strong>{user?.reportsTo || "Arjun Reddy"}</strong>
              </p>
            </div>
          </div>

          <div className="hrms-attendance-card">
            <div className="hrms-attendance-top">
              <h2>Today's Attendance</h2>
              <span
                className={`hrms-status-pill ${
                  safeAttendance.status?.toLowerCase() === "present"
                    ? "hrms-status-present"
                    : "hrms-status-neutral"
                }`}
              >
                {safeAttendance.status}
              </span>
            </div>

            <div className="hrms-attendance-stats">
              <div className="hrms-attendance-stat">
                <strong className="hrms-time-green">
                  {safeAttendance.checkInTime}
                </strong>
                <span>Check In</span>
              </div>
              <div className="hrms-attendance-stat">
                <strong className="hrms-time-red">
                  {safeAttendance.checkOutTime}
                </strong>
                <span>Check Out</span>
              </div>
              <div className="hrms-attendance-stat">
                <strong className="hrms-time-purple">
                  {safeAttendance.workingHours}
                </strong>
                <span>Working Hours</span>
              </div>
            </div>

            <p className="hrms-attendance-sync">
              Synced from biometric device • Last update: 2 min ago
            </p>

            <button
              type="button"
              className="hrms-check-toggle"
              onClick={toggleCheckInOut}
            >
              {safeAttendance.checkedIn &&
              safeAttendance.checkOutTime === "—"
                ? "Mark Check Out"
                : "Mark Check In"}
            </button>
          </div>
        </section>

        {/* Leave Balance */}
        <section className="hrms-panel hrms-leave-panel">
          <div className="hrms-section-heading">
            <h2>Leave Balance</h2>
            <button
              type="button"
              className="hrms-text-action"
              onClick={() => navigate("/employee/leave")}
            >
              Apply Leave <FiChevronRight />
            </button>
          </div>

          <div className="hrms-leave-grid">
            {leaveItems.map(({ key, label, data, tone }) => {
              const total = Number(data?.total) || 0;
              const available = Number(data?.available) || 0;
              const used = Number(data?.used) || 0;
              const percentage =
                total > 0
                  ? Math.min(100, Math.max(0, (available / total) * 100))
                  : 0;

              return (
                <div className="hrms-leave-item" key={key}>
                  <div className="hrms-leave-title-row">
                    <span>{label}</span>
                    <strong>{available} days</strong>
                  </div>

                  <div className="hrms-progress-track">
                    <div
                      className={`hrms-progress-fill hrms-progress-${tone}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="hrms-leave-meta">
                    <span>{used} used of {total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Three-column widgets */}
        <section className="hrms-widget-grid">
          {/* Payslip */}
          <article className="hrms-panel hrms-payslip-card">
            <div className="hrms-card-heading">
              <h2>{latestPayslip.month} Payslip</h2>
              <span className="hrms-status-pill hrms-status-present">
                Processed
              </span>
            </div>

            <div className="hrms-salary-list">
              <div className="hrms-salary-row">
                <span>Gross Salary</span>
                <strong className="hrms-money-green">
                  {latestPayslip.grossSalary}
                </strong>
              </div>
              <div className="hrms-salary-row">
                <span>Deductions</span>
                <strong className="hrms-money-red">
                  {latestPayslip.deductions}
                </strong>
              </div>
              <div className="hrms-salary-row">
                <span>Net Salary</span>
                <strong className="hrms-money-blue">
                  {latestPayslip.netSalary}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="hrms-outline-button"
              onClick={() => setShowPayslipModal(true)}
            >
              View Payslip
            </button>
          </article>

          {/* Holidays */}
          <article className="hrms-panel hrms-holidays-card">
            <div className="hrms-card-heading">
              <h2>Upcoming Holidays</h2>
            </div>

            <div className="hrms-holiday-list">
              {safeHolidays.slice(0, 3).map((item) => (
                <div className="hrms-holiday-item" key={item.id}>
                  <div className="hrms-holiday-date">
                    <strong>{getMonth(item.date)}</strong>
                    <span>{getDay(item.date)}</span>
                  </div>

                  <div className="hrms-holiday-copy">
                    <strong>{item.name}</strong>
                    <span>{item.day}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Quick actions */}
          <article className="hrms-panel hrms-quick-actions-card">
            <div className="hrms-card-heading">
              <h2>Quick Actions</h2>
            </div>

            <div className="hrms-action-list">
              <button
                type="button"
                className="hrms-action-item"
                onClick={() => navigate("/employee/leave")}
              >
                <span className="hrms-action-icon hrms-action-blue">
                  <FiCalendar />
                </span>
                <span>Apply Leave</span>
                <FiChevronRight />
              </button>

              <button
                type="button"
                className="hrms-action-item"
                onClick={() => navigate("/employee/attendance")}
              >
                <span className="hrms-action-icon hrms-action-purple">
                  <FiClock />
                </span>
                <span>View Attendance</span>
                <FiChevronRight />
              </button>

              <button
                type="button"
                className="hrms-action-item"
                onClick={() => navigate("/employee/payslips")}
              >
                <span className="hrms-action-icon hrms-action-green">
                  <FiDownload />
                </span>
                <span>Download Payslip</span>
                <FiChevronRight />
              </button>

              <button
                type="button"
                className="hrms-action-item"
                onClick={() => navigate("/employee/documents")}
              >
                <span className="hrms-action-icon hrms-action-orange">
                  <FiUpload />
                </span>
                <span>Upload Document</span>
                <FiChevronRight />
              </button>

              <button
                type="button"
                className="hrms-action-item"
                onClick={() => navigate("/employee/requests")}
              >
                <span className="hrms-action-icon hrms-action-pink">
                  <FiFileText />
                </span>
                <span>Raise Request</span>
                <FiChevronRight />
              </button>
            </div>
          </article>
        </section>

        {/* Recent Attendance */}
        <section className="hrms-panel hrms-table-panel">
          <div className="hrms-section-heading">
            <h2>Recent Attendance</h2>
            <button
              type="button"
              className="hrms-text-action"
              onClick={() => navigate("/employee/attendance")}
            >
              View all <FiArrowRight />
            </button>
          </div>

          <div className="hrms-table-scroll">
            <table className="hrms-attendance-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>CHECK IN</th>
                  <th>CHECK OUT</th>
                  <th>HOURS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map((row) => (
                  <tr key={`${row.date}-${row.status}`}>
                    <td>{row.date}</td>
                    <td className="hrms-table-green">{row.checkIn}</td>
                    <td className="hrms-table-red">{row.checkOut}</td>
                    <td>{row.hours}</td>
                    <td>
                      <span
                        className={`hrms-table-status hrms-table-status-${row.status.toLowerCase()}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Announcements */}
        <section className="hrms-panel hrms-announcements-panel">
          <div className="hrms-section-heading">
            <h2>Announcements</h2>
            <button
              type="button"
              className="hrms-text-action"
              onClick={() => navigate("/employee/announcements")}
            >
              View all <FiArrowRight />
            </button>
          </div>

          <div className="hrms-announcement-list">
            {announcements.map((item) => (
              <button
                type="button"
                className="hrms-announcement-item"
                key={item.title}
              >
                <span className="hrms-announcement-dot" />
                <span className="hrms-announcement-content">
                  <strong>{item.title}</strong>
                  <span>
                    <em>{item.category}</em>
                    {item.time}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Payslip Modal */}
      {showPayslipModal && (
        <div
          className="hrms-modal-overlay"
          onClick={() => setShowPayslipModal(false)}
        >
          <div
            className="hrms-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="hrms-modal-header">
              <div>
                <span className="hrms-modal-kicker">PAYROLL</span>
                <h3>Salary Slip Statement</h3>
                <p>{latestPayslip.month}</p>
              </div>

              <button
                type="button"
                className="hrms-modal-close"
                onClick={() => setShowPayslipModal(false)}
                aria-label="Close payslip"
              >
                ×
              </button>
            </div>

            <div className="hrms-modal-body">
              <div className="hrms-modal-employee">
                <p>
                  <span>Employee Name</span>
                  <strong>{user?.name || "Rahul Kumar"}</strong>
                </p>
                <p>
                  <span>Employee ID</span>
                  <strong>{user?.employeeId || "EMP001"}</strong>
                </p>
              </div>

              <div className="hrms-modal-breakdown">
                <div className="hrms-modal-row">
                  <span>Basic Salary</span>
                  <strong>₹50,000</strong>
                </div>
                <div className="hrms-modal-row">
                  <span>House Rent Allowance (HRA)</span>
                  <strong>₹25,000</strong>
                </div>
                <div className="hrms-modal-row">
                  <span>Special Allowances</span>
                  <strong>₹20,000</strong>
                </div>
                <div className="hrms-modal-row">
                  <span>PF Deduction</span>
                  <strong className="hrms-money-red">- ₹6,000</strong>
                </div>
                <div className="hrms-modal-row">
                  <span>Income Tax (TDS)</span>
                  <strong className="hrms-money-red">- ₹6,500</strong>
                </div>
                <div className="hrms-modal-total">
                  <span>Net Transferrable Salary</span>
                  <strong>{latestPayslip.netSalary}</strong>
                </div>
              </div>
            </div>

            <div className="hrms-modal-footer">
              <button
                type="button"
                className="hrms-download-button"
                onClick={() => {
                  alert("Downloading Payslip PDF...");
                  setShowPayslipModal(false);
                }}
              >
                <FiDownload /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
}
