import React, { useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import { FiPlus } from "react-icons/fi";

export default function EmployeeLeave() {
  const { leaveBalances, leaveRequests, handleAddLeaveRequest, user } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const myRequests = leaveRequests.filter((r) => r.employeeId === (user?.employeeId || "EMP001"));

  const handleApply = (e) => {
    e.preventDefault();
    if (startDate && endDate && reason) {
      handleAddLeaveRequest({ leaveType, startDate, endDate, duration: 1, reason });
      setShowApplyModal(false);
      setStartDate("");
      setEndDate("");
      setReason("");
    }
  };

  return (
    <EmployeeLayout title="My Leave Portal" breadcrumb="Leave">
      <div className="page-header-block" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Leave Balances & Applications</h2>
          <p>View your remaining quota, submit leave requests, and track status.</p>
        </div>
        <button className="login-btn" style={{ width: "auto", padding: "0.7rem 1.25rem" }} onClick={() => setShowApplyModal(true)}>
          <FiPlus /> Apply New Leave
        </button>
      </div>

      {/* LEAVE BALANCE SUMMARY */}
      <div className="leave-balance-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="leave-cat-card" style={{ background: "#ffffff" }}>
          <div className="leave-cat-header">
            <span className="cat-title">Casual Leave</span>
            <span className="cat-count">{leaveBalances.casual.available} / {leaveBalances.casual.total} Days Available</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill green" style={{ width: `${(leaveBalances.casual.available / leaveBalances.casual.total) * 100}%` }} />
          </div>
        </div>

        <div className="leave-cat-card" style={{ background: "#ffffff" }}>
          <div className="leave-cat-header">
            <span className="cat-title">Sick Leave</span>
            <span className="cat-count">{leaveBalances.sick.available} / {leaveBalances.sick.total} Days Available</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill blue" style={{ width: `${(leaveBalances.sick.available / leaveBalances.sick.total) * 100}%` }} />
          </div>
        </div>

        <div className="leave-cat-card" style={{ background: "#ffffff" }}>
          <div className="leave-cat-header">
            <span className="cat-title">Earned Leave</span>
            <span className="cat-count">{leaveBalances.earned.available} / {leaveBalances.earned.total} Days Available</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill purple" style={{ width: `${(leaveBalances.earned.available / leaveBalances.earned.total) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* MY LEAVE REQUESTS TABLE */}
      <div className="enterprise-card">
        <h3>My Leave Application History</h3>
        <div className="table-responsive-wrapper" style={{ marginTop: "1rem" }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>LEAVE TYPE</th>
                <th>START DATE</th>
                <th>END DATE</th>
                <th>DURATION</th>
                <th>REASON</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((req) => (
                <tr key={req.id}>
                  <td><strong>{req.id}</strong></td>
                  <td><span className="leave-type-tag">{req.leaveType}</span></td>
                  <td>{req.startDate}</td>
                  <td>{req.endDate}</td>
                  <td>{req.duration}</td>
                  <td>"{req.reason}"</td>
                  <td>
                    <span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLY LEAVE MODAL */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for Leave</h3>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}>✕</button>
            </div>
            <form onSubmit={handleApply}>
              <div className="modal-body">
                <label className="input-label">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "1rem" }}
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="input-label">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>
                  <div>
                    <label className="input-label">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>
                </div>

                <label className="input-label">Reason for Leave</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State the reason for your leave request..."
                  required
                  style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div className="modal-footer" style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button type="button" className="view-payslip-btn" style={{ width: "auto" }} onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="login-btn" style={{ width: "auto", padding: "0.65rem 1.25rem" }}>Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
}
