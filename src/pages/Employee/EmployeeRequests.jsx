import React, { useMemo, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiFileText,
  FiCalendar,
  FiChevronDown,
  FiSend,
} from "react-icons/fi";
import "./EmployeeRequests.css";

const STATIC_REQUESTS = [
  {
    id: "REQ-2041",
    type: "Attendance Correction",
    details: "Attendance correction request",
    date: "2026-09-01",
    status: "Pending",
  },
  {
    id: "REQ-2038",
    type: "Leave Request",
    details: "Leave request",
    date: "2026-08-28",
    status: "Approved",
  },
  {
    id: "REQ-2030",
    type: "Profile Update",
    details: "Profile information update",
    date: "2026-08-20",
    status: "Resolved",
  },
  {
    id: "REQ-2024",
    type: "Document Verification",
    details: "Document verification request",
    date: "2026-08-15",
    status: "In Progress",
  },
];

const formatRequestDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getRequestStatusClass = (status) => {
  const normalized = String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  if (normalized === "approved" || normalized === "resolved") {
    return "emp-request-status-success";
  }

  if (normalized === "pending") {
    return "emp-request-status-pending";
  }

  if (normalized === "rejected" || normalized === "cancelled") {
    return "emp-request-status-danger";
  }

  return "emp-request-status-progress";
};

