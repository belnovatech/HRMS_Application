import React from "react";
import "./Documents.css";
import HRLayout from "../../../layouts/HRLayout";
import { FiFileText, FiDownload, FiUploadCloud } from "react-icons/fi";

export default function Documents() {
  const docList = [
    { title: "Employee Handbook 2026.pdf", category: "Company Policy", size: "2.4 MB", updated: "Jan 10, 2026" },
    { title: "Standard Employment Agreement.docx", category: "Templates", size: "1.1 MB", updated: "Feb 15, 2026" },
    { title: "Code of Conduct & Ethics.pdf", category: "Compliance", size: "850 KB", updated: "Mar 01, 2026" },
    { title: "Health Insurance Claim Form.pdf", category: "Benefits", size: "520 KB", updated: "Jun 12, 2026" },
  ];

  return (
    <HRLayout title="Company Documents" breadcrumb="Documents">
      <div className="hr-docs-page-container">
        <div className="hr-page-intro">
          <h2>Document Repository & Policy Templates</h2>
          <p>Manage official company policies, employment agreements, templates, and compliance files.</p>
        </div>

        <div className="hr-docs-toolbar">
          <button type="button" className="hr-btn-upload-doc">
            <FiUploadCloud /> Upload New Document
          </button>
        </div>

        <div className="hr-docs-grid">
          {docList.map((d) => (
            <div key={d.title} className="hr-doc-card">
              <div className="hr-doc-icon">
                <FiFileText />
              </div>
              <div className="hr-doc-details">
                <h3>{d.title}</h3>
                <span className="hr-doc-cat">{d.category}</span>
                <small>{d.size} • Updated {d.updated}</small>
              </div>
              <button type="button" className="hr-btn-doc-download">
                <FiDownload />
              </button>
            </div>
          ))}
        </div>
      </div>
    </HRLayout>
  );
}
