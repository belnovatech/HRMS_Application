import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiHome,
  FiTrendingUp,
} from "react-icons/fi";

import "./AttendanceCards.css";

export default function AttendanceCards() {
  const cards = [
    {
      title: "Present",
      count: 98,
      icon: <FiCheckCircle />,
      className: "green",
    },
    {
      title: "Absent",
      count: 7,
      icon: <FiXCircle />,
      className: "red",
    },
    {
      title: "Late Arrivals",
      count: 5,
      icon: <FiClock />,
      className: "yellow",
    },
    {
      title: "WFH",
      count: 12,
      icon: <FiHome />,
      className: "blue",
    },
    {
      title: "Overtime",
      count: 8,
      icon: <FiTrendingUp />,
      className: "purple",
    },
  ];

  return (
    <div className="attendance-cards-grid">
      {cards.map((card, index) => (
        <div
          key={index}
          className="attendance-card"
        >
          <div className={`card-icon ${card.className}`}>
            {card.icon}
          </div>

          <h2>{card.count}</h2>

          <p>{card.title}</p>
        </div>
      ))}
    </div>
  );
}