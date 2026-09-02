import React from "react";
import "./Employees.css";
import HRLayout from "../../../layouts/HRLayout";
import EmployeeList from "./EmployeeList";

export default function Employees() {
  return (
    <HRLayout title="Employee Directory" breadcrumb="Employees">
      <div className="hradmin-emp-page-container">
        <div className="hradmin-emp-page-intro">
          <h2>Employee Directory & Management</h2>
          <p>Search, filter, and manage employee records, organizational roles, and active statuses.</p>
        </div>

        <EmployeeList />
      </div>
    </HRLayout>
  );
}
