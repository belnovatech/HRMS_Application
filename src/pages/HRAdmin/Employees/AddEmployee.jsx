import React, { useState } from "react";
import "./AddEmployee.css";
import HRLayout from "../../../layouts/HRLayout";
import {
  FiArrowLeft,
  FiUser,
  FiBriefcase,
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiUploadCloud,
  FiSave,
  FiChevronRight
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Male",
    department: "Engineering",
    role: "",
    employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    joinDate: new Date().toISOString().split("T")[0],
    workLocation: "Bangalore HQ",
    employmentType: "Full-Time",
    baseCtc: "",
    hra: "",
    specialAllowance: "",
    pfNumber: "",
    bankName: "HDFC Bank",
    accountNumber: "",
    ifscCode: "",
    photoName: "",
    resumeName: ""
  });

  const steps = [
    { number: 1, label: "Personal Info", icon: <FiUser /> },
    { number: 2, label: "Employment", icon: <FiBriefcase /> },
    { number: 3, label: "Salary", icon: <FiDollarSign /> },
    { number: 4, label: "Documents", icon: <FiFileText /> },
    { number: 5, label: "Review", icon: <FiCheckCircle /> }
  ];

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/hr/employees");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);

      setTimeout(() => {
        navigate(`/hr/employees/${formData.employeeId}`);
      }, 1000);
    }, 1200);
  };

  return (
    <HRLayout title="Add New Employee" breadcrumb="Employees / Add Employee">
      <div className="hradmin-emp-add-page">
        {/* Success Toast */}
        {showToast && (
          <div className="hradmin-emp-toast-success">
            <FiCheckCircle /> Employee added successfully! Redirecting...
          </div>
        )}

        {/* Header Banner */}
        <div className="hradmin-emp-add-header">
          <div className="hradmin-emp-add-header-left">
            <button
              type="button"
              className="hradmin-emp-btn-back"
              onClick={() => navigate("/hr/employees")}
            >
              <FiArrowLeft /> Back to Employees
            </button>
            <div className="hradmin-emp-add-title-row">
              <h2>Add New Employee</h2>
              <span className="hradmin-emp-draft-badge">Draft</span>
            </div>
            <p className="hradmin-emp-add-subtitle">
              Complete the employee profile by providing the required information across each section.
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
                {s.number < 5 && <div className="hradmin-emp-step-line" />}
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
                      placeholder="e.g. Ramesh"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kumar"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Work Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh.k@belnova.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
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
                      placeholder="e.g. Senior Software Engineer"
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

                  <div className="hradmin-emp-field-group">
                    <label>Employment Type</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contractor">Contractor</option>
                      <option value="Intern">Intern</option>
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
                      placeholder="1450000"
                      value={formData.baseCtc}
                      onChange={(e) => setFormData({ ...formData, baseCtc: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>PF Account Number</label>
                    <input
                      type="text"
                      placeholder="MH/BAN/0012345/000/0000123"
                      value={formData.pfNumber}
                      onChange={(e) => setFormData({ ...formData, pfNumber: e.target.value })}
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
                      placeholder="50100012345678"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    />
                  </div>

                  <div className="hradmin-emp-field-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      placeholder="HDFC0000123"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="hradmin-emp-form-step">
                <h3 className="hradmin-emp-step-title"><FiFileText /> Documents & Photo</h3>
                <div className="hradmin-emp-doc-upload-box">
                  <FiUploadCloud className="upload-icon" />
                  <h4>Upload Profile Photo & Verification Documents</h4>
                  <p>Drag and drop employee resume, identity proof, or click to browse files.</p>
                  <input
                    type="file"
                    className="file-input"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setFormData({ ...formData, photoName: e.target.files[0].name });
                      }
                    }}
                  />
                  {formData.photoName && (
                    <span className="file-attached">Attached: {formData.photoName}</span>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="hradmin-emp-form-step">
                <h3 className="hradmin-emp-step-title"><FiCheckCircle /> Review & Confirm</h3>
                <p className="hradmin-emp-review-subtitle">Please verify the employee details before creating the profile.</p>

                <div className="hradmin-emp-review-summary-grid">
                  <div className="hradmin-emp-review-card">
                    <div className="card-head">
                      <h4>Personal Information</h4>
                      <button type="button" onClick={() => setCurrentStep(1)}>Edit</button>
                    </div>
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone || "N/A"}</p>
                  </div>

                  <div className="hradmin-emp-review-card">
                    <div className="card-head">
                      <h4>Employment Details</h4>
                      <button type="button" onClick={() => setCurrentStep(2)}>Edit</button>
                    </div>
                    <p><strong>ID:</strong> {formData.employeeId}</p>
                    <p><strong>Department:</strong> {formData.department}</p>
                    <p><strong>Designation:</strong> {formData.role || "Developer"}</p>
                    <p><strong>Joining Date:</strong> {formData.joinDate}</p>
                  </div>

                  <div className="hradmin-emp-review-card">
                    <div className="card-head">
                      <h4>Compensation & Bank</h4>
                      <button type="button" onClick={() => setCurrentStep(3)}>Edit</button>
                    </div>
                    <p><strong>Base CTC:</strong> ₹{formData.baseCtc || "14,50,000"} / year</p>
                    <p><strong>Bank:</strong> {formData.bankName}</p>
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
              <button
                type="button"
                className="hradmin-emp-btn-draft"
                onClick={() => navigate("/hr/employees")}
              >
                <FiSave /> Save Draft
              </button>

              {currentStep < 5 ? (
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
                  {isSubmitting ? "Saving Profile..." : "Add Employee"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </HRLayout>
  );
}