import React from "react";
import "./Reports.css";
import HRLayout from "../../../layouts/HRLayout";
import { FiBarChart2, FiDownload } from "react-icons/fi";

export default function Reports() {
  const reportsList = [
    { title: "Monthly Attendance Summary", desc: "Detailed employee attendance, late clock-ins, and leave totals.", type: "PDF / Excel" },
    { title: "Payroll & Disbursal Register", desc: "Gross salaries, PF, ESI deductions, net payouts per department.", type: "Excel" },
    { title: "Headcount & Attrition Report", desc: "Quarterly employee joining, departure, and retention rates.", type: "PDF" },
    { title: "Leave Balance Ledger", desc: "Employee leave quota balances, carry-forward, and encashment.", type: "Excel" },
  ];

  return (
    <HRLayout title="Reports & Analytics" breadcrumb="Reports">
      <div className="hr-reports-page-container">
        <div className="hr-page-intro">
          <h2>HR Analytics & System Export Reports</h2>
          <p>Generate, schedule, and download comprehensive organizational and payroll reports.</p>
        </div>

        <div className="hr-reports-grid">
          {reportsList.map((rep) => (
            <div key={rep.title} className="hr-report-card">
              <div className="hr-report-icon">
                <FiBarChart2 />
              </div>
              <div className="hr-report-info">
                <h3>{rep.title}</h3>
                <p>{rep.desc}</p>
                <small>Format: <strong>{rep.type}</strong></small>
              </div>
              <button type="button" className="hr-btn-gen-report">
                <FiDownload /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </HRLayout>
  );
}
