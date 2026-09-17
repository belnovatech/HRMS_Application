import React, { useState } from "react";
import "./EmployeeList.css";
import { FiSearch, FiFilter, FiEdit2, FiEye, FiUserPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EmployeeList({ employees = [], loading = false, onDelete }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const filtered = employees.filter((e) => {
    const name = e.name || "";
    const email = e.email || "";
    const id = e.id || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "All" || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="hradmin-emp-list-container">
      <div className="hradmin-emp-list-toolbar">
        <div className="hradmin-emp-search-filter">
          <div className="hradmin-emp-search-input">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by ID, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="hradmin-emp-filter-select">
            <FiFilter />
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product & Design">Product & Design</option>
              <option value="HR & Operations">HR & Operations</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Finance & Legal">Finance & Legal</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="hradmin-emp-btn-add"
          onClick={() => navigate("/hr/employees/add")}
        >
          <FiUserPlus /> Add Employee
        </button>
      </div>

      <div className="hradmin-emp-table-card">
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
            Loading employees...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
            No employee records found.
          </div>
        ) : (
          <table className="hradmin-emp-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name & Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => {
                const initials = (emp.name || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("");

                const statusClass = (emp.status || "active").toLowerCase().replace(/\s+/g, "-");

                return (
                  <tr key={emp.id || emp.rawId}>
                    <td className="hradmin-emp-id">{emp.id}</td>
                    <td>
                      <div className="hradmin-emp-cell-user">
                        <div className="hradmin-emp-avatar">
                          {initials || "EM"}
                        </div>
                        <div>
                          <strong>{emp.name}</strong>
                          <small>{emp.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{emp.role}</td>
                    <td>
                      <span className={`hradmin-emp-status-badge ${statusClass}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>{emp.joinDate}</td>
                    <td>
                      <div className="hradmin-emp-actions">
                        <button
                          type="button"
                          className="hradmin-emp-action-icon"
                          title="View Profile"
                          onClick={() => navigate(`/hr/employees/${emp.rawId || emp.id}`)}
                        >
                          <FiEye />
                        </button>
                        <button
                          type="button"
                          className="hradmin-emp-action-icon"
                          title="Edit Profile"
                          onClick={() => navigate(`/hr/employees/${emp.rawId || emp.id}/edit`)}
                        >
                          <FiEdit2 />
                        </button>
                        {onDelete && (
                          <button
                            type="button"
                            className="hradmin-emp-action-icon delete"
                            title="Delete Employee"
                            style={{ color: "#ef4444" }}
                            onClick={() => onDelete(emp.id, emp.rawId)}
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}