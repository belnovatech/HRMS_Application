import React, { useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
export default function EmployeeRequests() {
  const { leaveRequests } = useAuth();
  const [requestsList] = useState([
    ...leaveRequests.map((l) => ({ id: l.id, type: "Leave Request", details: `${l.leaveType} (${l.startDate} to ${l.endDate})`, status: l.status, date: l.appliedOn })),
    { id: "REQ-301", type: "Attendance Regularization", details: "Forgot to punch check-out on Aug 25", status: "Approved", date: "2026-08-26" },
    { id: "REQ-302", type: "Address Update Request", details: "Change of local residential address", status: "Pending", date: "2026-08-29" },
  ]);

  return (
    <EmployeeLayout title="My Requests" breadcrumb="My Requests">
      <div className="page-header-block">
        <h2>My Submitted Requests Tracker</h2>
        <p>Track progress of leave, regularization, expense reimbursement, and document requests.</p>
      </div>

      <div className="enterprise-card">
        <div className="table-responsive-wrapper">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>REQUEST TYPE</th>
                <th>DETAILS / SUMMARY</th>
                <th>SUBMITTED DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {requestsList.map((req) => (
                <tr key={req.id}>
                  <td><strong>{req.id}</strong></td>
                  <td><span className="leave-type-tag">{req.type}</span></td>
                  <td>{req.details}</td>
                  <td>{req.date}</td>
                  <td>
                    <span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span>
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
