import React from "react";
import "./HelpSupport.css";
import HRLayout from "../../../layouts/HRLayout";
import { FiBookOpen, FiMail } from "react-icons/fi";

export default function HelpSupport() {
  const faqs = [
    { q: "How do I add a new employee to the system?", a: "Navigate to Employees -> click 'Add Employee' button -> fill in employee details and save." },
    { q: "How do I approve or reject leave applications?", a: "Go to Leave Management or Pending Approvals on Dashboard -> click Approve or Reject button." },
    { q: "How do I sync biometric device attendance?", a: "Go to Biometric Sync from the sidebar -> click 'Trigger Full Sync Now'." },
  ];

  return (
    <HRLayout title="Help & Support" breadcrumb="HelpSupport">
      <div className="hr-help-page-container">
        <div className="hr-page-intro">
          <h2>Knowledge Base & HR Support Center</h2>
          <p>Find answers to common HR portal questions or reach out to technical support.</p>
        </div>

        <div className="hr-help-grid">
          <div className="hr-help-card">
            <h3><FiBookOpen /> Frequently Asked Questions</h3>
            <div className="hr-faq-list">
              {faqs.map((f) => (
                <div key={f.q} className="hr-faq-item">
                  <strong>{f.q}</strong>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hr-help-card">
            <h3><FiMail /> Contact Support Desk</h3>
            <p>If you encounter technical issues or system bugs, contact our support team:</p>
            <div className="hr-support-contact-box">
              <p><strong>Email:</strong> support@belnova.com</p>
              <p><strong>Hotline:</strong> 1800-123-4567 (Mon-Fri 9AM-6PM)</p>
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
