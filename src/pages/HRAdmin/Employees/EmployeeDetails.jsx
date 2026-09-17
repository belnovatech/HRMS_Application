import React, { useState, useEffect } from "react";
import "./EmployeeDetails.css";
import HRLayout from "../../../layouts/HRLayout";
import api from "../../../api/axiosInstance";
import {
  FiArrowLeft,
  FiEdit2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiFileText,
  FiShield
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [employee, setEmployee] = useState({
    id: id || "EMP-1001",
    name: "Loading...",
    email: "—",
    phone: "+91 98765 43210",
    department: "Engineering",
    role: "Employee",
    status: "Active",
    joinDate: "—",
    ctc: "—",
    location: "Bangalore HQ",
    dob: "1994-08-12",
    gender: "Male",
    bank: "HDFC Bank",
    account: "50100098765432"
  });

  useEffect(() => {
    let active = true;
    async function fetchDetails() {
      try {
        setLoading(true);
        const [empRes, accRes, salRes] = await Promise.allSettled([
          api.get(`/Employees/${id}`),
          api.get("/Accounts"),
          api.get(`/Payroll/salary/${id}`)
        ]);

        const empData = empRes.status === "fulfilled" ? empRes.value.data : null;
        const accList = accRes.status === "fulfilled" && Array.isArray(accRes.value.data) ? accRes.value.data : [];
        const account = accList.find((a) => a.id === id || a.employeeNumber === id);
        const salData = salRes.status === "fulfilled" ? salRes.value.data : null;

        if (active) {
          const empNum = empData?.employeeNumber || account?.employeeNumber || id;
          const fullName = empData?.firstName
            ? `${empData.firstName} ${empData.lastName || ""}`.trim()
            : (account?.name || account?.username || "Employee");
          const email = empData?.email || account?.email || "—";
          const dept = account?.department || "Engineering";
          const role = account?.designation || account?.role || "Staff";
          const status = empData?.status !== undefined ? (typeof empData.status === "number" ? (empData.status === 0 ? "Active" : empData.status === 1 ? "On Leave" : "Inactive") : String(empData.status)) : "Active";
          const joinDate = empData?.createdAtUtc ? new Date(empData.createdAtUtc).toISOString().split("T")[0] : "2024-01-01";
          const ctcVal = salData?.basic ? `₹${(salData.basic + (salData.allowances || 0)).toLocaleString("en-IN")} / year` : "₹12,00,000 / year";

          setEmployee({
            id: empNum,
            name: fullName,
            email,
            phone: "+91 98765 43210",
            department: dept,
            role,
            status,
            joinDate,
            ctc: ctcVal,
            location: "Bangalore HQ",
            dob: "1994-08-12",
            gender: "Male",
            bank: "HDFC Bank",
            account: "50100098765432"
          });
        }
      } catch (err) {
        if (active) setError("Could not fetch employee details.");
      } finally {
        if (active) setLoading(false);
      }
    }
    if (id) fetchDetails();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <HRLayout title="Employee Details" breadcrumb={`Employees / ${id}`}>
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          Loading employee details...
        </div>
      </HRLayout>
    );
  }

  const initials = (employee.name || "U")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return (
    <HRLayout title={`Employee Details - ${employee.name}`} breadcrumb={`Employees / ${employee.id}`}>
      <div className="hradmin-emp-detail-page">
        {error && (
          <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {/* Navigation Toolbar */}
        <div className="hradmin-emp-detail-toolbar">
          <button
            type="button"
            className="hradmin-emp-btn-back"
            onClick={() => navigate("/hr/employees")}
          >
            <FiArrowLeft /> Back to Employees
          </button>

          <button
            type="button"
            className="hradmin-emp-btn-edit-profile"
            onClick={() => navigate(`/hr/employees/${id}/edit`)}
          >
            <FiEdit2 /> Edit Profile
          </button>
        </div>

        {/* Hero Card Banner */}
        <div className="hradmin-emp-detail-hero-card">
          <div className="hradmin-emp-detail-hero-top">
            <div className="hradmin-emp-detail-avatar">
              {initials || "EM"}
            </div>

            <div className="hradmin-emp-detail-hero-info">
              <div className="hradmin-emp-detail-name-row">
                <h2>{employee.name}</h2>
                <span className={`hradmin-emp-status-badge ${employee.status.toLowerCase().replace(" ", "-")}`}>
                  {employee.status}
                </span>
              </div>
              <p className="hradmin-emp-detail-role-text">
                {employee.role} • <strong>{employee.department}</strong>
              </p>
              <span className="hradmin-emp-detail-id-text">ID: {employee.id}</span>
            </div>
          </div>

          <div className="hradmin-emp-detail-meta-grid">
            <div className="meta-item">
              <FiMail />
              <div>
                <span className="meta-label">Email</span>
                <span className="meta-val">{employee.email}</span>
              </div>
            </div>

            <div className="meta-item">
              <FiPhone />
              <div>
                <span className="meta-label">Phone</span>
                <span className="meta-val">{employee.phone}</span>
              </div>
            </div>

            <div className="meta-item">
              <FiCalendar />
              <div>
                <span className="meta-label">Joining Date</span>
                <span className="meta-val">{employee.joinDate}</span>
              </div>
            </div>

            <div className="meta-item">
              <FiMapPin />
              <div>
                <span className="meta-label">Work Location</span>
                <span className="meta-val">{employee.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Content Card with Tabs */}
        <div className="hradmin-emp-detail-content-card">
          <div className="hradmin-emp-detail-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <FiUser /> Overview
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "employment" ? "active" : ""}`}
              onClick={() => setActiveTab("employment")}
            >
              <FiBriefcase /> Employment
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "compensation" ? "active" : ""}`}
              onClick={() => setActiveTab("compensation")}
            >
              <FiDollarSign /> Compensation
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "documents" ? "active" : ""}`}
              onClick={() => setActiveTab("documents")}
            >
              <FiFileText /> Documents
            </button>
          </div>

          <div className="hradmin-emp-detail-tab-body">
            {activeTab === "overview" && (
              <div className="hradmin-emp-info-grid">
                <div className="info-block">
                  <span className="label">Full Name</span>
                  <span className="value">{employee.name}</span>
                </div>
                <div className="info-block">
                  <span className="label">Date of Birth</span>
                  <span className="value">{employee.dob}</span>
                </div>
                <div className="info-block">
                  <span className="label">Gender</span>
                  <span className="value">{employee.gender}</span>
                </div>
                <div className="info-block">
                  <span className="label">Work Email</span>
                  <span className="value">{employee.email}</span>
                </div>
                <div className="info-block">
                  <span className="label">Mobile Number</span>
                  <span className="value">{employee.phone}</span>
                </div>
              </div>
            )}

            {activeTab === "employment" && (
              <div className="hradmin-emp-info-grid">
                <div className="info-block">
                  <span className="label">Employee ID</span>
                  <span className="value">{employee.id}</span>
                </div>
                <div className="info-block">
                  <span className="label">Department</span>
                  <span className="value">{employee.department}</span>
                </div>
                <div className="info-block">
                  <span className="label">Designation / Role</span>
                  <span className="value">{employee.role}</span>
                </div>
                <div className="info-block">
                  <span className="label">Joining Date</span>
                  <span className="value">{employee.joinDate}</span>
                </div>
                <div className="info-block">
                  <span className="label">Work Location</span>
                  <span className="value">{employee.location}</span>
                </div>
              </div>
            )}

            {activeTab === "compensation" && (
              <div className="hradmin-emp-info-grid">
                <div className="info-block">
                  <span className="label">Annual Base CTC</span>
                  <span className="value">{employee.ctc}</span>
                </div>
                <div className="info-block">
                  <span className="label">Bank Name</span>
                  <span className="value">{employee.bank}</span>
                </div>
                <div className="info-block">
                  <span className="label">Account Number</span>
                  <span className="value">{employee.account}</span>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="hradmin-emp-docs-list">
                <div className="doc-item">
                  <FiFileText className="doc-icon" />
                  <div>
                    <strong>Employment Agreement.pdf</strong>
                    <small>Signed on {employee.joinDate}</small>
                  </div>
                </div>
                <div className="doc-item">
                  <FiShield className="doc-icon" />
                  <div>
                    <strong>Identity Verification (Aadhaar/PAN).pdf</strong>
                    <small>Verified</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
