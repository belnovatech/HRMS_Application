import React, { useState } from "react";
import "./Employees.css";
import HRLayout from "../../../layouts/HRLayout";
import EmployeeList from "./EmployeeList";
import EmployeeDetails from "./EmployeeDetails";
import AddEmployee from "./AddEmployee";
import EditEmployee from "./EditEmployee";

export default function Employees() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddEmployee = (newEmp) => {
    setShowAddModal(false);
    // Add logic / refresh
  };

  const handleUpdateEmployee = (updatedEmp) => {
    setEditingEmployee(null);
    // Update logic / refresh
  };

  return (
    <HRLayout title="Employee Directory" breadcrumb="Employees">
      <div className="hr-employees-page-container">
        <div className="hr-page-intro">
          <h2>Employee Directory & Management</h2>
          <p>Manage employee records, roles, departments, and active statuses across the organization.</p>
        </div>

        <EmployeeList
          onSelectEmployee={(emp) => setSelectedEmployee(emp)}
          onAddClick={() => setShowAddModal(true)}
          onEditClick={(emp) => setEditingEmployee(emp)}
        />

        {selectedEmployee && (
          <EmployeeDetails
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
          />
        )}

        {showAddModal && (
          <AddEmployee
            onClose={() => setShowAddModal(false)}
            onSave={handleAddEmployee}
          />
        )}

        {editingEmployee && (
          <EditEmployee
            employee={editingEmployee}
            onClose={() => setEditingEmployee(null)}
            onUpdate={handleUpdateEmployee}
          />
        )}
      </div>
    </HRLayout>
  );
}
