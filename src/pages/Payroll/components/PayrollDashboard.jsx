import "./PayrollDashboard.css";
import PayrollStatsCards from "./PayrollStatsCards";
import PayrollBreakdown from "./PayrollBreakdown";

const PayrollDashboard = () => {
  const history = [
    {
      month: "Jun 2025",
      amount: "₹31.2L",
      status: "Pending",
    },
    {
      month: "May 2025",
      amount: "₹29.8L",
      status: "Active",
    },
    {
      month: "Apr 2025",
      amount: "₹28.5L",
      status: "Active",
    },
    {
      month: "Mar 2025",
      amount: "₹27.9L",
      status: "Active",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <PayrollStatsCards />

      <div className="dashboard-grid">
        <PayrollBreakdown />

        <div className="history-card">
          <h3>Recent Payroll History</h3>

          {history.map((item, index) => (
<div key={index} className="history-item">
  <div>
    <h4>{item.month}</h4>

    <span
      className={`status ${
        item.status === "Pending"
          ? "pending"
          : "active-status"
      }`}
    >
      {item.status}
    </span>
  </div>

  <div className="history-right">
    <h4>{item.amount}</h4>

    <button>View Details</button>
  </div>
</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;