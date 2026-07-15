import { useState, useEffect, useCallback } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCalendar,
  FiRefreshCw,
  FiAlertCircle,
  FiUpload,
} from "react-icons/fi";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import {
  applyLeave,
  getPendingLeaves,
  approveRejectLeave,
  getLeaveHistory,
  getMonthlySummary,
} from "../../services/leave_service";

import "./LeaveManagement.css";

// TODO: replace with the logged-in user's employee id from your auth context.
const DEFAULT_EMP_ID = 1;

// TODO: match these to the actual status IDs your backend uses.
const LEAVE_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
};

function formatDate(dateStr) {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusClass(statusName = "") {
  return statusName.toLowerCase().replace(/\s+/g, "-");
}

/* ============================================================
   Dashboard tab — stats + pending approvals + monthly summary
   ============================================================ */
function LeaveDashboard({ empId }) {
  const [pending, setPending] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const now = new Date();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pendingData, summaryData] = await Promise.all([
        getPendingLeaves(empId, { limit: 20, offset: 0 }),
        getMonthlySummary({
          empId,
          year: now.getFullYear(),
          month: now.getMonth() + 1,
        }),
      ]);
      setPending(pendingData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message || "Failed to load leave dashboard");
    } finally {
      setLoading(false);
    }
  }, [empId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDecision = async (leaveRequestId, statusId) => {
    setActioningId(leaveRequestId);
    try {
      await approveRejectLeave({
        leave_request_id: leaveRequestId,
        status_id: statusId,
      });
      setPending((prev) => prev.filter((l) => l.leave_request_id !== leaveRequestId));
    } catch (err) {
      setError(err.message || "Failed to update leave status");
    } finally {
      setActioningId(null);
    }
  };

  const cards = [
    {
      title: "Pending Requests",
      count: pending.length,
      icon: <FiClock />,
      className: "yellow",
    },
    {
      title: "Leaves This Month",
      count: summary?.total_leaves ?? 0,
      icon: <FiCalendar />,
      className: "blue",
    },
  ];

  return (
    <div className="leave-dashboard">
      <div className="leave-stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="leave-stat-card">
            <div className={`stat-icon ${card.className}`}>{card.icon}</div>
            <h2>{card.count}</h2>
            <p>{card.title}</p>
          </div>
        ))}
      </div>

      <div className="leave-panel">
        <div className="leave-panel-header">
          <h3>Pending Approvals</h3>
          <button className="refresh-btn" onClick={fetchData} disabled={loading}>
            <FiRefreshCw className={loading ? "spin" : ""} />
            Refresh
          </button>
        </div>

        {loading && (
          <div className="state-message">
            <FiRefreshCw className="spin" />
            <p>Loading pending leaves...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-message error">
            <FiAlertCircle />
            <p>{error}</p>
            <button onClick={fetchData}>Try again</button>
          </div>
        )}

        {!loading && !error && pending.length === 0 && (
          <div className="state-message">
            <FiCheckCircle />
            <p>No pending leave requests</p>
          </div>
        )}

        {!loading && !error && pending.length > 0 && (
          <div className="table-scroll">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((l) => (
                  <tr key={l.leave_request_id}>
                    <td>#{l.emp_id}</td>
                    <td>{l.leave_type}</td>
                    <td>{formatDate(l.start_date)}</td>
                    <td>{formatDate(l.end_date)}</td>
                    <td>{l.total_days}</td>
                    <td className="reason-cell">{l.reason || "--"}</td>
                    <td>
                      <div className="approval-actions">
                        <button
                          className="approve-btn"
                          disabled={actioningId === l.leave_request_id}
                          onClick={() => handleDecision(l.leave_request_id, LEAVE_STATUS.APPROVED)}
                        >
                          <FiCheckCircle /> Approve
                        </button>
                        <button
                          className="reject-btn"
                          disabled={actioningId === l.leave_request_id}
                          onClick={() => handleDecision(l.leave_request_id, LEAVE_STATUS.REJECTED)}
                        >
                          <FiXCircle /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Apply tab — leave application form
   ============================================================ */
function ApplyLeave({ empId }) {
  const [form, setForm] = useState({
    leavetype_id: "",
    start_date: "",
    end_date: "",
    from_date_session_id: "",
    to_date_session_id: "",
    reason: "",
    mobile: "",
    reporting_manager_id: "",
    cc: "",
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      await applyLeave({
        emp_id: empId,
        ...form,
        upload_file: file || undefined,
      });

      setStatus({ type: "success", message: "Leave request submitted successfully." });
      setForm({
        leavetype_id: "",
        start_date: "",
        end_date: "",
        from_date_session_id: "",
        to_date_session_id: "",
        reason: "",
        mobile: "",
        reporting_manager_id: "",
        cc: "",
      });
      setFile(null);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to submit leave request." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="leave-panel">
      <h3>Apply Leave</h3>

      <form className="apply-leave-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Leave Type
            <select value={form.leavetype_id} onChange={handleChange("leavetype_id")} required>
              <option value="">Select leave type</option>
              <option value="1">Casual Leave</option>
              <option value="2">Sick Leave</option>
              <option value="3">Earned Leave</option>
            </select>
          </label>

          <label>
            Reporting Manager ID
            <input
              type="number"
              value={form.reporting_manager_id}
              onChange={handleChange("reporting_manager_id")}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Start Date
            <input type="date" value={form.start_date} onChange={handleChange("start_date")} required />
          </label>

          <label>
            End Date
            <input type="date" value={form.end_date} onChange={handleChange("end_date")} required />
          </label>
        </div>

        <div className="form-row">
          <label>
            From Date Session
            <select value={form.from_date_session_id} onChange={handleChange("from_date_session_id")} required>
              <option value="">Select session</option>
              <option value="1">Full Day</option>
              <option value="2">First Half</option>
              <option value="3">Second Half</option>
            </select>
          </label>

          <label>
            To Date Session
            <select value={form.to_date_session_id} onChange={handleChange("to_date_session_id")} required>
              <option value="">Select session</option>
              <option value="1">Full Day</option>
              <option value="2">First Half</option>
              <option value="3">Second Half</option>
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Mobile
            <input type="tel" value={form.mobile} onChange={handleChange("mobile")} />
          </label>

          <label>
            CC (comma separated emails)
            <input type="text" value={form.cc} onChange={handleChange("cc")} />
          </label>
        </div>

        <label className="full-width">
          Reason
          <textarea
            rows="4"
            placeholder="Describe the reason..."
            value={form.reason}
            onChange={handleChange("reason")}
          />
        </label>

        <label className="full-width file-label">
          <FiUpload /> Attachment
          <input type="file" onChange={(e) => setFile(e.target.files[0] || null)} />
          {file && <span className="file-name">{file.name}</span>}
        </label>

        {status && (
          <div className={`form-status ${status.type}`}>
            {status.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            <span>{status.message}</span>
          </div>
        )}

        <button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Apply Leave"}
        </button>
      </form>
    </div>
  );
}

/* ============================================================
   Approvals tab — full pending list, same data as dashboard
   but shown as a dedicated page
   ============================================================ */
function Approvals({ empId }) {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingLeaves(empId, { limit: 50, offset: 0 });
      setPending(data);
    } catch (err) {
      setError(err.message || "Failed to load pending leaves");
    } finally {
      setLoading(false);
    }
  }, [empId]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleDecision = async (leaveRequestId, statusId) => {
    setActioningId(leaveRequestId);
    try {
      await approveRejectLeave({
        leave_request_id: leaveRequestId,
        status_id: statusId,
      });
      setPending((prev) => prev.filter((l) => l.leave_request_id !== leaveRequestId));
    } catch (err) {
      setError(err.message || "Failed to update leave status");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="leave-panel">
      <div className="leave-panel-header">
        <h3>All Pending Approvals</h3>
        <button className="refresh-btn" onClick={fetchPending} disabled={loading}>
          <FiRefreshCw className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="state-message">
          <FiRefreshCw className="spin" />
          <p>Loading pending leaves...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-message error">
          <FiAlertCircle />
          <p>{error}</p>
          <button onClick={fetchPending}>Try again</button>
        </div>
      )}

      {!loading && !error && pending.length === 0 && (
        <div className="state-message">
          <FiCheckCircle />
          <p>No pending leave requests</p>
        </div>
      )}

      {!loading && !error && pending.length > 0 && (
        <div className="table-scroll">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((l) => (
                <tr key={l.leave_request_id}>
                  <td>#{l.emp_id}</td>
                  <td>{l.leave_type}</td>
                  <td>{formatDate(l.start_date)}</td>
                  <td>{formatDate(l.end_date)}</td>
                  <td>{l.total_days}</td>
                  <td className="reason-cell">{l.reason || "--"}</td>
                  <td>
                    <div className="approval-actions">
                      <button
                        className="approve-btn"
                        disabled={actioningId === l.leave_request_id}
                        onClick={() => handleDecision(l.leave_request_id, LEAVE_STATUS.APPROVED)}
                      >
                        <FiCheckCircle /> Approve
                      </button>
                      <button
                        className="reject-btn"
                        disabled={actioningId === l.leave_request_id}
                        onClick={() => handleDecision(l.leave_request_id, LEAVE_STATUS.REJECTED)}
                      >
                        <FiXCircle /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   History tab (bonus) — full leave history for the employee,
   backed by /leave/history/{emp_id}
   ============================================================ */
function LeaveHistory({ empId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaveHistory(empId, { limit: 50, offset: 0 });
      setHistory(data);
    } catch (err) {
      setError(err.message || "Failed to load leave history");
    } finally {
      setLoading(false);
    }
  }, [empId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="leave-panel">
      <div className="leave-panel-header">
        <h3>Leave History</h3>
        <button className="refresh-btn" onClick={fetchHistory} disabled={loading}>
          <FiRefreshCw className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="state-message">
          <FiRefreshCw className="spin" />
          <p>Loading leave history...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-message error">
          <FiAlertCircle />
          <p>{error}</p>
          <button onClick={fetchHistory}>Try again</button>
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="state-message">
          <FiCalendar />
          <p>No leave history found</p>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="table-scroll">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {history.map((l) => (
                <tr key={l.leave_request_id}>
                  <td>{l.leave_type}</td>
                  <td>{formatDate(l.start_date)}</td>
                  <td>{formatDate(l.end_date)}</td>
                  <td>{l.total_days}</td>
                  <td>
                    <span className={`status ${statusClass(l.status_name)}`}>
                      {l.status_name}
                    </span>
                  </td>
                  <td className="reason-cell">{l.reason || "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Calendar & Policy — placeholders, unchanged
   ============================================================ */
function Calendar() {
  return (
    <div className="placeholder-card">
      <h2>Leave Calendar</h2>
      <p>Interactive calendar view renders here</p>
    </div>
  );
}

function Policy() {
  return (
    <div className="placeholder-card">
      <h2>Leave Policies</h2>
      <p>Interactive policy view renders here</p>
    </div>
  );
}

/* ============================================================
   Main page — tabs + Sidebar/Header shell
   ============================================================ */
export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [empId, setEmpId] = useState(DEFAULT_EMP_ID);

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "apply", label: "Apply" },
    { key: "approvals", label: "Approvals" },
    { key: "history", label: "History" },
    { key: "calendar", label: "Calendar" },
    { key: "policy", label: "Policy" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <LeaveDashboard empId={empId} />;
      case "apply":
        return <ApplyLeave empId={empId} />;
      case "approvals":
        return <Approvals empId={empId} />;
      case "history":
        return <LeaveHistory empId={empId} />;
      case "calendar":
        return <Calendar />;
      case "policy":
        return <Policy />;
      default:
        return <LeaveDashboard empId={empId} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Header title="Leave Management" breadcrumb="Leave Management" />

        <div className="leave-container">
          <div className="leave-toolbar">
            <div className="leave-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TODO: remove once emp_id comes from your auth/session context */}
            <label className="emp-id-picker">
              Employee ID
              <input
                type="number"
                value={empId}
                onChange={(e) => setEmpId(Number(e.target.value) || 0)}
              />
            </label>
          </div>

          <div className="leave-content">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}