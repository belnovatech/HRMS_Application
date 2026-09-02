import React, { useState, useEffect } from "react";
import "./EditEmployee.css";
import { FiX, FiCheck } from "react-icons/fi";

export default function EditEmployee({ employee, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "Engineering",
    role: "",
    status: "Active",
    joinDate: ""
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  if (!employee) return null;

  return (
    <div className="hr-edit-emp-overlay">
      <div className="hr-edit-emp-modal">
        <div className="hr-edit-emp-header">
          <h3>Edit Employee ({employee.id})</h3>
          <button type="button" className="hr-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="hr-edit-emp-body">
            <div className="hr-form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="hr-form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="hr-form-row">
              <div className="hr-form-group">
                <label>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="HR & Operations">HR & Operations</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                </select>
              </div>

              <div className="hr-form-group">
                <label>Designation / Role</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>

            <div className="hr-form-row">
              <div className="hr-form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="hr-form-group">
                <label>Joining Date</label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="hr-edit-emp-footer">
            <button type="button" className="hr-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="hr-btn-save"><FiCheck /> Update Record</button>
          </div>
        </form>
      </div>
    </div>
  );
}
