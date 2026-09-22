import React, { useMemo, useState, useEffect, useCallback } from "react";
import "./Organization.css";
import HRLayout from "../../../layouts/HRLayout";
import api from "../../../api/axiosInstance";

import {
  FiUsers,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiUserPlus,
  FiTrendingUp,
  FiGrid,
  FiBarChart2,
  FiMoreHorizontal,
  FiDollarSign,
} from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";

export default function Organization() {
  const { teamMembers = [] } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [expandedDepartments, setExpandedDepartments] = useState({
    Engineering: true,
    HR: true,
    Design: true,
  });
  const [departments, setDepartments] = useState([]);

  const fetchOrgData = useCallback(async () => {
    try {
      const deptRes = await api.get("/organization/departments").catch(() => null);
      if (deptRes && Array.isArray(deptRes.data) && deptRes.data.length > 0) {
        setDepartments(deptRes.data);
      } else if (teamMembers.length > 0) {
        const groups = {};
        teamMembers.forEach((m) => {
          const dept = m.department || "Engineering";
          if (!groups[dept]) {
            groups[dept] = {
              name: dept,
              shortName: dept.slice(0, 4).toUpperCase(),
              head: m.name,
              role: m.designation || m.role || "Department Lead",
              total: 0,
              openPositions: 1,
              budget: "₹18.5L",
              employees: [],
            };
          }
          groups[dept].total += 1;
          groups[dept].employees.push({
            id: m.id || m.employeeId || m.employeeNumber,
            name: m.name,
            role: m.designation || m.role || "Specialist",
            email: m.email || `${(m.username || "emp").toLowerCase()}@belnova.com`,
            status: m.status === 2 ? "On Leave" : "Active",
            initials: (m.name || "EM").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
            color: "#2563eb",
          });
        });
        setDepartments(Object.values(groups));
      }
    } catch (err) {
      console.warn("Organization fetch notice:", err.message);
    }
  }, [teamMembers]);

  useEffect(() => {
    fetchOrgData();
  }, [fetchOrgData]);

  const totalEmployees = departments.reduce(
    (sum, department) => sum + (department.total || (department.employees ? department.employees.length : 0)),
    0
  );

  const totalOpenPositions = departments.reduce(
    (sum, department) => sum + department.openPositions,
    0
  );

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) => {
      const matchesDepartment =
        selectedDepartment === "All" ||
        department.shortName === selectedDepartment;

      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        department.name.toLowerCase().includes(searchValue) ||
        department.head.toLowerCase().includes(searchValue) ||
        department.role.toLowerCase().includes(searchValue) ||
        department.employees.some(
          (employee) =>
            employee.name.toLowerCase().includes(searchValue) ||
            employee.role.toLowerCase().includes(searchValue)
        );

      return matchesDepartment && matchesSearch;
    });
  }, [searchTerm, selectedDepartment, departments]);

  const toggleDepartment = (departmentId) => {
    setExpandedDepartments((previous) => ({
      ...previous,
      [departmentId]: !previous[departmentId],
    }));
  };

  return (
    <HRLayout
      title="Organization Hierarchy"
      breadcrumb="Organization"
    >
      <div className="hr-organization-v2-page">

        {/* Header */}
        <div className="hr-organization-v2-header">
          <div>
            <div className="hr-organization-v2-eyebrow">
              <span className="hr-organization-v2-eyebrow-dot"></span>
              Workforce Management
            </div>

            <h1>Organization Structure</h1>

            <p>
              Manage departments, reporting structures, workforce distribution,
              and organizational insights.
            </p>
          </div>

          <button className="hr-organization-v2-primary-btn">
            <FiUserPlus />
            Add Employee
          </button>
        </div>

        {/* Overview Stats */}
        <div className="hr-organization-v2-stats-grid">

          <div className="hr-organization-v2-stat-card">
            <div className="hr-organization-v2-stat-icon blue">
              <FiUsers />
            </div>

            <div className="hr-organization-v2-stat-content">
              <span>Total Employees</span>
              <strong>{totalEmployees}</strong>
              <small>
                <FiTrendingUp /> +9.4% this year
              </small>
            </div>
          </div>

          <div className="hr-organization-v2-stat-card">
            <div className="hr-organization-v2-stat-icon purple">
              <FiGrid />
            </div>

            <div className="hr-organization-v2-stat-content">
              <span>Departments</span>
              <strong>{departments.length}</strong>
              <small>All departments active</small>
            </div>
          </div>

          <div className="hr-organization-v2-stat-card">
            <div className="hr-organization-v2-stat-icon orange">
              <FiUserPlus />
            </div>

            <div className="hr-organization-v2-stat-content">
              <span>Open Positions</span>
              <strong>{totalOpenPositions}</strong>
              <small>Across all departments</small>
            </div>
          </div>

          <div className="hr-organization-v2-stat-card">
            <div className="hr-organization-v2-stat-icon green">
              <FiBarChart2 />
            </div>

            <div className="hr-organization-v2-stat-content">
              <span>Workforce Growth</span>
              <strong>9.4%</strong>
              <small>
                <FiTrendingUp /> Positive trend
              </small>
            </div>
          </div>

        </div>

        {/* Controls */}
        <div className="hr-organization-v2-toolbar">

          <div className="hr-organization-v2-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search departments, managers or employees..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="hr-organization-v2-filter">
            <select
              value={selectedDepartment}
              onChange={(event) =>
                setSelectedDepartment(event.target.value)
              }
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>

            <FiChevronDown />
          </div>

        </div>

        {/* Department Cards */}
        <div className="hr-organization-v2-section-heading">
          <div>
            <h2>Departments</h2>
            <p>Overview of teams and departmental performance.</p>
          </div>

          <span className="hr-organization-v2-result-count">
            {filteredDepartments.length} Departments
          </span>
        </div>

        <div className="hr-organization-v2-department-grid">
          {filteredDepartments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem", gridColumn: "1 / -1", color: "var(--text-secondary)" }}>
              No departments found.
            </div>
          ) : (
            filteredDepartments.map((department) => (
            <div
              className="hr-organization-v2-department-card"
              key={department.id}
            >

              <div className="hr-organization-v2-department-top">

                <div
                  className={`hr-organization-v2-department-icon ${department.color}`}
                >
                  {department.icon}
                </div>

                <button className="hr-organization-v2-more-btn">
                  <FiMoreHorizontal />
                </button>

              </div>

              <div className="hr-organization-v2-department-title">
                <h3>{department.name}</h3>

                <span
                  className={`hr-organization-v2-status ${department.color}`}
                >
                  {department.status}
                </span>
              </div>

              <div className="hr-organization-v2-manager">

                <div className="hr-organization-v2-avatar">
                  {department.initials}
                </div>

                <div>
                  <span>Department Lead</span>
                  <strong>{department.head}</strong>
                </div>

              </div>

              <div className="hr-organization-v2-department-metrics">

                <div>
                  <span>Team Size</span>
                  <strong>{department.total}</strong>
                </div>

                <div>
                  <span>Open Roles</span>
                  <strong>{department.openPositions}</strong>
                </div>

                <div>
                  <span>Growth</span>
                  <strong>{department.growth}</strong>
                </div>

              </div>

              <div className="hr-organization-v2-budget">

                <div>
                  <span>Annual Budget</span>
                  <strong>{department.budget}</strong>
                </div>

                <div className="hr-organization-v2-budget-icon">
                  <FiDollarSign />
                </div>

              </div>

            </div>
          ))) }
        </div>

        {/* Organization Chart */}
        <div className="hr-organization-v2-chart-section">

          <div className="hr-organization-v2-section-heading">
            <div>
              <h2>Organization Chart</h2>
              <p>
                View reporting relationships and team hierarchy.
              </p>
            </div>
          </div>

          <div className="hr-organization-v2-chart-container">

            {/* CEO */}
            <div className="hr-organization-v2-ceo-wrapper">

              <div className="hr-organization-v2-person-card ceo">

                <div className="hr-organization-v2-person-avatar ceo-avatar">
                  VM
                </div>

                <div className="hr-organization-v2-person-info">
                  <strong>Vikram Singh</strong>
                  <span>Chief Executive Officer</span>
                </div>

              </div>

              <div className="hr-organization-v2-vertical-line"></div>

            </div>

            <div className="hr-organization-v2-chart-line"></div>

            {/* Managers */}
            <div className="hr-organization-v2-managers-grid">

              {filteredDepartments.map((department) => {

                const isExpanded =
                  expandedDepartments[department.shortName];

                return (
                  <div
                    className="hr-organization-v2-tree-column"
                    key={department.id}
                  >

                    <div className="hr-organization-v2-tree-connector"></div>

                    <div className="hr-organization-v2-person-card manager">

                      <div
                        className={`hr-organization-v2-person-avatar ${department.color}`}
                      >
                        {department.initials}
                      </div>

                      <div className="hr-organization-v2-person-info">
                        <strong>{department.head}</strong>
                        <span>{department.role}</span>
                      </div>

                      <button
                        className="hr-organization-v2-expand-btn"
                        onClick={() =>
                          toggleDepartment(department.shortName)
                        }
                        aria-label={`Toggle ${department.name}`}
                      >
                        {isExpanded ? (
                          <FiChevronDown />
                        ) : (
                          <FiChevronRight />
                        )}
                      </button>

                    </div>

                    {isExpanded && (
                      <div className="hr-organization-v2-team-list">

                        {department.employees.map((employee) => (
                          <div
                            className="hr-organization-v2-person-card employee"
                            key={employee.name}
                          >

                            <div className="hr-organization-v2-person-avatar employee-avatar">
                              {employee.initials}
                            </div>

                            <div className="hr-organization-v2-person-info">
                              <strong>{employee.name}</strong>
                              <span>{employee.role}</span>
                            </div>

                          </div>
                        ))}

                        <div className="hr-organization-v2-team-footer">
                          <span>
                            +{Math.max(
                              department.total -
                                department.employees.length -
                                1,
                              0
                            )} more employees
                          </span>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>

          </div>
        </div>

        {/* Workforce Insights */}
        <div className="hr-organization-v2-insights-section">

          <div className="hr-organization-v2-section-heading">
            <div>
              <h2>Workforce Insights</h2>
              <p>
                Quick organizational metrics for HR decision making.
              </p>
            </div>
          </div>

          <div className="hr-organization-v2-insights-grid">

            <div className="hr-organization-v2-insight-card">

              <div className="hr-organization-v2-insight-icon">
                <FiTrendingUp />
              </div>

              <div>
                <span>Fastest Growing Team</span>
                <strong>Sales & Growth</strong>
                <small>15% workforce growth</small>
              </div>

            </div>

            <div className="hr-organization-v2-insight-card">

              <div className="hr-organization-v2-insight-icon">
                <FiUsers />
              </div>

              <div>
                <span>Largest Department</span>
                <strong>Engineering & Tech</strong>
                <small>45 employees</small>
              </div>

            </div>

            <div className="hr-organization-v2-insight-card">

              <div className="hr-organization-v2-insight-icon">
                <FiUserPlus />
              </div>

              <div>
                <span>Hiring Priority</span>
                <strong>Engineering</strong>
                <small>6 open positions</small>
              </div>

            </div>

            <div className="hr-organization-v2-insight-card">

              <div className="hr-organization-v2-insight-icon">
                <FiBarChart2 />
              </div>

              <div>
                <span>Organization Health</span>
                <strong>Healthy</strong>
                <small>Positive workforce trend</small>
              </div>

            </div>

          </div>

        </div>

      </div>
    </HRLayout>
  );
}