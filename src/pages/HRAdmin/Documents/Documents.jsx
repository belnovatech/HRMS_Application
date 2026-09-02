import React, { useMemo, useRef, useState } from "react";
import "./Documents.css";
import HRLayout from "../../../layouts/HRLayout";
import { useAuth } from "../../../context/AuthContext";
import { downloadReportPdf } from "../../../utils/pdfGenerator";
import {
  FiFileText,
  FiDownload,
  FiUploadCloud,
  FiEye,
  FiSearch,
  FiX,
  FiCheck,
  FiClock,
  FiFolder,
  FiTrash2,
} from "react-icons/fi";

const DOCUMENT_CATEGORIES = [
  "All",
  "Identity",
  "Employment",
  "Education",
  "Legal",
  "Salary",
  "Other",
];

const EMPLOYEES = [
  { id: "All", name: "All Employees" },
  { id: "EMP1001", name: "Rahul Kumar" },
  { id: "EMP1002", name: "Priya Sharma" },
  { id: "EMP1003", name: "Arjun Reddy" },
  { id: "EMP1004", name: "Sneha Rao" },
  { id: "EMP1005", name: "Vikram Singh" },
  { id: "EMP1006", name: "Meena Pillai" },
];

function downloadDocument(documentItem) {
  downloadReportPdf(
    documentItem.title,
    documentItem.category,
    ["Document Metadata Field", "Value"],
    [
      ["Employee Name", documentItem.employee],
      ["Employee ID", documentItem.employeeId],
      ["Document Title", documentItem.title],
      ["Category", documentItem.category],
      ["File Name", documentItem.fileName],
      ["File Size", documentItem.size],
      ["Upload Date", documentItem.uploaded],
      ["Verification Status", documentItem.status]
    ],
    documentItem.fileName ? documentItem.fileName.replace(/\.txt$/, ".pdf") : `${documentItem.title.replace(/\s+/g, "_")}.pdf`
  );
}

