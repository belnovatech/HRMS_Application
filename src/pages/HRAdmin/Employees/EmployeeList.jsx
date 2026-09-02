import React, { useState } from "react";
import "./EmployeeList.css";

import {
  FiSearch,
  FiFilter,
  FiEdit2,
  FiEye,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

/* =========================================================
   EMPLOYEE DATA
   Keep this outside the component.
   Later this can be replaced with API data.
   ========================================================= */

const mockEmployees = [
  {
    id: "EMP-1001",
    name: "Arjun Mehta",
    email: "arjun.m@belnova.com",
    department: "Engineering",
    role: "Sr. Frontend Dev",
    status: "Active",
    joinDate: "2023-04-15",
  },
  {
    id: "EMP-1002",
    name: "Kavya Nair",
    email: "kavya.n@belnova.com",
    department: "Product & Design",
    role: "UX Designer",
    status: "Active",
    joinDate: "2023-08-01",
  },
  {
    id: "EMP-1003",
    name: "Rahul Verma",
    email: "rahul.v@belnova.com",
    department: "Engineering",
    role: "Backend Dev",
    status: "On Leave",
    joinDate: "2024-01-10",
  },
  {
    id: "EMP-1004",
    name: "Sneha Sharma",
    email: "sneha.s@belnova.com",
    department: "HR & Operations",
    role: "HR Specialist",
    status: "Active",
    joinDate: "2022-11-20",
  },
  {
    id: "EMP-1005",
    name: "Vikram Singh",
    email: "vikram.s@belnova.com",
    department: "Sales & Marketing",
    role: "Sales Lead",
    status: "Active",
    joinDate: "2024-05-12",
  },
  {
    id: "EMP-1006",
    name: "Ananya Deshmukh",
    email: "ananya.d@belnova.com",
    department: "Finance & Legal",
    role: "Financial Analyst",
    status: "Inactive",
    joinDate: "2021-06-18",
  },
];

/* =========================================================
   DEPARTMENTS
   ========================================================= */

const departments = [
  "All Departments",
  "Engineering",
  "Product & Design",
  "HR & Operations",
  "Sales & Marketing",
  "Finance & Legal",
];

export default function EmployeeList({
  onSelectEmployee,
  onAddClick,
  onEditClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  /* =========================================================
     FILTER EMPLOYEES
     ========================================================= */

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch =
      !normalizedSearch ||
      employee.id.toLowerCase().includes(normalizedSearch) ||
      employee.name.toLowerCase().includes(normalizedSearch) ||
      employee.email.toLowerCase().includes(normalizedSearch) ||
      employee.department.toLowerCase().includes(normalizedSearch) ||
      employee.role.toLowerCase().includes(normalizedSearch);

    const matchesDepartment =
      deptFilter === "All" ||
      employee.department === deptFilter;

    return matchesSearch && matchesDepartment;
  });

  /* =========================================================
     STATUS CLASS
     ========================================================= */

  const getStatusClass = (status) => {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  return (
    <div className="hr-emp-list-container">

      {/* =====================================================
          TOOLBAR
          ===================================================== */}

      <div className="hr-emp-list-toolbar">

        <div className="hr-emp-search-filter">

          {/* SEARCH */}
          <div className="hr-emp-search-input">

            <FiSearch />

            <input
              type="search"
              placeholder="Search by ID, name, email, department..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              aria-label="Search employees"
            />

          </div>

          {/* DEPARTMENT FILTER */}
          <div className="hr-emp-filter-select">

            <FiFilter />

            <select
              value={deptFilter}
              onChange={(event) =>
                setDeptFilter(event.target.value)
              }
              aria-label="Filter employees by department"
            >
              {departments.map((department) => (
                <option
                  key={department}
                  value={
                    department === "All Departments"
                      ? "All"
                      : department
                  }
                >
                  {department}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* ADD EMPLOYEE */}

        <button
          type="button"
          className="hr-btn-add-emp"
          onClick={onAddClick}
        >
          <FiUserPlus />
          <span>Add Employee</span>
        </button>

      </div>

      {/* =====================================================
          RESULT INFORMATION
          ===================================================== */}

      <div className="hr-emp-result-summary">

        <div>
          <strong>
            {filteredEmployees.length}
          </strong>

          <span>
            {filteredEmployees.length === 1
              ? " employee found"
              : " employees found"}
          </span>
        </div>

        {(searchTerm || deptFilter !== "All") && (
          <button
            type="button"
            className="hr-emp-clear-filter"
            onClick={() => {
              setSearchTerm("");
              setDeptFilter("All");
            }}
          >
            Clear filters
          </button>
        )}

      </div>

      {/* =====================================================
          TABLE
          ===================================================== */}

      <div className="hr-emp-table-wrapper">

        {filteredEmployees.length > 0 ? (

          <table className="hr-emp-table">

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

              {filteredEmployees.map((employee) => (

                <tr key={employee.id}>

                  {/* EMPLOYEE ID */}

                  <td className="hr-emp-id">
                    {employee.id}
                  </td>

                  {/* NAME */}

                  <td>
                    <div className="hr-emp-cell-user">

                      <strong>
                        {employee.name}
                      </strong>

                      <small>
                        {employee.email}
                      </small>

                    </div>
                  </td>

                  {/* DEPARTMENT */}

                  <td>
                    {employee.department}
                  </td>

                  {/* ROLE */}

                  <td>
                    {employee.role}
                  </td>

                  {/* STATUS */}

                  <td>

                    <span
                      className={`hr-emp-status-badge ${getStatusClass(
                        employee.status
                      )}`}
                    >
                      {employee.status}
                    </span>

                  </td>

                  {/* JOINING DATE */}

                  <td>
                    {employee.joinDate}
                  </td>

                  {/* ACTIONS */}

                  <td>

                    <div className="hr-emp-actions">

                      <button
                        type="button"
                        className="hr-action-icon"
                        title="View Details"
                        aria-label={`View ${employee.name}`}
                        onClick={() =>
                          onSelectEmployee(employee)
                        }
                      >
                        <FiEye />
                      </button>

                      <button
                        type="button"
                        className="hr-action-icon"
                        title="Edit Employee"
                        aria-label={`Edit ${employee.name}`}
                        onClick={() =>
                          onEditClick(employee)
                        }
                      >
                        <FiEdit2 />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        ) : (

          /* =================================================
             EMPTY STATE
             ================================================= */

          <div className="hr-emp-empty-state">

            <div className="hr-emp-empty-icon">
              <FiUsers />
            </div>

            <h3>
              No employees found
            </h3>

            <p>
              We couldn't find any employees matching your
              current search or department filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setDeptFilter("All");
              }}
            >
              Clear Filters
            </button>

          </div>

        )}

      </div>

    </div>
  );
}