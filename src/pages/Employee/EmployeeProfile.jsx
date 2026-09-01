import React, { useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";


export default function EmployeeProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <EmployeeLayout title="My Profile" breadcrumb="My Profile">
      <div className="page-header-block">
        <h2>Employee Profile Details</h2>
        <p>View personal information, job role, emergency contacts, and payroll details.</p>
      </div>

      <div className="enterprise-card" style={{ marginBottom: "1.5rem" }}>
        <div className="auth-mode-tabs" style={{ maxWidth: "450px" }}>
          <button className={`mode-tab ${activeTab === "personal" ? "active" : ""}`} onClick={() => setActiveTab("personal")}>
            Personal Info
          </button>
          <button className={`mode-tab ${activeTab === "job" ? "active" : ""}`} onClick={() => setActiveTab("job")}>
            Job Details
          </button>
          <button className={`mode-tab ${activeTab === "bank" ? "active" : ""}`} onClick={() => setActiveTab("bank")}>
            Bank & Statutory
          </button>
        </div>
      </div>

      <div className="enterprise-card">
        {activeTab === "personal" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
            <div>
              <label className="input-label">Full Name</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value={user?.name || "Arjun Mehta"} readOnly />
              </div>
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value={user?.email || "arjun@belnova.com"} readOnly />
              </div>
            </div>
            <div>
              <label className="input-label">Phone Number</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value={user?.phone || "+91 98765 43210"} readOnly />
              </div>
            </div>
            <div>
              <label className="input-label">Residential Address</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value={user?.address || "Bengaluru, Karnataka, India"} readOnly />
              </div>
            </div>
          </div>
        )}

        {activeTab === "job" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
            <div>
              <label className="input-label">Employee ID</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value={user?.employeeId || "EMP001"} readOnly />
              </div>
            </div>
            <div>
              <label className="input-label">Designation</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value={user?.designation || "Senior Engineer"} readOnly />
              </div>
            </div>
            <div>
              <label className="input-label">Department</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value={user?.department || "Engineering"} readOnly />
              </div>
            </div>
            <div>
              <label className="input-label">Reporting Manager</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value={user?.reportsTo || "Vikramaditya Rao"} readOnly />
              </div>
            </div>
          </div>
        )}

        {activeTab === "bank" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
            <div>
              <label className="input-label">Bank Account Number</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value="•••• •••• 8849" readOnly />
              </div>
            </div>
            <div>
              <label className="input-label">Bank Name & IFSC</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value="HDFC Bank (HDFC0001234)" readOnly />
              </div>
            </div>
            <div>
              <label className="input-label">PAN Number</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value="ABCDE1234F" readOnly />
              </div>
            </div>
            <div>
              <label className="input-label">PF UAN Number</label>
              <div className="input-box" style={{ background: "#f8fafc" }}>
                <input type="text" value="100987654321" readOnly />
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
