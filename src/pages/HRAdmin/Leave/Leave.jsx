import React, { useMemo, useState } from "react";
import "./Leave.css";
import HRLayout from "../../../layouts/HRLayout";
import { useAuth } from "../../../context/AuthContext";
import {
  FiCheck,
  FiChevronDown,
  FiDownload,
  FiEdit2,
  FiEye,
  FiFilter,
  FiX,
} from "react-icons/fi";

const INITIAL_POLICIES = [
  {
    id: "casual",
    name: "Casual Leave",
    annual: 12,
    used: 4,
    remaining: 8,
    carryForward: "Yes (max 5 days)",
    encashment: "Enabled",
    approval: "Manager → HR",
  },
  {
    id: "sick",
    name: "Sick Leave",
    annual: 12,
    used: 3,
    remaining: 9,
    carryForward: "Yes (max 5 days)",
    encashment: "Enabled",
    approval: "Manager → HR",
  },
  {
    id: "earned",
    name: "Earned Leave",
    annual: 18,
    used: 6,
    remaining: 12,
    carryForward: "Yes (max 5 days)",
    encashment: "Enabled",
    approval: "Manager → HR",
  },
  {
    id: "optional",
    name: "Optional Leave",
    annual: 3,
    used: 1,
    remaining: 2,
    carryForward: "Yes (max 5 days)",
    encashment: "Enabled",
    approval: "Manager → HR",
  },
];

const INITIAL_BALANCES = [
  {
    id: "EMP1001",
    employee: "Rahul Kumar",
    initials: "RK",
    casual: 8,
    sick: 9,
    earned: 12,
    optional: 2,
  },
  {
    id: "EMP1002",
    employee: "Priya Sharma",
    initials: "PS",
    casual: 6,
    sick: 4,
    earned: 12,
    optional: 2,
  },
  {
    id: "EMP1003",
    employee: "Arjun Reddy",
    initials: "AR",
    casual: 10,
    sick: 11,
    earned: 15,
    optional: 3,
  },
  {
    id: "EMP1004",
    employee: "Sneha Rao",
    initials: "SR",
    casual: 7,
    sick: 8,
    earned: 10,
    optional: 1,
  },
  {
    id: "EMP1005",
    employee: "Vikram Singh",
    initials: "VS",
    casual: 12,
    sick: 12,
    earned: 18,
    optional: 3,
  },
];

const FILTER_OPTIONS = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
];

const TYPE_OPTIONS = [
  "All Leave Types",
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Optional Leave",
];

function LeaveStatus({ status }) {
  return (
    <span
      className={`bel-leave-status bel-leave-status--${status.toLowerCase()}`}
    >
      <i />
      {status}
    </span>
  );
}

function EmployeeAvatar({ initials, index = 0 }) {
  const colors = ["red", "gold", "green", "cyan", "indigo", "purple"];
  return (
    <span className={`bel-leave-avatar bel-leave-avatar--${colors[index % colors.length]}`}>
      {initials}
    </span>
  );
}

function StatCard({ value, label, tone }) {
  return (
    <div className="bel-leave-stat-card">
      <strong>{value}</strong>
      <span className={`bel-leave-stat-label bel-leave-stat-label--${tone}`}>
        <i />
        {label}
      </span>
    </div>
  );
}

