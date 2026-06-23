import "./PayrollStatsCards.css";
import {
  DollarSign,
  Users,
  Clock3,
  TrendingDown,
} from "lucide-react";
const PayrollStatsCards = () => {
const cards = [
  {
    title: "TOTAL PAYROLL",
    value: "₹31.2L",
    growth: "+8.2% this month",
    positive: true,
    icon: <DollarSign size={22} color="#2563eb" />,
  },
  {
    title: "PAID EMPLOYEES",
    value: "108",
    growth: "+3 this month",
    positive: true,
    icon: <Users size={22} color="#52c41a" />,
  },
  {
    title: "PENDING",
    value: "7",
    growth: "-2 this month",
    positive: false,
    icon: <Clock3 size={22} color="#faad14" />,
  },
  {
    title: "TOTAL DEDUCTIONS",
    value: "₹4.8L",
    growth: "-1.1% this month",
    positive: false,
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