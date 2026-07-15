import { useState, useEffect, useMemo } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUsers,
  FiRefreshCw,
  FiSearch,
  FiAlertCircle,
} from "react-icons/fi";

import { getAttendance } from "../../services/attendance_service";
import "./Attendance.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

function formatDate(dateStr) {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateTimeStr) {
  if (!dateTimeStr) return "--";
  const d = new Date(dateTimeStr.replace(" ", "T"));
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatHours(hoursDecimal) {
  if (hoursDecimal === null || hoursDecimal === undefined) return "--";
  const totalMinutes = Math.round(hoursDecimal * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

function getStatus(record) {
  return record.check_out_time ? "Checked Out" : "Checked In";
}

export default function AllAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAttendance({ exportData: false });
      setRecords(data);
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const stats = useMemo(() => {
    const uniqueEmployees = new Set(records.map((r) => r.emp_id));
    const checkedIn = records.filter((r) => !r.check_out_time).length;
    const checkedOut = records.filter((r) => r.check_out_time).length;

    return {
      totalRecords: records.length,
      uniqueEmployees: uniqueEmployees.size,
      checkedIn,
      checkedOut,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const term = search.trim();
      const matchesSearch =
        term === "" ||
        String(r.emp_id).includes(term) ||
        String(r.id).includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "checked-in" && !r.check_out_time) ||
        (statusFilter === "checked-out" && r.check_out_time);

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const cards = [
    { title: "Total Records", count: stats.totalRecords, icon: <FiUsers />, className: "blue" },
    { title: "Employees", count: stats.uniqueEmployees, icon: <FiUsers />, className: "purple" },
    { title: "Checked In", count: stats.checkedIn, icon: <FiClock />, className: "yellow" },
    { title: "Checked Out", count: stats.checkedOut, icon: <FiCheckCircle />, className: "green" },
  ];

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Header />

        <div className="all-attendance-page">
          <div className="all-attendance-header">
            <div>
              <h2>All Attendance</h2>
              <p className="subtitle">Live data from the attendance API</p>
            </div>

            <button className="refresh-btn" onClick={fetchAttendance} disabled={loading}>
              <FiRefreshCw className={loading ? "spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="attendance-cards-grid">
            {cards.map((card, index) => (
              <div key={index} className="attendance-card">
                <div className={`card-icon ${card.className}`}>{card.icon}</div>
                <h2>{card.count}</h2>
                <p>{card.title}</p>
              </div>
            ))}
          </div>

          <div className="all-attendance-toolbar">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by Employee ID or Record ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="status-filters">
              <button
                className={statusFilter === "all" ? "active" : ""}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={statusFilter === "checked-in" ? "active" : ""}
                onClick={() => setStatusFilter("checked-in")}
              >
                Checked In
              </button>
              <button
                className={statusFilter === "checked-out" ? "active" : ""}
                onClick={() => setStatusFilter("checked-out")}
              >
                Checked Out
              </button>
            </div>
          </div>

          <div className="all-attendance-table-wrapper">
            {loading && (
              <div className="state-message">
                <FiRefreshCw className="spin" />
                <p>Loading attendance records...</p>
              </div>
            )}

            {!loading && error && (
              <div className="state-message error">
                <FiAlertCircle />
                <p>{error}</p>
                <button onClick={fetchAttendance}>Try again</button>
              </div>
            )}

            {!loading && !error && filteredRecords.length === 0 && (
              <div className="state-message">
                <FiXCircle />
                <p>No attendance records found</p>
              </div>
            )}

            {!loading && !error && filteredRecords.length > 0 && (
              <div className="table-scroll">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Record ID</th>
                      <th>Employee ID</th>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Work Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.map((r) => {
                      const status = getStatus(r);
                      return (
                        <tr key={r.id}>
                          <td>#{r.id}</td>
                          <td>{r.emp_id}</td>
                          <td>{formatDate(r.attendance_date)}</td>
                          <td>{formatTime(r.check_in_time)}</td>
                          <td>{formatTime(r.check_out_time)}</td>
                          <td>{formatHours(r.working_hours)}</td>
                          <td>
                            <span className={`status ${status.toLowerCase().replace(" ", "-")}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}