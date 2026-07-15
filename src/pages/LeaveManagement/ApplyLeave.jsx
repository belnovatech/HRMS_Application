import React, { useState } from "react";
import "./ApplyLeave.css";
import api from "../../api/axiosInstance";// adjust path to your project structure

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("leave_type", leaveType);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("reason", reason);
    if (file) formData.append("attachment", file);

    try {
      await api.post("/leave/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.error("Apply leave failed:", err);
    }
  };

  return (
    <div className="leave-form-card">
      <h2>Apply Leave</h2>

      <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
        <option>Casual Leave</option>
        <option>Sick Leave</option>
        <option>Earned Leave</option>
      </select>

      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      <textarea
        rows="5"
        placeholder="Describe the reason..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button className="submit-btn" onClick={handleSubmit}>
        Apply Leave
      </button>
    </div>
  );
};

export default ApplyLeave;