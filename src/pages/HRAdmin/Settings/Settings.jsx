import React, { useMemo, useState } from "react";
import "./Settings.css";
import HRLayout from "../../../layouts/HRLayout";
import {
  FiActivity,
  FiAlertTriangle,
  FiArchive,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiDollarSign,
  FiEdit3,
  FiFileText,
  FiGrid,
  FiLock,
  FiMail,
  FiMapPin,
  FiPlus,
  FiSave,
  FiSearch,
  FiServer,
  FiShield,
  FiSliders,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";

const SETTINGS_SECTIONS = [
  { id: "company", label: "Company Profile", icon: FiBriefcase },
  { id: "branches", label: "Branches", icon: FiMapPin },
  { id: "departments", label: "Departments", icon: FiUsers },
  { id: "designations", label: "Designations", icon: FiGrid },
  { id: "shifts", label: "Shift Policies", icon: FiClock },
  { id: "leave", label: "Leave Policies", icon: FiCalendar },
  { id: "payroll", label: "Payroll Config", icon: FiDollarSign },
  { id: "tax", label: "Tax Configuration", icon: FiFileText },
  { id: "notifications", label: "Notifications", icon: FiBell },
  { id: "email", label: "Email Templates", icon: FiMail },
  { id: "security", label: "Security", icon: FiShield },
  { id: "audit", label: "Audit Logs", icon: FiActivity },
];

const INITIAL_COMPANY = {
  name: "BELNOVA TECH PRIVATE LIMITED",
  cin: "U72200MH2015PTC123456",
  gst: "27AABCB1234A1Z5",
  pan: "AABCB1234A",
  headquarters: "Mumbai, Maharashtra",
  industry: "Information Technology",
  website: "www.belnova.tech",
  founded: "2015",
  supportEmail: "hr.support@belnova.tech",
  phone: "+91 22 4567 8900",
  timezone: "Asia/Kolkata",
  currency: "INR (₹)",
  financialYear: "April - March",
};

const INITIAL_BRANCHES = [
  { id: 1, name: "Mumbai Headquarters", city: "Mumbai", employees: 482, status: "Active" },
  { id: 2, name: "Bangalore Technology Center", city: "Bangalore", employees: 365, status: "Active" },
  { id: 3, name: "Hyderabad Development Center", city: "Hyderabad", employees: 241, status: "Active" },
  { id: 4, name: "Delhi NCR Office", city: "Delhi", employees: 160, status: "Active" },
];

const INITIAL_DEPARTMENTS = [
  { id: 1, name: "Engineering", code: "ENG", head: "Arjun Reddy", employees: 356 },
  { id: 2, name: "Human Resources", code: "HR", head: "Sneha Rao", employees: 48 },
  { id: 3, name: "Finance", code: "FIN", head: "Kiran Reddy", employees: 42 },
  { id: 4, name: "Product", code: "PROD", head: "Priya Sharma", employees: 86 },
  { id: 5, name: "Sales & Marketing", code: "SM", head: "Meena Pillai", employees: 174 },
];

const INITIAL_DESIGNATIONS = [
  { id: 1, title: "Software Engineer", department: "Engineering", level: "L2", employees: 142 },
  { id: 2, title: "Senior Software Engineer", department: "Engineering", level: "L3", employees: 96 },
  { id: 3, title: "Engineering Manager", department: "Engineering", level: "L5", employees: 24 },
  { id: 4, title: "HR Executive", department: "Human Resources", level: "L2", employees: 16 },
  { id: 5, title: "Product Manager", department: "Product", level: "L4", employees: 18 },
];

const INITIAL_SHIFTS = [
  { id: 1, name: "General Shift", start: "09:00", end: "18:00", grace: 15, break: 60, overnight: false },
  { id: 2, name: "Morning Shift", start: "06:00", end: "14:00", grace: 10, break: 45, overnight: false },
  { id: 3, name: "Evening Shift", start: "14:00", end: "22:00", grace: 10, break: 45, overnight: false },
  { id: 4, name: "Night Shift", start: "22:00", end: "06:00", grace: 15, break: 60, overnight: true },
];

const INITIAL_EMAIL_TEMPLATES = [
  { id: 1, name: "Welcome New Employee", event: "Employee Onboarding", channel: "Email", status: "Active" },
  { id: 2, name: "Leave Request Submitted", event: "Leave Workflow", channel: "Email", status: "Active" },
  { id: 3, name: "Payslip Available", event: "Payroll Completion", channel: "Email", status: "Active" },
  { id: 4, name: "Attendance Regularization", event: "Attendance", channel: "Email", status: "Active" },
];

const INITIAL_AUDIT = [
  { id: 1, action: "Company profile updated", user: "Sneha Rao", module: "Company Profile", time: "Today, 11:42 AM", result: "Success" },
  { id: 2, action: "Shift policy modified", user: "Arjun Reddy", module: "Shift Policies", time: "Today, 10:18 AM", result: "Success" },
  { id: 3, action: "Payroll configuration viewed", user: "Sneha Rao", module: "Payroll", time: "Yesterday, 4:32 PM", result: "Success" },
  { id: 4, action: "Failed security login", user: "Unknown", module: "Security", time: "Yesterday, 2:08 PM", result: "Blocked" },
  { id: 5, action: "Leave policy updated", user: "Sneha Rao", module: "Leave Policies", time: "Aug 29, 2026", result: "Success" },
];

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`bel-settings-toggle ${checked ? "is-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function FormField({ label, value, onChange, type = "text", placeholder, disabled = false }) {
  return (
    <label className="bel-settings-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="bel-settings-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange?.(e.target.value)}>
        {children}
      </select>
    </label>
  );
}

function SectionHeading({ icon: Icon, title, description, action }) {
  return (
    <div className="bel-settings-section-heading">
      <div className="bel-settings-heading-icon"><Icon /></div>
      <div className="bel-settings-heading-copy">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyOrNoop() {
  return null;
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState("company");
  const [company, setCompany] = useState(INITIAL_COMPANY);
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [designations, setDesignations] = useState(INITIAL_DESIGNATIONS);
  const [shifts, setShifts] = useState(INITIAL_SHIFTS);
  const [emailTemplates, setEmailTemplates] = useState(INITIAL_EMAIL_TEMPLATES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT);

  const [leaveConfig, setLeaveConfig] = useState({
    approval: "Manager → HR",
    carryForward: true,
    carryForwardLimit: 5,
    encashment: true,
    negativeBalance: false,
    halfDay: true,
    attachmentRequired: true,
    maxAdvanceDays: 60,
  });

  const [payrollConfig, setPayrollConfig] = useState({
    payCycle: "Monthly",
    payrollDay: "28",
    salaryDay: "1",
    workingDays: "26",
    overtime: true,
    pf: true,
    esi: true,
    professionalTax: true,
    tds: true,
  });

  const [taxConfig, setTaxConfig] = useState({
    regime: "New Tax Regime",
    pfEmployee: "12",
    pfEmployer: "12",
    esiEmployee: "0.75",
    esiEmployer: "3.25",
    ptEnabled: true,
    tdsEnabled: true,
  });

  const [notificationConfig, setNotificationConfig] = useState({
    email: true,
    inApp: true,
    payroll: true,
    attendance: true,
    leave: true,
    security: true,
    digest: false,
    digestTime: "18:00",
  });

  const [securityConfig, setSecurityConfig] = useState({
    mfa: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
    ipRestriction: false,
    auditLogging: true,
    biometricVerification: true,
  });

  const [generalSearch, setGeneralSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState("");

  const [modalForm, setModalForm] = useState({});

  const activeSectionData = SETTINGS_SECTIONS.find((item) => item.id === activeSection);

  const companyInitials = useMemo(
    () =>
      company.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join(""),
    [company.name]
  );

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__belSettingsToastTimer);
    window.__belSettingsToastTimer = window.setTimeout(() => setToast(""), 2500);
  };

  const updateCompany = (field, value) => {
    setCompany((current) => ({ ...current, [field]: value }));
  };

  const saveSection = (label) => {
    setAuditLogs((current) => [
      {
        id: Date.now(),
        action: `${label} settings saved`,
        user: "Sneha Rao",
        module: label,
        time: "Just now",
        result: "Success",
      },
      ...current,
    ]);
    notify(`${label} changes saved successfully.`);
  };

  const openAddModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (type === "branch") {
      setModalForm(item || { name: "", city: "", employees: "0", status: "Active" });
    } else if (type === "department") {
      setModalForm(item || { name: "", code: "", head: "", employees: "0" });
    } else if (type === "designation") {
      setModalForm(item || { title: "", department: "Engineering", level: "L2", employees: "0" });
    } else if (type === "shift") {
      setModalForm(item || { name: "", start: "09:00", end: "18:00", grace: "15", break: "60", overnight: false });
    } else if (type === "email") {
      setModalForm(item || { name: "", event: "", channel: "Email", status: "Active" });
    }
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setModalType("");
    setEditingItem(null);
    setModalForm({});
  };

  const saveModalItem = (event) => {
    event.preventDefault();
    const id = editingItem?.id || Date.now();

    if (modalType === "branch") {
      const item = { ...modalForm, id, employees: Number(modalForm.employees || 0) };
      setBranches((current) =>
        editingItem ? current.map((row) => row.id === id ? item : row) : [...current, item]
      );
      notify(editingItem ? "Branch updated." : "Branch added.");
    }

    if (modalType === "department") {
      const item = { ...modalForm, id, employees: Number(modalForm.employees || 0) };
      setDepartments((current) =>
        editingItem ? current.map((row) => row.id === id ? item : row) : [...current, item]
      );
      notify(editingItem ? "Department updated." : "Department added.");
    }

    if (modalType === "designation") {
      const item = { ...modalForm, id, employees: Number(modalForm.employees || 0) };
      setDesignations((current) =>
        editingItem ? current.map((row) => row.id === id ? item : row) : [...current, item]
      );
      notify(editingItem ? "Designation updated." : "Designation added.");
    }

    if (modalType === "shift") {
      const item = {
        ...modalForm,
        id,
        grace: Number(modalForm.grace || 0),
        break: Number(modalForm.break || 0),
      };
      setShifts((current) =>
        editingItem ? current.map((row) => row.id === id ? item : row) : [...current, item]
      );
      notify(editingItem ? "Shift policy updated." : "Shift policy added.");
    }

    if (modalType === "email") {
      const item = { ...modalForm, id };
      setEmailTemplates((current) =>
        editingItem ? current.map((row) => row.id === id ? item : row) : [...current, item]
      );
      notify(editingItem ? "Email template updated." : "Email template added.");
    }

    closeModal();
  };

  const deleteItem = (type, id) => {
    const labels = {
      branch: ["branch", setBranches],
      department: ["department", setDepartments],
      designation: ["designation", setDesignations],
      shift: ["shift policy", setShifts],
      email: ["email template", setEmailTemplates],
    };
    const [label, setter] = labels[type];
    if (!setter) return;
    setter((current) => current.filter((item) => item.id !== id));
    notify(`${label} removed.`);
  };

  const sectionTitles = {
    company: "Company Profile",
    branches: "Branches",
    departments: "Departments",
    designations: "Designations",
    shifts: "Shift Policies",
    leave: "Leave Policies",
    payroll: "Payroll Configuration",
    tax: "Tax Configuration",
    notifications: "Notifications",
    email: "Email Templates",
    security: "Security",
    audit: "Audit Logs",
  };

  const renderCompany = () => (
    <>
      <SectionHeading
        icon={FiBriefcase}
        title="Company Profile"
        description="Manage legal entity details, organization identity and regional defaults."
      />

      <div className="bel-settings-company-banner">
        <div className="bel-settings-company-logo">
          {companyInitials || "BT"}
        </div>
        <div className="bel-settings-company-identity">
          <h3>{company.name}</h3>
          <p>{company.industry} · 1,248 employees · Founded {company.founded}</p>
          <button type="button" onClick={() => notify("Logo upload dialog is ready for API integration.")}>
            Change Logo
          </button>
        </div>
        <div className="bel-settings-company-status">
          <span><FiCheck /> Active</span>
          <small>Verified organization</small>
        </div>
      </div>

      <div className="bel-settings-subheading">
        <h3>Legal & Registration</h3>
        <span>Official organization identifiers</span>
      </div>

      <div className="bel-settings-form-grid">
        <FormField label="Company Name" value={company.name} onChange={(v) => updateCompany("name", v)} />
        <FormField label="CIN / Registration Number" value={company.cin} onChange={(v) => updateCompany("cin", v)} />
        <FormField label="GST Number" value={company.gst} onChange={(v) => updateCompany("gst", v)} />
        <FormField label="PAN" value={company.pan} onChange={(v) => updateCompany("pan", v)} />
        <FormField label="Headquarters" value={company.headquarters} onChange={(v) => updateCompany("headquarters", v)} />
        <FormField label="Industry" value={company.industry} onChange={(v) => updateCompany("industry", v)} />
        <FormField label="Website" value={company.website} onChange={(v) => updateCompany("website", v)} />
        <FormField label="Year Founded" value={company.founded} onChange={(v) => updateCompany("founded", v)} />
      </div>

      <div className="bel-settings-subheading">
        <h3>Organization Contact</h3>
        <span>Primary HR and communication details</span>
      </div>

      <div className="bel-settings-form-grid">
        <FormField label="HR Support Email" type="email" value={company.supportEmail} onChange={(v) => updateCompany("supportEmail", v)} />
        <FormField label="Corporate Phone" value={company.phone} onChange={(v) => updateCompany("phone", v)} />
        <SelectField label="Time Zone" value={company.timezone} onChange={(v) => updateCompany("timezone", v)}>
          <option>Asia/Kolkata</option>
          <option>Asia/Singapore</option>
          <option>Europe/London</option>
          <option>America/New_York</option>
        </SelectField>
        <SelectField label="Currency" value={company.currency} onChange={(v) => updateCompany("currency", v)}>
          <option>INR (₹)</option>
          <option>USD ($)</option>
          <option>EUR (€)</option>
          <option>GBP (£)</option>
        </SelectField>
        <SelectField label="Financial Year" value={company.financialYear} onChange={(v) => updateCompany("financialYear", v)}>
          <option>April - March</option>
          <option>January - December</option>
        </SelectField>
      </div>

      <div className="bel-settings-save-row">
        <span><FiShield /> Changes are restricted to authorized HR administrators.</span>
        <button type="button" className="bel-settings-primary-btn" onClick={() => saveSection("Company Profile")}>
          <FiSave /> Save Changes
        </button>
      </div>
    </>
  );

  const renderBranches = () => (
    <>
      <SectionHeading
        icon={FiMapPin}
        title="Branches & Locations"
        description="Maintain office locations, workforce allocation and branch status."
        action={
          <button className="bel-settings-outline-btn" type="button" onClick={() => openAddModal("branch")}>
            <FiPlus /> Add Branch
          </button>
        }
      />
      <div className="bel-settings-summary-strip">
        <div><strong>{branches.length}</strong><span>Locations</span></div>
        <div><strong>{branches.reduce((sum, item) => sum + Number(item.employees || 0), 0).toLocaleString()}</strong><span>Employees</span></div>
        <div><strong>{branches.filter((item) => item.status === "Active").length}</strong><span>Active</span></div>
      </div>
      <div className="bel-settings-table-wrap">
        <table className="bel-settings-table">
          <thead><tr><th>Branch</th><th>City</th><th>Employees</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id}>
                <td><strong>{branch.name}</strong></td>
                <td>{branch.city}</td>
                <td>{branch.employees}</td>
                <td><span className="bel-settings-status active">{branch.status}</span></td>
                <td>
                  <div className="bel-settings-row-actions">
                    <button type="button" onClick={() => openAddModal("branch", branch)}><FiEdit3 /> Edit</button>
                    <button type="button" className="danger" onClick={() => deleteItem("branch", branch.id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderDepartments = () => (
    <>
      <SectionHeading
        icon={FiUsers}
        title="Departments"
        description="Organize employees by business unit and assign department ownership."
        action={
          <button className="bel-settings-outline-btn" type="button" onClick={() => openAddModal("department")}>
            <FiPlus /> Add Department
          </button>
        }
      />
      <div className="bel-settings-table-wrap">
        <table className="bel-settings-table">
          <thead><tr><th>Department</th><th>Code</th><th>Department Head</th><th>Employees</th><th>Actions</th></tr></thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td><strong>{department.name}</strong></td>
                <td><span className="bel-settings-code">{department.code}</span></td>
                <td>{department.head}</td>
                <td>{department.employees}</td>
                <td>
                  <div className="bel-settings-row-actions">
                    <button type="button" onClick={() => openAddModal("department", department)}><FiEdit3 /> Edit</button>
                    <button type="button" className="danger" onClick={() => deleteItem("department", department.id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderDesignations = () => (
    <>
      <SectionHeading
        icon={FiGrid}
        title="Designations & Job Levels"
        description="Configure job titles, organizational levels and reporting structure."
        action={
          <button className="bel-settings-outline-btn" type="button" onClick={() => openAddModal("designation")}>
            <FiPlus /> Add Designation
          </button>
        }
      />
      <div className="bel-settings-table-wrap">
        <table className="bel-settings-table">
          <thead><tr><th>Designation</th><th>Department</th><th>Level</th><th>Employees</th><th>Actions</th></tr></thead>
          <tbody>
            {designations.map((designation) => (
              <tr key={designation.id}>
                <td><strong>{designation.title}</strong></td>
                <td>{designation.department}</td>
                <td><span className="bel-settings-level">{designation.level}</span></td>
                <td>{designation.employees}</td>
                <td>
                  <div className="bel-settings-row-actions">
                    <button type="button" onClick={() => openAddModal("designation", designation)}><FiEdit3 /> Edit</button>
                    <button type="button" className="danger" onClick={() => deleteItem("designation", designation.id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderShifts = () => (
    <>
      <SectionHeading
        icon={FiClock}
        title="Shift Policies"
        description="Define working hours, grace periods, breaks and overnight shift behavior."
        action={
          <button className="bel-settings-outline-btn" type="button" onClick={() => openAddModal("shift")}>
            <FiPlus /> Add Shift
          </button>
        }
      />
      <div className="bel-settings-card-grid">
        {shifts.map((shift) => (
          <div className="bel-settings-policy-card" key={shift.id}>
            <div className="bel-settings-policy-top">
              <div>
                <h3>{shift.name}</h3>
                <p>{shift.start} - {shift.end}{shift.overnight ? " · Overnight" : ""}</p>
              </div>
              <button type="button" onClick={() => openAddModal("shift", shift)}><FiEdit3 /></button>
            </div>
            <div className="bel-settings-mini-grid">
              <div><span>Grace</span><strong>{shift.grace} min</strong></div>
              <div><span>Break</span><strong>{shift.break} min</strong></div>
              <div><span>Cross-day</span><strong>{shift.overnight ? "Yes" : "No"}</strong></div>
            </div>
            <div className="bel-settings-policy-footer">
              <span className="bel-settings-status active">Active</span>
              <button type="button" className="bel-settings-text-danger" onClick={() => deleteItem("shift", shift.id)}>
                <FiTrash2 /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderLeave = () => (
    <>
      <SectionHeading
        icon={FiCalendar}
        title="Leave Policies"
        description="Control leave approval, carry-forward, encashment and employee request rules."
      />
      <div className="bel-settings-card-grid">
        {[
          ["Casual Leave", 12, 4, 8, "33%", "Yes (max 5 days)"],
          ["Sick Leave", 12, 3, 9, "25%", "Yes (max 5 days)"],
          ["Earned Leave", 18, 6, 12, "33%", "Yes (max 5 days)"],
          ["Optional Leave", 3, 1, 2, "33%", "No"],
        ].map(([name, annual, used, remaining, utilization, carry], index) => (
          <div className="bel-settings-policy-card" key={name}>
            <div className="bel-settings-policy-top">
              <div><h3>{name}</h3><p>Annual leave allocation</p></div>
              <button type="button" onClick={() => notify(`${name} policy editor opened.`)}><FiEdit3 /></button>
            </div>
            <div className="bel-settings-mini-grid">
              <div><span>Annual</span><strong>{annual}</strong></div>
              <div><span>Used</span><strong>{used}</strong></div>
              <div><span>Remaining</span><strong>{remaining}</strong></div>
            </div>
            <div className="bel-settings-progress"><span style={{ width: utilization }} /></div>
            <div className="bel-settings-policy-meta"><span>Utilized {utilization}</span><span>Carry Forward: {carry}</span></div>
          </div>
        ))}
      </div>

      <div className="bel-settings-subheading">
        <h3>Global Leave Controls</h3>
        <span>Applied across employee leave workflows</span>
      </div>
      <div className="bel-settings-controls-grid">
        <div className="bel-settings-control-row"><div><strong>Manager → HR approval</strong><span>Route leave requests through manager and HR.</span></div><Toggle label="Leave approval" checked={leaveConfig.approval === "Manager → HR"} onChange={(value) => setLeaveConfig((c) => ({ ...c, approval: value ? "Manager → HR" : "HR Only" }))} /></div>
        <div className="bel-settings-control-row"><div><strong>Carry forward</strong><span>Allow unused eligible leave to move into the next year.</span></div><Toggle label="Carry forward" checked={leaveConfig.carryForward} onChange={(value) => setLeaveConfig((c) => ({ ...c, carryForward: value }))} /></div>
        <div className="bel-settings-control-row"><div><strong>Leave encashment</strong><span>Allow eligible earned leave to be encashed.</span></div><Toggle label="Leave encashment" checked={leaveConfig.encashment} onChange={(value) => setLeaveConfig((c) => ({ ...c, encashment: value }))} /></div>
        <div className="bel-settings-control-row"><div><strong>Half-day requests</strong><span>Employees can request half-day leave.</span></div><Toggle label="Half day" checked={leaveConfig.halfDay} onChange={(value) => setLeaveConfig((c) => ({ ...c, halfDay: value }))} /></div>
        <div className="bel-settings-control-row"><div><strong>Attachment for selected leave types</strong><span>Require supporting documents where configured.</span></div><Toggle label="Attachments" checked={leaveConfig.attachmentRequired} onChange={(value) => setLeaveConfig((c) => ({ ...c, attachmentRequired: value }))} /></div>
        <div className="bel-settings-control-row"><div><strong>Negative leave balance</strong><span>Allow employees to apply beyond their available balance.</span></div><Toggle label="Negative balance" checked={leaveConfig.negativeBalance} onChange={(value) => setLeaveConfig((c) => ({ ...c, negativeBalance: value }))} /></div>
      </div>
      <div className="bel-settings-save-row">
        <span><FiCheck /> Policy changes apply to new requests.</span>
        <button type="button" className="bel-settings-primary-btn" onClick={() => saveSection("Leave Policies")}><FiSave /> Save Policies</button>
      </div>
    </>
  );

  const renderPayroll = () => (
    <>
      <SectionHeading
        icon={FiDollarSign}
        title="Payroll Configuration"
        description="Configure payroll cycles, attendance inputs, statutory deductions and salary processing."
      />
      <div className="bel-settings-form-grid">
        <SelectField label="Pay Cycle" value={payrollConfig.payCycle} onChange={(v) => setPayrollConfig((c) => ({ ...c, payCycle: v }))}>
          <option>Monthly</option><option>Bi-weekly</option>
        </SelectField>
        <FormField label="Payroll Processing Day" type="number" value={payrollConfig.payrollDay} onChange={(v) => setPayrollConfig((c) => ({ ...c, payrollDay: v }))} />
        <FormField label="Salary Credit Day" type="number" value={payrollConfig.salaryDay} onChange={(v) => setPayrollConfig((c) => ({ ...c, salaryDay: v }))} />
        <FormField label="Standard Working Days" type="number" value={payrollConfig.workingDays} onChange={(v) => setPayrollConfig((c) => ({ ...c, workingDays: v }))} />
      </div>
      <div className="bel-settings-subheading"><h3>Salary Processing Rules</h3><span>Statutory and attendance-linked calculations</span></div>
      <div className="bel-settings-controls-grid">
        {[
          ["overtime", "Overtime calculation", "Calculate approved overtime in payroll."],
          ["pf", "Provident Fund (PF)", "Apply employee and employer PF contributions."],
          ["esi", "ESI contribution", "Apply eligible ESI deductions and contributions."],
          ["professionalTax", "Professional Tax", "Calculate state-wise professional tax."],
          ["tds", "TDS / Income Tax", "Apply configured income tax deductions."],
        ].map(([key, title, desc]) => (
          <div className="bel-settings-control-row" key={key}>
            <div><strong>{title}</strong><span>{desc}</span></div>
            <Toggle label={title} checked={payrollConfig[key]} onChange={(value) => setPayrollConfig((c) => ({ ...c, [key]: value }))} />
          </div>
        ))}
      </div>
      <div className="bel-settings-info-box"><FiAlertTriangle /><div><strong>Payroll lock period</strong><span>Once payroll is approved and processed, employee salary data should become read-only for that cycle.</span></div></div>
      <div className="bel-settings-save-row"><span><FiShield /> Payroll settings require HR administrator access.</span><button type="button" className="bel-settings-primary-btn" onClick={() => saveSection("Payroll")}><FiSave /> Save Configuration</button></div>
    </>
  );

  const renderTax = () => (
    <>
      <SectionHeading icon={FiFileText} title="Tax Configuration" description="Manage India payroll statutory settings and tax calculation defaults." />
      <div className="bel-settings-form-grid">
        <SelectField label="Default Income Tax Regime" value={taxConfig.regime} onChange={(v) => setTaxConfig((c) => ({ ...c, regime: v }))}>
          <option>New Tax Regime</option><option>Old Tax Regime</option>
        </SelectField>
        <FormField label="Employee PF (%)" value={taxConfig.pfEmployee} onChange={(v) => setTaxConfig((c) => ({ ...c, pfEmployee: v }))} />
        <FormField label="Employer PF (%)" value={taxConfig.pfEmployer} onChange={(v) => setTaxConfig((c) => ({ ...c, pfEmployer: v }))} />
        <FormField label="Employee ESI (%)" value={taxConfig.esiEmployee} onChange={(v) => setTaxConfig((c) => ({ ...c, esiEmployee: v }))} />
        <FormField label="Employer ESI (%)" value={taxConfig.esiEmployer} onChange={(v) => setTaxConfig((c) => ({ ...c, esiEmployer: v }))} />
      </div>
      <div className="bel-settings-controls-grid">
        <div className="bel-settings-control-row"><div><strong>Professional Tax</strong><span>Enable state-specific PT calculations.</span></div><Toggle label="Professional tax" checked={taxConfig.ptEnabled} onChange={(value) => setTaxConfig((c) => ({ ...c, ptEnabled: value }))} /></div>
        <div className="bel-settings-control-row"><div><strong>TDS</strong><span>Enable income-tax withholding during payroll.</span></div><Toggle label="TDS" checked={taxConfig.tdsEnabled} onChange={(value) => setTaxConfig((c) => ({ ...c, tdsEnabled: value }))} /></div>
      </div>
      <div className="bel-settings-info-box"><FiShield /><div><strong>Statutory compliance</strong><span>Rates should be reviewed whenever government rules change. Production calculations should come from a validated payroll service.</span></div></div>
      <div className="bel-settings-save-row"><span>Last reviewed: August 2026</span><button type="button" className="bel-settings-primary-btn" onClick={() => saveSection("Tax Configuration")}><FiSave /> Save Tax Settings</button></div>
    </>
  );

  const renderNotifications = () => (
    <>
      <SectionHeading icon={FiBell} title="Notification Preferences" description="Control HRMS alerts, delivery channels and notification categories." />
      <div className="bel-settings-notification-layout">
        <div className="bel-settings-preference-card">
          <div className="bel-settings-preference-header"><FiMail /><div><h3>Delivery Channels</h3><p>Choose how users receive HRMS notifications.</p></div></div>
          {[
            ["email", "Email notifications", "Send important events to employee and HR email addresses."],
            ["inApp", "In-app notifications", "Show notifications inside the HRMS notification center."],
            ["digest", "Daily HR digest", "Send a daily summary instead of individual low-priority alerts."],
          ].map(([key, title, desc]) => (
            <div className="bel-settings-control-row" key={key}>
              <div><strong>{title}</strong><span>{desc}</span></div>
              <Toggle label={title} checked={notificationConfig[key]} onChange={(value) => setNotificationConfig((c) => ({ ...c, [key]: value }))} />
            </div>
          ))}
          {notificationConfig.digest && (
            <FormField label="Daily Digest Time" type="time" value={notificationConfig.digestTime} onChange={(v) => setNotificationConfig((c) => ({ ...c, digestTime: v }))} />
          )}
        </div>
        <div className="bel-settings-preference-card">
          <div className="bel-settings-preference-header"><FiAlertTriangle /><div><h3>Alert Categories</h3><p>Enable notifications for business-critical events.</p></div></div>
          {[
            ["payroll", "Payroll", "Payroll processing, payslips and salary alerts."],
            ["attendance", "Attendance", "Late arrivals, regularization and anomalies."],
            ["leave", "Leave", "Leave submissions, approvals and policy alerts."],
            ["security", "Security", "Login, access and security events."],
          ].map(([key, title, desc]) => (
            <div className="bel-settings-control-row" key={key}>
              <div><strong>{title}</strong><span>{desc}</span></div>
              <Toggle label={title} checked={notificationConfig[key]} onChange={(value) => setNotificationConfig((c) => ({ ...c, [key]: value }))} />
            </div>
          ))}
        </div>
      </div>
      <div className="bel-settings-save-row"><span><FiCheck /> Notification preferences are saved at organization level.</span><button type="button" className="bel-settings-primary-btn" onClick={() => saveSection("Notifications")}><FiSave /> Save Preferences</button></div>
    </>
  );

  const renderEmail = () => (
    <>
      <SectionHeading
        icon={FiMail}
        title="Email Templates"
        description="Manage transactional HRMS emails used for onboarding, leave, attendance and payroll events."
        action={<button className="bel-settings-outline-btn" type="button" onClick={() => openAddModal("email")}><FiPlus /> New Template</button>}
      />
      <div className="bel-settings-table-wrap">
        <table className="bel-settings-table">
          <thead><tr><th>Template</th><th>Event</th><th>Channel</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {emailTemplates.map((template) => (
              <tr key={template.id}>
                <td><strong>{template.name}</strong></td>
                <td>{template.event}</td>
                <td>{template.channel}</td>
                <td><span className="bel-settings-status active">{template.status}</span></td>
                <td><div className="bel-settings-row-actions"><button type="button" onClick={() => openAddModal("email", template)}><FiEdit3 /> Edit</button><button type="button" className="danger" onClick={() => deleteItem("email", template.id)}><FiTrash2 /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bel-settings-info-box"><FiMail /><div><strong>Template variables</strong><span>Use variables such as employee name, joining date, leave dates and payroll period in the production email service.</span></div></div>
    </>
  );

  const renderSecurity = () => (
    <>
      <SectionHeading icon={FiShield} title="Security & Access" description="Configure authentication, sessions, login protection and security auditing." />
      <div className="bel-settings-security-banner"><div className="bel-settings-security-icon"><FiShield /></div><div><strong>Security posture: Strong</strong><span>MFA, audit logging and biometric verification are enabled.</span></div><span className="bel-settings-security-score">85 / 100</span></div>
      <div className="bel-settings-controls-grid">
        {[
          ["mfa", "Multi-factor authentication", "Require an additional verification factor for privileged users."],
          ["ipRestriction", "IP access restrictions", "Restrict admin access to approved corporate networks."],
          ["auditLogging", "Security audit logging", "Record administrative changes and authentication events."],
          ["biometricVerification", "Biometric verification", "Allow configured biometric devices to authenticate attendance events."],
        ].map(([key, title, desc]) => (
          <div className="bel-settings-control-row" key={key}><div><strong>{title}</strong><span>{desc}</span></div><Toggle label={title} checked={securityConfig[key]} onChange={(value) => setSecurityConfig((c) => ({ ...c, [key]: value }))} /></div>
        ))}
      </div>
      <div className="bel-settings-subheading"><h3>Authentication Rules</h3><span>Recommended enterprise security defaults</span></div>
      <div className="bel-settings-form-grid">
        <FormField label="Session Timeout (minutes)" type="number" value={securityConfig.sessionTimeout} onChange={(v) => setSecurityConfig((c) => ({ ...c, sessionTimeout: v }))} />
        <FormField label="Password Expiry (days)" type="number" value={securityConfig.passwordExpiry} onChange={(v) => setSecurityConfig((c) => ({ ...c, passwordExpiry: v }))} />
        <FormField label="Max Login Attempts" type="number" value={securityConfig.loginAttempts} onChange={(v) => setSecurityConfig((c) => ({ ...c, loginAttempts: v }))} />
      </div>
      <div className="bel-settings-danger-zone">
        <div><strong>Emergency access controls</strong><span>Use these controls only during an incident or controlled security review.</span></div>
        <button type="button" onClick={() => notify("Emergency access review started.")}><FiLock /> Review Emergency Access</button>
      </div>
      <div className="bel-settings-save-row"><span><FiShield /> Security changes are logged in Audit Logs.</span><button type="button" className="bel-settings-primary-btn" onClick={() => saveSection("Security")}><FiSave /> Save Security Settings</button></div>
    </>
  );

  const renderAudit = () => (
    <>
      <SectionHeading icon={FiActivity} title="Audit Logs" description="Review administrative configuration changes and security events." action={<button className="bel-settings-outline-btn" type="button" onClick={() => notify("Audit log export prepared.")}><FiArchive /> Export Logs</button>} />
      <div className="bel-settings-audit-summary">
        <div><strong>{auditLogs.length}</strong><span>Recent Events</span></div>
        <div><strong>{auditLogs.filter((item) => item.result === "Success").length}</strong><span>Successful</span></div>
        <div><strong>{auditLogs.filter((item) => item.result === "Blocked").length}</strong><span>Blocked</span></div>
      </div>
      <div className="bel-settings-table-wrap">
        <table className="bel-settings-table">
          <thead><tr><th>Event</th><th>User</th><th>Module</th><th>Time</th><th>Result</th></tr></thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id}>
                <td><strong>{log.action}</strong></td><td>{log.user}</td><td>{log.module}</td><td>{log.time}</td>
                <td><span className={`bel-settings-status ${log.result === "Success" ? "active" : "blocked"}`}>{log.result}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "company": return renderCompany();
      case "branches": return renderBranches();
      case "departments": return renderDepartments();
      case "designations": return renderDesignations();
      case "shifts": return renderShifts();
      case "leave": return renderLeave();
      case "payroll": return renderPayroll();
      case "tax": return renderTax();
      case "notifications": return renderNotifications();
      case "email": return renderEmail();
      case "security": return renderSecurity();
      case "audit": return renderAudit();
      default: return <EmptyOrNoop />;
    }
  };

  const filteredSections = SETTINGS_SECTIONS.filter((item) =>
    item.label.toLowerCase().includes(generalSearch.toLowerCase())
  );

  return (
    <HRLayout title="System Settings" breadcrumb="Settings">
      <div className="bel-settings-shell">
        <div className="bel-settings-topbar">
          <div>
            <h1>Settings</h1>
            <p>Configure your BELNOVA HRMS system preferences</p>
          </div>
          <div className="bel-settings-top-actions">
            <div className="bel-settings-global-search">
              <FiSearch />
              <input
                type="search"
                placeholder="Search settings..."
                value={generalSearch}
                onChange={(e) => setGeneralSearch(e.target.value)}
              />
            </div>
            <button type="button" className="bel-settings-primary-btn" onClick={() => saveSection(sectionTitles[activeSection])}>
              <FiSave /> Save
            </button>
          </div>
        </div>

        <div className="bel-settings-layout">
          <aside className="bel-settings-sidebar">
            <div className="bel-settings-sidebar-title">System Configuration</div>
            <nav>
              {filteredSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    type="button"
                    key={section.id}
                    className={`bel-settings-nav-item ${activeSection === section.id ? "active" : ""}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon />
                    <span>{section.label}</span>
                    {activeSection === section.id && <FiChevronDown className="bel-settings-nav-chevron" />}
                  </button>
                );
              })}
              {filteredSections.length === 0 && (
                <div className="bel-settings-no-results">No settings found.</div>
              )}
            </nav>
            <div className="bel-settings-sidebar-footer">
              <FiServer />
              <div><strong>HRMS System</strong><span>Version 2.6.0 · Production</span></div>
            </div>
          </aside>

          <main className="bel-settings-content">
            <div className="bel-settings-breadcrumb">
              <FiSliders />
              <span>Settings</span>
              <b>/</b>
              <strong>{activeSectionData?.label}</strong>
            </div>
            <section className="bel-settings-main-card">
              {renderSection()}
            </section>
          </main>
        </div>

        {showAddModal && (
          <div className="bel-settings-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
            <form className="bel-settings-modal" onSubmit={saveModalItem}>
              <div className="bel-settings-modal-header">
                <div><div className="bel-settings-modal-icon"><FiPlus /></div><div><h2>{editingItem ? "Edit" : "Add"} {modalType === "email" ? "Email Template" : modalType === "shift" ? "Shift Policy" : modalType}</h2><p>Enter the configuration details below.</p></div></div>
                <button type="button" onClick={closeModal}><FiX /></button>
              </div>

              <div className="bel-settings-modal-form">
                {modalType === "branch" && <>
                  <FormField label="Branch Name" value={modalForm.name || ""} onChange={(v) => setModalForm((c) => ({ ...c, name: v }))} />
                  <FormField label="City" value={modalForm.city || ""} onChange={(v) => setModalForm((c) => ({ ...c, city: v }))} />
                  <FormField label="Employees" type="number" value={modalForm.employees || 0} onChange={(v) => setModalForm((c) => ({ ...c, employees: v }))} />
                  <SelectField label="Status" value={modalForm.status || "Active"} onChange={(v) => setModalForm((c) => ({ ...c, status: v }))}><option>Active</option><option>Inactive</option></SelectField>
                </>}

                {modalType === "department" && <>
                  <FormField label="Department Name" value={modalForm.name || ""} onChange={(v) => setModalForm((c) => ({ ...c, name: v }))} />
                  <FormField label="Department Code" value={modalForm.code || ""} onChange={(v) => setModalForm((c) => ({ ...c, code: v.toUpperCase() }))} />
                  <FormField label="Department Head" value={modalForm.head || ""} onChange={(v) => setModalForm((c) => ({ ...c, head: v }))} />
                  <FormField label="Employees" type="number" value={modalForm.employees || 0} onChange={(v) => setModalForm((c) => ({ ...c, employees: v }))} />
                </>}

                {modalType === "designation" && <>
                  <FormField label="Designation" value={modalForm.title || ""} onChange={(v) => setModalForm((c) => ({ ...c, title: v }))} />
                  <SelectField label="Department" value={modalForm.department || "Engineering"} onChange={(v) => setModalForm((c) => ({ ...c, department: v }))}><option>Engineering</option><option>Human Resources</option><option>Finance</option><option>Product</option><option>Sales & Marketing</option></SelectField>
                  <SelectField label="Job Level" value={modalForm.level || "L2"} onChange={(v) => setModalForm((c) => ({ ...c, level: v }))}><option>L1</option><option>L2</option><option>L3</option><option>L4</option><option>L5</option><option>L6</option></SelectField>
                  <FormField label="Employees" type="number" value={modalForm.employees || 0} onChange={(v) => setModalForm((c) => ({ ...c, employees: v }))} />
                </>}

                {modalType === "shift" && <>
                  <FormField label="Shift Name" value={modalForm.name || ""} onChange={(v) => setModalForm((c) => ({ ...c, name: v }))} />
                  <FormField label="Start Time" type="time" value={modalForm.start || "09:00"} onChange={(v) => setModalForm((c) => ({ ...c, start: v }))} />
                  <FormField label="End Time" type="time" value={modalForm.end || "18:00"} onChange={(v) => setModalForm((c) => ({ ...c, end: v }))} />
                  <FormField label="Grace Period (mins)" type="number" value={modalForm.grace || 15} onChange={(v) => setModalForm((c) => ({ ...c, grace: v }))} />
                  <FormField label="Break Duration (mins)" type="number" value={modalForm.break || 60} onChange={(v) => setModalForm((c) => ({ ...c, break: v }))} />
                  <div className="bel-settings-modal-toggle"><span>Overnight / Cross-day Shift</span><Toggle label="Overnight shift" checked={Boolean(modalForm.overnight)} onChange={(v) => setModalForm((c) => ({ ...c, overnight: v }))} /></div>
                </>}

                {modalType === "email" && <>
                  <FormField label="Template Name" value={modalForm.name || ""} onChange={(v) => setModalForm((c) => ({ ...c, name: v }))} />
                  <FormField label="Trigger Event" value={modalForm.event || ""} onChange={(v) => setModalForm((c) => ({ ...c, event: v }))} />
                  <SelectField label="Channel" value={modalForm.channel || "Email"} onChange={(v) => setModalForm((c) => ({ ...c, channel: v }))}><option>Email</option><option>Email + In-app</option></SelectField>
                  <SelectField label="Status" value={modalForm.status || "Active"} onChange={(v) => setModalForm((c) => ({ ...c, status: v }))}><option>Active</option><option>Draft</option></SelectField>
                </>}
              </div>

              <div className="bel-settings-modal-actions">
                <button type="button" onClick={closeModal}>Cancel</button>
                <button type="submit" className="bel-settings-primary-btn"><FiCheck /> Save</button>
              </div>
            </form>
          </div>
        )}

        {toast && <div className="bel-settings-toast"><FiCheck /> {toast}</div>}
      </div>
    </HRLayout>
  );
}
