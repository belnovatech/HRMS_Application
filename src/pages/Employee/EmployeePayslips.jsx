import React, { useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import { FiDownload, FiEye } from "react-icons/fi";

export default function EmployeePayslips() {
  const { payslips, user } = useAuth();
  const [selectedSlip, setSelectedSlip] = useState(null);

  return (
    <EmployeeLayout title="My Payslips" breadcrumb="My Payslips">
      <div className="page-header-block">
        <h2>Monthly Salary Slips & Tax Statements</h2>
        <p>View and download official monthly pay slips and tax deductions.</p>
      </div>

      <div className="enterprise-card">
        <div className="table-responsive-wrapper">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>PAY PERIOD</th>
                <th>GROSS SALARY</th>
                <th>DEDUCTIONS</th>
                <th>NET SALARY</th>
                <th>PAYMENT DATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((slip, idx) => (
                <tr key={idx}>
                  <td><strong>{slip.month}</strong></td>
                  <td>{slip.grossSalary}</td>
                  <td className="deduction-val">- {slip.deductions}</td>
                  <td><strong style={{ color: "#16a34a" }}>{slip.netSalary}</strong></td>
                  <td>{slip.payDate}</td>
                  <td><span className="badge badge-present">{slip.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="text-btn" onClick={() => setSelectedSlip(slip)}>
                        <FiEye /> View
                      </button>
                      <button className="text-btn" onClick={() => alert(`Downloading ${slip.month} Payslip PDF...`)}>
                        <FiDownload /> Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSlip && (
        <div className="modal-overlay" onClick={() => setSelectedSlip(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Salary Slip Statement — {selectedSlip.month}</h3>
              <button className="modal-close" onClick={() => setSelectedSlip(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p><strong>Employee:</strong> {user?.name || "Arjun Mehta"} ({user?.employeeId || "EMP001"})</p>
              <hr />
              <div className="salary-breakdown-list">
                <div className="salary-row"><span>Gross Earnings</span><strong>{selectedSlip.grossSalary}</strong></div>
                <div className="salary-row"><span>Total Deductions</span><strong className="deduction-val">- {selectedSlip.deductions}</strong></div>
                <hr />
                <div className="salary-row total-net"><span>Net Salary Paid</span><strong className="net-val">{selectedSlip.netSalary}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
}
