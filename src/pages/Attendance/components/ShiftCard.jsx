import {
  FiClock,
  FiEdit2
} from "react-icons/fi";

import "./ShiftCard.css";

export default function ShiftCard({
  title,
  time,
  employees,
  iconClass
}) {
  return (
    <div className="shift-card">

      <div className="shift-top">

        <div>
          <h3>{title}</h3>

          <p>{time}</p>
        </div>

        <div className={`shift-icon ${iconClass}`}>
          <FiClock />
        </div>

      </div>

      <div className="shift-count">
        {employees}
      </div>

      <span className="employee-label">
        employees assigned
      </span>

      <div className="shift-actions">

        <button className="view-btn">
          View
        </button>

        <button className="edit-btn">
          <FiEdit2 />
        </button>

      </div>
    </div>
  );
}