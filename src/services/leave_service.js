import { apiGet, apiPostJson, apiPostForm } from "./apiClient";

/**
 * Apply for leave.
 * POST /leave/apply  (multipart/form-data)
 *
 * fields: emp_id, leavetype_id, start_date, end_date,
 *         from_date_session_id, to_date_session_id,
 *         reason, mobile, reporting_manager_id, cc, upload_file
 */
export async function applyLeave(fields) {
  return apiPostForm("/leave/apply", fields);
}

/**
 * Get pending leave requests for an employee.
 * GET /leave/pending/{emp_id}?limit=&offset=
 */
export async function getPendingLeaves(empId, { limit = 10, offset = 0 } = {}) {
  const data = await apiGet(`/leave/pending/${empId}`, { limit, offset });
  return Array.isArray(data) ? data : [];
}

/**
 * Approve or reject a leave request.
 * POST /leave/approve-reject
 *
 * payload shape depends on your backend, typically:
 * { leave_request_id, status_id, remarks }
 */
export async function approveRejectLeave(payload) {
  return apiPostJson("/leave/approve-reject", payload);
}

/**
 * Get full leave history for an employee.
 * GET /leave/history/{emp_id}?limit=&offset=
 */
export async function getLeaveHistory(empId, { limit = 10, offset = 0 } = {}) {
  const data = await apiGet(`/leave/history/${empId}`, { limit, offset });
  return Array.isArray(data) ? data : [];
}

/**
 * Get monthly leave summary for an employee.
 * GET /leave/monthly-summary?emp_id=&year=&month=
 */
export async function getMonthlySummary({ empId, year, month }) {
  return apiGet("/leave/monthly-summary", { emp_id: empId, year, month });
}

const leaveService = {
  applyLeave,
  getPendingLeaves,
  approveRejectLeave,
  getLeaveHistory,
  getMonthlySummary,
};

export default leaveService;