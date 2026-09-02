import React from "react";
import "./DepartmentDistribution.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function DepartmentDistribution() {
  const deptData = [
    { name: "Engineering", count: 342, color: "#2563eb" },
    { name: "Sales", count: 215, color: "#8b5cf6" },
    { name: "HR", count: 86, color: "#a855f7" },
    { name: "Finance", count: 124, color: "#06b6d4" },
    { name: "Product & Design", count: 481, color: "#10b981" }
  ];

  const totalEmployees = 1248;

  return (
    <div className="hradmin-dashboard-dept-card">
      <div className="hradmin-dashboard-dept-header">
        <h3 className="hradmin-dashboard-card-title">Department Distribution</h3>
        <span className="hradmin-dashboard-card-subtitle">{totalEmployees.toLocaleString()} total employees</span>
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
              formatter={(val, name) => [`${val} Employees`, name]}
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
