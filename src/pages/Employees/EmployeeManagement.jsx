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

const defaultEmployees = [
  {
    id: "BEL-001",
    name: "Arjun Mehta",
    initials: "AM",
    department: "Engineering",
    designation: "Senior Engineer",
    email: "arjun.m@belnova.com",
    phone: "+91 98765 43210",
    status: "Active",
    color: "#52c41a",
  },
  {
    id: "BEL-002",
    name: "Priya Sharma",
    initials: "PS",
    department: "HR",
    designation: "HR Manager",
    email: "priya.s@belnova.com",
    phone: "+91 98765 43211",
    status: "Active",
    color: "#faad14",
  },
  {
    id: "BEL-003",
    name: "Rahul Verma",
    initials: "RV",
    department: "Sales",
    designation: "Sales Lead",
    email: "rahul.v@belnova.com",
    phone: "+91 98765 43212",
    status: "Active",
    color: "#13c2c2",
  },
  {
    id: "BEL-004",
    name: "Sneha Patel",
    initials: "SP",
    department: "Finance",
    designation: "Finance Analyst",
    email: "sneha.p@belnova.com",
    phone: "+91 98765 43213",
    status: "On Leave",
    color: "#722ed1",
  },
  {
    id: "BEL-005",
    name: "Vikram Singh",
    initials: "VS",
    department: "Engineering",
    designation: "DevOps Engineer",
    email: "vikram.s@belnova.com",
    phone: "+91 98765 43214",
    status: "Active",
    color: "#52c41a",
  },
  {
    id: "BEL-006",
    name: "Anita Roy",
    initials: "AR",
    department: "Marketing",
    designation: "Marketing Manager",
    email: "anita.r@belnova.com",
    phone: "+91 98765 43215",
    status: "Inactive",
    color: "#52c41a",
  },
  {
    id: "BEL-007",
    name: "Deepak Kumar",
    initials: "DK",
    department: "Engineering",
    designation: "Backend Developer",
    email: "deepak.k@belnova.com",
    phone: "+91 98765 43216",
    status: "Active",
    color: "#13c2c2",
  },
  {
    id: "BEL-008",
    name: "Kavya Nair",
    initials: "KN",
    department: "Sales",
    designation: "Account Executive",
    email: "kavya.n@belnova.com",
    phone: "+91 98765 43217",
    status: "Active",
    color: "#13c2c2",
  },
];

export default function EmployeeManagement() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const employeesPerPage = 10;

  useEffect(() => {
    const localEmployees =
      JSON.parse(localStorage.getItem("employees")) || [];

    setEmployees([...defaultEmployees, ...localEmployees]);
  }, []);

  const handleDelete = (id) => {
    const updated = employees.filter(
      (emp) => emp.id !== id
    );

    setEmployees(updated);

    const customEmployees = updated.filter(
      (emp) => Number(emp.id.split("-")[1]) > 100
    );

    localStorage.setItem(
      "employees",
      JSON.stringify(customEmployees)
    );
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());

    const matchDept =
      department === "All"
        ? true
        : emp.department === department;

    return matchSearch && matchDept;
  });

  const totalPages = Math.ceil(
    filteredEmployees.length / employeesPerPage
  );

  const startIndex =
    (currentPage - 1) * employeesPerPage;

  const currentEmployees =
    filteredEmployees.slice(
      startIndex,
      startIndex + employeesPerPage
    );

  return (
<div className="dashboard-layout">
  <Sidebar />

  <div className="employees-main">
    <Header
      title="Employees"
      breadcrumb="Employees"
    />

  {/* page content */}


        <div className="employee-page">

          {/* TITLE */}


          {/* TOOLBAR */}

          <div className="toolbar">

            <div className="search-box">
              <FiSearch />
              <input
                placeholder="Search employees..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="toolbar-right">

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
              >
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

              <button
                className="add-btn"
                onClick={() =>
                  navigate("/add-employee")
                }
              >
                <FiPlus />
                Add Employee
              </button>

            </div>
          </div>

          {/* TABLE */}

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
                  <tr key={emp.id}>

                    <td>
                      <div className="employee-info">

                        <div
                          className="avatar"
                          style={{
                            background: emp.color,
                          }}
                        >
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
                        className={`status ${emp.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td>
                      <div className="actions">

                        <FiEye />

                        <FiEdit2 />

                        <FiTrash2
                          onClick={() =>
                            handleDelete(emp.id)
                          }
                        />

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>

            {/* FOOTER */}

            <div className="table-footer">

              <span>
                Showing {currentEmployees.length} of{" "}
                {filteredEmployees.length}
                {" "}employees
              </span>

              <div className="pagination">

                {[...Array(totalPages)].map(
                  (_, index) => (
                    <button
                      key={index}
                      className={
                        currentPage === index + 1
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(index + 1)
                      }
                    >
                      {index + 1}
                    </button>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
      </div>
  )
}