export default function EmployeeRequests() {
  const { leaveRequests = [], user } = useAuth();

  const [createdRequests, setCreatedRequests] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const [requestType, setRequestType] = useState(
    "Attendance Correction"
  );
  const [requestDetails, setRequestDetails] = useState("");

  /*
   * Leave requests already coming from AuthContext are converted
   * into the same structure used by this page.
   */
  const leaveBasedRequests = useMemo(
    () =>
      leaveRequests.map((leave, index) => ({
        id: leave.id || `REQ-LEAVE-${index + 1}`,
        type: "Leave Request",
        details:
          leave.reason ||
          `${leave.leaveType || "Leave"} (${leave.startDate || "—"} to ${
            leave.endDate || "—"
          })`,
        date: leave.appliedOn || leave.startDate || "",
        status: leave.status || "Pending",
      })),
    [leaveRequests]
  );

  /*
   * Keep static demo records, AuthContext leave records,
   * and requests created from this page together.
   */
  const allRequests = useMemo(() => {
    const combined = [
      ...createdRequests,
      ...leaveBasedRequests,
      ...STATIC_REQUESTS,
    ];

    const uniqueRequests = [];
    const seen = new Set();

    combined.forEach((request) => {
      if (!seen.has(request.id)) {
        seen.add(request.id);
        uniqueRequests.push(request);
      }
    });

    return uniqueRequests;
  }, [createdRequests, leaveBasedRequests]);

  const requestTypes = useMemo(() => {
    return [
      "All",
      ...new Set(allRequests.map((request) => request.type)),
    ];
  }, [allRequests]);

  const filteredRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return allRequests.filter((request) => {
      const matchesSearch =
        !query ||
        request.id.toLowerCase().includes(query) ||
        request.type.toLowerCase().includes(query) ||
        request.details.toLowerCase().includes(query) ||
        request.status.toLowerCase().includes(query);

      const matchesType =
        selectedType === "All" ||
        request.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [allRequests, searchTerm, selectedType]);

  const pendingCount = allRequests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedCount = allRequests.filter(
    (request) =>
      request.status === "Approved" ||
      request.status === "Resolved"
  ).length;

  const handleOpenRequest = () => {
    setRequestType("Attendance Correction");
    setRequestDetails("");
    setShowRequestModal(true);
  };

  const handleCloseRequest = () => {
    setShowRequestModal(false);
    setRequestDetails("");
  };

  const handleSubmitRequest = (event) => {
    event.preventDefault();

    const trimmedDetails = requestDetails.trim();

    if (!trimmedDetails) {
      return;
    }

    const today = new Date();

    const newRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      type: requestType,
      details: trimmedDetails,
      date: today.toISOString().split("T")[0],
      status: "Pending",
      employeeId: user?.employeeId || "EMP001",
    };

    /*
     * New request is immediately added to the employee's request list.
     * Status starts as Pending until HR/Manager processes it.
     */
    setCreatedRequests((previous) => [
      newRequest,
      ...previous,
    ]);

    handleCloseRequest();
  };

  return (
    <EmployeeLayout
      title="My Requests"
      breadcrumb="My Requests"
    >
      <div className="emp-requests-page">

        {/* PAGE HEADER */}
        <section className="emp-requests-header">
          <div className="emp-requests-header-copy">
            <span className="emp-requests-eyebrow">
              EMPLOYEE SERVICES
            </span>

            <h1>My Requests</h1>

            <p>
              Submit requests and track their progress from
              one place.
            </p>
          </div>

          <button
            type="button"
            className="emp-requests-new-btn"
            onClick={handleOpenRequest}
          >
            <FiPlus />
            <span>New Request</span>
          </button>
        </section>


        {/* SUMMARY */}
        <section className="emp-requests-summary">

          <div className="emp-requests-summary-card">
            <div className="emp-requests-summary-icon emp-requests-icon-blue">
              <FiFileText />
            </div>
            <div>
              <span>Total Requests</span>
              <strong>{allRequests.length}</strong>
            </div>
          </div>

          <div className="emp-requests-summary-card">
            <div className="emp-requests-summary-icon emp-requests-icon-yellow">
              <FiCalendar />
            </div>
            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="emp-requests-summary-card">
            <div className="emp-requests-summary-icon emp-requests-icon-green">
              <FiSend />
            </div>
            <div>
              <span>Completed</span>
              <strong>{approvedCount}</strong>
            </div>
          </div>

        </section>


        {/* REQUEST HISTORY */}
        <section className="emp-requests-panel">

          <div className="emp-requests-panel-header">
            <div>
              <span className="emp-requests-section-label">
                REQUEST TRACKER
              </span>
              <h2>Request History</h2>
              <p>
                Review all requests submitted through the
                employee portal.
              </p>
            </div>

            <span className="emp-requests-count">
              {filteredRequests.length} requests
            </span>
          </div>


          {/* SEARCH / FILTER */}
          <div className="emp-requests-toolbar">

            <div className="emp-requests-search">
              <FiSearch />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search by ID, type, details or status..."
              />
            </div>

            <div className="emp-requests-filter">
              <select
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(event.target.value)
                }
              >
                {requestTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "All"
                      ? "All Request Types"
                      : type}
                  </option>
                ))}
              </select>
              <FiChevronDown />
            </div>

          </div>


          {/* DESKTOP TABLE */}
          <div className="emp-requests-table-wrapper">
            <table className="emp-requests-table">
              <thead>
                <tr>
                  <th>REQUEST ID</th>
                  <th>REQUEST TYPE</th>
                  <th>DETAILS / SUMMARY</th>
                  <th>SUBMITTED DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <span className="emp-requests-id">
                        {request.id}
                      </span>
                    </td>

                    <td>
                      <span className="emp-requests-type">
                        {request.type}
                      </span>
                    </td>

                    <td>
                      <span className="emp-requests-details">
                        {request.details}
                      </span>
                    </td>

                    <td>
                      <span className="emp-requests-date">
                        {formatRequestDate(request.date)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`emp-requests-status ${getRequestStatusClass(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* MOBILE REQUEST CARDS */}
          <div className="emp-requests-mobile-list">
            {filteredRequests.map((request) => (
              <article
                className="emp-requests-mobile-card"
                key={`mobile-${request.id}`}
              >
                <div className="emp-requests-mobile-top">
                  <span className="emp-requests-id">
                    {request.id}
                  </span>

                  <span
                    className={`emp-requests-status ${getRequestStatusClass(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>

                <h3>{request.type}</h3>

                <p>{request.details}</p>

                <div className="emp-requests-mobile-date">
                  <FiCalendar />
                  {formatRequestDate(request.date)}
                </div>
              </article>
            ))}
          </div>


          {filteredRequests.length === 0 && (
            <div className="emp-requests-empty">
              <div className="emp-requests-empty-icon">
                <FiSearch />
              </div>

              <h3>No requests found</h3>

              <p>
                Try changing your search or filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        </section>
      </div>


      {/* NEW REQUEST MODAL */}
      {showRequestModal && (
        <div
          className="emp-requests-modal-overlay"
          onClick={handleCloseRequest}
        >
          <div
            className="emp-requests-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="emp-requests-modal-header">
              <div>
                <span>EMPLOYEE SERVICES</span>
                <h2>Create New Request</h2>
                <p>
                  Submit a request to HR or your manager.
                </p>
              </div>

              <button
                type="button"
                className="emp-requests-modal-close"
                onClick={handleCloseRequest}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>


            <form onSubmit={handleSubmitRequest}>

              <div className="emp-requests-modal-body">

                <div className="emp-requests-form-group">
                  <label htmlFor="employee-request-type">
                    Request Type
                  </label>

                  <div className="emp-requests-select-wrap">
                    <select
                      id="employee-request-type"
                      value={requestType}
                      onChange={(event) =>
                        setRequestType(event.target.value)
                      }
                    >
                      <option>
                        Attendance Correction
                      </option>
                      <option>Leave Request</option>
                      <option>Profile Update</option>
                      <option>Document Verification</option>
                      <option>Payroll Query</option>
                      <option>Other Request</option>
                    </select>
                    <FiChevronDown />
                  </div>
                </div>


                <div className="emp-requests-form-group">
                  <label htmlFor="employee-request-details">
                    Request Details
                  </label>

                  <textarea
                    id="employee-request-details"
                    rows={5}
                    value={requestDetails}
                    onChange={(event) =>
                      setRequestDetails(event.target.value)
                    }
                    placeholder="Describe your request clearly..."
                    required
                  />

                  <small>
                    Please provide enough information for HR or
                    your manager to process the request.
                  </small>
                </div>

              </div>


              <div className="emp-requests-modal-footer">

                <button
                  type="button"
                  className="emp-requests-cancel-btn"
                  onClick={handleCloseRequest}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="emp-requests-submit-btn"
                >
                  <FiSend />
                  Submit Request
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
}
