import React, { useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { FiSend } from "react-icons/fi";

export default function EmployeeHelp() {
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject && query) {
      setSent(true);
      setSubject("");
      setQuery("");
    }
  };

  return (
    <EmployeeLayout title="Help & Support" breadcrumb="Help & Support">
      <div className="page-header-block">
        <h2>Employee Helpdesk & Support</h2>
        <p>Raise support tickets or read frequently asked questions.</p>
      </div>

      <div className="employee-grid">
        <div className="enterprise-card">
          <h3>Submit a Support Ticket</h3>
          {sent && (
            <div className="login-error-alert" style={{ background: "#f0fdf4", borderColor: "#86efac", color: "#166534", marginBottom: "1rem" }}>
              ✓ Ticket submitted! Reference ID #EMP-{Math.floor(1000 + Math.random() * 9000)}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label className="input-label">Ticket Subject</label>
            <div className="input-box" style={{ background: "#f8fafc" }}>
              <input
                type="text"
                placeholder="e.g. Issue downloading payslip statement"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <label className="input-label">Details / Message</label>
            <div className="input-box" style={{ background: "#f8fafc", padding: "0.5rem 0.85rem", marginBottom: "1.25rem" }}>
              <textarea
                rows={4}
                placeholder="Describe your issue or request..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: "100%", border: "none", outline: "none", background: "transparent", resize: "vertical" }}
                required
              />
            </div>

            <button className="login-btn" type="submit" style={{ width: "auto", padding: "0.75rem 1.5rem" }}>
              <FiSend /> Send Ticket
            </button>
          </form>
        </div>

        <div className="enterprise-card">
          <h3>Frequently Asked Questions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ padding: "0.85rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <strong style={{ display: "block", fontSize: "0.9rem", color: "#0f172a" }}>How do I apply for leave?</strong>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.82rem", color: "#64748b" }}>Go to Leave menu or click 'Apply Leave' on your Dashboard.</p>
            </div>
            <div style={{ padding: "0.85rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <strong style={{ display: "block", fontSize: "0.9rem", color: "#0f172a" }}>When are payslips generated?</strong>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.82rem", color: "#64748b" }}>Payslips are published on the last working day of every month.</p>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
