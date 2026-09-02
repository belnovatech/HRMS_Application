import React, { useState } from "react";
import "./PendingApprovals.css";
import { useNavigate } from "react-router-dom";

export default function PendingApprovals() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([
    {
      id: "req-1",
      name: "Meena Pillai",
      avatar: "MP",
      avatarBg: "#4f46e5",
      subtext: "Casual Leave · 3 days",
      badges: [{ label: "Leave", type: "warning-pill" }]
    },
    {
      id: "req-2",
      name: "Rohan Das",
      avatar: "RD",
      avatarBg: "#3b82f6",
      subtext: "Correction · Aug 28",
      badges: [
        { label: "Urgent", type: "danger-pill" },
        { label: "Attendance", type: "warning-pill" }
      ]
    },
    {
      id: "req-3",
      name: "Kavya Nair",
      avatar: "KN",
      avatarBg: "#2563eb",
      subtext: "Sick Leave · 2 days",
      badges: [{ label: "Leave", type: "warning-pill" }]
    },
    {
      id: "req-4",
      name: "Aditya Joshi",
      avatar: "AJ",
      avatarBg: "#3b82f6",
      subtext: "Bank details update",
      badges: [{ label: "Profile", type: "warning-pill" }]
    }
  ]);

  const [pendingCount, setPendingCount] = useState(18);

  const handleApprove = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setPendingCount((prev) => Math.max(0, prev - 1));
  };

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setPendingCount((prev) => Math.max(0, prev - 1));
  };

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
        {requests.length === 0 ? (
          <div className="hradmin-dashboard-empty-state">
            <p>All pending requests resolved! 🎉</p>
          </div>
        ) : (
          requests.map((req) => (
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
                    onClick={() => handleApprove(req.id)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="hradmin-dashboard-btn-reject"
                    onClick={() => handleReject(req.id)}
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
