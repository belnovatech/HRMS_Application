import React, { useMemo, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useAuth } from "../../context/AuthContext";
import {
  FiClock,
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import "./EmployeeAttendance.css";

/*
 * Attendance data is generated from the selected month instead of
 * hardcoding 2026 dates. When the month changes, the dates update
 * automatically.
 *
 * The correction request is stored as an HR notification in localStorage
 * and a browser event is dispatched so an HR notification component can
 * refresh immediately when it is listening for "hr-notification-created".
 */

const HR_NOTIFICATION_STORAGE_KEY = "hrNotifications";

const formatTime = (value) => value || "—";

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTableDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const getMonthLabel = (monthValue) => {
  if (!monthValue) return "";

  const [year, month] = monthValue.split("-").map(Number);

  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const getDaysInSelectedMonth = (monthValue) => {
  const [year, month] = monthValue.split("-").map(Number);
  return new Date(year, month, 0).getDate();
};

const getWeekdayName = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
  });

const getWorkingDaysInMonth = (monthValue) => {
  const [year, month] = monthValue.split("-").map(Number);
  const days = new Date(year, month, 0).getDate();

  let count = 0;

  for (let day = 1; day <= days; day += 1) {
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();

    if (weekday !== 0 && weekday !== 6) {
      count += 1;
    }
  }

  return count;
};

const getDateRangeForMonth = (monthValue) => {
  const [year, month] = monthValue.split("-").map(Number);
  const totalDays = getDaysInSelectedMonth(monthValue);

  const today = new Date();
  const currentMonthValue = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  const lastAllowedDay =
    monthValue === currentMonthValue
      ? today.getDate()
      : totalDays;

  const dates = [];

  for (let day = lastAllowedDay; day >= 1; day -= 1) {
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();

    // Only show working days in the attendance log.
    if (weekday !== 0 && weekday !== 6) {
      dates.push(date);
    }

    // Keep the table compact like the reference design.
    if (dates.length === 6) break;
  }

  return dates;
};

const buildDynamicAttendance = (monthValue, todayAttendance) => {
  const dates = getDateRangeForMonth(monthValue);

  return dates.map((date, index) => {
    const dateKey = getDateKey(date);
    const todayKey = getDateKey(new Date());

    // The first row is always connected to the actual AuthContext data
    // when the selected month is the current month.
    if (dateKey === todayKey) {
      return {
        date: dateKey,
        day: getWeekdayName(date),
        checkIn: formatTime(todayAttendance?.checkInTime),
        checkOut: formatTime(todayAttendance?.checkOutTime),
        hours: formatTime(todayAttendance?.workingHours),
        status: todayAttendance?.status || "Present",
      };
    }

    /*
     * Demo fallback rows for the existing UI.
     * Dates are dynamic; these values are only used when the application
     * does not yet provide historical attendance from an API/context.
     */
    const fallbackRows = [
      {
        checkIn: "09:30 AM",
        checkOut: "06:30 PM",
        hours: "9h 00m",
        status: "Present",
      },
      {
        checkIn: "10:15 AM",
        checkOut: "06:45 PM",
        hours: "8h 30m",
        status: "Late",
      },
      {
        checkIn: "—",
        checkOut: "—",
        hours: "—",
        status: "Leave",
      },
      {
        checkIn: "09:38 AM",
        checkOut: "06:40 PM",
        hours: "9h 02m",
        status: "Present",
      },
      {
        checkIn: "09:50 AM",
        checkOut: "06:35 PM",
        hours: "8h 45m",
        status: "Present",
      },
    ];

    const fallback = fallbackRows[(index - 1 + fallbackRows.length) % fallbackRows.length];

    return {
      date: dateKey,
      day: getWeekdayName(date),
      ...fallback,
    };
  });
};

