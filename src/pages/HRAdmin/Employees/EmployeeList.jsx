import React, { useState } from "react";
import "./EmployeeList.css";
import { FiSearch, FiFilter, FiEdit2, FiEye, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EmployeeList({ employees: initialEmployees }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const defaultEmployees = [
    { id: "EMP-1001", name: "Arjun Mehta", email: "arjun.m@belnova.com", department: "Engineering", role: "Sr. Frontend Dev", status: "Active", joinDate: "2023-04-15" },
    { id: "EMP-1002", name: "Kavya Nair", email: "kavya.n@belnova.com", department: "Product & Design", role: "UX Designer", status: "Active", joinDate: "2023-08-01" },
    { id: "EMP-1003", name: "Rahul Verma", email: "rahul.v@belnova.com", department: "Engineering", role: "Backend Dev", status: "On Leave", joinDate: "2024-01-10" },
    { id: "EMP-1004", name: "Sneha Sharma", email: "sneha.s@belnova.com", department: "HR & Operations", role: "HR Specialist", status: "Active", joinDate: "2022-11-20" },
    { id: "EMP-1005", name: "Vikram Singh", email: "vikram.s@belnova.com", department: "Sales & Marketing", role: "Sales Lead", status: "Active", joinDate: "2024-05-12" },
    { id: "EMP-1006", name: "Ananya Deshmukh", email: "ananya.d@belnova.com", department: "Finance & Legal", role: "Financial Analyst", status: "Inactive", joinDate: "2021-06-18" },
  ];

  const employeeData = initialEmployees && initialEmployees.length > 0 ? initialEmployees : defaultEmployees;

  const filtered = employeeData.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase());
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
            {filtered.map((emp) => (
              <tr key={emp.id}>
                <td className="hradmin-emp-id">{emp.id}</td>
                <td>
                  <div className="hradmin-emp-cell-user">
                    <div className="hradmin-emp-avatar">
                      {emp.name.split(" ").map((n) => n[0]).join("")}
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
                  <span className={`hradmin-emp-status-badge ${emp.status.toLowerCase().replace(" ", "-")}`}>
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
                      onClick={() => navigate(`/hr/employees/${emp.id}`)}
                    >
                      <FiEye />
                    </button>
                    <button
                      type="button"
                      className="hradmin-emp-action-icon"
                      title="Edit Profile"
                      onClick={() => navigate(`/hr/employees/${emp.id}/edit`)}
                    >
                      <FiEdit2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}