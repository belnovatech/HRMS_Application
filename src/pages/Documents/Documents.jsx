import "./Documents.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState, useRef } from "react";
import Header from "../../components/Header/Header";
import {
  FiUser,
  FiShield,
  FiFileText,
  FiDollarSign,
  FiUpload,
  FiEye,
  FiDownload,
  FiTrash2,
} from "react-icons/fi";

export default function Documents() {
  const fileInputRef = useRef(null);

  const [search] = useState("");

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Arjun_Mehta_Offer_Letter.pdf",
      details: "Contract • 248 KB",
      url: null,
    },
    {
      id: 2,
      name: "Q1_2025_Payroll_Report.xlsx",
      details: "Salary Doc • 1.2 MB",
      url: null,
    },
    {
      id: 3,
      name: "Priya_Sharma_PAN.pdf",
      details: "Legal Doc • 312 KB",
      url: null,
    },
  ]);

  const handleFiles = (files) => {
    const uploadedFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      details: `${(file.size / 1024).toFixed(1)} KB`,
      url: URL.createObjectURL(file),
    }));

    setDocuments((prev) => [...uploadedFiles, ...prev]);
  };

  const openFileExplorer = () => {
    fileInputRef.current.click();
  };

  const deleteFile = (id) => {
    setDocuments((prev) =>
      prev.filter((doc) => doc.id !== id)
    );
  };

  const viewFile = (doc) => {
    if (doc.url) {
      window.open(doc.url, "_blank");
    } else {
      alert("Preview unavailable for sample document");
    }
  };

  const downloadFile = (doc) => {
    if (!doc.url) {
      alert("Download unavailable for sample document");
      return;
    }

    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
<div className="docs-layout">
  <Sidebar />

<div className="docs-main">
  <Header
    title="Document Management"
    breadcrumb="Documents"
  />

  <div className="docs-content">




        {/* Stats */}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FiUser />
            </div>

            <div>
              <p>Total Documents</p>
              <h2>{documents.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <FiShield />
            </div>

            <div>
              <p>Legal Docs</p>
              <h2>12</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FiFileText />
            </div>

            <div>
              <p>Contracts</p>
              <h2>23</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <FiDollarSign />
            </div>

            <div>
              <p>Salary Docs</p>
              <h2>115</h2>
            </div>
          </div>
        </div>

        {/* Upload */}

        <div className="upload-card">
          <h3>Upload Documents</h3>

          <div
            className="upload-area"
            onClick={openFileExplorer}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            <FiUpload size={40} />

            <h4>Drag & Drop files here</h4>

            <p>Click to browse files</p>

            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>

        {/* Recent Documents */}

        <div className="recent-card">
          <div className="recent-header">
            <h3>Recent Documents</h3>
            <span>{filteredDocs.length} Files</span>
          </div>

          {filteredDocs.length === 0 ? (
            <p>No documents found.</p>
          ) : (
            filteredDocs.map((doc) => (
              <div className="doc-row" key={doc.id}>
                <div className="doc-left">
                  <div className="doc-icon">
                    <FiFileText />
                  </div>

                  <div>
                    <h4>{doc.name}</h4>
                    <p>{doc.details}</p>
                  </div>
                </div>

                <div className="doc-actions">
                  <FiEye
                    title="View"
                    onClick={() => viewFile(doc)}
                  />

                  <FiDownload
                    title="Download"
                    onClick={() => downloadFile(doc)}
                  />

                  <FiTrash2
                    title="Delete"
                    onClick={() => deleteFile(doc.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </div>
  );
}