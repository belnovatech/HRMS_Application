import React, { useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiDownload,
  FiEdit2,
  FiFilter,
  FiHome,
  FiPlus,
  FiSearch,
  FiX,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import HRLayout from "../../../layouts/HRLayout";
import "./Attendance.css";

const INITIAL_LOGS = [
  {
    id: "EMP1001",
    name: "Rahul Kumar",
    initials: "RK",
    date: "Sep 1, 2026",
    checkIn: "09:42 AM",
    checkOut: "06:38 PM",
    hours: "8h 56m",
    shift: "General",
    status: "Present",
  },
  {
    id: "EMP1002",
    name: "Priya Sharma",
    initials: "PS",
    date: "Sep 1, 2026",
    checkIn: "09:12 AM",
    checkOut: "06:15 PM",
    hours: "9h 03m",
    shift: "General",
    status: "Present",
  },
  {
    id: "EMP1003",
    name: "Arjun Reddy",
    initials: "AR",
    date: "Sep 1, 2026",
    checkIn: "10:15 AM",
    checkOut: "06:45 PM",
    hours: "8h 30m",
    shift: "General",
    status: "Late",
  },
  {
    id: "EMP1004",
    name: "Sneha Rao",
    initials: "SR",
    date: "Sep 1, 2026",
    checkIn: "06:05 AM",
    checkOut: "02:10 PM",
    hours: "8h 05m",
    shift: "Morning",
    status: "Present",
  },
  {
    id: "EMP1005",
    name: "Vikram Singh",
    initials: "VS",
    date: "Sep 1, 2026",
    checkIn: "02:18 PM",
    checkOut: "10:06 PM",
    hours: "7h 48m",
    shift: "Evening",
    status: "Late",
  },
  {
    id: "EMP1006",
    name: "Ananya Patel",
    initials: "AP",
    date: "Sep 1, 2026",
    checkIn: "-",
    checkOut: "-",
    hours: "0h",
    shift: "General",
    status: "Absent",
  },
  {
    id: "EMP1007",
    name: "Rohan Das",
    initials: "RD",
    date: "Sep 1, 2026",
    checkIn: "09:05 AM",
    checkOut: "06:30 PM",
    hours: "9h 25m",
    shift: "General",
    status: "WFH",
  },
];

const INITIAL_REQUESTS = [
  {
    id: 1,
    employee: "Rohan Das",
    empId: "EMP1007",
    initials: "RD",
    date: "Aug 28, 2026",
    requestedIn: "09:45 AM",
    requestedOut: "07:00 PM",
    reason: "Biometric device failure",
    status: "Pending",
  },
  {
    id: 2,
    employee: "Deepika Iyer",
    empId: "EMP1012",
    initials: "DI",
    date: "Aug 26, 2026",
    requestedIn: "09:30 AM",
    requestedOut: "06:30 PM",
    reason: "Forgot to punch out",
    status: "Approved",
  },
  {
    id: 3,
    employee: "Kiran Reddy",
    empId: "EMP1011",
    initials: "KR",
    date: "Aug 25, 2026",
    requestedIn: "10:00 AM",
    requestedOut: "06:45 PM",
    reason: "Missed biometric punch",
    status: "Rejected",
  },
];

const STATUS_OPTIONS = ["All", "Present", "Absent", "Late", "WFH", "Leave"];

const CALENDAR_STATUS = {
  1: "Present",
  2: "Present",
  3: "Present",
  4: "Absent",
  5: "Late",
  6: "Off",
  7: "Off",
  8: "Present",
  9: "Present",
  10: "Present",
  11: "Present",
  12: "Absent",
  13: "Late",
  14: "Off",
  15: "Off",
  16: "Present",
  17: "Present",
  18: "Present",
  19: "Present",
  20: "Absent",
  21: "Late",
  22: "Off",
  23: "Off",
  24: "Present",
  25: "Present",
  26: "Present",
  27: "Present",
  28: "Absent",
  29: "Late",
  30: "Present",
};

const STATUS_META = {
  Present: { className: "present", short: "Pre" },
  Absent: { className: "absent", short: "Abs" },
  Late: { className: "late", short: "Lat" },
  Leave: { className: "leave", short: "Lea" },
  WFH: { className: "wfh", short: "WFH" },
  Off: { className: "off", short: "Off" },
  Holiday: { className: "holiday", short: "Hol" },
  Weekend: { className: "weekend", short: "Off" },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Present;
  return (
    <span className={`bel-attendance-status bel-attendance-status--${meta.className}`}>
      <span className="bel-attendance-status-dot" />
      {status}
    </span>
  );
}

function StatCard({ icon, value, label, tone }) {
  return (
    <div className={`bel-attendance-stat bel-attendance-stat--${tone}`}>
      <div className="bel-attendance-stat-icon">{icon}</div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ShiftCard({ color, icon, name, count, time }) {
  return (
    <div className="bel-attendance-shift-card">
      <div className="bel-attendance-shift-title">
        <span className="bel-attendance-shift-dot" style={{ backgroundColor: color }} />
        {icon}
        <span>{name}</span>
      </div>
      <strong>{count}</strong>
      <small>{time}</small>
    </div>
  );
}

export default function Attendance() {
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState("2026-09-01");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [modal, setModal] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const filteredLogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !term ||
        log.name.toLowerCase().includes(term) ||
        log.id.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || log.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [logs, search, statusFilter]);

  const openEdit = (log) => {
    setEditForm({ ...log });
    setModal("edit");
  };

  const openRegularize = (log) => {
    setEditForm({
      ...log,
      requestedIn: log.checkIn === "-" ? "09:00 AM" : log.checkIn,
      requestedOut: log.checkOut === "-" ? "06:00 PM" : log.checkOut,
      reason: "",
    });
    setModal("regularize");
  };

  const closeModal = () => {
    setModal(null);
    setEditForm(null);
  };

  const saveAttendance = (event) => {
    event.preventDefault();

    setLogs((current) =>
      current.map((item) =>
        item.id === editForm.id
          ? {
              ...item,
              checkIn: editForm.checkIn,
              checkOut: editForm.checkOut,
              hours: editForm.hours || item.hours,
              status: editForm.status,
              shift: editForm.shift,
            }
          : item
      )
    );

    closeModal();
  };

  const submitRegularization = (event) => {
    event.preventDefault();

    setRequests((current) => [
      {
        id: Date.now(),
        employee: editForm.name,
        empId: editForm.id,
        initials: editForm.initials,
        date: editForm.date,
        requestedIn: editForm.requestedIn,
        requestedOut: editForm.requestedOut,
        reason: editForm.reason || "Attendance correction requested",
        status: "Pending",
      },
      ...current,
    ]);

    setActiveTab("regularization");
    closeModal();
  };

  const updateRequestStatus = (id, status) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const exportAttendance = () => {
    const header = [
      "Employee ID",
      "Employee Name",
      "Date",
      "Clock In",
      "Clock Out",
      "Working Hours",
      "Shift",
      "Status",
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      log.name,
      log.date,
      log.checkIn,
      log.checkOut,
      log.hours,
      log.shift,
      log.status,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance-september-2026.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const calendarDays = Array.from({ length: 30 }, (_, index) => index + 1);
  const leadingEmptyDays = 2; // September 1, 2026 is Tuesday.

  return (
    <HRLayout title="Attendance" breadcrumb="Attendance">
      <div className="bel-attendance-page">
        <div className="bel-attendance-header">
          <div>
            <h1>Attendance</h1>
            <p>Manage and track employee attendance · September 2026</p>
          </div>

          <button
            type="button"
            className="bel-attendance-export-btn"
            onClick={exportAttendance}
          >
            <FiDownload />
            Export
          </button>
        </div>

        <section className="bel-attendance-stats">
          <StatCard
            tone="present"
            icon={<FiCheckCircle />}
            value="1,086"
            label="Present"
          />
          <StatCard
            tone="absent"
            icon={<FiAlertCircle />}
            value="72"
            label="Absent"
          />
          <StatCard tone="late" icon={<FiClock />} value="45" label="Late" />
          <StatCard tone="wfh" icon={<FiHome />} value="38" label="WFH" />
          <StatCard
            tone="overtime"
            icon={<FiArrowRight />}
            value="23"
            label="Overtime"
          />
        </section>

        <div className="bel-attendance-tabs" role="tablist">
          <button
            type="button"
            className={activeTab === "daily" ? "is-active" : ""}
            onClick={() => setActiveTab("daily")}
          >
            Daily View
          </button>
          <button
            type="button"
            className={activeTab === "monthly" ? "is-active" : ""}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly Calendar
          </button>
          <button
            type="button"
            className={activeTab === "regularization" ? "is-active" : ""}
            onClick={() => setActiveTab("regularization")}
          >
            Regularization
          </button>
        </div>

        {activeTab === "daily" && (
          <>
            <section className="bel-attendance-shifts">
              <ShiftCard
                color="#2879f6"
                name="General Shift"
                count="890"
                time="09:30 AM – 06:30 PM"
              />
              <ShiftCard
                color="#16c7df"
                name="Morning Shift"
                count="96"
                time="06:00 AM – 02:00 PM"
              />
              <ShiftCard
                color="#8655ee"
                name="Evening Shift"
                count="72"
                time="02:00 PM – 10:00 PM"
              />
              <ShiftCard
                color="#d03ee5"
                name="Night Shift"
                count="28"
                time="10:00 PM – 06:00 AM"
              />
            </section>

            <section className="bel-attendance-table-card">
              <div className="bel-attendance-toolbar">
                <div className="bel-attendance-search">
                  <FiSearch />
                  <input
                    type="search"
                    placeholder="Search employee..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <div className="bel-attendance-search">
                  <FiCalendar />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                  />
                </div>

                <div className="bel-attendance-filter-wrap">
                  <button
                    type="button"
                    className="bel-attendance-select"
                    onClick={() => setShowFilter((value) => !value)}
                  >
                    <span>{statusFilter}</span>
                    <FiChevronDown />
                  </button>

                  {showFilter && (
                    <div className="bel-attendance-filter-menu">
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          type="button"
                          key={option}
                          className={statusFilter === option ? "selected" : ""}
                          onClick={() => {
                            setStatusFilter(option);
                            setShowFilter(false);
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="bel-attendance-filter-btn"
                  onClick={() => setShowFilter((value) => !value)}
                >
                  <FiFilter />
                  Filters
                </button>
              </div>

              <div className="bel-attendance-table-scroll">
                <table className="bel-attendance-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Working Hours</th>
                      <th>Shift</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="bel-attendance-empty">
                          No attendance records found.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id}>
                          <td>
                            <div className="bel-attendance-employee">
                              <span className="bel-attendance-avatar">
                                {log.initials}
                              </span>
                              <div>
                                <strong>{log.name}</strong>
                                <small>{log.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>{log.date}</td>
                          <td className="bel-attendance-time bel-attendance-time--in">
                            {log.checkIn}
                          </td>
                          <td className="bel-attendance-time bel-attendance-time--out">
                            {log.checkOut}
                          </td>
                          <td>{log.hours}</td>
                          <td>{log.shift}</td>
                          <td>
                            <StatusBadge status={log.status} />
                          </td>
                          <td>
                            <div className="bel-attendance-actions">
                              <button
                                type="button"
                                title="Edit attendance"
                                onClick={() => openEdit(log)}
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                type="button"
                                className="regularize"
                                onClick={() => openRegularize(log)}
                              >
                                Regularize
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
          </>
        )}

        {activeTab === "monthly" && (
          <section className="bel-attendance-calendar-card">
            <div className="bel-attendance-calendar-header">
              <div>
                <h2>September 2026</h2>
              </div>

              <div className="bel-attendance-calendar-legend">
                {["Present", "Absent", "Late", "Leave", "Holiday", "Weekend"].map(
                  (item) => (
                    <span key={item}>
                      <i
                        className={`bel-attendance-legend-dot bel-attendance-legend-dot--${STATUS_META[item].className}`}
                      />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="bel-attendance-calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="bel-attendance-calendar-grid">
              {Array.from({ length: leadingEmptyDays }).map((_, index) => (
                <div
                  className="bel-attendance-calendar-cell bel-attendance-calendar-cell--empty"
                  key={`empty-${index}`}
                />
              ))}

              {calendarDays.map((day) => {
                const status = CALENDAR_STATUS[day];
                const meta = STATUS_META[status];

                return (
                  <button
                    type="button"
                    key={day}
                    className={`bel-attendance-calendar-cell bel-attendance-calendar-cell--${meta.className}`}
                    onClick={() =>
                      setSelectedDate(
                        `2026-09-${String(day).padStart(2, "0")}`
                      )
                    }
                  >
                    <strong>{day}</strong>
                    <small>{meta.short}</small>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "regularization" && (
          <section className="bel-attendance-regularization-card">
            <div className="bel-attendance-section-heading">
              <h2>Attendance Regularization Requests</h2>
              <p>Review and approve employee attendance correction requests</p>
            </div>

            <div className="bel-attendance-request-list">
              {requests.map((request) => (
                <article
                  className="bel-attendance-request"
                  key={request.id}
                >
                  <div className="bel-attendance-request-top">
                    <div className="bel-attendance-request-employee">
                      <span className="bel-attendance-request-avatar">
                        {request.initials}
                      </span>
                      <div>
                        <strong>{request.employee}</strong>
                        <small>
                          {request.empId} · {request.date}
                        </small>
                      </div>
                    </div>

                    <span
                      className={`bel-attendance-request-status bel-attendance-request-status--${request.status.toLowerCase()}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="bel-attendance-request-times">
                    <div>
                      <small>Requested In:</small>
                      <strong>{request.requestedIn}</strong>
                    </div>
                    <div>
                      <small>Requested Out:</small>
                      <strong>{request.requestedOut}</strong>
                    </div>
                  </div>

                  <p className="bel-attendance-request-reason">
                    "{request.reason}"
                  </p>

                  {request.status === "Pending" && (
                    <div className="bel-attendance-request-actions">
                      <button
                        type="button"
                        className="bel-attendance-approve"
                        onClick={() =>
                          updateRequestStatus(request.id, "Approved")
                        }
                      >
                        <FiCheck />
                        Approve
                      </button>
                      <button
                        type="button"
                        className="bel-attendance-reject"
                        onClick={() =>
                          updateRequestStatus(request.id, "Rejected")
                        }
                      >
                        <FiX />
                        Reject
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {modal && editForm && (
        <div
          className="bel-attendance-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="bel-attendance-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="attendance-modal-title"
          >
            <div className="bel-attendance-modal-header">
              <div>
                <h2 id="attendance-modal-title">
                  {modal === "edit"
                    ? "Edit Attendance"
                    : "Regularize Attendance"}
                </h2>
                <p>
                  {editForm.name} · {editForm.id}
                </p>
              </div>
              <button type="button" onClick={closeModal} aria-label="Close">
                <FiX />
              </button>
            </div>

            {modal === "edit" ? (
              <form onSubmit={saveAttendance}>
                <div className="bel-attendance-form-grid">
                  <label>
                    Date
                    <input type="text" value={editForm.date} disabled />
                  </label>

                  <label>
                    Shift
                    <select
                      value={editForm.shift}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          shift: event.target.value,
                        })
                      }
                    >
                      <option>General</option>
                      <option>Morning</option>
                      <option>Evening</option>
                      <option>Night</option>
                    </select>
                  </label>

                  <label>
                    Check In
                    <input
                      type="text"
                      value={editForm.checkIn}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          checkIn: event.target.value,
                        })
                      }
                      placeholder="09:00 AM"
                    />
                  </label>

                  <label>
                    Check Out
                    <input
                      type="text"
                      value={editForm.checkOut}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          checkOut: event.target.value,
                        })
                      }
                      placeholder="06:00 PM"
                    />
                  </label>

                  <label>
                    Working Hours
                    <input
                      type="text"
                      value={editForm.hours}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          hours: event.target.value,
                        })
                      }
                      placeholder="9h 00m"
                    />
                  </label>

                  <label>
                    Status
                    <select
                      value={editForm.status}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          status: event.target.value,
                        })
                      }
                    >
                      {STATUS_OPTIONS.filter(
                        (option) => option !== "All"
                      ).map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="bel-attendance-modal-footer">
                  <button
                    type="button"
                    className="bel-attendance-cancel"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bel-attendance-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={submitRegularization}>
                <div className="bel-attendance-form-grid">
                  <label>
                    Date
                    <input type="text" value={editForm.date} disabled />
                  </label>

                  <label>
                    Employee
                    <input type="text" value={editForm.name} disabled />
                  </label>

                  <label>
                    Requested In
                    <input
                      type="text"
                      value={editForm.requestedIn}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          requestedIn: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Requested Out
                    <input
                      type="text"
                      value={editForm.requestedOut}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          requestedOut: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="bel-attendance-form-full">
                    Reason
                    <textarea
                      value={editForm.reason}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          reason: event.target.value,
                        })
                      }
                      placeholder="Enter the reason for attendance correction..."
                      rows="4"
                      required
                    />
                  </label>
                </div>

                <div className="bel-attendance-modal-footer">
                  <button
                    type="button"
                    className="bel-attendance-cancel"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bel-attendance-primary">
                    <FiPlus />
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </HRLayout>
  );
}
