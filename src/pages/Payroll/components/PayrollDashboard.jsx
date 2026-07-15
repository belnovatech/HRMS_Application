import { useState, useEffect } from "react";
import "./PayrollDashboard.css";
import PayrollStatsCards from "./PayrollStatsCards";
import PayrollBreakdown from "./PayrollBreakdown";
import { getAllPayslips } from "../../../services/payrollService";

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatLakh = (value) => `₹${(value / 100000).toFixed(1)}L`;

const formatGrowth = (current, previous) => {
  if (previous === undefined || previous === 0) return "N/A";
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}% this month`;
};

const PayrollDashboard = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAllPayslips();
      const payslips = res.data || [];

      // Group payslips by month_id + year_id since there's no
      // dedicated dashboard/history endpoint.
      const grouped = {};

      payslips.forEach((p) => {
        const key = `${p.year_id}-${p.month_id}`;

        if (!grouped[key]) {
          grouped[key] = {
            month_id: p.month_id,
            year_id: p.year_id,
            monthLabel: `${MONTH_NAMES[p.month_id] || p.month_id} ${p.year_id}`,
            totalEarnings: 0,
            totalDeductions: 0,
            netPay: 0,
            basic: 0,
            hra: 0,
            conveyance: 0,
            medicalAllowance: 0,
            specialAllowance: 0,
            activeCount: 0,
            inactiveCount: 0,
            employeeCount: 0,
          };
        }

        const g = grouped[key];
        g.totalEarnings += Number(p.total_earnings) || 0;
        g.totalDeductions += Number(p.total_deductions) || 0;
        g.netPay += Number(p.net_pay) || 0;
        g.basic += Number(p.basic) || 0;
        g.hra += Number(p.hra) || 0;
        g.conveyance += Number(p.conveyance) || 0;
        g.medicalAllowance += Number(p.medical_allowance) || 0;
        g.specialAllowance += Number(p.special_allowance) || 0;
        g.employeeCount += 1;
        if (p.is_active) g.activeCount += 1;
        else g.inactiveCount += 1;
      });

      // Sort groups by year/month, most recent first
      const sortedGroups = Object.values(grouped).sort(
        (a, b) =>
          b.year_id - a.year_id || b.month_id - a.month_id
      );

      const latest = sortedGroups[0];
      const previous = sortedGroups[1];

      if (latest) {
        setStats({
          totalPayroll: formatLakh(latest.totalEarnings),
          payrollGrowth: previous
            ? formatGrowth(latest.totalEarnings, previous.totalEarnings)
            : "N/A",
          payrollPositive: previous
            ? latest.totalEarnings >= previous.totalEarnings
            : true,

          paidEmployees: String(latest.employeeCount),
          employeeGrowth: previous
            ? formatGrowth(latest.employeeCount, previous.employeeCount)
            : "N/A",
          employeeGrowthPositive: previous
            ? latest.employeeCount >= previous.employeeCount
            : true,

          // NOTE: "pending" has no real backend field. Approximated here
          // using is_active === false as a stand-in — confirm with
          // backend what "pending" should actually mean.
          pendingCount: String(latest.inactiveCount),
          pendingGrowth: "N/A",
          pendingPositive: false,

          totalDeductions: formatLakh(latest.totalDeductions),
          deductionGrowth: previous
            ? formatGrowth(latest.totalDeductions, previous.totalDeductions)
            : "N/A",
          deductionPositive: previous
            ? latest.totalDeductions <= previous.totalDeductions
            : true,
        });

        const total = latest.totalEarnings || 1;

        setBreakdown({
          monthLabel: latest.monthLabel,
          data: [
            {
              label: "Basic Salary",
              value: `₹${latest.basic.toLocaleString("en-IN")}`,
              width: `${((latest.basic / total) * 100).toFixed(0)}%`,
            },
            {
              label: "HRA",
              value: `₹${latest.hra.toLocaleString("en-IN")}`,
              width: `${((latest.hra / total) * 100).toFixed(0)}%`,
            },
            {
              label: "Special Allowance",
              value: `₹${latest.specialAllowance.toLocaleString("en-IN")}`,
              width: `${((latest.specialAllowance / total) * 100).toFixed(0)}%`,
            },
            {
              // No "bonus" field exists in the payslip API — showing
              // N/A instead of fabricating a number. Flag to backend.
              label: "Bonus",
              value: "N/A",
              width: "0%",
            },
          ],
        });
      }

      // Recent history list (top 4 months). "status" has no real
      // backend field — hardcoded to "Completed" as an approximation.
      setHistory(
        sortedGroups.slice(0, 4).map((g) => ({
          month: g.monthLabel,
          amount: formatLakh(g.netPay),
          status: "Completed",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load payroll dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-wrapper">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <p>{error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <PayrollStatsCards {...(stats || {})} />

      <div className="dashboard-grid">
        <PayrollBreakdown
          data={breakdown?.data}
          monthLabel={breakdown?.monthLabel}
        />

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