export default function Leave() {
  const { leaveRequests = [], handleApproveLeave, handleRejectLeave } = useAuth();
  const [activeTab, setActiveTab] = useState("requests");
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [balances] = useState(INITIAL_BALANCES);

  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Leave Types");
  const [search, setSearch] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const [modal, setModal] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const normalizedRequests = useMemo(() => {
    return leaveRequests.map((req) => ({
      id: req.id,
      employeeId: req.employeeId || "EMP001",
      employee: req.employeeName || req.employee || "Employee",
      department: req.department || "Engineering",
      initials: req.initials || "EM",
      type: req.leaveType || req.type || "Casual Leave",
      from: req.startDate || req.from || "—",
      to: req.endDate || req.to || "—",
      days: parseInt(req.duration) || req.days || 1,
      reason: req.reason || "—",
      applied: req.appliedOn || req.applied || "Today",
      status: req.status || "Pending",
    }));
  }, [leaveRequests]);

  const filteredRequests = useMemo(() => {
    const term = search.trim().toLowerCase();

    return normalizedRequests.filter((request) => {
      const matchesSearch =
        !term ||
        request.employee.toLowerCase().includes(term) ||
        request.employeeId.toLowerCase().includes(term) ||
        request.id.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      const matchesType =
        typeFilter === "All Leave Types" || request.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [normalizedRequests, search, statusFilter, typeFilter]);

  const pendingCount = normalizedRequests.filter((item) => item.status === "Pending").length;
  const approvedCount = normalizedRequests.filter((item) => item.status === "Approved").length;
  const rejectedCount = normalizedRequests.filter((item) => item.status === "Rejected").length;

  const closeModal = () => {
    setModal(null);
    setSelectedRequest(null);
    setSelectedPolicy(null);
  };

  const approveRequest = (id) => handleApproveLeave(id);
  const rejectRequest = (id) => handleRejectLeave(id, "Rejected by HR");

  const exportRequests = () => {
    const header = [
      "Request ID",
      "Employee ID",
      "Employee",
      "Department",
      "Leave Type",
      "From",
      "To",
      "Days",
      "Reason",
      "Applied",
      "Status",
    ];

    const rows = filteredRequests.map((request) => [
      request.id,
      request.employeeId,
      request.employee,
      request.department,
      request.type,
      request.from,
      request.to,
      request.days,
      request.reason,
      request.applied,
      request.status,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "leave-requests.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportBalances = () => {
    const header = [
      "Employee ID",
      "Employee",
      "Casual Leave",
      "Sick Leave",
      "Earned Leave",
      "Optional Leave",
      "Total Available",
    ];

    const rows = balances.map((employee) => {
      const total =
        employee.casual +
        employee.sick +
        employee.earned +
        employee.optional;

      return [
        employee.id,
        employee.employee,
        `${employee.casual} days`,
        `${employee.sick} days`,
        `${employee.earned} days`,
        `${employee.optional} days`,
        `${total} days`,
      ];
    });

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "leave-balances.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const savePolicy = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const annual = Number(form.get("annual") || 0);
    const used = Number(form.get("used") || 0);

    setPolicies((current) =>
      current.map((policy) =>
        policy.id === selectedPolicy.id
          ? {
              ...policy,
              annual,
              used,
              remaining: Math.max(annual - used, 0),
              carryForward: form.get("carryForward"),
              encashment: form.get("encashment"),
              approval: form.get("approval"),
            }
          : policy
      )
    );

    closeModal();
  };

  const openRequestDetails = (request) => {
    setSelectedRequest(request);
    setModal("view");
  };

  const openPolicyEditor = (policy) => {
    setSelectedPolicy(policy);
    setModal("policy");
  };

  return (
    <HRLayout title="Leave Management" breadcrumb="Leave">
      <div className="bel-leave-page">
        <header className="bel-leave-header">
          <div>
            <h1>Leave Management</h1>
            <p>Manage leave requests, policies and balances</p>
          </div>

          <button
            type="button"
            className="bel-leave-export-button"
            onClick={
              activeTab === "balance" ? exportBalances : exportRequests
            }
          >
            <FiDownload />
            Export
          </button>
        </header>

        <section className="bel-leave-stat-grid">
          <StatCard value={pendingCount} label="Pending" tone="pending" />
          <StatCard value={approvedCount} label="Approved" tone="approved" />
          <StatCard value={rejectedCount} label="Rejected" tone="rejected" />
          <StatCard value="90" label="On Leave Today" tone="today" />
        </section>

        <nav className="bel-leave-tabs" aria-label="Leave sections">
          <button
            type="button"
            className={activeTab === "requests" ? "is-active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            Leave Requests
          </button>
          <button
            type="button"
            className={activeTab === "policies" ? "is-active" : ""}
            onClick={() => setActiveTab("policies")}
          >
            Leave Policies
          </button>
          <button
            type="button"
            className={activeTab === "balance" ? "is-active" : ""}
            onClick={() => setActiveTab("balance")}
          >
            Leave Balance
          </button>
        </nav>

        {activeTab === "requests" && (
          <section className="bel-leave-requests-card">
            <div className="bel-leave-request-toolbar">
              <div className="bel-leave-toolbar-search">
                <input
                  type="search"
                  placeholder="Search employee..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="bel-leave-dropdown-wrap">
                <button
                  type="button"
                  className="bel-leave-filter-select"
                  onClick={() => {
                    setShowStatusMenu((value) => !value);
                    setShowTypeMenu(false);
                  }}
                >
                  <span>{statusFilter}</span>
                  <FiChevronDown />
                </button>

                {showStatusMenu && (
                  <div className="bel-leave-dropdown-menu">
                    {FILTER_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={statusFilter === option ? "selected" : ""}
                        onClick={() => {
                          setStatusFilter(option);
                          setShowStatusMenu(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bel-leave-dropdown-wrap">
                <button
                  type="button"
                  className="bel-leave-more-filter-button"
                  onClick={() => {
                    setShowTypeMenu((value) => !value);
                    setShowStatusMenu(false);
                  }}
                >
                  <FiFilter />
                  <span>More Filters</span>
                </button>

                {showTypeMenu && (
                  <div className="bel-leave-dropdown-menu bel-leave-dropdown-menu--type">
                    {TYPE_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={typeFilter === option ? "selected" : ""}
                        onClick={() => {
                          setTypeFilter(option);
                          setShowTypeMenu(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bel-leave-table-scroll">
              <table className="bel-leave-request-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="bel-leave-empty">
                        No leave requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request, index) => (
                      <tr key={request.id}>
                        <td>
                          <div className="bel-leave-employee-cell">
                            <EmployeeAvatar
                              initials={request.initials}
                              index={index}
                            />
                            <div>
                              <strong>{request.employee}</strong>
                              <small>{request.department}</small>
                            </div>
                          </div>
                        </td>
                        <td>{request.type}</td>
                        <td>{request.from}</td>
                        <td>{request.to}</td>
                        <td>
                          <strong className="bel-leave-days">{request.days}d</strong>
                        </td>
                        <td
                          className="bel-leave-reason"
                          title={request.reason}
                        >
                          {request.reason}
                        </td>
                        <td>{request.applied}</td>
                        <td>
                          <LeaveStatus status={request.status} />
                        </td>
                        <td>
                          <div className="bel-leave-row-actions">
                            {request.status === "Pending" && (
                              <>
                                <button
                                  type="button"
                                  className="bel-leave-icon-action bel-leave-icon-action--approve"
                                  title="Approve leave"
                                  onClick={() => approveRequest(request.id)}
                                >
                                  <FiCheck />
                                </button>
                                <button
                                  type="button"
                                  className="bel-leave-icon-action bel-leave-icon-action--reject"
                                  title="Reject leave"
                                  onClick={() => rejectRequest(request.id)}
                                >
                                  <FiX />
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              className="bel-leave-icon-action bel-leave-icon-action--view"
                              title="View leave request"
                              onClick={() => openRequestDetails(request)}
                            >
                              <FiEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "policies" && (
          <section className="bel-leave-policy-grid">
            {policies.map((policy) => {
              const utilization =
                policy.annual > 0
                  ? Math.round((policy.used / policy.annual) * 100)
                  : 0;

              return (
                <article className="bel-leave-policy-card" key={policy.id}>
                  <div className="bel-leave-policy-header">
                    <h2>{policy.name}</h2>
                    <button
                      type="button"
                      onClick={() => openPolicyEditor(policy)}
                    >
                      <FiEdit2 />
                      Edit Policy
                    </button>
                  </div>

                  <div className="bel-leave-policy-metrics">
                    <div>
                      <strong>{policy.annual}</strong>
                      <span>Annual</span>
                    </div>
                    <div>
                      <strong>{policy.used}</strong>
                      <span>Used</span>
                    </div>
                    <div>
                      <strong>{policy.remaining}</strong>
                      <span>Remaining</span>
                    </div>
                  </div>

                  <div className="bel-leave-progress">
                    <span
                      style={{
                        width: `${Math.min(utilization, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="bel-leave-progress-meta">
                    <span>Used: {policy.used} days</span>
                    <span>{utilization}% utilized</span>
                  </div>

                  <dl className="bel-leave-policy-details">
                    <div>
                      <dt>Carry Forward</dt>
                      <dd>{policy.carryForward}</dd>
                    </div>
                    <div>
                      <dt>Encashment</dt>
                      <dd>{policy.encashment}</dd>
                    </div>
                    <div>
                      <dt>Approval</dt>
                      <dd>{policy.approval}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </section>
        )}

        {activeTab === "balance" && (
          <section className="bel-leave-balance-card">
            <div className="bel-leave-balance-scroll">
              <table className="bel-leave-balance-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Casual Leave</th>
                    <th>Sick Leave</th>
                    <th>Earned Leave</th>
                    <th>Optional Leave</th>
                    <th>Total Available</th>
                  </tr>
                </thead>

                <tbody>
                  {balances.map((employee, index) => {
                    const total =
                      employee.casual +
                      employee.sick +
                      employee.earned +
                      employee.optional;

                    return (
                      <tr key={employee.id}>
                        <td>
                          <div className="bel-leave-employee-cell">
                            <EmployeeAvatar
                              initials={employee.initials}
                              index={index}
                            />
                            <div>
                              <strong>{employee.employee}</strong>
                              <small>{employee.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>{employee.casual}</strong> <span>days</span>
                        </td>
                        <td>
                          <strong>{employee.sick}</strong> <span>days</span>
                        </td>
                        <td>
                          <strong>{employee.earned}</strong> <span>days</span>
                        </td>
                        <td>
                          <strong>{employee.optional}</strong> <span>days</span>
                        </td>
                        <td>
                          <span className="bel-leave-total-badge">
                            {total} days
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {modal === "view" && selectedRequest && (
        <div
          className="bel-leave-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="bel-leave-modal">
            <div className="bel-leave-modal-header">
              <div>
                <h2>Leave Request</h2>
                <p>
                  {selectedRequest.id} · {selectedRequest.employee}
                </p>
              </div>
              <button type="button" onClick={closeModal} aria-label="Close">
                <FiX />
              </button>
            </div>

            <div className="bel-leave-view-grid">
              <div>
                <span>Employee</span>
                <strong>{selectedRequest.employee}</strong>
              </div>
              <div>
                <span>Department</span>
                <strong>{selectedRequest.department}</strong>
              </div>
              <div>
                <span>Leave Type</span>
                <strong>{selectedRequest.type}</strong>
              </div>
              <div>
                <span>Duration</span>
                <strong>{selectedRequest.days} days</strong>
              </div>
              <div>
                <span>From</span>
                <strong>{selectedRequest.from}</strong>
              </div>
              <div>
                <span>To</span>
                <strong>{selectedRequest.to}</strong>
              </div>
              <div className="bel-leave-view-full">
                <span>Reason</span>
                <strong>{selectedRequest.reason}</strong>
              </div>
              <div className="bel-leave-view-full">
                <span>Status</span>
                <LeaveStatus status={selectedRequest.status} />
              </div>
            </div>

            <div className="bel-leave-modal-footer">
              <button
                type="button"
                className="bel-leave-secondary-button"
                onClick={closeModal}
              >
                Close
              </button>
              {selectedRequest.status === "Pending" && (
                <>
                  <button
                    type="button"
                    className="bel-leave-reject-button"
                    onClick={() => {
                      rejectRequest(selectedRequest.id);
                      closeModal();
                    }}
                  >
                    <FiX />
                    Reject
                  </button>
                  <button
                    type="button"
                    className="bel-leave-primary-button"
                    onClick={() => {
                      approveRequest(selectedRequest.id);
                      closeModal();
                    }}
                  >
                    <FiCheck />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {modal === "policy" && selectedPolicy && (
        <div
          className="bel-leave-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="bel-leave-modal">
            <div className="bel-leave-modal-header">
              <div>
                <h2>Edit Leave Policy</h2>
                <p>{selectedPolicy.name}</p>
              </div>
              <button type="button" onClick={closeModal} aria-label="Close">
                <FiX />
              </button>
            </div>

            <form className="bel-leave-policy-form" onSubmit={savePolicy}>
              <div>
                <label>Annual Days</label>
                <input
                  name="annual"
                  type="number"
                  min="0"
                  defaultValue={selectedPolicy.annual}
                  required
                />
              </div>

              <div>
                <label>Used Days</label>
                <input
                  name="used"
                  type="number"
                  min="0"
                  defaultValue={selectedPolicy.used}
                  required
                />
              </div>

              <div>
                <label>Carry Forward</label>
                <select
                  name="carryForward"
                  defaultValue={selectedPolicy.carryForward}
                >
                  <option>Yes (max 5 days)</option>
                  <option>Yes (max 10 days)</option>
                  <option>No</option>
                </select>
              </div>

              <div>
                <label>Encashment</label>
                <select
                  name="encashment"
                  defaultValue={selectedPolicy.encashment}
                >
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>

              <div className="bel-leave-policy-form-full">
                <label>Approval Flow</label>
                <select name="approval" defaultValue={selectedPolicy.approval}>
                  <option>Manager → HR</option>
                  <option>Manager only</option>
                  <option>HR only</option>
                </select>
              </div>

              <div className="bel-leave-modal-footer bel-leave-policy-form-footer">
                <button
                  type="button"
                  className="bel-leave-secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="bel-leave-primary-button">
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRLayout>
  );
}
