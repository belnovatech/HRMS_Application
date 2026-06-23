import { useState } from "react";
import {
  FiEye,
  FiDownload,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import "./PayrollHistory.css";

export default function PayrollHistory() {
  const [selectedPayroll, setSelectedPayroll] =
    useState(null);

  const history = [
    {
      month: "Jun 2025",
      amount: "₹31.2L",
      employees: 115,
      status: "Completed",
    },
    {
      month: "May 2025",
      amount: "₹29.8L",
      employees: 112,
      status: "Completed",
    },
    {
      month: "Apr 2025",
      amount: "₹28.5L",
      employees: 110,
      status: "Completed",
    },
    {
      month: "Mar 2025",
      amount: "₹27.9L",
      employees: 108,
      status: "Completed",
    },
  ];

  const downloadReport = (item) => {
    const blob = new Blob(
      [
        `Payroll Report\nMonth: ${item.month}\nAmount: ${item.amount}`,
      ],
      { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.month}-Payroll.txt`;
    a.click();
  };

  return (
    <div className="history-main">
      <div className="history-header">
        <h2>Payroll History</h2>

        <span>
          {history.length} Payroll Cycles
        </span>
      </div>

      {history.map((item, index) => (
        <div
          key={index}
          className="history-row"
        >
          <div className="history-left">
            <div className="month-icon">
              <FiCalendar />
            </div>

            <div>
              <h3>{item.month}</h3>
              <p>
                {item.employees} Employees
              </p>
            </div>
          </div>

          <div className="history-center">
            <FiDollarSign />

            <h3>{item.amount}</h3>
          </div>

          <div className="history-status">
            {item.status}
          </div>

          <div className="history-actions">
            <button
              className="view-btn"
              onClick={() =>
                setSelectedPayroll(item)
              }
            >
              <FiEye />
            </button>

            <button
              className="download-btn"
              onClick={() =>
                downloadReport(item)
              }
            >
              <FiDownload />
            </button>
          </div>
        </div>
      ))}

      {selectedPayroll && (
        <div className="history-modal">
          <div className="modal-card">
            <h2>
              {selectedPayroll.month}
            </h2>

            <div className="modal-info">
              <p>
                Amount:
                {selectedPayroll.amount}
              </p>

              <p>
                Employees:
                {selectedPayroll.employees}
              </p>

              <p>
                Status:
                {selectedPayroll.status}
              </p>
            </div>

            <button
              className="close-btn"
              onClick={() =>
                setSelectedPayroll(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}