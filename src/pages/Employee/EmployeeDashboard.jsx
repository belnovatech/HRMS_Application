import React, { useState } from "react";
import "./EmployeeDashboard.css";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import {
  FiClock,
  FiCalendar,
  FiFileText,
  FiDownload,
  FiUpload,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user, todayAttendance, toggleCheckInOut, leaveBalances, holidays, payslips } = useAuth();
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const latestPayslip = payslips[0] || {
    month: "August 2026",
    grossSalary: "₹95,000",
    deductions: "₹12,500",
    netSalary: "₹82,500",
  };

  return (
    <EmployeeLayout title="Dashboard" breadcrumb="Employee Dashboard">
      <div className="employee-dashboard">
        {/* GREETING HERO & PROFILE SUMMARY BAR */}
        <section className="employee-hero-card">
          <div className="hero-left">
            <div
              className="emp-avatar-large"
              style={{ background: user?.avatarBg || "#10b981" }}
            >
              {user?.avatar || "AM"}
            </div>
            <div className="hero-greeting-text">
              <span className="greeting-sub">Good Morning 👋</span>
              <h2>{user?.name || "Arjun Mehta"}</h2>
              <p className="emp-date-badge">{currentDateStr}</p>
            </div>
          </div>

          <div className="profile-summary-meta">
            <div className="meta-item">
              <span className="meta-label">Employee ID</span>
              <strong>{user?.employeeId || "EMP001"}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">Designation</span>
              <strong>{user?.designation || "Senior Engineer"}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">Department</span>
              <strong>{user?.department || "Engineering"}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">Reports To</span>
              <strong>{user?.reportsTo || "Vikramaditya Rao"}</strong>
            </div>
          </div>
        </section>

        {/* TWO COLUMN CONTENT LAYOUT */}
        <div className="employee-grid">
          {/* LEFT COLUMN */}
          <div className="grid-col-main">
            {/* TODAY'S ATTENDANCE CARD */}
            <div className="enterprise-card attendance-card-box">
              <div className="card-header-flex">
                <div>
                  <h3>Today's Attendance</h3>
                  <p>Track check-in, check-out, and daily working hours</p>
                </div>
                <span className={`badge badge-${todayAttendance.checkedIn ? "present" : "rejected"}`}>
                  {todayAttendance.status}
                </span>
              </div>

              <div className="attendance-time-grid">
                <div className="time-block">
                  <span className="time-label">Check In</span>
                  <strong className="time-val">{todayAttendance.checkInTime}</strong>
                </div>
                <div className="time-block">
                  <span className="time-label">Check Out</span>
                  <strong className="time-val">{todayAttendance.checkOutTime}</strong>
                </div>
                <div className="time-block">
                  <span className="time-label">Working Hours</span>
                  <strong className="time-val highlight">{todayAttendance.workingHours}</strong>
                </div>
              </div>

              <button className="check-out-toggle-btn" onClick={toggleCheckInOut}>
                <FiClock /> {todayAttendance.checkedIn && todayAttendance.checkOutTime === "—" ? "Mark Check Out" : "Mark Check In"}
              </button>
            </div>

            {/* LEAVE BALANCE CARDS */}
            <div className="enterprise-card">
              <div className="card-header-flex">
                <div>
                  <h3>Leave Balance</h3>
                  <p>Available quota for the current calendar year</p>
                </div>
                <button className="text-btn" onClick={() => navigate("/employee/leave")}>
                  Apply Leave <FiArrowRight />
                </button>
              </div>

              <div className="leave-balance-grid">
                {/* Casual Leave */}
                <div className="leave-cat-card">
                  <div className="leave-cat-header">
                    <span className="cat-title">Casual Leave</span>
                    <span className="cat-count">{leaveBalances.casual.available} Days Left</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill green"
                      style={{ width: `${(leaveBalances.casual.available / leaveBalances.casual.total) * 100}%` }}
                    />
                  </div>
                  <div className="leave-cat-sub">
                    <span>Used: {leaveBalances.casual.used}</span>
                    <span>Total: {leaveBalances.casual.total}</span>
                  </div>
                </div>

                {/* Sick Leave */}
                <div className="leave-cat-card">
                  <div className="leave-cat-header">
                    <span className="cat-title">Sick Leave</span>
                    <span className="cat-count">{leaveBalances.sick.available} Days Left</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill blue"
                      style={{ width: `${(leaveBalances.sick.available / leaveBalances.sick.total) * 100}%` }}
                    />
                  </div>
                  <div className="leave-cat-sub">
                    <span>Used: {leaveBalances.sick.used}</span>
                    <span>Total: {leaveBalances.sick.total}</span>
                  </div>
                </div>

                {/* Earned Leave */}
                <div className="leave-cat-card">
                  <div className="leave-cat-header">
                    <span className="cat-title">Earned Leave</span>
                    <span className="cat-count">{leaveBalances.earned.available} Days Left</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill purple"
                      style={{ width: `${(leaveBalances.earned.available / leaveBalances.earned.total) * 100}%` }}
                    />
                  </div>
                  <div className="leave-cat-sub">
                    <span>Used: {leaveBalances.earned.used}</span>
                    <span>Total: {leaveBalances.earned.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="enterprise-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions-row">
                <div className="emp-action-tile" onClick={() => navigate("/employee/leave")}>
                  <div className="action-tile-icon green"><FiCalendar /></div>
                  <span>Apply Leave</span>
                </div>
                <div className="emp-action-tile" onClick={() => navigate("/employee/attendance")}>
                  <div className="action-tile-icon blue"><FiClock /></div>
                  <span>View Attendance</span>
                </div>
                <div className="emp-action-tile" onClick={() => navigate("/employee/payslips")}>
                  <div className="action-tile-icon purple"><FiDownload /></div>
                  <span>Download Payslip</span>
                </div>
                <div className="emp-action-tile" onClick={() => navigate("/employee/documents")}>
                  <div className="action-tile-icon orange"><FiUpload /></div>
                  <span>Upload Document</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="grid-col-side">
            {/* PAYSLIP SECTION */}
            <div className="enterprise-card payslip-widget">
              <div className="card-header-flex">
                <h3>Latest Payslip</h3>
                <span className="badge badge-present">Paid</span>
              </div>

              <div className="payslip-summary-box">
                <h4>{latestPayslip.month}</h4>
                <div className="salary-row">
                  <span>Gross Salary</span>
                  <strong>{latestPayslip.grossSalary}</strong>
                </div>
                <div className="salary-row">
                  <span>Deductions (PF & Tax)</span>
                  <span className="deduction-val">- {latestPayslip.deductions}</span>
                </div>
                <div className="salary-row total-net">
                  <span>Net Salary</span>
                  <strong className="net-val">{latestPayslip.netSalary}</strong>
                </div>
              </div>

              <button className="view-payslip-btn" onClick={() => setShowPayslipModal(true)}>
                <FiFileText /> View Payslip Statement
              </button>
            </div>

            {/* UPCOMING HOLIDAYS */}
            <div className="enterprise-card">
              <div className="card-header-flex">
                <h3>Upcoming Holidays</h3>
                <button className="text-btn" onClick={() => navigate("/employee/holidays")}>
                  View All
                </button>
              </div>

              <div className="holidays-mini-list">
                {holidays.slice(0, 3).map((item) => (
                  <div key={item.id} className="holiday-mini-item">
                    <div className="holiday-date-badge">
                      <span className="date-num">{item.date.split("-")[2]}</span>
                      <span className="date-month">SEP</span>
                    </div>
                    <div className="holiday-info">
                      <strong>{item.name}</strong>
                      <small>{item.day} • {item.type}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAYSLIP DETAILED MODAL */}
      {showPayslipModal && (
        <div className="modal-overlay" onClick={() => setShowPayslipModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Salary Slip Statement — {latestPayslip.month}</h3>
              <button className="modal-close" onClick={() => setShowPayslipModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p><strong>Employee Name:</strong> {user?.name}</p>
              <p><strong>Employee ID:</strong> {user?.employeeId || "EMP001"}</p>
              <hr />
              <div className="salary-breakdown-list">
                <div className="salary-row"><span>Basic Salary</span><strong>₹50,000</strong></div>
                <div className="salary-row"><span>House Rent Allowance (HRA)</span><strong>₹25,000</strong></div>
                <div className="salary-row"><span>Special Allowances</span><strong>₹20,000</strong></div>
                <div className="salary-row"><span>PF Deduction</span><strong className="deduction-val">- ₹6,000</strong></div>
                <div className="salary-row"><span>Income Tax (TDS)</span><strong className="deduction-val">- ₹6,500</strong></div>
                <hr />
                <div className="salary-row total-net"><span>Net Transferrable Salary</span><strong className="net-val">{latestPayslip.netSalary}</strong></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-approve" onClick={() => { alert("Downloading Payslip PDF..."); setShowPayslipModal(false); }}>
                <FiDownload /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
}
