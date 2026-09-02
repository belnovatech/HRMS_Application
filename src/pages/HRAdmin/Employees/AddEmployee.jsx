import React, { useMemo, useState } from "react";
import "./AddEmployee.css";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiUploadCloud,
  FiUser,
  FiBriefcase,
  FiDollarSign,
  FiFileText,
  FiClipboard,
  FiCalendar,
  FiChevronDown,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function AddEmployee({ onClose, onSave }) {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    /* =========================
       PERSONAL INFORMATION
       ========================= */
    profilePhoto: null,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    personalEmail: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",

    /* =========================
       EMPLOYMENT INFORMATION
       ========================= */
    employeeId: "",
    joiningDate: "",
    department: "",
    designation: "",
    reportingManager: "",
    branch: "",
    employmentType: "",
    workLocation: "",
    workEmail: "",
    confirmationDate: "",

    /* =========================
       SALARY INFORMATION
       ========================= */
    basicSalary: "",
    hra: "",
    specialAllowance: "",
    bonus: "",
    pfContribution: "12",
    esiContribution: "0.75",
    tds: "5",
    payFrequency: "",
    payMode: "",
    bankAccount: "",
    ifscCode: "",
    bankName: "",

    /* =========================
       DOCUMENTS
       ========================= */
    panCard: null,
    aadhaarCard: null,
    resume: null,
    educationCertificate: null,
    offerLetter: null,
    bankDocument: null,
  });

  const [errors, setErrors] = useState({});

  const steps = [
    {
      id: 1,
      title: "Personal Info",
      subtitle: "Basic details",
      icon: <FiUser />,
    },
    {
      id: 2,
      title: "Employment",
      subtitle: "Work details",
      icon: <FiBriefcase />,
    },
    {
      id: 3,
      title: "Salary",
      subtitle: "Compensation",
      icon: <FiDollarSign />,
    },
    {
      id: 4,
      title: "Documents",
      subtitle: "Upload docs",
      icon: <FiFileText />,
    },
    {
      id: 5,
      title: "Review",
      subtitle: "Confirm & submit",
      icon: <FiClipboard />,
    },
  ];

  const departments = [
    "Engineering",
    "Product & Design",
    "HR & Operations",
    "Sales & Marketing",
    "Finance & Legal",
  ];

  const designations = [
    "Software Engineer",
    "Senior Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Product Designer",
    "UX Designer",
    "Product Manager",
    "HR Executive",
    "HR Specialist",
    "Sales Executive",
    "Sales Lead",
    "Financial Analyst",
    "Finance Executive",
  ];

  const managers = [
    "Vikram Malhotra",
    "Kavya Nair",
    "Sneha Kapur",
    "Rajesh Sharma",
    "Ananya Deshmukh",
  ];

  const branches = [
    "Hyderabad",
    "Bengaluru",
    "Chennai",
    "Mumbai",
    "Pune",
  ];

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: "",
      }));
    }
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    updateField(field, file);
  };

  const removeFile = (field) => {
    updateField(field, null);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      }

      if (!formData.gender) {
        newErrors.gender = "Please select gender";
      }

      if (!formData.personalEmail.trim()) {
        newErrors.personalEmail = "Email is required";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
    }

    if (step === 2) {
      if (!formData.employeeId.trim()) {
        newErrors.employeeId = "Employee ID is required";
      }

      if (!formData.joiningDate) {
        newErrors.joiningDate = "Joining date is required";
      }

      if (!formData.department) {
        newErrors.department = "Department is required";
      }

      if (!formData.designation) {
        newErrors.designation = "Designation is required";
      }

      if (!formData.reportingManager) {
        newErrors.reportingManager = "Reporting manager is required";
      }

      if (!formData.employmentType) {
        newErrors.employmentType = "Employment type is required";
      }

      if (!formData.workLocation) {
        newErrors.workLocation = "Work location is required";
      }

      if (!formData.workEmail.trim()) {
        newErrors.workEmail = "Work email is required";
      }
    }

    if (step === 3) {
      if (!formData.basicSalary) {
        newErrors.basicSalary = "Basic salary is required";
      }

      if (!formData.payFrequency) {
        newErrors.payFrequency = "Pay frequency is required";
      }

      if (!formData.payMode) {
        newErrors.payMode = "Pay mode is required";
      }

      if (!formData.bankAccount) {
        newErrors.bankAccount = "Bank account number is required";
      }

      if (!formData.ifscCode) {
        newErrors.ifscCode = "IFSC code is required";
      }

      if (!formData.bankName) {
        newErrors.bankName = "Bank name is required";
      }
    }

    if (step === 4) {
      if (!formData.panCard) {
        newErrors.panCard = "PAN card is required";
      }

      if (!formData.aadhaarCard) {
        newErrors.aadhaarCard = "Aadhaar card is required";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((previous) => previous + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((previous) => previous - 1);

      setErrors({});

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleStepClick = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    const employee = {
      ...formData,
      id:
        formData.employeeId ||
        `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      role: formData.designation,
      department: formData.department,
      status: "Active",
      joinDate: formData.joiningDate,
    };

    if (onSave) {
      onSave(employee);
    }
  };

  const fullName = useMemo(() => {
    return `${formData.firstName} ${formData.lastName}`.trim();
  }, [formData.firstName, formData.lastName]);

  const formatFileSize = (size) => {
    if (!size) return "";

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderFieldError = (field) => {
    if (!errors[field]) return null;

    return (
      <span className="hr-addemployee-v2-error">
        <FiAlertCircle />
        {errors[field]}
      </span>
    );
  };

  const renderSelect = ({
    label,
    field,
    options,
    required = false,
    placeholder = "Select",
  }) => {
    return (
      <div className="hr-addemployee-v2-field">
        <label>
          {label}
          {required && <span>*</span>}
        </label>

        <div className="hr-addemployee-v2-select-wrap">
          <select
            value={formData[field]}
            onChange={(event) =>
              updateField(field, event.target.value)
            }
            className={errors[field] ? "has-error" : ""}
          >
            <option value="">{placeholder}</option>

            {options.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>

          <FiChevronDown />
        </div>

        {renderFieldError(field)}
      </div>
    );
  };

  const renderDateField = ({
    label,
    field,
    required = false,
  }) => {
    return (
      <div className="hr-addemployee-v2-field">
        <label>
          {label}
          {required && <span>*</span>}
        </label>

        <div className="hr-addemployee-v2-date-wrap">
          <input
            type="date"
            value={formData[field]}
            onChange={(event) =>
              updateField(field, event.target.value)
            }
            className={errors[field] ? "has-error" : ""}
          />

          <FiCalendar />
        </div>

        {renderFieldError(field)}
      </div>
    );
  };

  const renderInput = ({
    label,
    field,
    placeholder,
    type = "text",
    required = false,
  }) => {
    return (
      <div className="hr-addemployee-v2-field">
        <label>
          {label}
          {required && <span>*</span>}
        </label>

        <input
          type={type}
          value={formData[field]}
          placeholder={placeholder}
          onChange={(event) =>
            updateField(field, event.target.value)
          }
          className={errors[field] ? "has-error" : ""}
        />

        {renderFieldError(field)}
      </div>
    );
  };

  const renderTextArea = ({
    label,
    field,
    placeholder,
    required = false,
  }) => {
    return (
      <div className="hr-addemployee-v2-field hr-addemployee-v2-full-field">
        <label>
          {label}
          {required && <span>*</span>}
        </label>

        <textarea
          value={formData[field]}
          placeholder={placeholder}
          onChange={(event) =>
            updateField(field, event.target.value)
          }
          className={errors[field] ? "has-error" : ""}
        />

        {renderFieldError(field)}
      </div>
    );
  };

  const renderSectionHeader = (title, description, icon) => {
    return (
      <div className="hr-addemployee-v2-section-header">
        <div className="hr-addemployee-v2-section-icon">
          {icon}
        </div>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    );
  };

  const renderUploadBox = ({
    title,
    subtitle,
    field,
    required = false,
    accept,
  }) => {
    const file = formData[field];

    return (
      <div
        className={`hr-addemployee-v2-document ${
          errors[field] ? "document-error" : ""
        }`}
      >
        <div className="hr-addemployee-v2-document-info">
          <div className="hr-addemployee-v2-document-icon">
            <FiFileText />
          </div>

          <div>
            <h4>
              {title}

              {required && (
                <span className="hr-addemployee-v2-required">
                  *Required
                </span>
              )}
            </h4>

            {file ? (
              <div className="hr-addemployee-v2-uploaded-file">
                <span>{file.name}</span>
                <small>{formatFileSize(file.size)}</small>
              </div>
            ) : (
              <p>{subtitle}</p>
            )}

            {errors[field] && (
              <span className="hr-addemployee-v2-error">
                <FiAlertCircle />
                {errors[field]}
              </span>
            )}
          </div>
        </div>

        <div>
          {file ? (
            <button
              type="button"
              className="hr-addemployee-v2-remove-file"
              onClick={() => removeFile(field)}
            >
              <FiX />
              Remove
            </button>
          ) : (
            <label className="hr-addemployee-v2-upload-button">
              <FiUploadCloud />
              Upload

              <input
                type="file"
                accept={accept}
                onChange={(event) =>
                  handleFileUpload(field, event)
                }
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  /* =========================================================
     STEP 1
     ========================================================= */

  const renderPersonalInfo = () => {
    return (
      <div className="hr-addemployee-v2-form-card">
        {renderSectionHeader(
          "Personal Information",
          "Enter the employee's basic personal information.",
          <FiUser />
        )}

        {/* Profile Photo */}
        <div className="hr-addemployee-v2-photo-section">
          <div className="hr-addemployee-v2-photo-preview">
            {formData.profilePhoto ? (
              <img
                src={URL.createObjectURL(formData.profilePhoto)}
                alt="Employee profile"
              />
            ) : (
              <FiUser />
            )}
          </div>

          <div className="hr-addemployee-v2-photo-content">
            <h3>Profile Photo</h3>

            <p>
              Upload a professional profile image.
              JPG, PNG up to 5MB.
            </p>

            <label className="hr-addemployee-v2-photo-button">
              <FiUploadCloud />
              {formData.profilePhoto
                ? "Change Photo"
                : "Choose Photo"}

              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(event) =>
                  handleFileUpload(
                    "profilePhoto",
                    event
                  )
                }
              />
            </label>

            {formData.profilePhoto && (
              <button
                type="button"
                className="hr-addemployee-v2-photo-remove"
                onClick={() =>
                  updateField("profilePhoto", null)
                }
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="hr-addemployee-v2-form-grid">
          {renderInput({
            label: "First Name",
            field: "firstName",
            placeholder: "Enter first name",
            required: true,
          })}

          {renderInput({
            label: "Last Name",
            field: "lastName",
            placeholder: "Enter last name",
            required: true,
          })}

          {renderDateField({
            label: "Date of Birth",
            field: "dateOfBirth",
            required: true,
          })}

          {renderSelect({
            label: "Gender",
            field: "gender",
            options: ["Male", "Female", "Other"],
            required: true,
            placeholder: "Select Gender",
          })}

          {renderInput({
            label: "Personal Email",
            field: "personalEmail",
            placeholder: "employee@example.com",
            type: "email",
            required: true,
          })}

          {renderInput({
            label: "Phone Number",
            field: "phone",
            placeholder: "+91 XXXXX XXXXX",
            type: "tel",
            required: true,
          })}

          {renderInput({
            label: "Alternate Phone",
            field: "alternatePhone",
            placeholder: "+91 XXXXX XXXXX",
            type: "tel",
          })}

          {renderInput({
            label: "City",
            field: "city",
            placeholder: "Enter city",
          })}

          {renderInput({
            label: "State",
            field: "state",
            placeholder: "Enter state",
          })}

          {renderInput({
            label: "Pincode",
            field: "pincode",
            placeholder: "Enter pincode",
          })}

          {renderTextArea({
            label: "Address",
            field: "address",
            placeholder: "Enter complete residential address",
          })}
        </div>

        <div className="hr-addemployee-v2-subsection">
          <div className="hr-addemployee-v2-subsection-title">
            <h3>Emergency Contact</h3>
            <p>
              Add someone who can be contacted in case of emergency.
            </p>
          </div>

          <div className="hr-addemployee-v2-form-grid">
            {renderInput({
              label: "Contact Name",
              field: "emergencyName",
              placeholder: "Enter contact name",
            })}

            {renderInput({
              label: "Relationship",
              field: "emergencyRelation",
              placeholder: "e.g. Father, Mother, Spouse",
            })}

            {renderInput({
              label: "Contact Number",
              field: "emergencyPhone",
              placeholder: "+91 XXXXX XXXXX",
              type: "tel",
            })}
          </div>
        </div>
      </div>
    );
  };

  /* =========================================================
     STEP 2
     ========================================================= */

  const renderEmployment = () => {
    return (
      <div className="hr-addemployee-v2-form-card">
        {renderSectionHeader(
          "Employment Details",
          "Set up employment details, organizational role, and work information.",
          <FiBriefcase />
        )}

        <div className="hr-addemployee-v2-form-grid">
          {renderInput({
            label: "Employee ID",
            field: "employeeId",
            placeholder: "EMP1024",
            required: true,
          })}

          {renderDateField({
            label: "Joining Date",
            field: "joiningDate",
            required: true,
          })}

          {renderSelect({
            label: "Department",
            field: "department",
            options: departments,
            required: true,
            placeholder: "Select Department",
          })}

          {renderSelect({
            label: "Designation",
            field: "designation",
            options: designations,
            required: true,
            placeholder: "Select Designation",
          })}

          {renderSelect({
            label: "Reporting Manager",
            field: "reportingManager",
            options: managers,
            required: true,
            placeholder: "Select Reporting Manager",
          })}

          {renderSelect({
            label: "Branch",
            field: "branch",
            options: branches,
            placeholder: "Select Branch",
          })}

          {renderSelect({
            label: "Employment Type",
            field: "employmentType",
            options: [
              "Full Time",
              "Part Time",
              "Contract",
              "Internship",
              "Consultant",
            ],
            required: true,
            placeholder: "Select Employment Type",
          })}

          {renderSelect({
            label: "Work Location",
            field: "workLocation",
            options: [
              "Office",
              "Hybrid",
              "Remote",
            ],
            required: true,
            placeholder: "Select Work Location",
          })}

          {renderInput({
            label: "Work Email",
            field: "workEmail",
            placeholder: "employee@belnova.tech",
            type: "email",
            required: true,
          })}

          {renderDateField({
            label: "Date of Confirmation",
            field: "confirmationDate",
          })}
        </div>

        <div className="hr-addemployee-v2-info-banner">
          <div className="hr-addemployee-v2-info-banner-icon">
            <FiCheckCircle />
          </div>

          <div>
            <strong>Employment information</strong>
            <p>
              These details will be used across employee records,
              attendance, leave, payroll, and reporting modules.
            </p>
          </div>
        </div>
      </div>
    );
  };

  /* =========================================================
     STEP 3
     ========================================================= */

  const renderSalary = () => {
    return (
      <div className="hr-addemployee-v2-form-card">
        {renderSectionHeader(
          "Salary & Compensation",
          "Configure salary structure, payroll information, and statutory deductions.",
          <FiDollarSign />
        )}

        <div className="hr-addemployee-v2-confidential-banner">
          <div className="hr-addemployee-v2-confidential-icon">
            <FiDollarSign />
          </div>

          <div>
            <strong>
              Salary information is confidential and encrypted
            </strong>

            <p>
              Only authorized HR and Admin users can view full
              salary details.
            </p>
          </div>
        </div>

        <div className="hr-addemployee-v2-form-grid">
          {renderInput({
            label: "Basic Salary (₹/month)",
            field: "basicSalary",
            placeholder: "35,000",
            type: "number",
            required: true,
          })}

          {renderInput({
            label: "HRA (₹/month)",
            field: "hra",
            placeholder: "14,000",
            type: "number",
          })}

          {renderInput({
            label: "Special Allowance (₹/month)",
            field: "specialAllowance",
            placeholder: "8,000",
            type: "number",
          })}

          {renderInput({
            label: "Bonus",
            field: "bonus",
            placeholder: "Annual bonus amount",
            type: "number",
          })}

          {renderInput({
            label: "PF Contribution (%)",
            field: "pfContribution",
            placeholder: "12",
            type: "number",
          })}

          {renderInput({
            label: "ESI Contribution (%)",
            field: "esiContribution",
            placeholder: "0.75",
            type: "number",
          })}

          {renderInput({
            label: "TDS (%)",
            field: "tds",
            placeholder: "5",
            type: "number",
          })}

          {renderSelect({
            label: "Pay Frequency",
            field: "payFrequency",
            options: [
              "Monthly",
              "Bi-Weekly",
              "Weekly",
            ],
            required: true,
            placeholder: "Select Pay Frequency",
          })}

          {renderSelect({
            label: "Pay Mode",
            field: "payMode",
            options: [
              "Bank Transfer",
              "Cheque",
              "Cash",
            ],
            required: true,
            placeholder: "Select Pay Mode",
          })}

          {renderInput({
            label: "Bank Account Number",
            field: "bankAccount",
            placeholder: "XXXXXXXXXXXX",
            required: true,
          })}

          {renderInput({
            label: "IFSC Code",
            field: "ifscCode",
            placeholder: "HDFC0001234",
            required: true,
          })}

          {renderInput({
            label: "Bank Name",
            field: "bankName",
            placeholder: "HDFC Bank",
            required: true,
          })}
        </div>
      </div>
    );
  };

  /* =========================================================
     STEP 4
     ========================================================= */

  const renderDocuments = () => {
    return (
      <div className="hr-addemployee-v2-form-card">
        {renderSectionHeader(
          "Employee Documents",
          "Upload the required documents for employee verification.",
          <FiFileText />
        )}

        <div className="hr-addemployee-v2-document-summary">
          <div>
            <strong>Document Verification</strong>
            <p>
              Upload clear and readable copies. Required documents
              must be provided before submission.
            </p>
          </div>

          <span>
            {
              [
                formData.panCard,
                formData.aadhaarCard,
              ].filter(Boolean).length
            }
            /2 Required
          </span>
        </div>

        <div className="hr-addemployee-v2-document-list">
          {renderUploadBox({
            title: "PAN Card",
            subtitle: "PAN card image or PDF",
            field: "panCard",
            required: true,
            accept: ".pdf,.jpg,.jpeg,.png",
          })}

          {renderUploadBox({
            title: "Aadhaar Card",
            subtitle: "Aadhaar card image or PDF",
            field: "aadhaarCard",
            required: true,
            accept: ".pdf,.jpg,.jpeg,.png",
          })}

          {renderUploadBox({
            title: "Resume / CV",
            subtitle: "PDF, DOC, DOCX",
            field: "resume",
            accept: ".pdf,.doc,.docx",
          })}

          {renderUploadBox({
            title: "Educational Certificates",
            subtitle: "Degree, marksheets, certificates",
            field: "educationCertificate",
            accept: ".pdf,.jpg,.jpeg,.png",
          })}

          {renderUploadBox({
            title: "Offer Letter",
            subtitle: "Signed offer letter",
            field: "offerLetter",
            accept: ".pdf,.doc,.docx",
          })}

          {renderUploadBox({
            title: "Bank Document",
            subtitle: "Cancelled cheque / passbook",
            field: "bankDocument",
            accept: ".pdf,.jpg,.jpeg,.png",
          })}
        </div>

        <div className="hr-addemployee-v2-upload-note">
          <FiAlertCircle />

          <p>
            Maximum file size: 5MB per document. Accepted formats:
            PDF, JPG, PNG, DOC, DOCX.
          </p>
        </div>
      </div>
    );
  };

  /* =========================================================
     STEP 5
     ========================================================= */

  const renderReview = () => {
    const documentCount = [
      formData.panCard,
      formData.aadhaarCard,
      formData.resume,
      formData.educationCertificate,
      formData.offerLetter,
      formData.bankDocument,
    ].filter(Boolean).length;

    return (
      <div className="hr-addemployee-v2-review-wrapper">

        <div className="hr-addemployee-v2-review-success">
          <div className="hr-addemployee-v2-review-success-icon">
            <FiCheck />
          </div>

          <div>
            <h2>Review Employee Information</h2>
            <p>
              Please verify all information before creating the
              employee profile.
            </p>
          </div>
        </div>

        {/* Personal */}
        <div className="hr-addemployee-v2-review-card">
          <div className="hr-addemployee-v2-review-card-header">
            <div>
              <span className="hr-addemployee-v2-review-number">
                01
              </span>

              <div>
                <h3>Personal Information</h3>
                <p>Basic employee details</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
            >
              Edit
            </button>
          </div>

          <div className="hr-addemployee-v2-review-grid">
            <div>
              <span>Full Name</span>
              <strong>{fullName || "Not provided"}</strong>
            </div>

            <div>
              <span>Date of Birth</span>
              <strong>
                {formData.dateOfBirth || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Gender</span>
              <strong>
                {formData.gender || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Personal Email</span>
              <strong>
                {formData.personalEmail || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>
                {formData.phone || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Location</span>
              <strong>
                {[formData.city, formData.state]
                  .filter(Boolean)
                  .join(", ") || "Not provided"}
              </strong>
            </div>
          </div>
        </div>

        {/* Employment */}
        <div className="hr-addemployee-v2-review-card">
          <div className="hr-addemployee-v2-review-card-header">
            <div>
              <span className="hr-addemployee-v2-review-number">
                02
              </span>

              <div>
                <h3>Employment Details</h3>
                <p>Role and organizational information</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
            >
              Edit
            </button>
          </div>

          <div className="hr-addemployee-v2-review-grid">
            <div>
              <span>Employee ID</span>
              <strong>
                {formData.employeeId || "Auto generated"}
              </strong>
            </div>

            <div>
              <span>Joining Date</span>
              <strong>
                {formData.joiningDate || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Department</span>
              <strong>
                {formData.department || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Designation</span>
              <strong>
                {formData.designation || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Reporting Manager</span>
              <strong>
                {formData.reportingManager || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Employment Type</span>
              <strong>
                {formData.employmentType || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Work Location</span>
              <strong>
                {formData.workLocation || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Work Email</span>
              <strong>
                {formData.workEmail || "Not provided"}
              </strong>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="hr-addemployee-v2-review-card">
          <div className="hr-addemployee-v2-review-card-header">
            <div>
              <span className="hr-addemployee-v2-review-number">
                03
              </span>

              <div>
                <h3>Salary & Compensation</h3>
                <p>Payroll information</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
            >
              Edit
            </button>
          </div>

          <div className="hr-addemployee-v2-review-grid">
            <div>
              <span>Basic Salary</span>
              <strong>
                ₹{formData.basicSalary || "0"} / month
              </strong>
            </div>

            <div>
              <span>HRA</span>
              <strong>
                ₹{formData.hra || "0"} / month
              </strong>
            </div>

            <div>
              <span>Special Allowance</span>
              <strong>
                ₹{formData.specialAllowance || "0"} / month
              </strong>
            </div>

            <div>
              <span>Pay Frequency</span>
              <strong>
                {formData.payFrequency || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Pay Mode</span>
              <strong>
                {formData.payMode || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Bank</span>
              <strong>
                {formData.bankName || "Not provided"}
              </strong>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="hr-addemployee-v2-review-card">
          <div className="hr-addemployee-v2-review-card-header">
            <div>
              <span className="hr-addemployee-v2-review-number">
                04
              </span>

              <div>
                <h3>Documents</h3>
                <p>Uploaded employee documents</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
            >
              Edit
            </button>
          </div>

          <div className="hr-addemployee-v2-document-review">
            <FiCheckCircle />

            <div>
              <strong>{documentCount} documents uploaded</strong>

              <span>
                {formData.panCard && "PAN Card"}
                {formData.panCard && formData.aadhaarCard && " • "}
                {formData.aadhaarCard && "Aadhaar Card"}
              </span>
            </div>
          </div>
        </div>

        {/* Final Confirmation */}
        <div className="hr-addemployee-v2-final-confirmation">
          <div className="hr-addemployee-v2-final-check">
            <FiCheckCircle />
          </div>

          <div>
            <h3>Ready to create employee profile</h3>
            <p>
              By clicking "Create Employee", the employee profile
              will be created and the information will become
              available across the HRMS.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();

      case 2:
        return renderEmployment();

      case 3:
        return renderSalary();

      case 4:
        return renderDocuments();

      case 5:
        return renderReview();

      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="hr-addemployee-v2-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <header className="hr-addemployee-v2-page-header">

        <div className="hr-addemployee-v2-header-left">

          <button
            type="button"
            className="hr-addemployee-v2-back-button"
            onClick={onClose}
            aria-label="Go back"
          >
            <FiArrowLeft />
          </button>

          <div>
            <div className="hr-addemployee-v2-breadcrumb">
              Employees
              <span>/</span>
              Add Employee
            </div>

            <h1>Add New Employee</h1>

            <p>
              Complete all steps to create the employee profile.
            </p>
          </div>

        </div>

        <div className="hr-addemployee-v2-header-status">
          <span></span>
          Draft
        </div>

      </header>

      {/* =====================================================
          STEPPER
          ===================================================== */}

      <div className="hr-addemployee-v2-stepper">

        {steps.map((step, index) => {

          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>

              <button
                type="button"
                className={`hr-addemployee-v2-step ${
                  isActive ? "active" : ""
                } ${isCompleted ? "completed" : ""}`}
                onClick={() => handleStepClick(step.id)}
                disabled={!isCompleted && !isActive}
              >

                <div className="hr-addemployee-v2-step-circle">
                  {isCompleted ? (
                    <FiCheck />
                  ) : (
                    step.id
                  )}
                </div>

                <div className="hr-addemployee-v2-step-content">
                  <strong>{step.title}</strong>
                  <span>{step.subtitle}</span>
                </div>

              </button>

              {index < steps.length - 1 && (
                <div
                  className={`hr-addemployee-v2-step-line ${
                    currentStep > step.id
                      ? "completed"
                      : ""
                  }`}
                />
              )}

            </React.Fragment>
          );
        })}

      </div>

      {/* =====================================================
          CURRENT STEP
          ===================================================== */}

      <main className="hr-addemployee-v2-content">
        {renderCurrentStep()}
      </main>

      {/* =====================================================
          FOOTER ACTIONS
          ===================================================== */}

      <div className="hr-addemployee-v2-action-bar">

        <button
          type="button"
          className="hr-addemployee-v2-secondary-button"
          onClick={
            currentStep === 1
              ? onClose
              : handlePrevious
          }
        >
          <FiArrowLeft />

          {currentStep === 1
            ? "Cancel"
            : "Previous"}
        </button>

        <div className="hr-addemployee-v2-action-right">

          {currentStep < 5 ? (
            <button
              type="button"
              className="hr-addemployee-v2-primary-button"
              onClick={handleContinue}
            >
              Continue
              <FiArrowRight />
            </button>
          ) : (
            <button
              type="button"
              className="hr-addemployee-v2-create-button"
              onClick={handleSubmit}
            >
              <FiCheck />
              Create Employee
            </button>
          )}

        </div>

      </div>

    </div>
  );
}