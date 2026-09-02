import React from "react";
import "./EmployeeDetails.css";
import { FiX, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCalendar, FiDollarSign } from "react-icons/fi";

export default function EmployeeDetails({ employee, onClose }) {
  if (!employee) return null;

  return (
    <div className="hr-emp-details-overlay">
      <div className="hr-emp-details-modal">
        <div className="hr-emp-details-header">
          <h3>Employee Profile</h3>
          <button type="button" className="hr-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="hr-emp-details-body">
          <div className="hr-profile-card-hero">
            <div className="hr-hero-avatar">
              {employee.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="hr-hero-info">
              <h2>{employee.name}</h2>
              <p>{employee.role} • <strong>{employee.department}</strong></p>
              <span className={`hr-emp-status-badge ${employee.status.toLowerCase().replace(" ", "-")}`}>
                {employee.status}
              </span>
            </div>
          </div>

          <div className="hr-details-grid">
            <div className="hr-detail-block">
              <span className="label"><FiMail /> Email Address</span>
              <p className="value">{employee.email}</p>
            </div>
            <div className="hr-detail-block">
              <span className="label"><FiPhone /> Phone Number</span>
              <p className="value">+91 98765 43210</p>
            </div>
            <div className="hr-detail-block">
              <span className="label"><FiBriefcase /> Employee ID</span>
              <p className="value">{employee.id}</p>
            </div>
            <div className="hr-detail-block">
              <span className="label"><FiCalendar /> Joining Date</span>
              <p className="value">{employee.joinDate}</p>
            </div>
            <div className="hr-detail-block">
              <span className="label"><FiDollarSign /> Base CTC</span>
              <p className="value">₹14,50,000 / annum</p>
            </div>
            <div className="hr-detail-block">
              <span className="label"><FiMapPin /> Work Location</span>
              <p className="value">Bangalore HQ</p>
            </div>
          </div>
        </div>

        <div className="hr-emp-details-footer">
          <button type="button" className="hr-btn-sec" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
