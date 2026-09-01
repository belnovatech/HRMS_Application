import React, { useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { FiFileText, FiUpload, FiDownload } from "react-icons/fi";

export default function EmployeeDocuments() {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Employment Offer Letter.pdf", category: "Official", uploadDate: "2023-01-15", size: "1.2 MB" },
    { id: 2, name: "Government ID Proof (Aadhaar).pdf", category: "Personal ID", uploadDate: "2023-01-16", size: "850 KB" },
    { id: 3, name: "Form 16 Tax Certificate 2025-26.pdf", category: "Tax & Statutory", uploadDate: "2026-05-20", size: "2.4 MB" },
  ]);
  const [showUpload, setShowUpload] = useState(false);
  const [docName, setDocName] = useState("");
  const [docCat, setDocCat] = useState("Personal ID");

  const handleUpload = (e) => {
    e.preventDefault();
    if (docName) {
      setDocuments([
        ...documents,
        {
          id: Date.now(),
          name: docName.endsWith(".pdf") ? docName : `${docName}.pdf`,
          category: docCat,
          uploadDate: new Date().toISOString().split("T")[0],
          size: "1.0 MB",
        },
      ]);
      setShowUpload(false);
      setDocName("");
    }
  };

  return (
    <EmployeeLayout title="Documents" breadcrumb="Documents">
      <div className="page-header-block" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Employee Document Vault</h2>
          <p>Access company letters, ID records, tax forms, and upload new certificates.</p>
        </div>
        <button className="login-btn" style={{ width: "auto", padding: "0.7rem 1.25rem" }} onClick={() => setShowUpload(true)}>
          <FiUpload /> Upload New Document
        </button>
      </div>

      <div className="enterprise-card">
        <div className="table-responsive-wrapper">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>DOCUMENT NAME</th>
                <th>CATEGORY</th>
                <th>UPLOAD DATE</th>
                <th>FILE SIZE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <FiFileText size={20} color="#2563eb" />
                      <strong>{doc.name}</strong>
                    </div>
                  </td>
                  <td><span className="leave-type-tag">{doc.category}</span></td>
                  <td>{doc.uploadDate}</td>
                  <td>{doc.size}</td>
                  <td><span className="badge badge-present">Verified</span></td>
                  <td>
                    <button className="text-btn" onClick={() => alert(`Downloading ${doc.name}...`)}>
                      <FiDownload /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Personal Document</h3>
              <button className="modal-close" onClick={() => setShowUpload(false)}>✕</button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="modal-body">
                <label className="input-label">Document Title / Name</label>
                <div className="input-box" style={{ background: "#f8fafc" }}>
                  <input
                    type="text"
                    placeholder="e.g. Degree Certificate"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    required
                  />
                </div>

                <label className="input-label">Category</label>
                <select
                  value={docCat}
                  onChange={(e) => setDocCat(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "1rem" }}
                >
                  <option value="Personal ID">Personal ID</option>
                  <option value="Educational Certificate">Educational Certificate</option>
                  <option value="Medical Certificate">Medical Certificate</option>
                  <option value="Tax Document">Tax Document</option>
                </select>

                <div style={{ border: "2px dashed #cbd5e1", borderRadius: "10px", padding: "1.5rem", textAlign: "center", background: "#f8fafc" }}>
                  <FiUpload size={32} color="#94a3b8" />
                  <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>Click to select PDF or image file (Max 5MB)</p>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button type="button" className="view-payslip-btn" style={{ width: "auto" }} onClick={() => setShowUpload(false)}>Cancel</button>
                <button type="submit" className="login-btn" style={{ width: "auto", padding: "0.65rem 1.25rem" }}>Upload File</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
}
