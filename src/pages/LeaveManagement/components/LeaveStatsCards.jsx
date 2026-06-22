import React from "react";
import "./LeaveStatsCards.css";

const cards = [
  {
    title: "CASUAL LEAVE",
    remaining: 8,
    used: 4,
    total: 12,
    color: "#2563eb",
  },
  {
    title: "SICK LEAVE",
    remaining: 6,
    used: 2,
    total: 8,
    color: "#ef4444",
  },
  {
    title: "EARNED LEAVE",
    remaining: 16,
    used: 8,
    total: 24,
    color: "#22c55e",
  },
  {
    title: "UNPAID LEAVE",
    remaining: "∞",
    used: 0,
    total: "-",
    color: "#f59e0b",
  },
];

const LeaveStatsCards = () => {
  return (
    <div className="leave-stats-grid">
      {cards.map((card, index) => (
        <div className="leave-card" key={index}>
          <h4>{card.title}</h4>

          <div
            className="leave-number"
            style={{ color: card.color }}
          >
            {card.remaining}
          </div>

          <p>days remaining</p>

          {card.total !== "-" && (
            <>
              <div className="leave-progress">
                <div
                  className="leave-fill"
                  style={{
                    width: `${
                      (card.used / card.total) * 100
                    }%`,
                    background: card.color,
                  }}
                />
              </div>

              <span>
                {card.used} used / {card.total} total
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveStatsCards;