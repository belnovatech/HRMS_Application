import React, { useMemo, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiBriefcase,
  FiCreditCard,
  FiCopy,
  FiCheck,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import "./EmployeeProfile.css";

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [copiedField, setCopiedField] = useState("");

  /*
   * All profile values come from the currently logged-in user.
   * If a field is not available in AuthContext, "Not available"
   * is displayed instead of showing another employee's data.
   */
  const profile = useMemo(
    () => ({
      name: user?.name || "Employee",
      avatar: user?.avatar || "EM",
      avatarBg: user?.avatarBg || "#4f6df5",

      employeeId: user?.employeeId || "Not available",
      designation: user?.designation || "Not available",
      department: user?.department || "Not available",
      reportsTo: user?.reportsTo || "Not available",

      email: user?.email || "Not available",
      phone: user?.phone || "Not available",
      address: user?.address || "Not available",

      branch: user?.branch || user?.location || "Not available",
      workMode: user?.workMode || "Not available",

      joiningDate:
        user?.joiningDate ||
        user?.dateOfJoining ||
        user?.joinedDate ||
        "Not available",

      status: user?.status || "Active",

      bankAccount:
        user?.bankAccount ||
        user?.bankAccountNumber ||
        "Not available",

      bankName: user?.bankName || "Not available",
      ifsc: user?.ifsc || user?.ifscCode || "Not available",

      pan: user?.pan || user?.panNumber || "Not available",

      pfUan:
        user?.pfUan ||
        user?.pfUAN ||
        user?.uan ||
        user?.uanNumber ||
        "Not available",

      emergencyContact:
        user?.emergencyContact ||
        user?.emergencyPhone ||
        "Not available",

      emergencyName:
        user?.emergencyContactName ||
        user?.emergencyName ||
        "Not available",

      emergencyRelation:
        user?.emergencyRelation ||
        "Not available",
    }),
    [user]
  );

  const copyToClipboard = async (value, fieldName) => {
    if (!value || value === "Not available") return;

    try {
      await navigator.clipboard.writeText(String(value));

      setCopiedField(fieldName);

      setTimeout(() => {
        setCopiedField("");
      }, 1800);
    } catch (error) {
      console.error("Unable to copy value:", error);
    }
  };

  const renderCopyButton = (value, fieldName) => {
    if (!value || value === "Not available") {
      return null;
    }

    const isCopied = copiedField === fieldName;

    return (
      <button
        type="button"
        className={`emp-profile-copy-btn ${
          isCopied ? "emp-profile-copy-success" : ""
        }`}
        onClick={() => copyToClipboard(value, fieldName)}
        title={isCopied ? "Copied" : "Copy"}
        aria-label={isCopied ? "Copied" : `Copy ${fieldName}`}
      >
        {isCopied ? <FiCheck /> : <FiCopy />}
      </button>
    );
  };

  const formatJoiningDate = (dateValue) => {
    if (!dateValue || dateValue === "Not available") {
      return "Not available";
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
      return dateValue;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <EmployeeLayout title="My Profile" breadcrumb="My Profile">
      <div className="emp-profile-page">

        {/* =====================================================
            PROFILE HEADER
           ===================================================== */}
        <section className="emp-profile-header">
          <h1>My Profile</h1>
        </section>

        {/* =====================================================
            PROFILE SUMMARY CARD
            Designed to match the first screenshot
           ===================================================== */}
        <section className="emp-profile-summary-card">

          <div className="emp-profile-summary-top">

            <div
              className="emp-profile-avatar"
              style={{ background: profile.avatarBg }}
            >
              {profile.avatar}
            </div>

            <div className="emp-profile-main-info">

              <div className="emp-profile-name-row">
                <h2>{profile.name}</h2>

                <span className="emp-profile-active-badge">
                  {profile.status}
                </span>
              </div>

              <p className="emp-profile-designation">
                {profile.designation}
                <span className="emp-profile-separator">•</span>
                {profile.department}
              </p>

              <p className="emp-profile-id-line">
                {profile.employeeId}

                {profile.joiningDate !== "Not available" && (
                  <>
                    <span className="emp-profile-separator">•</span>
                    Joined {formatJoiningDate(profile.joiningDate)}
                  </>
                )}
              </p>

            </div>
          </div>

          {/* Profile information exactly in the compact style */}
          <div className="emp-profile-summary-details">

            <div className="emp-profile-summary-item">
              <span className="emp-profile-summary-label">
                <FiMail />
                Email
              </span>

              <div className="emp-profile-summary-value-row">
                <span>{profile.email}</span>
                {renderCopyButton(profile.email, "email")}
              </div>
            </div>

            <div className="emp-profile-summary-item">
              <span className="emp-profile-summary-label">
                <FiPhone />
                Phone
              </span>

              <div className="emp-profile-summary-value-row">
                <span>{profile.phone}</span>
                {renderCopyButton(profile.phone, "phone")}
              </div>
            </div>

            <div className="emp-profile-summary-item">
              <span className="emp-profile-summary-label">
                <FiBriefcase />
                Department
              </span>

              <span className="emp-profile-summary-value">
                {profile.department}
              </span>
            </div>

            <div className="emp-profile-summary-item">
              <span className="emp-profile-summary-label">
                <FiUser />
                Manager
              </span>

              <span className="emp-profile-summary-value">
                {profile.reportsTo}
              </span>
            </div>

            <div className="emp-profile-summary-item">
              <span className="emp-profile-summary-label">
                <FiMapPin />
                Branch
              </span>

              <span className="emp-profile-summary-value">
                {profile.branch}
              </span>
            </div>

            <div className="emp-profile-summary-item">
              <span className="emp-profile-summary-label">
                <FiCalendar />
                Work Mode
              </span>

              <span className="emp-profile-summary-value">
                {profile.workMode}
              </span>
            </div>

          </div>

          <div className="emp-profile-hr-note">
            Some information can only be updated by HR. Contact HR for changes.
          </div>
        </section>

        {/* =====================================================
            DETAILED INFORMATION
           ===================================================== */}
        <section className="emp-profile-details-section">

          <div className="emp-profile-tabs">

            <button
              type="button"
              className={`emp-profile-tab ${
                activeTab === "personal"
                  ? "emp-profile-tab-active"
                  : ""
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <FiUser />
              <span>Personal Info</span>
            </button>

            <button
              type="button"
              className={`emp-profile-tab ${
                activeTab === "job"
                  ? "emp-profile-tab-active"
                  : ""
              }`}
              onClick={() => setActiveTab("job")}
            >
              <FiBriefcase />
              <span>Job Details</span>
            </button>

            <button
              type="button"
              className={`emp-profile-tab ${
                activeTab === "bank"
                  ? "emp-profile-tab-active"
                  : ""
              }`}
              onClick={() => setActiveTab("bank")}
            >
              <FiCreditCard />
              <span>Bank &amp; Statutory</span>
            </button>

          </div>

          {/* ===================================================
              PERSONAL INFORMATION
             =================================================== */}
          {activeTab === "personal" && (
            <div className="emp-profile-tab-content">

              <div className="emp-profile-detail-grid">

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Full Name
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.name}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Email Address
                  </span>

                  <div className="emp-profile-detail-value emp-profile-copy-value">
                    <span>{profile.email}</span>
                    {renderCopyButton(profile.email, "detail-email")}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Phone Number
                  </span>

                  <div className="emp-profile-detail-value emp-profile-copy-value">
                    <span>{profile.phone}</span>
                    {renderCopyButton(profile.phone, "detail-phone")}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Residential Address
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.address}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Emergency Contact Name
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.emergencyName}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Emergency Contact
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.emergencyContact}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Relationship
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.emergencyRelation}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ===================================================
              JOB DETAILS
             =================================================== */}
          {activeTab === "job" && (
            <div className="emp-profile-tab-content">

              <div className="emp-profile-detail-grid">

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Employee ID
                  </span>

                  <div className="emp-profile-detail-value emp-profile-copy-value">
                    <span>{profile.employeeId}</span>
                    {renderCopyButton(
                      profile.employeeId,
                      "employee-id"
                    )}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Designation
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.designation}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Department
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.department}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Reporting Manager
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.reportsTo}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Branch
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.branch}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Work Mode
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.workMode}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Date of Joining
                  </span>

                  <div className="emp-profile-detail-value">
                    {formatJoiningDate(profile.joiningDate)}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Employment Status
                  </span>

                  <div className="emp-profile-detail-value">
                    <span className="emp-profile-detail-status">
                      {profile.status}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ===================================================
              BANK & STATUTORY
             =================================================== */}
          {activeTab === "bank" && (
            <div className="emp-profile-tab-content">

              <div className="emp-profile-detail-grid">

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Bank Account Number
                  </span>

                  <div className="emp-profile-detail-value emp-profile-copy-value">
                    <span>{profile.bankAccount}</span>
                    {renderCopyButton(
                      profile.bankAccount,
                      "bank-account"
                    )}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    Bank Name
                  </span>

                  <div className="emp-profile-detail-value">
                    {profile.bankName}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    IFSC Code
                  </span>

                  <div className="emp-profile-detail-value emp-profile-copy-value">
                    <span>{profile.ifsc}</span>
                    {renderCopyButton(profile.ifsc, "ifsc")}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    PAN Number
                  </span>

                  <div className="emp-profile-detail-value emp-profile-copy-value">
                    <span>{profile.pan}</span>
                    {renderCopyButton(profile.pan, "pan")}
                  </div>
                </div>

                <div className="emp-profile-detail-item">
                  <span className="emp-profile-detail-label">
                    PF UAN Number
                  </span>

                  <div className="emp-profile-detail-value emp-profile-copy-value">
                    <span>{profile.pfUan}</span>
                    {renderCopyButton(profile.pfUan, "pf-uan")}
                  </div>
                </div>

              </div>

              <div className="emp-profile-sensitive-note">
                Bank and statutory information is displayed based on the
                authenticated employee profile. Contact HR if any information
                needs to be corrected.
              </div>

            </div>
          )}

        </section>
      </div>
    </EmployeeLayout>
  );
}