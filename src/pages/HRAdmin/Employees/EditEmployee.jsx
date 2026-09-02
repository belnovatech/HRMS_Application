import React, { useState, useEffect } from "react";
import "./EditEmployee.css";
import HRLayout from "../../../layouts/HRLayout";
import {
  FiArrowLeft,
  FiUser,
  FiBriefcase,
  FiDollarSign,
  FiCheckCircle,
  FiChevronRight
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const MOCK_EMPLOYEE_DATA = {
  "EMP-1001": { firstName: "Arjun", lastName: "Mehta", email: "arjun.m@belnova.com", phone: "+91 98765 43210", dob: "1994-08-12", gender: "Male", department: "Engineering", role: "Sr. Frontend Dev", employeeId: "EMP-1001", joinDate: "2023-04-15", workLocation: "Bangalore HQ", employmentType: "Full-Time", baseCtc: "1850000", pfNumber: "MH/BAN/0012345/000/0000123", bankName: "HDFC Bank", accountNumber: "50100098765432", ifscCode: "HDFC0000123" },
  "EMP-1002": { firstName: "Kavya", lastName: "Nair", email: "kavya.n@belnova.com", phone: "+91 98123 45678", dob: "1996-03-24", gender: "Female", department: "Product & Design", role: "UX Designer", employeeId: "EMP-1002", joinDate: "2023-08-01", workLocation: "Bangalore HQ", employmentType: "Full-Time", baseCtc: "1400000", pfNumber: "MH/BAN/0012345/000/0000456", bankName: "ICICI Bank", accountNumber: "000401567890", ifscCode: "ICIC0000401" },
};

export default function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const initialData = MOCK_EMPLOYEE_DATA[id] || {
    firstName: "Arjun",
    lastName: "Mehta",
    email: "arjun.m@belnova.com",
    phone: "+91 98765 43210",
    dob: "1994-08-12",
    gender: "Male",
    department: "Engineering",
    role: "Sr. Frontend Dev",
    employeeId: id || "EMP-1001",
    joinDate: "2023-04-15",
    workLocation: "Bangalore HQ",
    employmentType: "Full-Time",
    baseCtc: "1850000",
    pfNumber: "MH/BAN/0012345/000/0000123",
    bankName: "HDFC Bank",
    accountNumber: "50100098765432",
    ifscCode: "HDFC0000123"
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (id && MOCK_EMPLOYEE_DATA[id]) {
      setFormData(MOCK_EMPLOYEE_DATA[id]);
    }
  }, [id]);

  const steps = [
    { number: 1, label: "Personal Info", icon: <FiUser /> },
    { number: 2, label: "Employment", icon: <FiBriefcase /> },
    { number: 3, label: "Salary", icon: <FiDollarSign /> },
    { number: 4, label: "Review & Save", icon: <FiCheckCircle /> }
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(`/hr/employees/${id || "EMP-1001"}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);

      setTimeout(() => {
        navigate(`/hr/employees/${id || "EMP-1001"}`);
      }, 1000);
    }, 1200);
  };

  return (
    <HRLayout title={`Edit Employee - ${formData.firstName} ${formData.lastName}`} breadcrumb={`Employees / Edit ${formData.employeeId}`}>
      <div className="hradmin-emp-add-page">
        {/* Success Toast */}
        {showToast && (
          <div className="hradmin-emp-toast-success">
            <FiCheckCircle /> Employee details updated successfully! Redirecting...
          </div>
        )}

        {/* Header Banner */}
        <div className="hradmin-emp-add-header">
          <div className="hradmin-emp-add-header-left">
            <button
              type="button"
              className="hradmin-emp-btn-back"
              onClick={() => navigate(`/hr/employees/${id || "EMP-1001"}`)}
            >
              <FiArrowLeft /> Back to Profile
            </button>
            <div className="hradmin-emp-add-title-row">
              <h2>Edit Employee Profile ({formData.employeeId})</h2>
            </div>
            <p className="hradmin-emp-add-subtitle">
              Modify the employee information and save changes to update the master record.
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="hradmin-emp-stepper-card">
          <div className="hradmin-emp-stepper">
            {steps.map((s) => (
              <div
                key={s.number}
                className={`hradmin-emp-step-item ${
                  currentStep === s.number ? "active" : ""
                } ${currentStep > s.number ? "completed" : ""}`}
                onClick={() => {
                  if (s.number < currentStep) setCurrentStep(s.number);
                }}
              >
                <div className="hradmin-emp-step-number">
                  {currentStep > s.number ? <FiCheckCircle /> : s.number}
                </div>
                <div className="hradmin-emp-step-text">
                  <span className="label">{s.label}</span>
                </div>
                {s.number < 4 && <div className="hradmin-emp-step-line" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <form onSubmit={handleSubmit} className="hradmin-emp-form-container">
          <div className="hradmin-emp-form-card">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="hradmin-emp-form-step">
                <h3 className="hradmin-emp-step-title"><FiUser /> Personal Information</h3>
                <div className="hradmin-emp-form-grid">
                  <div className="hradmin-emp-field-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Work Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment */}
            {currentStep === 2 && (
              <div className="hradmin-emp-form-step">
                <h3 className="hradmin-emp-step-title"><FiBriefcase /> Employment Details</h3>
                <div className="hradmin-emp-form-grid">
                  <div className="hradmin-emp-field-group">
                    <label>Department *</label>
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

                  <div className="hradmin-emp-field-group">
                    <label>Designation / Role *</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Employee ID *</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.employeeId}
                      className="readonly-input"
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Joining Date</label>
                    <input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Work Location</label>
                    <select
                      value={formData.workLocation}
                      onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                    >
                      <option value="Bangalore HQ">Bangalore HQ</option>
                      <option value="Mumbai Office">Mumbai Office</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Salary */}
            {currentStep === 3 && (
              <div className="hradmin-emp-form-step">
                <h3 className="hradmin-emp-step-title"><FiDollarSign /> Compensation & Banking</h3>
                <div className="hradmin-emp-form-grid">
                  <div className="hradmin-emp-field-group">
                    <label>Annual Base CTC (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.baseCtc}
                      onChange={(e) => setFormData({ ...formData, baseCtc: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Bank Name</label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                    </select>
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Bank Account Number</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="hradmin-emp-form-step">
                <h3 className="hradmin-emp-step-title"><FiCheckCircle /> Review & Update</h3>
                <div className="hradmin-emp-review-summary-grid">
                  <div className="hradmin-emp-review-card">
                    <h4>Summary of Modifications</h4>
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Department:</strong> {formData.department} ({formData.role})</p>
                    <p><strong>Base CTC:</strong> ₹{formData.baseCtc} / year</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="hradmin-emp-action-bar">
            <button
              type="button"
              className="hradmin-emp-btn-sec"
              onClick={handlePrev}
            >
              {currentStep === 1 ? "Cancel" : "Back"}
            </button>

            <div className="hradmin-emp-action-right">
              {currentStep < 4 ? (
                <button
                  type="button"
                  className="hradmin-emp-btn-primary"
                  onClick={handleNext}
                >
                  Continue <FiChevronRight />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="hradmin-emp-btn-primary submit"
                >
                  {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </HRLayout>
  );
}
