import React, { useState, useEffect, useMemo } from "react";
import "./DepartmentDistribution.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import api from "../../../api/axiosInstance";

const COLOR_PALETTE = ["#2563eb", "#8b5cf6", "#10b981", "#06b6d4", "#f59e0b", "#ec4899", "#6366f1"];

export default function DepartmentDistribution() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.get("/Employees"),
      api.get("/Accounts")
    ]).then(([empRes, accRes]) => {
      if (!active) return;
      const list = [];
      if (empRes.status === "fulfilled" && Array.isArray(empRes.value.data)) {
        empRes.value.data.forEach(e => list.push(e));
      }
      if (accRes.status === "fulfilled" && Array.isArray(accRes.value.data)) {
        accRes.value.data.forEach(a => {
          if (!list.some(e => (e.email && e.email === a.email) || e.employeeNumber === a.employeeNumber)) {
            list.push(a);
          }
        });
      }
      setEmployees(list);
    });
    return () => { active = false; };
  }, []);

  const deptData = useMemo(() => {
    if (employees.length === 0) {
      return [
        { name: "Engineering", count: 1, color: COLOR_PALETTE[0] },
        { name: "HR", count: 1, color: COLOR_PALETTE[1] }
      ];
    }
    const counts = {};
    employees.forEach((emp) => {
      const d = emp.department || "Engineering";
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count], index) => ({
      name,
      count,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length]
    }));
  }, [employees]);

  const totalEmployees = employees.length || deptData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="hradmin-dashboard-dept-card">
      <div className="hradmin-dashboard-dept-header">
        <h3 className="hradmin-dashboard-card-title">Department Distribution</h3>
        <span className="hradmin-dashboard-card-subtitle">{totalEmployees.toLocaleString()} total members</span>
      </div>

      <div className="hradmin-dashboard-dept-chart-wrapper">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={deptData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="count"
            >
              {deptData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }}
              formatter={(val, name) => [`${val} Members`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="hradmin-dashboard-dept-legend">
        {deptData.slice(0, 4).map((dept) => (
          <div key={dept.name} className="hradmin-dashboard-dept-legend-row">
            <div className="hradmin-dashboard-dept-legend-left">
              <span className="hradmin-dashboard-dept-dot" style={{ background: dept.color }} />
              <span className="hradmin-dashboard-dept-name">{dept.name}</span>
            </div>
            <span className="hradmin-dashboard-dept-count">{dept.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
