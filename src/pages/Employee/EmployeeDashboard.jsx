import React, { useState, useMemo } from "react";
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

import { getOfficialHolidays } from "../../utils/holidayHelper";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const {
    user,
    todayAttendance,
    toggleCheckInOut,
    leaveBalances,
    holidays,
    payslips,
    attendanceRecords = [],
    announcements = [],
  } = useAuth();

  const [showPayslipModal, setShowPayslipModal] = useState(false);

  const latestPayslip = payslips?.[0] || null;

  const safeLeaveBalances = leaveBalances || {};
  const casualBal = safeLeaveBalances.casual || { available: 0, used: 0, total: 12 };
  const sickBal = safeLeaveBalances.sick || { available: 0, used: 0, total: 12 };
  const earnedBal = safeLeaveBalances.earned || { available: 0, used: 0, total: 18 };

  const safeAttendance = todayAttendance || {
    checkedIn: false,
    checkInTime: "—",
    checkOutTime: "—",
    workingHours: "—",
    status: "Not checked in",
  };

  const currentYear = new Date().getFullYear();
  const allHolidays = useMemo(() => {
    if (holidays && holidays.length > 0) return holidays;
    return getOfficialHolidays(currentYear);
  }, [holidays, currentYear]);

  const todayDateStr = new Date().toLocaleDateString("en-CA");
  const safeHolidays = useMemo(() => {
    const upcoming = allHolidays
      .filter((h) => !h.date || h.date >= todayDateStr)
      .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
    return upcoming.length > 0 ? upcoming : allHolidays;
  }, [allHolidays, todayDateStr]);

  const empId = user?.employeeId || user?.employeeNumber || user?.id;
  const recentAttendance = (attendanceRecords || [])
    .filter((x) => x.employeeId === empId || x.employeeId === user?.id)
    .slice(0, 5)
    .map((x) => ({
      date: x.date || "Today",
      checkIn: x.checkIn || "—",
      checkOut: x.checkOut || "—",
      hours: x.workingHours || "—",
      status: x.status || (x.checkIn ? "Present" : "Not checked in"),
    }));

  const announcementItems = announcements || [];

  const getMonth = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString.includes("T") ? dateString : `${dateString}T00:00:00`);
    return Number.isNaN(date.getTime()) ? "Hol" : date.toLocaleDateString("en-US", { month: "short" });
  };

  const getDay = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString.includes("T") ? dateString : `${dateString}T00:00:00`);
    return Number.isNaN(date.getTime()) ? "—" : date.getDate();
  };

  const leaveItems = [
    {
      key: "casual",
      label: "Casual Leave",
      data: casualBal,
      tone: "blue",
    },
    {
      key: "sick",
      label: "Sick Leave",
      data: sickBal,
      tone: "purple",
    },
    {
      key: "earned",
      label: "Earned Leave",
      data: earnedBal,
      tone: "green",
    },
  ];

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "EM";

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
              {user?.avatar || userInitials}
            </div>

            <div className="hrms-profile-copy">
              <div className="hrms-profile-name-row">
                <h1>{user?.name || "Employee"}</h1>
                <button
                  type="button"
                  className="hrms-profile-link"
                  onClick={() => navigate("/employee/profile")}
                >
                  Profile <FiChevronRight />
                </button>
              </div>

              <p className="hrms-profile-role">
                {user?.designation || user?.role || "Team Member"}
              </p>
              <p className="hrms-profile-department">
                {user?.department || "General"} •{" "}
                {user?.employeeNumber || user?.employeeId || user?.id || "EMP"}
              </p>
              <p className="hrms-profile-reports">
                Reports to: <strong>{user?.reportsTo || user?.manager || "Management"}</strong>
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
              <h2>{latestPayslip ? `${latestPayslip.month} Payslip` : "Latest Payslip"}</h2>
              {latestPayslip && (
                <span className="hrms-status-pill hrms-status-present">
                  Processed
                </span>
              )}
            </div>

            {latestPayslip ? (
              <>
                <div className="hrms-salary-list">
                  <div className="hrms-salary-row">
                    <span>Gross Salary</span>
                    <strong className="hrms-money-green">
                      ₹{Number(latestPayslip.grossSalary || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="hrms-salary-row">
                    <span>Deductions</span>
                    <strong className="hrms-money-red">
                      ₹{Number(latestPayslip.deductions || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="hrms-salary-row">
                    <span>Net Salary</span>
                    <strong className="hrms-money-blue">
                      ₹{Number(latestPayslip.netSalary || 0).toLocaleString("en-IN")}
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
              </>
            ) : (
              <div style={{ padding: "24px 0", color: "#64748b", textAlign: "center", fontSize: "14px" }}>
                <p>No payslips generated yet.</p>
                <button
                  type="button"
                  className="hrms-outline-button"
                  style={{ marginTop: "12px" }}
                  onClick={() => navigate("/employee/payslips")}
                >
                  Go to Payslips
                </button>
              </div>
            )}
          </article>

          {/* Holidays */}
          <article className="hrms-panel hrms-holidays-card">
            <div className="hrms-card-heading">
              <h2>Upcoming Holidays</h2>
            </div>

            <div className="hrms-holiday-list">
              {safeHolidays.length > 0 ? (
                safeHolidays.slice(0, 3).map((item) => (
                  <div className="hrms-holiday-item" key={item.id || item.name}>
                    <div className="hrms-holiday-date">
                      <strong>{getMonth(item.date)}</strong>
                      <span>{getDay(item.date)}</span>
                    </div>

                    <div className="hrms-holiday-copy">
                      <strong>{item.name}</strong>
                      <span>{item.day || "Holiday"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "20px 0", color: "#64748b", textAlign: "center", fontSize: "14px" }}>
                  <p>No upcoming holidays listed.</p>
                </div>
              )}
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
                {recentAttendance.length > 0 ? (
                  recentAttendance.map((row, idx) => (
                    <tr key={`${row.date}-${idx}`}>
                      <td>{row.date}</td>
                      <td className="hrms-table-green">{row.checkIn}</td>
                      <td className="hrms-table-red">{row.checkOut}</td>
                      <td>{row.hours}</td>
                      <td>
                        <span
                          className={`hrms-table-status hrms-table-status-${String(row.status || "").toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                      No recent attendance logs recorded yet.
                    </td>
                  </tr>
                )}
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
            {announcementItems.length > 0 ? (
              announcementItems.map((item, idx) => (
                <button
                  type="button"
                  className="hrms-announcement-item"
                  key={item.id || item.title || idx}
                  onClick={() => navigate("/employee/announcements")}
                >
                  <span className="hrms-announcement-dot" />
                  <span className="hrms-announcement-content">
                    <strong>{item.title}</strong>
                    <span>
                      <em>{item.category || "Notice"}</em>
                      {item.date || item.time || "Recent"}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <div style={{ padding: "20px", color: "#64748b", textAlign: "center", fontSize: "14px" }}>
                No active announcements published.
              </div>
            )}
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
                  <strong>{user?.fullName || user?.name || user?.username || "Employee"}</strong>
                </p>
                <p>
                  <span>Employee ID</span>
                  <strong>{user?.employeeId || user?.employeeNumber || user?.id || "—"}</strong>
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
