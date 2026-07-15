const API_BASE = "https://belnova-hrms-be-tckt.onrender.com";

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const errBody = await res.json();
      message = errBody?.detail || errBody?.message || message;
    } catch {
      // response wasn't JSON, ignore
    }
    throw new Error(message);
  }

  // DELETE routes may return an empty body
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Log in / check in an employee.
 * POST /attendance/login
 */
export async function loginAttendance(payload) {
  const res = await fetch(`${API_BASE}/attendance/login`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

/**
 * Log out / check out an employee.
 * POST /attendance/logout/{emp_id}
 */
export async function logoutAttendance(empId) {
  const res = await fetch(`${API_BASE}/attendance/logout/${empId}`, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  });

  return handleResponse(res);
}

/**
 * Fetch attendance records.
 * GET /attendance/?export=false
 */
export async function getAttendance({ exportData = false } = {}) {
  const res = await fetch(
    `${API_BASE}/attendance/?export=${exportData}`,
    {
      headers: { accept: "application/json" },
    }
  );

  const data = await handleResponse(res);
  return Array.isArray(data) ? data : [];
}

/**
 * Delete an attendance record.
 * DELETE /attendance/delete/{attendance_id}
 */
export async function deleteAttendance(attendanceId) {
  const res = await fetch(`${API_BASE}/attendance/delete/${attendanceId}`, {
    method: "DELETE",
    headers: { accept: "application/json" },
  });

  return handleResponse(res);
}

const attendanceService = {
  loginAttendance,
  logoutAttendance,
  getAttendance,
  deleteAttendance,
};

export default attendanceService;