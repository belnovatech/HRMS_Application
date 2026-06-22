import React, { useState } from "react";
import "./LeaveApprovalTable.css";

const initialData = [
  {
    id: 1,
    name: "Deepak Kumar",
    initials: "DK",
    type: "Casual Leave",
    dates: "Jun 22 - Jun 23",
    days: "2 days",
    reason: "Personal work",
    status: "Pending",
  },
  {
    id: 2,
    name: "Kavya Nair",
    initials: "KN",
    type: "Sick Leave",
    dates: "Jun 18 - Jun 18",
    days: "1 day",
    reason: "Medical appointment",
    status: "Pending",
  },
];

export default function LeaveApprovalTable() {
  const [requests, setRequests] = useState(initialData);

  const updateStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      )
    );
  };

  return (
    <div className="approval-container">
      <h3>Pending Approvals</h3>

      {requests.map((item) => (
        <div key={item.id} className="approval-row">
          <div className="approval-left">
            <div className="employee-avatar">
              {item.initials}
            </div>

            <div className="employee-info">
              <h4>{item.name}</h4>

              <p>
                {item.type} • {item.dates} ({item.days})
              </p>

              <span className="leave-reason">
                {item.reason}
              </span>
            </div>
          </div>

          <div className="approval-actions">

            <span
              className={`status-badge ${item.status.toLowerCase()}`}
            >
              {item.status}
            </span>

            {item.status === "Pending" && (
              <>
                <button
                  className="approve-btn"
                  onClick={() =>
                    updateStatus(
                      item.id,
                      "Approved"
                    )
                  }
                >
                  ✓
                </button>

                <button
                  className="reject-btn"
                  onClick={() =>
                    updateStatus(
                      item.id,
                      "Rejected"
                    )
                  }
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}