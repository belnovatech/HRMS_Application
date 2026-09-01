import React, { useMemo, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import {
  FiDownload,
  FiEye,
  FiX,
  FiFileText,
} from "react-icons/fi";
import "./EmployeePayslips.css";

export default function EmployeePayslips() {
  const { payslips = [], user } = useAuth();
  const [selectedSlip, setSelectedSlip] = useState(null);

  const currentSlip = useMemo(() => {
    if (!payslips.length) return null;
    return payslips[0];
  }, [payslips]);

  const handleDownload = (slip) => {
    alert(`Downloading ${slip.month} Payslip PDF...`);
  };

  const getMonthName = (monthValue) => {
    if (!monthValue) return "Current Month";

    const value = String(monthValue);

    if (/^\d{4}-\d{2}$/.test(value)) {
      const [year, month] = value.split("-").map(Number);

      return new Date(year, month - 1, 1).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      );
    }

    return value;
  };

  return (
    <EmployeeLayout
      title="My Payslips"
      breadcrumb="My Payslips"
    >
      <div className="emp-payslip-page">

        <section className="emp-payslip-page-header">
          <h1>My Payslips</h1>

          <p>
            View and download your monthly payslips
          </p>
        </section>

        {currentSlip ? (
          <section className="emp-payslip-current-card">

            <div className="emp-payslip-current-top">
              <span className="emp-payslip-current-label">
                Current Month — {getMonthName(currentSlip.month)}
              </span>

              <div className="emp-payslip-company-mark">
                <div className="emp-payslip-company-icon">
                  B
                </div>

                <div className="emp-payslip-company-name">
                  <strong>BELNOVA</strong>
                  <span>HRMS</span>
                </div>
              </div>
            </div>

            <div className="emp-payslip-current-salary-grid">

              <div className="emp-payslip-current-item">
                <span>Gross Salary</span>
                <strong>
                  {currentSlip.grossSalary}
                </strong>
              </div>

              <div className="emp-payslip-current-item">
                <span>Deductions</span>
                <strong>
                  {currentSlip.deductions}
                </strong>
              </div>

              <div className="emp-payslip-current-item">
                <span>Net Salary</span>
                <strong>
                  {currentSlip.netSalary}
                </strong>
              </div>

            </div>

            <button
              type="button"
              className="emp-payslip-current-download"
              onClick={() =>
                handleDownload(currentSlip)
              }
            >
              <FiDownload />
              Download {getMonthName(currentSlip.month)} Payslip
            </button>

          </section>
        ) : (
          <section className="emp-payslip-current-card emp-payslip-no-current">
            <FiFileText />

            <div>
              <strong>No payslip available</strong>
              <span>
                Your latest payslip will appear here once it is available.
              </span>
            </div>
          </section>
        )}

        <section className="emp-payslip-history-card">

          <div className="emp-payslip-history-header">
            <h2>Payslip History</h2>
          </div>

          <div className="emp-payslip-table-scroll">
            <table className="emp-payslip-table">

              <thead>
                <tr>
                  <th>MONTH</th>
                  <th>GROSS</th>
                  <th>DEDUCTIONS</th>
                  <th>NET SALARY</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {payslips.length > 0 ? (
                  payslips.map((slip, index) => (
                    <tr key={slip.id || `${slip.month}-${index}`}>

                      <td>
                        <strong>
                          {slip.month}
                        </strong>
                      </td>

                      <td className="emp-payslip-gross">
                        {slip.grossSalary}
                      </td>

                      <td className="emp-payslip-deduction">
                        {slip.deductions}
                      </td>

                      <td className="emp-payslip-net">
                        {slip.netSalary}
                      </td>

                      <td>
                        <span
                          className={`emp-payslip-status emp-payslip-status-${String(
                            slip.status || "Processed"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {slip.status || "Processed"}
                        </span>
                      </td>

                      <td>
                        <div className="emp-payslip-actions">

                          <button
                            type="button"
                            className="emp-payslip-view-button"
                            onClick={() =>
                              setSelectedSlip(slip)
                            }
                          >
                            <FiEye />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            className="emp-payslip-pdf-button"
                            onClick={() =>
                              handleDownload(slip)
                            }
                          >
                            <FiDownload />
                            <span>PDF</span>
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="emp-payslip-empty"
                    >
                      No payslip records found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </section>

        {selectedSlip && (
          <div
            className="emp-payslip-modal-overlay"
            onClick={() => setSelectedSlip(null)}
          >
            <div
              className="emp-payslip-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="emp-payslip-modal-header">

                <div>
                  <span className="emp-payslip-modal-kicker">
                    SALARY STATEMENT
                  </span>

                  <h2>
                    {selectedSlip.month}
                  </h2>
                </div>

                <button
                  type="button"
                  className="emp-payslip-modal-close"
                  onClick={() =>
                    setSelectedSlip(null)
                  }
                  aria-label="Close payslip"
                >
                  <FiX />
                </button>

              </div>

              <div className="emp-payslip-modal-body">

                <div className="emp-payslip-employee-info">
                  <span>Employee</span>

                  <strong>
                    {user?.name || "Employee"}
                  </strong>

                  <small>
                    {user?.employeeId || "EMP001"}
                  </small>
                </div>

                <div className="emp-payslip-breakdown">

                  <div className="emp-payslip-breakdown-row">
                    <span>Gross Earnings</span>
                    <strong className="emp-payslip-modal-green">
                      {selectedSlip.grossSalary}
                    </strong>
                  </div>

                  <div className="emp-payslip-breakdown-row">
                    <span>Total Deductions</span>
                    <strong className="emp-payslip-modal-red">
                      - {selectedSlip.deductions}
                    </strong>
                  </div>

                  <div className="emp-payslip-breakdown-divider" />

                  <div className="emp-payslip-breakdown-row emp-payslip-breakdown-total">
                    <span>Net Salary Paid</span>
                    <strong>
                      {selectedSlip.netSalary}
                    </strong>
                  </div>

                </div>

                <button
                  type="button"
                  className="emp-payslip-modal-download"
                  onClick={() =>
                    handleDownload(selectedSlip)
                  }
                >
                  <FiDownload />
                  Download PDF
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}