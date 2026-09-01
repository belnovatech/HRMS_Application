import React from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import { FiCalendar } from "react-icons/fi";

export default function EmployeeHolidays() {
  const { holidays } = useAuth();

  return (
    <EmployeeLayout title="Company Holidays" breadcrumb="Holidays">
      <div className="page-header-block">
        <h2>Company Holiday Calendar 2026</h2>
        <p>List of official public holidays, regional observances, and festival breaks.</p>
      </div>

      <div className="enterprise-card">
        <div className="table-responsive-wrapper">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>SL NO</th>
                <th>HOLIDAY DATE</th>
                <th>HOLIDAY NAME</th>
                <th>WEEKDAY</th>
                <th>HOLIDAY TYPE</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((item, index) => (
                <tr key={item.id}>
                  <td><strong>#{index + 1}</strong></td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#2563eb", fontWeight: 600 }}>
                      <FiCalendar size={14} /> {item.date}
                    </span>
                  </td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.day}</td>
                  <td><span className="badge badge-wfh">{item.type}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </EmployeeLayout>
  );
}
