import React from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeAnnouncements() {
  const { announcements } = useAuth();

  return (
    <EmployeeLayout title="Announcements" breadcrumb="Announcements">
      <div className="page-header-block">
        <h2>Company Notices & Policy News</h2>
        <p>Stay updated on key organizational policies, events, and HR updates.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {announcements.map((item) => (
          <div key={item.id} className="enterprise-card" style={{ borderLeft: item.important ? "4px solid #2563eb" : "1px solid #e2e8f0" }}>
            <div className="card-header-flex" style={{ marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="leave-type-tag">{item.category}</span>
                {item.important && <span className="badge badge-warning">Important Notice</span>}
              </div>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.date}</span>
            </div>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.1rem" }}>{item.title}</h3>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569", lineHeight: 1.5 }}>{item.content}</p>
          </div>
        ))}
      </div>
    </EmployeeLayout>
  );
}
