import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axiosInstance";
const AuthContext = createContext(null);
const emptyAttendance = { checkedIn: false, checkInTime: "—", checkOutTime: "—", status: "Not checked in", workingHours: "—" };

export const normalizeRole = (r) => {
  if (!r) return "employee";
  const lower = String(r).toLowerCase().trim().replace(/[\s_-]/g, "");
  if (lower.includes("hr") || lower.includes("admin")) return "hr";
  if (lower.includes("manager") || lower.includes("lead") || lower.includes("supervisor")) return "manager";
  return "employee";
};

const extractErrorMessage = (error, defaultMsg = "Invalid username/email or password.") => {
  if (!error) return defaultMsg;
  if (!error.response) {
    return "Unable to connect to the server. Please check your network.";
  }
  const { status, data } = error.response;
  if (status === 401) {
    if (data?.detail && typeof data.detail === "string" && !data.detail.toLowerCase().includes("unauthorized")) {
      return data.detail;
    }
    if (data?.message && typeof data.message === "string") {
      return data.message;
    }
    return "Invalid username/email or password.";
  }
  if (status === 400) {
    if (data?.errors && typeof data.errors === "object") {
      const messages = Object.values(data.errors).flat().filter(Boolean);
      if (messages.length > 0) return messages.join(" ");
    }
    return data?.detail || data?.title || "Invalid request. Please check your input.";
  }
  if (status === 409) {
    return data?.detail || data?.message || data?.title || "Account state conflict or active session issue. Please contact your administrator.";
  }
  if (status === 403) {
    return "Access denied. Your account does not have permission.";
  }
  if (status === 404) {
    return data?.detail || data?.title || "Requested resource not found.";
  }
  if (status >= 500) {
    return "Server encountered an error. Please try again later.";
  }
  return data?.detail || data?.title || data?.message || defaultMsg;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [helpTickets, setHelpTickets] = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(emptyAttendance);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const refresh = useCallback(async (account) => {
    const sessionToken = localStorage.getItem("token");
    const routes = ["/leave", "/team", "/leave/balances", "/support/tickets", "/documents", "/notifications", "/holidays", "/announcements", "/payroll/payslips", "/attendance"];
    const results = await Promise.allSettled(routes.map(route => api.get(route)));
    if (sessionToken !== localStorage.getItem("token")) return;
    const targetId = account?.id || account?.employeeNumber;
    const setters = [
      data => setLeaveRequests(data.map(x => ({ ...x, duration: `${x.durationDays || 1} Day(s)` }))),
      setTeamMembers,
      data => setLeaveBalances(Object.fromEntries(data.filter(x => x.employeeId === targetId || x.employeeId === account?.employeeNumber || x.employeeId === account?.id).map(x => [x.leaveType.toLowerCase().split(" ")[0], x]))),
      setHelpTickets,
      setDocumentsList,
      setNotificationsList,
      setHolidays,
      setAnnouncements,
      data => setPayslips(data.map(x => ({ ...x, month: `${x.year}-${String(x.month).padStart(2, "0")}`, grossSalary: x.basic + x.allowances, netSalary: x.netPay }))),
      data => {
        setAttendanceRecords(data);
        const own = data.filter(x => x.employeeId === targetId || x.employeeId === account?.employeeNumber || x.employeeId === account?.id).sort((a,b) => `${b.date}${b.checkIn}`.localeCompare(`${a.date}${a.checkIn}`));
        const today = new Date().toLocaleDateString("en-CA");
        const record = own.find(x => !x.checkOut) || own.find(x => x.date === today);
        setTodayAttendance(record ? { checkedIn: !record.checkOut, checkInTime: record.checkIn || "—", checkOutTime: record.checkOut || "—", status: record.status, workingHours: record.workingHours } : emptyAttendance);
      }
    ];
    results.forEach((result, i) => { if (result.status === "fulfilled") setters[i](result.value.data || []); });
  }, []);
  useEffect(() => {
    let active = true;
    if (!localStorage.getItem("token")) { setLoading(false); return; }
    api.get("/auth/me").then(({ data }) => { if (active) { setUser(data); refresh(data); } })
      .catch(() => { localStorage.removeItem("token"); localStorage.removeItem("belnova_user"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh]);
  const login = async (identifier, password, mode = "password") => {
    try {
      const payload = mode === "otp"
        ? { identifier: (identifier || "").trim(), otp: (password || "").trim() }
        : { identifier: (identifier || "").trim(), password: password || "" };
      const { data } = await api.post(mode === "otp" ? "/auth/verify-otp" : "/auth/login", payload);
      const token = data.token || data.accessToken || data.jwt;
      if (token) {
        localStorage.setItem("token", token);
      }
      const userData = data.user || data;
      setUser(userData);
      setError("");
      if (userData) {
        await refresh(userData);
      }
      return { success: true, role: normalizeRole(userData?.role), user: userData, token };
    } catch (e) {
      return { success: false, error: extractErrorMessage(e, "Invalid username/email or password.") };
    }
  };
  const requestOtp = async (identifier) => {
    try { await api.post("/auth/request-otp", { identifier: (identifier || "").trim() }); return { success: true }; }
    catch (e) { return { success: false, error: extractErrorMessage(e, "Failed to send OTP.") }; }
  };
  const logout = async () => {
    try { await api.post("/auth/logout"); } catch (e) { setError(extractErrorMessage(e, "Logout failed.")); }
    finally {
      localStorage.removeItem("token"); localStorage.removeItem("belnova_user"); setUser(null);
      setLeaveRequests([]); setTeamMembers([]); setLeaveBalances({}); setHelpTickets([]); setDocumentsList([]); setNotificationsList([]); setHolidays([]); setAnnouncements([]); setPayslips([]); setAttendanceRecords([]); setTodayAttendance(emptyAttendance);
    }
  };
  const mutate = async (method, path, body) => {
    try { setError(""); const response = await api.request({ method, url: path, data: body }); await refresh(user); return response.data; }
    catch (e) { setError(extractErrorMessage(e, "Operation failed.")); return null; }
  };
  const resetPassword = async (identifier, otp, newPassword) => {
    try {
      await api.post("/auth/reset-password", { identifier: (identifier || "").trim(), otp: (otp || "").trim(), newPassword });
      return { success: true };
    } catch (e) {
      return { success: false, error: extractErrorMessage(e, "Password reset failed.") };
    }
  };

  const withSelf = data => ({ ...(data || {}), employeeId: user?.employeeId || user?.employeeNumber || user?.id });

  return <AuthContext.Provider value={{ user, role: normalizeRole(user?.role), rawRole: user?.role || null, loading, isAuthenticated: !!user, login, logout, requestOtp, resetPassword, refresh, mutate,
    leaveRequests, teamMembers, setTeamMembers, leaveBalances, helpTickets, documentsList, notificationsList, holidays, announcements, payslips, todayAttendance, attendanceRecords,
    requestAttendanceCorrection: data => mutate("post", "/attendance/corrections", withSelf(data)),
    decideAttendanceCorrection: (id, status, note = "") => mutate("post", `/attendance/corrections/${id}/decision`, { status, note }),
    deleteAttendanceCorrection: id => mutate("delete", `/attendance/corrections/${id}`),
    syncBiometricDevice: id => mutate("post", `/biometric/devices/${id}/sync`),
    updateCandidateStage: (id, stage) => mutate("post", `/recruitment/candidates/${id}/stage`, { stage }),
    handleApproveLeave: id => mutate("patch", `/leave/${id}/decision`, { status: "Approved" }),
    handleRejectLeave: (id, reason = "") => mutate("patch", `/leave/${id}/decision`, { status: "Rejected", reason }),
    handleAddLeaveRequest: data => mutate("post", "/leave", {
      employeeId: user?.employeeId || user?.employeeNumber || user?.id,
      employeeName: user?.name || "Employee",
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason
    }),
    addHelpTicket: data => mutate("post", "/support/tickets", withSelf(data)),
    updateHelpTicketStatus: (id, status, responseNote = "") => mutate("patch", `/support/tickets/${id}`, { status, responseNote }),
    addEmployeeDocument: async data => {
      try {
        const form = new FormData(); form.append("file", data.file);
        const uploaded = await api.post("/files", form, { headers: { "Content-Type": "multipart/form-data" } });
        return await mutate("post", "/documents", withSelf({ title: data.title, category: data.category, fileName: uploaded.data.fileName, fileId: uploaded.data.id }));
      } catch (e) { setError(extractErrorMessage(e, "Document upload failed.")); return null; }
    },
    verifyEmployeeDocument: (id, status = "Verified") => mutate("patch", `/documents/${id}/status`, { status }),
    sendNotification: data => mutate("post", "/notifications", data),
    markNotificationAsRead: id => mutate("patch", `/notifications/${id}/read`),
    markAllNotificationsAsRead: () => mutate("patch", "/notifications/read-all"),
    toggleCheckInOut: () => mutate("post", todayAttendance.checkedIn ? "/attendance/check-out" : "/attendance/check-in", withSelf({}))
  }}>
    {error && <div role="alert" style={{ padding: 12, background: "#fee2e2", color: "#991b1b" }}>{error} <button onClick={() => setError("")}>Dismiss</button></div>}
    {children}
  </AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
