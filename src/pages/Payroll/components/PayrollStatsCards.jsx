import "./PayrollStatsCards.css";
import {
  DollarSign,
  Users,
  Clock3,
  TrendingDown,
} from "lucide-react";

const PayrollStatsCards = ({
  totalPayroll = "₹31.2L",
  payrollGrowth = "+8.2% this month",
  payrollPositive = true,
  paidEmployees = "108",
  employeeGrowth = "+3 this month",
  employeeGrowthPositive = true,
  pendingCount = "7",
  pendingGrowth = "-2 this month",
  pendingPositive = false,
  totalDeductions = "₹4.8L",
  deductionGrowth = "-1.1% this month",
  deductionPositive = false,
}) => {
  const cards = [
    {
      title: "TOTAL PAYROLL",
      value: totalPayroll,
      growth: payrollGrowth,
      positive: payrollPositive,
      icon: <DollarSign size={22} color="#2563eb" />,
    },
    {
      title: "PAID EMPLOYEES",
      value: paidEmployees,
      growth: employeeGrowth,
      positive: employeeGrowthPositive,
      icon: <Users size={22} color="#52c41a" />,
    },
    {
      title: "PENDING",
      value: pendingCount,
      growth: pendingGrowth,
      positive: pendingPositive,
      icon: <Clock3 size={22} color="#faad14" />,
    },
    {
      title: "TOTAL DEDUCTIONS",
      value: totalDeductions,
      growth: deductionGrowth,
      positive: deductionPositive,
      icon: <TrendingDown size={22} color="#ff4d4f" />,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-top">
            <span>{card.title}</span>

            <div className="stat-icon">
              {card.icon}
            </div>
          </div>

          <h2>{card.value}</h2>

          <p
            className={
              card.positive
                ? "positive"
                : "negative"
            }
          >
            {card.growth}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PayrollStatsCards;