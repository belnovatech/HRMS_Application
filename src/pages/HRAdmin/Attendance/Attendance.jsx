import React, { useMemo, useState, useEffect, useCallback } from "react";
import api from "../../../api/axiosInstance";
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
  const [logs, setLogs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [modal, setModal] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    return {
      present: logs.filter((l) => l.status === "Present").length,
      absent: logs.filter((l) => l.status === "Absent").length,
      late: logs.filter((l) => l.status === "Late").length,
      wfh: logs.filter((l) => l.status === "WFH").length,
      overtime: logs.filter((l) => l.status === "Overtime" || parseFloat(l.overtime || 0) > 0).length,
    };
  }, [logs]);

  const shiftCounts = useMemo(() => {
    return {
      general: logs.filter((l) => l.shift === "General").length,
      morning: logs.filter((l) => l.shift === "Morning").length,
      evening: logs.filter((l) => l.shift === "Evening").length,
      night: logs.filter((l) => l.shift === "Night").length,
    };
  }, [logs]);

  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      const [attRes, corrRes, empRes] = await Promise.allSettled([
        api.get("/Attendance"),
        api.get("/attendance/corrections"),
        api.get("/Employees")
      ]);

      if (attRes.status === "fulfilled" && Array.isArray(attRes.value.data) && attRes.value.data.length > 0) {
        const empMap = new Map();
        if (empRes.status === "fulfilled" && Array.isArray(empRes.value.data)) {
          empRes.value.data.forEach((e) => {
            empMap.set(e.id, `${e.firstName || ""} ${e.lastName || ""}`.trim() || e.email);
            if (e.employeeNumber) empMap.set(e.employeeNumber, `${e.firstName || ""} ${e.lastName || ""}`.trim() || e.email);
          });
        }

        const mappedLogs = attRes.value.data.map((item, idx) => {
          const empName = empMap.get(item.employeeId) || item.employeeName || `Employee ${item.employeeId || idx + 1}`;
          const initials = empName.split(" ").map((n) => n[0]).join("").slice(0, 2);
          return {
            id: item.employeeId || `EMP${1000 + idx}`,
            name: empName,
            initials: initials || "EM",
            date: item.date || "Sep 1, 2026",
            checkIn: item.checkIn || "-",
            checkOut: item.checkOut || "-",
            hours: item.workingHours || "8h 30m",
            shift: item.shift || "General",
            status: item.status || (item.checkIn ? "Present" : "Absent")
          };
        });
        setLogs(mappedLogs);
      }

      if (corrRes.status === "fulfilled" && Array.isArray(corrRes.value.data) && corrRes.value.data.length > 0) {
        setRequests(corrRes.value.data.map((c) => ({
          id: c.id,
          employee: c.employeeName || `Employee ${c.employeeId}`,
          empId: c.employeeId,
          initials: (c.employeeName || "EM").split(" ").map((n) => n[0]).join("").slice(0, 2),
          date: c.date || "Aug 28, 2026",
          requestedIn: c.requestedIn || "09:00 AM",
          requestedOut: c.requestedOut || "06:00 PM",
          reason: c.reason || "Attendance correction requested",
          status: c.status || "Pending"
        })));
      }
    } catch (err) {
      console.warn("Failed to fetch live attendance:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

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

  const saveAttendance = async (event) => {
    event.preventDefault();

    try {
      await api.post("/Attendance/check-in", {
        employeeId: editForm.id,
        employeeName: editForm.name
      });
    } catch (err) {
      console.warn("Check-in API notice:", err.message);
    }

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

  const submitRegularization = async (event) => {
    event.preventDefault();

    try {
      await api.post("/attendance/corrections", {
        employeeId: editForm.id,
        employeeName: editForm.name,
        date: editForm.date,
        requestedIn: editForm.requestedIn,
        requestedOut: editForm.requestedOut,
        reason: editForm.reason || "Attendance correction requested"
      });
    } catch (err) {
      console.warn("Correction submission notice:", err.message);
    }

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

  const updateRequestStatus = async (id, status) => {
    try {
      await api.post(`/attendance/corrections/${id}/decision`, {
        status,
        note: `Decision marked as ${status}`
      });
    } catch (err) {
      console.warn("Correction decision API notice:", err.message);
    }

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
            value={stats.present}
            label="Present"
          />
          <StatCard
            tone="absent"
            icon={<FiAlertCircle />}
            value={stats.absent}
            label="Absent"
          />
          <StatCard tone="late" icon={<FiClock />} value={stats.late} label="Late" />
          <StatCard tone="wfh" icon={<FiHome />} value={stats.wfh} label="WFH" />
          <StatCard
            tone="overtime"
            icon={<FiArrowRight />}
            value={stats.overtime}
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
                count={shiftCounts.general}
                time="09:30 AM – 06:30 PM"
              />
              <ShiftCard
                color="#16c7df"
                name="Morning Shift"
                count={shiftCounts.morning}
                time="06:00 AM – 02:00 PM"
              />
              <ShiftCard
                color="#8655ee"
                name="Evening Shift"
                count={shiftCounts.evening}
                time="02:00 PM – 10:00 PM"
              />
              <ShiftCard
                color="#d03ee5"
                name="Night Shift"
                count={shiftCounts.night}
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
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="bel-attendance-empty">
                          Loading attendance records...
                        </td>
                      </tr>
                    ) : filteredLogs.length === 0 ? (
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
              {requests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                  No pending attendance regularization requests.
                </div>
              ) : (
                requests.map((request) => (
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
              ))) }
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