function downloadEmployeeDocuments(employeeName, documents) {
  const rows = [
    [
      "Document ID",
      "Employee ID",
      "Employee",
      "Category",
      "Document",
      "Type",
      "Size",
      "Uploaded",
      "Status",
    ],
    ...documents.map((item) => [
      item.id,
      item.employeeId,
      item.employee,
      item.category,
      item.title,
      item.type,
      item.size,
      item.uploaded,
      item.status,
    ]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${employeeName.replace(/\s+/g, "-")}-documents.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function Documents() {
  const { documentsList = [], verifyEmployeeDocument, addEmployeeDocument } = useAuth();

  const documents = useMemo(() => {
    return documentsList.map((d) => ({
      id: d.id,
      employeeId: d.employeeId || "EMP001",
      employee: d.employee || "Employee",
      category: d.category || "General",
      title: d.title || d.name,
      fileName: d.fileName || `${d.title}.pdf`,
      type: d.fileName?.split(".").pop()?.toUpperCase() || "PDF",
      size: d.size || "1.5 MB",
      uploaded: d.uploaded || d.uploadDate || "2026-09-01",
      status: d.status || "Pending",
    }));
  }, [documentsList]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState("");
  const [uploadData, setUploadData] = useState({
    employeeId: "EMP1001",
    category: "Identity",
    documentName: "",
    file: null,
  });
  const fileInputRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__belDocumentToastTimer);
    window.__belDocumentToastTimer = window.setTimeout(() => {
      setToast("");
    }, 2600);
  };

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return documents.filter((documentItem) => {
      const matchesSearch =
        !normalizedSearch ||
        documentItem.title.toLowerCase().includes(normalizedSearch) ||
        documentItem.employee.toLowerCase().includes(normalizedSearch) ||
        documentItem.employeeId.toLowerCase().includes(normalizedSearch) ||
        documentItem.fileName.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "All" || documentItem.category === categoryFilter;

      const matchesEmployee =
        employeeFilter === "All" ||
        documentItem.employeeId === employeeFilter;

      const matchesStatus =
        statusFilter === "All" || documentItem.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesEmployee &&
        matchesStatus
      );
    });
  }, [
    documents,
    searchTerm,
    categoryFilter,
    employeeFilter,
    statusFilter,
  ]);

  const categoryCounts = useMemo(() => {
    return DOCUMENT_CATEGORIES.reduce((accumulator, category) => {
      accumulator[category] =
        category === "All"
          ? documents.length
          : documents.filter((item) => item.category === category).length;
      return accumulator;
    }, {});
  }, [documents]);

  const activeFilterCount = [
    categoryFilter !== "All",
    employeeFilter !== "All",
    statusFilter !== "All",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setEmployeeFilter("All");
    setStatusFilter("All");
    setShowFilters(false);
    showToast("Document filters cleared.");
  };

  const verifyDocument = (documentId) => {
    verifyEmployeeDocument(documentId, "Verified");

    setSelectedDocument((current) =>
      current?.id === documentId ? { ...current, status: "Verified" } : current
    );

    showToast("Document verified successfully.");
  };

  const removeDocument = (documentId) => {
    const documentItem = documents.find((item) => item.id === documentId);

    if (!documentItem) return;

    const confirmed = window.confirm(
      `Remove "${documentItem.title}" from the document repository?`
    );

    if (!confirmed) return;

    setSelectedDocument(null);
    showToast("Document removed from the repository.");
  };

  const handleUpload = (event) => {
    event.preventDefault();

    if (!uploadData.documentName.trim()) {
      showToast("Enter a document name.");
      return;
    }

    const employee = EMPLOYEES.find(
      (item) => item.id === uploadData.employeeId
    );

    addEmployeeDocument({
      title: `${uploadData.documentName.trim()} — ${employee?.name || "Employee"}`,
      category: uploadData.category,
      fileName: uploadData.file?.name || `${uploadData.documentName.trim().replace(/\s+/g, "-")}.pdf`,
      size: uploadData.file ? `${(uploadData.file.size / (1024 * 1024)).toFixed(1)} MB` : "0.5 MB",
    });

    setUploadData({
      employeeId: "EMP1001",
      category: "Identity",
      documentName: "",
      file: null,
    });
    setShowUpload(false);
    showToast("Document uploaded and added for verification.");
  };

  const clearSelectedEmployee = () => {
    setEmployeeFilter("All");
    showToast("Showing documents for all employees.");
  };

  return (
    <HRLayout title="Document Management" breadcrumb="Documents">
      <div className="bel-documents-page">
        <header className="bel-documents-header">
          <div>
            <h1>Document Management</h1>
            <p>Manage and verify employee documents</p>
          </div>

          <button
            type="button"
            className="bel-documents-upload-button"
            onClick={() => setShowUpload(true)}
          >
            <FiUploadCloud />
            Upload Document
          </button>
        </header>

        <section className="bel-documents-category-grid">
          {DOCUMENT_CATEGORIES.slice(1).map((category) => (
            <button
              type="button"
              className={`bel-documents-category-card ${
                categoryFilter === category ? "is-selected" : ""
              }`}
              key={category}
              onClick={() =>
                setCategoryFilter(
                  categoryFilter === category ? "All" : category
                )
              }
            >
              <FiFolder />
              <strong>{category}</strong>
              <span>{categoryCounts[category] || 0} docs</span>
            </button>
          ))}
        </section>

        <section className="bel-documents-toolbar">
          <div className="bel-documents-search">
            <FiSearch />
            <input
              type="search"
              placeholder="Search documents or employees..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="bel-documents-toolbar-controls">
            <select
              className="bel-documents-employee-select"
              value={employeeFilter}
              onChange={(event) => setEmployeeFilter(event.target.value)}
              aria-label="Filter by employee"
            >
              {EMPLOYEES.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={`bel-documents-more-filter ${
                showFilters ? "is-active" : ""
              }`}
              onClick={() => setShowFilters((value) => !value)}
            >
              Filters
              {activeFilterCount > 0 && (
                <span>{activeFilterCount}</span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="bel-documents-filter-panel">
              <div className="bel-documents-filter-heading">
                <div>
                  <strong>Document Filters</strong>
                  <small>Filter the HR document repository.</small>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  aria-label="Close filters"
                >
                  <FiX />
                </button>
              </div>

              <label>
                Employee
                <select
                  value={employeeFilter}
                  onChange={(event) => setEmployeeFilter(event.target.value)}
                >
                  {EMPLOYEES.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Document Category
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label>
                Verification Status
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option>All</option>
                  <option>Verified</option>
                  <option>Pending</option>
                </select>
              </label>

              <div className="bel-documents-filter-actions">
                <button type="button" onClick={resetFilters}>
                  Clear
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={() => setShowFilters(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </section>

        {employeeFilter !== "All" && (
          <div className="bel-documents-employee-context">
            <div>
              <strong>
                {EMPLOYEES.find((item) => item.id === employeeFilter)?.name}
              </strong>
              <span>
                {filteredDocuments.length} document
                {filteredDocuments.length === 1 ? "" : "s"} found
              </span>
            </div>
            <div>
              <button
                type="button"
                onClick={() =>
                  downloadEmployeeDocuments(
                    EMPLOYEES.find((item) => item.id === employeeFilter)
                      ?.name || "Employee",
                    filteredDocuments
                  )
                }
              >
                <FiDownload />
                Download Employee Documents
              </button>
              <button type="button" onClick={clearSelectedEmployee}>
                <FiX />
              </button>
            </div>
          </div>
        )}

        <section className="bel-documents-grid">
          {filteredDocuments.map((documentItem) => (
            <article className="bel-document-card" key={documentItem.id}>
              <div className="bel-document-card-top">
                <div className="bel-document-file-type">
                  {documentItem.type}
                </div>

                <span
                  className={`bel-document-status ${
                    documentItem.status === "Verified"
                      ? "is-verified"
                      : "is-pending"
                  }`}
                >
                  {documentItem.status === "Verified" ? (
                    <FiCheck />
                  ) : (
                    <FiClock />
                  )}
                  {documentItem.status}
                </span>
              </div>

              <div className="bel-document-card-body">
                <h2>{documentItem.title}</h2>
                <p>
                  {documentItem.category} · {documentItem.size}
                </p>
                <span>Uploaded {documentItem.uploaded}</span>
              </div>

              <div className="bel-document-card-actions">
                <button
                  type="button"
                  className="bel-document-secondary-action"
                  onClick={() => setSelectedDocument(documentItem)}
                >
                  <FiEye />
                  View
                </button>

                <button
                  type="button"
                  className="bel-document-secondary-action"
                  onClick={() => {
                    downloadDocument(documentItem);
                    showToast(`${documentItem.title} downloaded.`);
                  }}
                >
                  <FiDownload />
                  Download
                </button>

                {documentItem.status === "Pending" && (
                  <button
                    type="button"
                    className="bel-document-verify-action"
                    onClick={() => verifyDocument(documentItem.id)}
                  >
                    <FiCheck />
                    Verify
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>

        {filteredDocuments.length === 0 && (
          <div className="bel-documents-empty">
            <FiFileText />
            <strong>No documents found</strong>
            <span>
              Try another employee, category, status, or search term.
            </span>
            <button type="button" onClick={resetFilters}>
              Clear Filters
            </button>
          </div>
        )}

        <div className="bel-documents-summary">
          Showing <strong>{filteredDocuments.length}</strong> of{" "}
          <strong>{documents.length}</strong> documents
        </div>

        {selectedDocument && (
          <div
            className="bel-documents-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedDocument(null);
              }
            }}
          >
            <div className="bel-documents-view-modal">
              <div className="bel-documents-modal-header">
                <div>
                  <span className="bel-documents-modal-type">
                    {selectedDocument.type}
                  </span>
                  <div>
                    <h2>{selectedDocument.title}</h2>
                    <p>{selectedDocument.fileName}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDocument(null)}
                  aria-label="Close document"
                >
                  <FiX />
                </button>
              </div>

              <div className="bel-documents-preview">
                <FiFileText />
                <strong>Document Preview</strong>
                <span>
                  HR Admin can review the employee document metadata and
                  verification state from this repository.
                </span>
              </div>

              <div className="bel-documents-metadata">
                <div>
                  <span>Employee</span>
                  <strong>{selectedDocument.employee}</strong>
                </div>
                <div>
                  <span>Employee ID</span>
                  <strong>{selectedDocument.employeeId}</strong>
                </div>
                <div>
                  <span>Category</span>
                  <strong>{selectedDocument.category}</strong>
                </div>
                <div>
                  <span>Uploaded</span>
                  <strong>{selectedDocument.uploaded}</strong>
                </div>
                <div>
                  <span>File Size</span>
                  <strong>{selectedDocument.size}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{selectedDocument.status}</strong>
                </div>
              </div>

              <div className="bel-documents-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    downloadDocument(selectedDocument);
                    showToast("Document downloaded.");
                  }}
                >
                  <FiDownload />
                  Download
                </button>

                {selectedDocument.status === "Pending" && (
                  <button
                    type="button"
                    className="primary"
                    onClick={() => verifyDocument(selectedDocument.id)}
                  >
                    <FiCheck />
                    Verify Document
                  </button>
                )}

                <button
                  type="button"
                  className="danger"
                  onClick={() => removeDocument(selectedDocument.id)}
                >
                  <FiTrash2 />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {showUpload && (
          <div
            className="bel-documents-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowUpload(false);
              }
            }}
          >
            <form
              className="bel-documents-upload-modal"
              onSubmit={handleUpload}
            >
              <div className="bel-documents-modal-header">
                <div>
                  <h2>Upload Employee Document</h2>
                  <p>Add a document to the HR repository for verification.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  aria-label="Close upload dialog"
                >
                  <FiX />
                </button>
              </div>

              <label>
                Employee
                <select
                  value={uploadData.employeeId}
                  onChange={(event) =>
                    setUploadData((current) => ({
                      ...current,
                      employeeId: event.target.value,
                    }))
                  }
                >
                  {EMPLOYEES.filter((item) => item.id !== "All").map(
                    (employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.id})
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                Document Category
                <select
                  value={uploadData.category}
                  onChange={(event) =>
                    setUploadData((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                >
                  {DOCUMENT_CATEGORIES.slice(1).map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label>
                Document Name
                <input
                  type="text"
                  placeholder="e.g. Experience Certificate"
                  value={uploadData.documentName}
                  onChange={(event) =>
                    setUploadData((current) => ({
                      ...current,
                      documentName: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="bel-documents-file-picker">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    setUploadData((current) => ({
                      ...current,
                      file: event.target.files?.[0] || null,
                    }))
                  }
                />
                <FiUploadCloud />
                <strong>
                  {uploadData.file
                    ? uploadData.file.name
                    : "Choose document file"}
                </strong>
                <span>PDF, DOC, DOCX, JPG or PNG</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </button>
              </div>

              <div className="bel-documents-upload-note">
                <FiClock />
                Newly uploaded documents are marked <strong>Pending</strong>{" "}
                until an HR administrator verifies them.
              </div>

              <div className="bel-documents-modal-actions">
                <button type="button" onClick={() => setShowUpload(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  <FiUploadCloud />
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        )}

        {toast && (
          <div className="bel-documents-toast">
            <FiCheck />
            {toast}
          </div>
        )}
      </div>
    </HRLayout>
  );
}
