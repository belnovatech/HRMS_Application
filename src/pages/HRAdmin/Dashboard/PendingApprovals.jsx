import React from "react";
import "./PendingApprovals.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function PendingApprovals() {
  const navigate = useNavigate();
  const { leaveRequests = [], handleApproveLeave, handleRejectLeave } = useAuth();

  const pendingRequests = React.useMemo(() => {
    return leaveRequests
      .filter((r) => r.status === "Pending")
      .map((r) => ({
        id: r.id,
        name: r.employeeName || r.employee || "Employee",
        avatar: r.initials || "EM",
        avatarBg: r.avatarBg || "#2563eb",
        subtext: `${r.leaveType} · ${r.duration || "1 Day"}`,
        badges: [{ label: "Leave", type: "warning-pill" }],
      }));
  }, [leaveRequests]);

  const pendingCount = pendingRequests.length;

  return (
    <div className="hradmin-dashboard-pending-card">
      <div className="hradmin-dashboard-pending-header">
        <div>
          <h3 className="hradmin-dashboard-card-title">Pending Approvals</h3>
          <span className="hradmin-dashboard-card-subtitle">
            {pendingCount} requests require your action
          </span>
        </div>

        <button
          type="button"
          className="hradmin-dashboard-btn-link"
          onClick={() => navigate("/hr/leave-management")}
        >
          View all &rarr;
        </button>
      </div>

      <div className="hradmin-dashboard-pending-list">
        {pendingRequests.length === 0 ? (
          <div className="hradmin-dashboard-empty-state">
            <p>All pending requests resolved! 🎉</p>
          </div>
        ) : (
          pendingRequests.map((req) => (
            <div key={req.id} className="hradmin-dashboard-pending-item">
              <div className="hradmin-dashboard-pending-user">
                <div
                  className="hradmin-dashboard-pending-avatar"
                  style={{ background: req.avatarBg }}
                >
                  {req.avatar}
                </div>

                <div className="hradmin-dashboard-pending-info">
                  <h4 className="hradmin-dashboard-pending-name">{req.name}</h4>
                  <span className="hradmin-dashboard-pending-subtext">{req.subtext}</span>
                </div>
              </div>

              <div className="hradmin-dashboard-pending-right">
                <div className="hradmin-dashboard-pending-badges">
                  {req.badges.map((b, idx) => (
                    <span
                      key={idx}
                      className={`hradmin-dashboard-pill ${b.type}`}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>

                <div className="hradmin-dashboard-pending-actions">
                  <button
                    type="button"
                    className="hradmin-dashboard-btn-approve"
                    onClick={() => handleApproveLeave(req.id)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="hradmin-dashboard-btn-reject"
                    onClick={() => handleRejectLeave(req.id, "Rejected from Dashboard")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
