import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axiosInstance";
const AuthContext = createContext(null);
const emptyAttendance = { checkedIn: false, checkInTime: "—", checkOutTime: "—", status: "Not checked in", workingHours: "—" };
const message = (error) => error.response?.data?.title || error.response?.data?.detail || "Unable to reach the server. Please try again.";
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
    const setters = [data => setLeaveRequests(data.map(x => ({ ...x, duration: `${x.durationDays} Day(s)` }))), setTeamMembers,
      data => setLeaveBalances(Object.fromEntries(data.filter(x => x.employeeId === account.id).map(x => [x.leaveType.toLowerCase().split(" ")[0], x]))),
      setHelpTickets, setDocumentsList, setNotificationsList, setHolidays, setAnnouncements, data => setPayslips(data.map(x => ({ ...x, month: `${x.year}-${String(x.month).padStart(2, "0")}`, grossSalary: x.basic + x.allowances, netSalary: x.netPay }))),
      data => { setAttendanceRecords(data); const own = data.filter(x => x.employeeId === account.id).sort((a,b) => `${b.date}${b.checkIn}`.localeCompare(`${a.date}${a.checkIn}`));
        const today = new Date().toLocaleDateString("en-CA");
        const record = own.find(x => !x.checkOut) || own.find(x => x.date === today);
        setTodayAttendance(record ? { checkedIn: !record.checkOut, checkInTime: record.checkIn || "—", checkOutTime: record.checkOut || "—", status: record.status, workingHours: record.workingHours } : emptyAttendance);
      }];
    results.forEach((result, i) => { if (result.status === "fulfilled") setters[i](result.value.data || []); });
    if (results.some(x => x.status === "rejected")) setError("Some records could not be loaded. Please refresh and try again.");
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
      const { data } = await api.post(mode === "otp" ? "/auth/verify-otp" : "/auth/login", mode === "otp" ? { identifier, otp: password } : { identifier, password });
      localStorage.setItem("token", data.token); setUser(data.user); setError(""); await refresh(data.user);
      return { success: true, role: data.user.role, user: data.user };
    } catch (e) { return { success: false, error: message(e) }; }
  };
  const requestOtp = async (identifier) => {
    try { await api.post("/auth/request-otp", { identifier }); return { success: true }; }
    catch (e) { return { success: false, error: message(e) }; }
  };
  const logout = async () => {
    try { await api.post("/auth/logout"); } catch (e) { setError(message(e)); }
    finally {
      localStorage.removeItem("token"); localStorage.removeItem("belnova_user"); setUser(null);
      setLeaveRequests([]); setTeamMembers([]); setLeaveBalances({}); setHelpTickets([]); setDocumentsList([]); setNotificationsList([]); setHolidays([]); setAnnouncements([]); setPayslips([]); setAttendanceRecords([]); setTodayAttendance(emptyAttendance);
    }
  };
  const mutate = async (method, path, body) => {
    try { setError(""); const response = await api.request({ method, url: path, data: body }); await refresh(user); return response.data; }
    catch (e) { setError(message(e)); return null; }
  };
  const self = data => ({ ...data, employeeId: user.id });
  return <AuthContext.Provider value={{ user, role: user?.role || null, loading, isAuthenticated: !!user, login, logout, requestOtp,
    leaveRequests, teamMembers, setTeamMembers, leaveBalances, helpTickets, documentsList, notificationsList, holidays, announcements, payslips, todayAttendance, attendanceRecords,
    requestAttendanceCorrection: data => mutate("post", "/attendance/corrections", data),
    handleApproveLeave: id => mutate("patch", `/leave/${id}/decision`, { status: "Approved" }),
    handleRejectLeave: (id, reason = "") => mutate("patch", `/leave/${id}/decision`, { status: "Rejected", reason }),
    handleAddLeaveRequest: data => mutate("post", "/leave", self(data)),
    addHelpTicket: data => mutate("post", "/support/tickets", self(data)),
    updateHelpTicketStatus: (id, status, responseNote = "") => mutate("patch", `/support/tickets/${id}`, { status, responseNote }),
    addEmployeeDocument: async data => {
      try {
        const form = new FormData(); form.append("file", data.file);
        const uploaded = await api.post("/files", form, { headers: { "Content-Type": "multipart/form-data" } });
        return await mutate("post", "/documents", self({ title: data.title, category: data.category, fileName: uploaded.data.fileName, fileId: uploaded.data.id }));
      } catch (e) { setError(message(e)); return null; }
    },
    verifyEmployeeDocument: (id, status = "Verified") => mutate("patch", `/documents/${id}/status`, { status }),
    sendNotification: data => mutate("post", "/notifications", data),
    markNotificationAsRead: id => mutate("patch", `/notifications/${id}/read`),
    markAllNotificationsAsRead: () => mutate("patch", "/notifications/read-all"),
    toggleCheckInOut: () => mutate("post", todayAttendance.checkedIn ? "/attendance/check-out" : "/attendance/check-in", self({}))
  }}>
    {error && <div role="alert" style={{ padding: 12, background: "#fee2e2", color: "#991b1b" }}>{error} <button onClick={() => setError("")}>Dismiss</button></div>}
    {children}
  </AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
