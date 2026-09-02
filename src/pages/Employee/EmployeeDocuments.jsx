import React, { useMemo, useRef, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import { downloadReportPdf } from "../../utils/pdfGenerator";
import {
  FiFolder,
  FiUpload,
  FiDownload,
  FiEye,
  FiX,
  FiFileText,
  FiImage,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";
import "./EmployeeDocuments.css";

const CATEGORY_CONFIG = [
  { key: "Identity", label: "Identity" },
  { key: "Employment", label: "Employment" },
  { key: "Education", label: "Education" },
  { key: "Legal", label: "Legal" },
  { key: "Salary", label: "Salary" },
  { key: "Other", label: "Other" },
];

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";

  const mb = bytes / (1024 * 1024);

  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export default function EmployeeDocuments() {
  const { user, documentsList = [], addEmployeeDocument } = useAuth();
  const fileInputRef = useRef(null);

  const empId = user?.employeeId || "EMP001";

  const documents = useMemo(() => {
    return documentsList
      .filter((d) => !d.employeeId || d.employeeId === empId || d.employee === user?.name)
      .map((d) => ({
        id: d.id,
        name: d.title || d.name,
        category: d.category,
        fileName: d.fileName,
        type: d.fileName?.split(".").pop()?.toUpperCase() || "PDF",
        size: d.size || "1.5 MB",
        uploadDate: d.uploaded || d.uploadDate || "2026-09-01",
        status: d.status || "Pending",
      }));
  }, [documentsList, empId, user]);

  const [showUpload, setShowUpload] =
    useState(false);

  const [selectedDocument, setSelectedDocument] =
    useState(null);

  const [searchText, setSearchText] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [docTitle, setDocTitle] =
    useState("");

  const [docCategory, setDocCategory] =
    useState("Identity");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [uploadError, setUploadError] =
    useState("");

  const [isDragging, setIsDragging] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const userName = "Rahul Kumar";

  const categoryCounts = useMemo(() => {
    return CATEGORY_CONFIG.reduce(
      (counts, category) => {
        counts[category.key] =
          documents.filter(
            (doc) =>
              doc.category === category.key
          ).length;

        return counts;
      },
      {
        Identity: 0,
        Employment: 0,
        Education: 0,
        Legal: 0,
        Salary: 0,
        Other: 0,
      }
    );
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const search = searchText
      .trim()
      .toLowerCase();

    return documents.filter((doc) => {
      const matchesSearch =
        !search ||
        doc.name.toLowerCase().includes(search) ||
        doc.category.toLowerCase().includes(search) ||
        doc.fileName.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        doc.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [
    documents,
    searchText,
    selectedCategory,
  ]);

  const resetUploadForm = () => {
    setDocTitle("");
    setDocCategory("Identity");
    setSelectedFile(null);
    setUploadError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openUpload = () => {
    resetUploadForm();
    setShowSuccess(false);
    setShowUpload(true);
  };

  const closeUpload = () => {
    setShowUpload(false);
    setShowSuccess(false);
    resetUploadForm();
  };

  const processSelectedFile = (file) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setUploadError(
        "File size must be 5 MB or less."
      );
      setSelectedFile(null);
      return;
    }

    const allowedExtensions = [
      "pdf",
      "png",
      "jpg",
      "jpeg",
      "doc",
      "docx",
      "xls",
      "xlsx",
    ];

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "";

    if (
      !allowedExtensions.includes(extension)
    ) {
      setUploadError(
        "Please select PDF, image, Word, or Excel files."
      );
      setSelectedFile(null);
      return;
    }

    setUploadError("");
    setSelectedFile(file);

    if (!docTitle.trim()) {
      const titleWithoutExtension =
        file.name.replace(/\.[^/.]+$/, "");

      setDocTitle(titleWithoutExtension);
    }
  };

  const handleFileChange = (event) => {
    processSelectedFile(
      event.target.files?.[0]
    );
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    processSelectedFile(
      event.dataTransfer.files?.[0]
    );
  };

  const handleUpload = (event) => {
    event.preventDefault();
    setUploadError("");

    if (!docTitle.trim()) {
      setUploadError(
        "Please enter a document title."
      );
      return;
    }

    if (!selectedFile) {
      setUploadError(
        "Please select a file to upload."
      );
      return;
    }

    addEmployeeDocument({
      title: docTitle.trim(),
      category: docCategory,
      fileName: selectedFile.name,
      size: formatFileSize(selectedFile.size),
    });

    setShowSuccess(true);
  };

  const handleDownload = (documentItem) => {
    if (documentItem.file) {
      const objectUrl = URL.createObjectURL(
        documentItem.file
      );

      const anchor =
        document.createElement("a");

      anchor.href = objectUrl;
      anchor.download =
        documentItem.fileName ||
        documentItem.name;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(objectUrl);
      return;
    }

    downloadReportPdf(
      documentItem.name,
      documentItem.category,
      ["Document Field", "Information Details"],
      [
        ["Document Name", documentItem.name],
        ["Document Category", documentItem.category],
        ["Document Type", documentItem.type],
        ["Verification Status", documentItem.status],
        ["Upload Date", documentItem.uploadDate]
      ],
      documentItem.fileName || `${documentItem.name.replace(/\s+/g, "_")}.pdf`
    );
  };

  const getFileIcon = (type) => {
    const imageTypes = ["JPG", "JPEG", "PNG"];

    if (imageTypes.includes(type)) {
      return <FiImage />;
    }

    return <FiFileText />;
  };

  return (
    <EmployeeLayout
      title="Documents"
      breadcrumb="Documents"
    >
      <div className="emp-docs-page">

        {/* =====================================================
            HEADER
           ===================================================== */}
        <section className="emp-docs-header">
          <div>
            <h1>Document Management</h1>
            <p>
              Manage and verify employee documents
            </p>
          </div>

          <button
            type="button"
            className="emp-docs-upload-button"
            onClick={openUpload}
          >
            <FiUpload />
            Upload Document
          </button>
        </section>


        {/* =====================================================
            CATEGORY CARDS
           ===================================================== */}
        <section className="emp-docs-category-grid">
          {CATEGORY_CONFIG.map((category) => (
            <button
              type="button"
              key={category.key}
              className={`emp-docs-category-card ${
                selectedCategory === category.key
                  ? "emp-docs-category-active"
                  : ""
              }`}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.key
                    ? "All"
                    : category.key
                )
              }
            >
              <FiFolder />

              <strong>
                {category.label}
              </strong>

              <span>
                {categoryCounts[category.key]}{" "}
                {categoryCounts[category.key] === 1
                  ? "doc"
                  : "docs"}
              </span>
            </button>
          ))}
        </section>


        {/* =====================================================
            SEARCH / FILTER
           ===================================================== */}
        <section className="emp-docs-filter-bar">

          <div className="emp-docs-search-box">
            <FiSearch />

            <input
              type="search"
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
              placeholder="Search documents or employees..."
            />
          </div>

          <div className="emp-docs-filter-select">
            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
            >
              <option value="All">All</option>

              {CATEGORY_CONFIG.map(
                (category) => (
                  <option
                    key={category.key}
                    value={category.key}
                  >
                    {category.label}
                  </option>
                )
              )}
            </select>

            <FiChevronDown />
          </div>

        </section>


        {/* =====================================================
            DOCUMENT GRID
           ===================================================== */}
        <section className="emp-docs-grid">

          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((documentItem) => (
              <article
                className="emp-docs-document-card"
                key={documentItem.id}
              >

                <div className="emp-docs-card-top">

                  <div className="emp-docs-file-type">
                    {getFileIcon(
                      documentItem.type
                    )}

                    <span>
                      {documentItem.type}
                    </span>
                  </div>

                  <span
                    className={`emp-docs-status emp-docs-status-${String(
                      documentItem.status
                    )
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {documentItem.status ===
                    "Verified" ? (
                      <FiCheckCircle />
                    ) : documentItem.status ===
                      "Pending" ? (
                      <FiClock />
                    ) : (
                      <FiAlertCircle />
                    )}

                    {documentItem.status}
                  </span>

                </div>


                <div className="emp-docs-card-content">

                  <h3>
                    {documentItem.name}
                  </h3>

                  <p>
                    {documentItem.category}
                    {" · "}
                    {documentItem.size}
                  </p>

                  <span className="emp-docs-uploaded-date">
                    Uploaded{" "}
                    {formatDate(
                      documentItem.uploadDate
                    )}
                  </span>

                </div>


                <div className="emp-docs-card-actions">

                  <button
                    type="button"
                    className="emp-docs-view-button"
                    onClick={() =>
                      setSelectedDocument(
                        documentItem
                      )
                    }
                  >
                    <FiEye />
                    View
                  </button>

                  <button
                    type="button"
                    className="emp-docs-download-button"
                    onClick={() =>
                      handleDownload(
                        documentItem
                      )
                    }
                  >
                    <FiDownload />
                    Download
                  </button>

                  {documentItem.status ===
                    "Pending" && (
                    <span className="emp-docs-pending-note">
                      Awaiting HR
                    </span>
                  )}

                </div>

              </article>
            ))
          ) : (
            <div className="emp-docs-empty-state">
              <FiFileText />

              <strong>
                No documents found
              </strong>

              <span>
                Try another search or category.
              </span>
            </div>
          )}

        </section>


        {/* =====================================================
            UPLOAD MODAL
           ===================================================== */}
        {showUpload && (
          <div
            className="emp-docs-modal-overlay"
            onClick={closeUpload}
          >
            <div
              className="emp-docs-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {!showSuccess ? (
                <>
                  <div className="emp-docs-modal-header">

                    <div>
                      <span className="emp-docs-modal-kicker">
                        DOCUMENT VAULT
                      </span>

                      <h2>
                        Upload Document
                      </h2>

                      <p>
                        Add a document to your
                        employee records.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="emp-docs-modal-close"
                      onClick={closeUpload}
                      aria-label="Close"
                    >
                      <FiX />
                    </button>

                  </div>


                  <form
                    className="emp-docs-upload-form"
                    onSubmit={handleUpload}
                  >

                    <div className="emp-docs-form-field">
                      <label htmlFor="emp-doc-title">
                        Document Title
                      </label>

                      <input
                        id="emp-doc-title"
                        type="text"
                        value={docTitle}
                        onChange={(event) =>
                          setDocTitle(
                            event.target.value
                          )
                        }
                        placeholder="e.g. Degree Certificate"
                        required
                      />
                    </div>


                    <div className="emp-docs-form-field">
                      <label htmlFor="emp-doc-category">
                        Category
                      </label>

                      <select
                        id="emp-doc-category"
                        value={docCategory}
                        onChange={(event) =>
                          setDocCategory(
                            event.target.value
                          )
                        }
                      >
                        {CATEGORY_CONFIG.map(
                          (category) => (
                            <option
                              key={category.key}
                              value={category.key}
                            >
                              {category.label}
                            </option>
                          )
                        )}
                      </select>
                    </div>


                    <div
                      className={`emp-docs-drop-zone ${
                        isDragging
                          ? "emp-docs-drop-zone-active"
                          : ""
                      } ${
                        selectedFile
                          ? "emp-docs-drop-zone-selected"
                          : ""
                      }`}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() =>
                        setIsDragging(false)
                      }
                      onDrop={handleDrop}
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          fileInputRef.current?.click();
                        }
                      }}
                    >

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileChange}
                        hidden
                      />

                      <div className="emp-docs-drop-icon">
                        {selectedFile ? (
                          <FiCheckCircle />
                        ) : (
                          <FiUpload />
                        )}
                      </div>

                      {selectedFile ? (
                        <>
                          <strong>
                            {selectedFile.name}
                          </strong>

                          <span>
                            {formatFileSize(
                              selectedFile.size
                            )}{" "}
                            · Click to replace
                          </span>
                        </>
                      ) : (
                        <>
                          <strong>
                            Click to select a file
                          </strong>

                          <span>
                            or drag and drop here
                          </span>

                          <small>
                            PDF, JPG, PNG, DOC, DOCX,
                            XLS or XLSX · Max 5MB
                          </small>
                        </>
                      )}

                    </div>


                    {uploadError && (
                      <div className="emp-docs-upload-error">
                        <FiAlertCircle />
                        {uploadError}
                      </div>
                    )}


                    <div className="emp-docs-modal-actions">

                      <button
                        type="button"
                        className="emp-docs-cancel-button"
                        onClick={closeUpload}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="emp-docs-submit-button"
                      >
                        <FiUpload />
                        Upload File
                      </button>

                    </div>

                  </form>
                </>
              ) : (
                <div className="emp-docs-success">

                  <div className="emp-docs-success-icon">
                    <FiCheckCircle />
                  </div>

                  <h2>
                    Document Uploaded
                  </h2>

                  <p>
                    Your document was added
                    successfully and is now
                    marked as Pending for HR
                    verification.
                  </p>

                  <button
                    type="button"
                    className="emp-docs-submit-button"
                    onClick={closeUpload}
                  >
                    Done
                  </button>

                </div>
              )}

            </div>
          </div>
        )}


        {/* =====================================================
            DOCUMENT DETAILS MODAL
           ===================================================== */}
        {selectedDocument && (
          <div
            className="emp-docs-modal-overlay"
            onClick={() =>
              setSelectedDocument(null)
            }
          >
            <div
              className="emp-docs-details-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="emp-docs-modal-header">

                <div>
                  <span className="emp-docs-modal-kicker">
                    DOCUMENT DETAILS
                  </span>

                  <h2>
                    {selectedDocument.name}
                  </h2>
                </div>

                <button
                  type="button"
                  className="emp-docs-modal-close"
                  onClick={() =>
                    setSelectedDocument(null)
                  }
                  aria-label="Close"
                >
                  <FiX />
                </button>

              </div>


              <div className="emp-docs-details-body">

                <div className="emp-docs-details-file">
                  <div className="emp-docs-details-file-icon">
                    {getFileIcon(
                      selectedDocument.type
                    )}
                  </div>

                  <div>
                    <strong>
                      {selectedDocument.fileName}
                    </strong>

                    <span>
                      {selectedDocument.type} ·{" "}
                      {selectedDocument.size}
                    </span>
                  </div>
                </div>


                <div className="emp-docs-details-grid">

                  <div>
                    <span>Category</span>
                    <strong>
                      {selectedDocument.category}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>
                      {selectedDocument.status}
                    </strong>
                  </div>

                  <div>
                    <span>Uploaded On</span>
                    <strong>
                      {formatDate(
                        selectedDocument.uploadDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Employee</span>
                    <strong>
                      {userName}
                    </strong>
                  </div>

                </div>


                <button
                  type="button"
                  className="emp-docs-details-download"
                  onClick={() =>
                    handleDownload(
                      selectedDocument
                    )
                  }
                >
                  <FiDownload />
                  Download Document
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}
