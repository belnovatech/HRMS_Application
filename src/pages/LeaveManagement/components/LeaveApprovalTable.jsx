import React from "react";
import "./LeaveApprovalTable.css";
import { useAuth } from "../../../context/AuthContext";
import { FiCheck, FiX } from "react-icons/fi";

export default function LeaveApprovalTable() {
  const { leaveRequests, handleApproveLeave, handleRejectLeave } = useAuth();

  return (
    <div className="leave-approvals-card enterprise-card">
      <div className="leave-approvals-header">
        <h3>Pending Approvals</h3>
        <span className="badge badge-warning">{leaveRequests.filter(r => r.status === "Pending").length} Pending</span>
      </div>

      <div className="leave-approvals-list">
        {leaveRequests.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "1rem" }}>No leave requests found.</p>
        ) : (
          leaveRequests.map((item) => (
            <div key={item.id} className="leave-approval-row">
              <div className="leave-approval-left">
                <div className="leave-emp-avatar" style={{ background: item.avatarBg || "#7c3aed" }}>
                  {item.initials}
                </div>

                <div className="leave-emp-details">
                  <h4>{item.employeeName}</h4>
                  <p>
                    <span className="badge badge-info">{item.leaveType}</span> • {item.startDate} to {item.endDate} ({item.duration})
                  </p>
                  <span className="leave-reason-text">"{item.reason}"</span>
                </div>
              </div>

              <div className="leave-approval-actions">
                <span className={`badge badge-${item.status.toLowerCase()}`}>
                  {item.status}
                </span>

                {item.status === "Pending" && (
                  <div className="leave-btn-group">
                    <button
                      className="leave-approve-btn"
                      onClick={() => handleApproveLeave(item.id)}
                      title="Approve Leave"
                    >
                      <FiCheck /> Approve
                    </button>

                    <button
                      className="leave-reject-btn"
                      onClick={() => handleRejectLeave(item.id)}
                      title="Reject Leave"
                    >
                      <FiX /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}