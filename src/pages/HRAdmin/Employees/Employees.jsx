import React, { useState, useEffect, useCallback } from "react";
import "./Employees.css";
import HRLayout from "../../../layouts/HRLayout";
import EmployeeList from "./EmployeeList";
import api from "../../../api/axiosInstance";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [empRes, accRes] = await Promise.allSettled([
        api.get("/Employees"),
        api.get("/Accounts")
      ]);

      const empData = empRes.status === "fulfilled" && Array.isArray(empRes.value.data) ? empRes.value.data : [];
      const accData = accRes.status === "fulfilled" && Array.isArray(accRes.value.data) ? accRes.value.data : [];

      // Combine accounts and employees
      const combinedMap = new Map();

      empData.forEach((emp) => {
        const id = emp.employeeNumber || emp.id;
        combinedMap.set(id, {
          rawId: emp.id,
          id: id,
          name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email || "Employee",
          email: emp.email || "—",
          department: emp.department || "Engineering",
          role: emp.designation || emp.role || "Employee",
          status: typeof emp.status === "number" ? (emp.status === 0 ? "Active" : emp.status === 1 ? "On Leave" : "Inactive") : (emp.status || "Active"),
          joinDate: emp.createdAtUtc ? new Date(emp.createdAtUtc).toISOString().split("T")[0] : "2024-01-01"
        });
      });

      accData.forEach((acc) => {
        const id = acc.employeeNumber || acc.id;
        const existing = combinedMap.get(id);
        if (existing) {
          if (acc.name) existing.name = acc.name;
          if (acc.department) existing.department = acc.department;
          if (acc.designation || acc.role) existing.role = acc.designation || acc.role;
        } else {
          combinedMap.set(id, {
            rawId: acc.id,
            id: id,
            name: acc.name || acc.username || acc.email || "Employee",
            email: acc.email || "—",
            department: acc.department || "General",
            role: acc.designation || acc.role || "Staff",
            status: "Active",
            joinDate: "2024-01-01"
          });
        }
      });

      setEmployees(Array.from(combinedMap.values()));
    } catch (err) {
      setError("Failed to load employees from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDeleteEmployee = async (empId, rawId) => {
    if (!window.confirm(`Are you sure you want to delete employee ${empId}?`)) return;
    try {
      await api.delete(`/Employees/${rawId || empId}`);
      setEmployees((prev) => prev.filter((e) => e.id !== empId && e.rawId !== rawId));
    } catch (err) {
      alert("Failed to delete employee: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <HRLayout title="Employee Directory" breadcrumb="Employees">
      <div className="hradmin-emp-page-container">
        <div className="hradmin-emp-page-intro">
          <h2>Employee Directory & Management</h2>
          <p>Search, filter, and manage employee records, organizational roles, and active statuses.</p>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "16px" }}>
            {error} <button onClick={fetchEmployees} style={{ marginLeft: "8px", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#991b1b" }}>Retry</button>
          </div>
        )}

        <EmployeeList
          employees={employees}
          loading={loading}
          onDelete={handleDeleteEmployee}
          onRefresh={fetchEmployees}
        />
      </div>
    </HRLayout>
  );
}
