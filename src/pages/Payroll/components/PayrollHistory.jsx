import { useState, useEffect } from "react";
import {
  FiEye,
  FiDownload,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import "./PayrollHistory.css";
import { getAllPayslips } from "../../../services/payrollService";

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function PayrollHistory() {
  const [selectedPayroll, setSelectedPayroll] =
    useState(null);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getAllPayslips();
      const payslips = res.data || [];

      // No dedicated history endpoint exists yet, so payroll cycles
      // are derived here by grouping payslips by month_id + year_id.
      // "status" has no real backend field, so it is hardcoded.
      const grouped = {};

      payslips.forEach((p) => {
        const key = `${p.month_id}-${p.year_id}`;

        if (!grouped[key]) {
          grouped[key] = {
            month: `${MONTH_NAMES[p.month_id] || p.month_id} ${p.year_id}`,
            amount: 0,
            employees: 0,
            status: "Completed",
          };
        }

        grouped[key].amount += Number(p.net_pay) || 0;
        grouped[key].employees += 1;
      });

      setHistory(Object.values(grouped));
    } catch (err) {
      console.error("Failed to fetch payroll history:", err);
    }
  };

  const formatAmount = (value) =>
    `₹${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const downloadReport = (item) => {
    const blob = new Blob(
      [
        `Payroll Report\nMonth: ${item.month}\nAmount: ${formatAmount(
          item.amount
        )}`,
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

            <h3>{formatAmount(item.amount)}</h3>
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
                {formatAmount(selectedPayroll.amount)}
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