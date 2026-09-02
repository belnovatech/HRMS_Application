import React from "react";
import "./QuickActions.css";
import {
  FiPlus,
  FiCheckCircle,
  FiDollarSign,
  FiRefreshCw,
  FiUploadCloud,
  FiBarChart2
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      id: "qa-add-employee",
      label: "Add Employee",
      icon: <FiPlus />,
      iconBg: "#eff6ff",
      iconColor: "#3b82f6",
      route: "/hr/employees"
    },
    {
      id: "qa-approve-leave",
      label: "Approve Leave",
      icon: <FiCheckCircle />,
      iconBg: "#ecfdf5",
      iconColor: "#10b981",
      route: "/hr/leave-management"
    },
    {
      id: "qa-run-payroll",
      label: "Run Payroll",
      icon: <FiDollarSign />,
      iconBg: "#faf5ff",
      iconColor: "#a855f7",
      route: "/hr/payroll"
    },
    {
      id: "qa-sync-biometric",
      label: "Sync Biometric",
      icon: <FiRefreshCw />,
      iconBg: "#ecfeff",
      iconColor: "#06b6d4",
      route: "/hr/biometric-sync"
    },
    {
      id: "qa-upload-doc",
      label: "Upload Document",
      icon: <FiUploadCloud />,
      iconBg: "#fff7ed",
      iconColor: "#f97316",
      route: "/hr/documents"
    },
    {
      id: "qa-generate-report",
      label: "Generate Report",
      icon: <FiBarChart2 />,
      iconBg: "#fdf4ff",
      iconColor: "#d946ef",
      route: "/hr/reports"
    }
  ];

  return (
    <div className="hradmin-dashboard-actions-card">
      <div className="hradmin-dashboard-actions-header">
        <h3 className="hradmin-dashboard-card-title">Quick Actions</h3>
      </div>

      <div className="hradmin-dashboard-actions-grid">
        {actions.map((act) => (
          <div
            key={act.id}
            className="hradmin-dashboard-action-tile"
            onClick={() => navigate(act.route)}
          >
            <div
              className="hradmin-dashboard-action-icon-box"
              style={{ background: act.iconBg, color: act.iconColor }}
            >
              {act.icon}
            </div>
            <span className="hradmin-dashboard-action-label">{act.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
