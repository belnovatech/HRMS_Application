import React from "react";
import "./RolesPermissions.css";
import HRLayout from "../../../layouts/HRLayout";
import { FiShield } from "react-icons/fi";

export default function RolesPermissions() {
  const roles = [
    { role: "HR Administrator", usersCount: 3, access: "Full System Access", permissions: "All modules & settings" },
    { role: "Department Manager", usersCount: 12, access: "Manager Portal", permissions: "Team management, Leave approval, Reports" },
    { role: "Standard Employee", usersCount: 109, access: "Employee Portal", permissions: "Self-service, Attendance, Payslips" },
  ];

  return (
    <HRLayout title="Roles & Permissions" breadcrumb="RolesPermissions">
      <div className="hr-roles-page-container">
        <div className="hr-page-intro">
          <h2>Role-Based Access Control (RBAC)</h2>
          <p>Configure user roles, access policies, module permissions, and security scope across portals.</p>
        </div>

        <div className="hr-roles-list">
          {roles.map((r) => (
            <div key={r.role} className="hr-role-card">
              <div className="hr-role-icon">
                <FiShield />
              </div>
              <div className="hr-role-details">
                <h3>{r.role}</h3>
                <p><strong>Assigned Users:</strong> {r.usersCount} Active Users</p>
                <p><strong>Access Scope:</strong> {r.access}</p>
                <small>Permissions: {r.permissions}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HRLayout>
  );
}
