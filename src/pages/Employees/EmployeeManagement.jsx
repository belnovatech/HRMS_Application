import { useState, useEffect } from "react";
import "./EmployeeManagement.css";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

// Consistent color per employee, based on department (keeps existing look/feel)
const deptColors = {
  Engineering: "#52c41a",
  HR: "#faad14",
  Sales: "#13c2c2",
  Finance: "#722ed1",
  Marketing: "#eb2f96",
};
const fallbackColor = "#2563eb";

function getInitials(first, last) {
  return `${(first?.[0] || "").toUpperCase()}${(last?.[0] || "").toUpperCase()}`;
}

export default function EmployeeManagement() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const employeesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees + status list together
        const [empRes, statusRes] = await Promise.all([
          api.get("/employees"),
          api.get("/employees/master-status"),
        ]);

        // Build a status_id -> label map, defensively (field name unconfirmed from backend team)
        const map = {};
        (statusRes.data || []).forEach((s) => {
          const label = s.status_name || s.name || s.status || `Status ${s.id}`;
          map[s.id ?? s.status_id] = label;
        });
        setStatusMap(map);

        // Normalize API data into the shape the table expects
        const mapped = (empRes.data || []).map((emp) => ({
          id: emp.emp_code || emp.id,
          rawId: emp.id,
          name: `${emp.first_name || ""} ${emp.last_name || ""}`.trim(),
          initials: getInitials(emp.first_name, emp.last_name),
          department: emp.department || "-",
          designation: emp.designation_name || "-",
          email: emp.email || "-",
          phone: emp.mobile || "-",
          status: map[emp.status_id] || "Unknown",
          color: deptColors[emp.department] || fallbackColor,
        }));

        setEmployees(mapped);
      } catch (err) {
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // NOTE: No DELETE /employees/{id} endpoint exists yet — flagged to backend team.
  // This only removes the row from local state (UI-only), not from the actual database.
  const handleDelete = (id) => {
    alert(
      "Delete is not yet supported by the backend for Employees. This will only hide it from your current view until the page is refreshed."
    );
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  // NOTE: No PUT /employees/{emp_id} endpoint exists yet — flagged to backend team.
  const handleEdit = (emp) => {
    alert("Edit Employee is not yet supported by the backend.");
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());

    const matchDept = department === "All" ? true : emp.department === department;

    return matchSearch && matchDept;
  });

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const startIndex = (currentPage - 1) * employeesPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + employeesPerPage);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="employees-main">
        <Header title="Employees" breadcrumb="Employees" />

        <div className="employee-page">
          {/* TOOLBAR */}
          <div className="toolbar">
            <div className="search-box">
              <FiSearch />
              <input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="toolbar-right">
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option>All</option>
                <option>Engineering</option>
                <option>HR</option>
                <option>Sales</option>
                <option>Finance</option>
                <option>Marketing</option>
              </select>

              <button className="filter-btn">
                <FiFilter />
                Filter
              </button>

              <button className="export-btn">
                <FiDownload />
                Export
              </button>

              <button className="add-btn" onClick={() => navigate("/employees/add")}>
                <FiPlus />
                Add Employee
              </button>
            </div>
          </div>

          {loading && <p>Loading employees...</p>}
          {error && <p className="employee-error">{error}</p>}

          {/* TABLE */}
          {!loading && !error && (
            <div className="employee-table">
              <table>
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>DEPARTMENT</th>
                    <th>DESIGNATION</th>
                    <th>EMAIL</th>
                    <th>PHONE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {currentEmployees.map((emp) => (
                    <tr key={emp.rawId}>
                      <td>
                        <div className="employee-info">
                          <div className="avatar" style={{ background: emp.color }}>
                            {emp.initials}
                          </div>
                          <div>
                            <h4>{emp.name}</h4>
                            <span>{emp.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{emp.department}</td>
                      <td>{emp.designation}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>

                      <td>
                        <span
                          className={`status ${emp.status.toLowerCase().replace(" ", "-")}`}
                        >
                          {emp.status}
                        </span>
                      </td>

                      <td>
                        <div className="actions">
                          <FiEye onClick={() => navigate(`/employees/${emp.rawId}`)} />
                          <FiEdit2 onClick={() => handleEdit(emp)} />
                          <FiTrash2 onClick={() => handleDelete(emp.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* FOOTER */}
              <div className="table-footer">
                <span>
                  Showing {currentEmployees.length} of {filteredEmployees.length} employees
                </span>

                <div className="pagination">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}