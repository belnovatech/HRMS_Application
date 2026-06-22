import React from "react";
import "./ApplyLeave.css";

const ApplyLeave = () => {
  return (
    <div className="leave-form-card">
      <h2>Apply Leave</h2>

      <select>
        <option>Casual Leave</option>
        <option>Sick Leave</option>
        <option>Earned Leave</option>
      </select>

      <input type="date" />

      <input type="date" />

      <textarea
        rows="5"
        placeholder="Describe the reason..."
      />

      <input type="file" />

      <button className="submit-btn">
        Apply Leave
      </button>
    </div>
  );
};

export default ApplyLeave;