export default function EmployeeAttendance() {
  const { user, todayAttendance, toggleCheckInOut } = useAuth();

  const currentMonth = useMemo(() => {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  const [correctionDate, setCorrectionDate] = useState(
    getDateKey(new Date())
  );

  const [correctionReason, setCorrectionReason] = useState("");

  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);

  const attendanceHistory = useMemo(
    () => buildDynamicAttendance(selectedMonth, todayAttendance),
    [selectedMonth, todayAttendance]
  );

  const summary = useMemo(() => {
    const workingDays = getWorkingDaysInMonth(selectedMonth);

    const present = attendanceHistory.filter(
      (item) => item.status?.toLowerCase() === "present"
    ).length;

    const absent = attendanceHistory.filter(
      (item) => item.status?.toLowerCase() === "absent"
    ).length;

    const late = attendanceHistory.filter(
      (item) => item.status?.toLowerCase() === "late"
    ).length;

    const leave = attendanceHistory.filter(
      (item) => item.status?.toLowerCase() === "leave"
    ).length;

    return {
      workingDays,
      present,
      absent,
      late,
      leave,
    };
  }, [attendanceHistory, selectedMonth]);

  const openCorrectionRequest = () => {
    setCorrectionDate(getDateKey(new Date()));
    setCorrectionReason("");
    setCorrectionSubmitted(false);
    setShowCorrectionModal(true);
  };

  const closeCorrectionRequest = () => {
    setShowCorrectionModal(false);
    setCorrectionReason("");
    setCorrectionSubmitted(false);
  };

  const submitCorrectionRequest = (event) => {
    event.preventDefault();

    const employeeName = user?.name || "Employee";
    const employeeId = user?.employeeId || "EMP001";

    const notification = {
      id: `ATT-CORR-${Date.now()}`,
      type: "attendance_correction",
      title: "Attendance Correction Request",
      message: `${employeeName} (${employeeId}) requested an attendance correction for ${correctionDate}.`,
      reason: correctionReason.trim(),
      employeeId,
      employeeName,
      requestedDate: correctionDate,
      status: "Pending",
      createdAt: new Date().toISOString(),
      audience: "HR",
      read: false,
    };

    try {
      const existingNotifications = JSON.parse(
        localStorage.getItem(HR_NOTIFICATION_STORAGE_KEY) || "[]"
      );

      localStorage.setItem(
        HR_NOTIFICATION_STORAGE_KEY,
        JSON.stringify([
          notification,
          ...existingNotifications,
        ])
      );

      window.dispatchEvent(
        new CustomEvent("hr-notification-created", {
          detail: notification,
        })
      );
    } catch (error) {
      console.error("Unable to create HR notification:", error);
    }

    setCorrectionSubmitted(true);
  };

  return (
    <EmployeeLayout title="My Attendance" breadcrumb="Attendance">
      <div className="emp-attendance-page">

        {/* =====================================================
            PAGE HEADER
           ===================================================== */}
        <section className="emp-attendance-header">
          <div>
            <h1>My Attendance</h1>
            <p>{getMonthLabel(selectedMonth)}</p>
          </div>

          <button
            type="button"
            className="emp-attendance-correction-btn"
            onClick={openCorrectionRequest}
          >
            <FiAlertCircle />
            Request Correction
          </button>
        </section>


        {/* =====================================================
            SUMMARY CARDS
           ===================================================== */}
        <section className="emp-attendance-summary-grid">

          <div className="emp-attendance-summary-card">
            <strong className="emp-attendance-summary-blue">
              {summary.workingDays}
            </strong>
            <span>Working Days</span>
          </div>

          <div className="emp-attendance-summary-card">
            <strong className="emp-attendance-summary-green">
              {summary.present}
            </strong>
            <span>Present</span>
          </div>

          <div className="emp-attendance-summary-card">
            <strong className="emp-attendance-summary-red">
              {summary.absent}
            </strong>
            <span>Absent</span>
          </div>

          <div className="emp-attendance-summary-card">
            <strong className="emp-attendance-summary-orange">
              {summary.late}
            </strong>
            <span>Late</span>
          </div>

          <div className="emp-attendance-summary-card">
            <strong className="emp-attendance-summary-purple">
              {summary.leave}
            </strong>
            <span>Leave</span>
          </div>

        </section>


        {/* =====================================================
            ATTENDANCE TABLE
           ===================================================== */}
        <section className="emp-attendance-table-card">

          <div className="emp-attendance-table-header">
            <h2>Attendance Log</h2>

            <div className="emp-attendance-month-control">
              <FiCalendar />

              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                aria-label="Select attendance month"
              />
            </div>
          </div>

          <div className="emp-attendance-table-scroll">
            <table className="emp-attendance-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>CHECK IN</th>
                  <th>CHECK OUT</th>
                  <th>HOURS</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {attendanceHistory.length > 0 ? (
                  attendanceHistory.map((item) => (
                    <tr key={item.date}>

                      <td>
                        <strong>
                          {formatTableDate(
                            new Date(`${item.date}T00:00:00`)
                          )}
                        </strong>
                      </td>

                      <td className="emp-attendance-checkin">
                        {item.checkIn}
                      </td>

                      <td className="emp-attendance-checkout">
                        {item.checkOut}
                      </td>

                      <td className="emp-attendance-hours">
                        {item.hours}
                      </td>

                      <td>
                        <span
                          className={`emp-attendance-status emp-attendance-status-${String(
                            item.status || "unknown"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {item.status}
                        </span>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="emp-attendance-empty"
                    >
                      No attendance records found for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>


        {/* =====================================================
            TODAY'S ATTENDANCE
            Kept small and secondary so page matches screenshot.
           ===================================================== */}
        <section className="emp-attendance-today-card">

          <div className="emp-attendance-today-info">
            <div className="emp-attendance-today-icon">
              <FiClock />
            </div>

            <div>
              <h2>Today's Attendance</h2>

              <p>
                Status:
                <strong>
                  {todayAttendance?.status || "Present"}
                </strong>

                <span>
                  {todayAttendance?.workingHours || "—"}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            className="emp-attendance-check-btn"
            onClick={toggleCheckInOut}
          >
            <FiClock />

            {todayAttendance?.checkedIn &&
            todayAttendance?.checkOutTime === "—"
              ? "Mark Check Out"
              : "Mark Check In"}
          </button>

        </section>


        {/* =====================================================
            CORRECTION REQUEST MODAL
           ===================================================== */}
        {showCorrectionModal && (
          <div
            className="emp-attendance-modal-overlay"
            onClick={closeCorrectionRequest}
          >
            <div
              className="emp-attendance-modal"
              onClick={(event) => event.stopPropagation()}
            >

              {!correctionSubmitted ? (
                <>
                  <div className="emp-attendance-modal-header">
                    <div>
                      <span className="emp-attendance-modal-kicker">
                        HR NOTIFICATION
                      </span>

                      <h2>Request Attendance Correction</h2>

                      <p>
                        Submit a correction request. HR will receive a
                        notification for review.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="emp-attendance-modal-close"
                      onClick={closeCorrectionRequest}
                      aria-label="Close"
                    >
                      <FiX />
                    </button>
                  </div>

                  <form
                    className="emp-attendance-correction-form"
                    onSubmit={submitCorrectionRequest}
                  >
                    <label>
                      Attendance Date

                      <input
                        type="date"
                        value={correctionDate}
                        onChange={(event) =>
                          setCorrectionDate(event.target.value)
                        }
                        required
                      />
                    </label>

                    <label>
                      Reason for Correction

                      <textarea
                        value={correctionReason}
                        onChange={(event) =>
                          setCorrectionReason(event.target.value)
                        }
                        placeholder="Explain what needs to be corrected..."
                        rows="4"
                        required
                      />
                    </label>

                    <div className="emp-attendance-modal-actions">
                      <button
                        type="button"
                        className="emp-attendance-cancel-btn"
                        onClick={closeCorrectionRequest}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="emp-attendance-submit-btn"
                      >
                        Send to HR
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="emp-attendance-success-state">

                  <div className="emp-attendance-success-icon">
                    <FiCheckCircle />
                  </div>

                  <h2>Request Sent</h2>

                  <p>
                    Your attendance correction request has been sent to HR.
                    They can review it from their notifications.
                  </p>

                  <button
                    type="button"
                    className="emp-attendance-submit-btn"
                    onClick={closeCorrectionRequest}
                  >
                    Done
                  </button>

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}
