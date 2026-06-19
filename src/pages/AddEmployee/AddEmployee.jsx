import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import "./AddEmployee.css";

import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiUpload,
} from "react-icons/fi";

export default function AddEmployee() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    personalEmail: "",
    phone: "",
    address: "",
    city: "",

    employeeId: `BEL-${Math.floor(
      100 + Math.random() * 900
    )}`,

    joiningDate: "",
    department: "",
    designation: "",
    reportingManager: "",
    employeeType: "",
    workLocation: "",
    workEmail: "",

    basicSalary: "",
    hra: "",
    specialAllowance: "",
    bonus: "",
    pf: "",
    esi: "",
    tds: "",
    ctc: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    panNumber: "",

    aadhaar: null,
    panCard: null,
    resume: null,
    education: null,
    offerLetter: null,
    backgroundCheck: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSubmit = () => {
    const employee = {
      id: formData.employeeId,
      name: formData.fullName,
      initials: getInitials(formData.fullName),
      department: formData.department,
      designation: formData.designation,
      email: formData.workEmail,
      phone: formData.phone,
      status: "Active",
      color: "#1677ff",
    };

    const existing =
      JSON.parse(localStorage.getItem("employees")) || [];

    existing.push(employee);

    localStorage.setItem(
      "employees",
      JSON.stringify(existing)
    );

    alert("Employee Added Successfully");

    navigate("/employees");
  };

  return (
      <div className="dashboard-layout">
    <Sidebar />

    <div className="dashboard-content">
      <Header />
    <div className="add-employee-page">
      {/* STEPPER */}

      <div className="stepper-card">

        {[1, 2, 3, 4, 5].map((item) => (
          <div className="step-item" key={item}>
            <div
              className={`step-circle ${
                step > item
                  ? "completed"
                  : step === item
                  ? "active"
                  : ""
              }`}
            >
              {step > item ? <FiCheck /> : item}
            </div>

            <span>
              {
                [
                  "Personal",
                  "Employment",
                  "Salary",
                  "Documents",
                  "Review",
                ][item - 1]
              }
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1 */}

      {step === 1 && (
        <div className="form-card">
          <h2>Personal Details</h2>

          <div className="form-grid">

            <div>
              <label>Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Arjun Mehta"
              />
            </div>

            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label>Marital Status</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option>Single</option>
                <option>Married</option>
              </select>
            </div>

            <div>
              <label>Personal Email</label>
              <input
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <div className="form-card">
          <h2>Employment Details</h2>

          <div className="form-grid">

            <div>
              <label>Employee ID</label>
              <input
                value={formData.employeeId}
                readOnly
              />
            </div>

            <div>
              <label>Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Department</label>
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Designation</label>
              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Reporting Manager</label>
              <input
                name="reportingManager"
                value={formData.reportingManager}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Employee Type</label>
              <input
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Work Location</label>
              <input
                name="workLocation"
                value={formData.workLocation}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Work Email</label>
              <input
                name="workEmail"
                value={formData.workEmail}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
      )}

      {/* STEP 3 */}

      {step === 3 && (
        <div className="form-card">
          <h2>Salary & Bank Details</h2>

          <div className="form-grid">

            <input
              placeholder="Basic Salary"
              name="basicSalary"
              onChange={handleChange}
            />

            <input
              placeholder="HRA"
              name="hra"
              onChange={handleChange}
            />

            <input
              placeholder="Special Allowance"
              name="specialAllowance"
              onChange={handleChange}
            />

            <input
              placeholder="Bonus"
              name="bonus"
              onChange={handleChange}
            />

            <input
              placeholder="PF"
              name="pf"
              onChange={handleChange}
            />

            <input
              placeholder="ESI"
              name="esi"
              onChange={handleChange}
            />

            <input
              placeholder="TDS"
              name="tds"
              onChange={handleChange}
            />

            <input
              placeholder="CTC"
              name="ctc"
              onChange={handleChange}
            />

            <input
              placeholder="Bank Name"
              name="bankName"
              onChange={handleChange}
            />

            <input
              placeholder="Account Number"
              name="accountNumber"
              onChange={handleChange}
            />

            <input
              placeholder="IFSC Code"
              name="ifscCode"
              onChange={handleChange}
            />

            <input
              placeholder="PAN Number"
              name="panNumber"
              onChange={handleChange}
            />

          </div>
        </div>
      )}

      {/* STEP 4 */}

      {step === 4 && (
        <div className="form-card">
          <h2>Document Upload</h2>

          <div className="upload-grid">

            {[
              "aadhaar",
              "panCard",
              "resume",
              "education",
              "offerLetter",
              "backgroundCheck",
            ].map((doc) => (
              <label
                key={doc}
                className="upload-box"
              >
                <FiUpload />

                <span>{doc}</span>

                <input
                  type="file"
                  hidden
                  name={doc}
                  onChange={handleFile}
                />
              </label>
            ))}

          </div>
        </div>
      )}

      {/* STEP 5 */}

      {step === 5 && (
        <div className="form-card">
          <h2>Review & Submit</h2>

          <div className="review-box">
            <p>
              <strong>Name:</strong>{" "}
              {formData.fullName}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {formData.department}
            </p>

            <p>
              <strong>Designation:</strong>{" "}
              {formData.designation}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {formData.workEmail}
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}

      <div className="form-footer">

        <button
          className="cancel-btn"
          onClick={prevStep}
          disabled={step === 1}
        >
          <FiChevronLeft />
          Back
        </button>

        {step < 5 ? (
          <button
            className="next-btn"
            onClick={nextStep}
          >
            Next
            <FiChevronRight />
          </button>
        ) : (
          <button
            className="submit-btn"
            onClick={handleSubmit}
          >
            Submit Employee
          </button>
        )}

      </div>
    </div>
    </div>
    </div>
  );
}