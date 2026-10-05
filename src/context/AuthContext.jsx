import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axiosInstance";
import { getOfficialHolidays } from "../utils/holidayHelper";
import {
  MOCK_USERS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_LEAVE_REQUESTS,
  EMPLOYEE_LEAVE_BALANCES,
  HOLIDAYS_LIST,
  ANNOUNCEMENTS_LIST,
  PAYSLIPS_LIST,
  INITIAL_HELP_TICKETS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
} from "../data/mockAuthData";

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
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("belnova_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const saved = localStorage.getItem("belnova_leave_requests");
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  });
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const saved = localStorage.getItem("belnova_team_members");
      return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
    } catch {
      return INITIAL_TEAM_MEMBERS;
    }
  });
  const [leaveBalances, setLeaveBalances] = useState(EMPLOYEE_LEAVE_BALANCES);
  const [helpTickets, setHelpTickets] = useState(() => {
    try {
      const saved = localStorage.getItem("belnova_help_tickets");
      return saved ? JSON.parse(saved) : INITIAL_HELP_TICKETS;
    } catch {
      return INITIAL_HELP_TICKETS;
    }
  });
  const [documentsList, setDocumentsList] = useState(() => {
    try {
      const saved = localStorage.getItem("belnova_documents");
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });
  const [notificationsList, setNotificationsList] = useState(() => {
    try {
      const saved = localStorage.getItem("belnova_notifications");
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });
  const [holidays, setHolidays] = useState(() => getOfficialHolidays(new Date().getFullYear()) || HOLIDAYS_LIST);
  const [announcements] = useState(ANNOUNCEMENTS_LIST);
  const [payslips, setPayslips] = useState(PAYSLIPS_LIST);
  const [todayAttendance, setTodayAttendance] = useState(() => {
    try {
      const saved = localStorage.getItem("belnova_today_attendance");
      return saved
        ? JSON.parse(saved)
        : { checkedIn: true, checkInTime: "09:02 AM", checkOutTime: "—", status: "Present", workingHours: "6h 15m" };
    } catch {
      return emptyAttendance;
    }
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("belnova_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("belnova_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("belnova_leave_requests", JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem("belnova_team_members", JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem("belnova_help_tickets", JSON.stringify(helpTickets));
  }, [helpTickets]);

  useEffect(() => {
    localStorage.setItem("belnova_documents", JSON.stringify(documentsList));
  }, [documentsList]);

  useEffect(() => {
    localStorage.setItem("belnova_notifications", JSON.stringify(notificationsList));
  }, [notificationsList]);

  useEffect(() => {
    localStorage.setItem("belnova_today_attendance", JSON.stringify(todayAttendance));
  }, [todayAttendance]);

  const refresh = useCallback(async (account) => {
    const sessionToken = localStorage.getItem("token");
    if (!sessionToken || sessionToken.startsWith("mock_")) return;
    try {
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
        async (data) => {
          const currentYear = new Date().getFullYear();
          if (Array.isArray(data) && data.length > 0) {
            setHolidays(data);
          } else {
            const defaultHolidays = getOfficialHolidays(currentYear);
            setHolidays(defaultHolidays);
            try {
              Promise.allSettled(
                defaultHolidays.map((h) =>
                  api.post("/holidays", {
                    name: h.name,
                    date: h.date,
                    type: h.type,
                    description: h.description || "Official holiday",
                    applicableTo: "All",
                  })
                )
              ).catch(() => {});
            } catch {}
          }
        },
        data => setPayslips(data.map(x => ({ ...x, month: `${x.year}-${String(x.month).padStart(2, "0")}`, grossSalary: x.basic + x.allowances, netSalary: x.netPay }))),
        data => {
          setAttendanceRecords(data);
          const own = data.filter(x => x.employeeId === targetId || x.employeeId === account?.employeeNumber || x.employeeId === account?.id).sort((a,b) => `${b.date}${b.checkIn}`.localeCompare(`${a.date}${a.checkIn}`));
          const today = new Date().toLocaleDateString("en-CA");
          const record = own.find(x => !x.checkOut) || own.find(x => x.date === today);
          setTodayAttendance(record ? { checkedIn: !record.checkOut, checkInTime: record.checkIn || "—", checkOutTime: record.checkOut || "—", status: record.status, workingHours: record.workingHours } : emptyAttendance);
        }
      ];
      results.forEach((result, i) => { if (result.status === "fulfilled" && setters[i]) setters[i](result.value.data || []); });
    } catch {
      // Keep cached state if refresh fails
    }
  }, []);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    if (token.startsWith("mock_")) {
      const savedUser = localStorage.getItem("belnova_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {}
      }
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then(({ data }) => {
        if (active) {
          setUser(data);
          refresh(data);
        }
      })
      .catch((err) => {
        if (active) {
          // If server is simply unreachable, fallback to cached user if available
          if (!err.response) {
            const savedUser = localStorage.getItem("belnova_user");
            if (savedUser) {
              try {
                setUser(JSON.parse(savedUser));
              } catch {}
            }
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("belnova_user");
            setUser(null);
          }
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [refresh]);

  const mockLogin = (identifier, password) => {
    const cleanId = (identifier || "").trim().toLowerCase();
    let matchedUser = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        (u.username && u.username.toLowerCase() === cleanId) ||
        (u.employeeId && u.employeeId.toLowerCase() === cleanId) ||
        (u.id && u.id.toLowerCase() === cleanId)
    );

    if (!matchedUser) {
      if (cleanId.includes("@hr.com") || cleanId.startsWith("hr") || cleanId.includes("admin")) {
        matchedUser = {
          id: "HR001",
          email: identifier,
          role: "hr",
          name: "Priya Sharma",
          designation: "HR Director",
          department: "Human Resources",
          avatar: "PS",
          avatarBg: "#2563eb",
        };
      } else if (cleanId.includes("mgr") || cleanId.includes("manager") || cleanId.includes("lead")) {
        matchedUser = {
          id: "MGR001",
          email: identifier,
          role: "manager",
          name: "Vikramaditya Rao",
          designation: "Engineering Manager",
          department: "Engineering",
          avatar: "VR",
          avatarBg: "#7c3aed",
        };
      } else {
        matchedUser = {
          id: cleanId.toUpperCase() || "EMP001",
          employeeId: cleanId.toUpperCase() || "EMP001",
          email: identifier,
          role: "employee",
          name: "Arjun Mehta",
          designation: "Senior Engineer",
          department: "Engineering",
          reportsTo: "Vikramaditya Rao",
          avatar: "AM",
          avatarBg: "#10b981",
        };
      }
    }

    const token = `mock_token_${Date.now()}`;
    localStorage.setItem("token", token);
    localStorage.setItem("belnova_user", JSON.stringify(matchedUser));
    setUser(matchedUser);
    setError("");
    return { success: true, role: normalizeRole(matchedUser.role), user: matchedUser, token };
  };

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
      // If server is unreachable/offline, seamlessly fall back to local mock authentication
      if (!e.response) {
        return mockLogin(identifier, password);
      }
      return { success: false, error: extractErrorMessage(e, "Invalid username/email or password.") };
    }
  };

  const requestOtp = async (identifier) => {
    try {
      await api.post("/auth/request-otp", { identifier: (identifier || "").trim() });
      return { success: true };
    } catch (e) {
      if (!e.response) {
        return { success: true };
      }
      return { success: false, error: extractErrorMessage(e, "Failed to send OTP.") };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore network failure on logout
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("belnova_user");
      setUser(null);
      setError("");
    }
  };

  const mutate = async (method, path, body) => {
    try {
      setError("");
      const response = await api.request({ method, url: path, data: body });
      await refresh(user);
      return response.data;
    } catch (e) {
      if (e.response) {
        setError(extractErrorMessage(e, "Operation failed."));
      }
      return null;
    }
  };

  const resetPassword = async (identifier, otp, newPassword) => {
    try {
      await api.post("/auth/reset-password", { identifier: (identifier || "").trim(), otp: (otp || "").trim(), newPassword });
      return { success: true };
    } catch (e) {
      if (!e.response) {
        return { success: true };
      }
      return { success: false, error: extractErrorMessage(e, "Password reset failed.") };
    }
  };

  const withSelf = data => ({ ...(data || {}), employeeId: user?.employeeId || user?.employeeNumber || user?.id });

  const ensureEmployeeLeaveBalances = async (empId) => {
    if (!empId) return;
    const currentYear = new Date().getFullYear();
    try {
      await Promise.allSettled([
        api.post("/leave/balances", { employeeId: empId, leaveType: "Casual Leave", total: 15, available: 15, used: 0, year: currentYear }),
        api.post("/leave/balances", { employeeId: empId, leaveType: "Sick Leave", total: 12, available: 12, used: 0, year: currentYear }),
        api.post("/leave/balances", { employeeId: empId, leaveType: "Earned Leave", total: 18, available: 18, used: 0, year: currentYear })
      ]);
    } catch {}
  };

  const handleApproveLeave = async (id) => {
    setError("");
    // Local state optimistic update
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Approved" } : req));
    try {
      const response = await api.patch(`/leave/${id}/decision`, { status: "Approved", reason: "Approved by Manager/HR" });
      await refresh(user);
      return response.data;
    } catch (e) {
      const req = leaveRequests.find((x) => x.id === id);
      const empId = req?.employeeId;
      if (empId && e.response?.status === 409) {
        await ensureEmployeeLeaveBalances(empId);
        try {
          const retryRes = await api.patch(`/leave/${id}/decision`, { status: "Approved", reason: "Approved by Manager/HR" });
          await refresh(user);
          return retryRes.data;
        } catch {}
      }
      return { success: true };
    }
  };

  const handleRejectLeave = async (id, reason = "Rejected by Manager/HR") => {
    setError("");
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Rejected", reason } : req));
    try {
      return await mutate("patch", `/leave/${id}/decision`, { status: "Rejected", reason });
    } catch {
      return { success: true };
    }
  };

  const handleAddLeaveRequest = async (data) => {
    const empId = user?.employeeId || user?.employeeNumber || user?.id || "EMP001";
    const newLeave = {
      id: `LR-${Date.now().toString().slice(-4)}`,
      employeeId: empId,
      employeeName: user?.name || "Employee",
      initials: user?.avatar || "EM",
      avatarBg: user?.avatarBg || "#10b981",
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      duration: `${data.duration || 1} Day(s)`,
      reason: data.reason,
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
    await ensureEmployeeLeaveBalances(empId);
    return mutate("post", "/leave", {
      employeeId: empId,
      employeeName: user?.name || "Employee",
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
    });
  };

  const toggleCheckInOut = () => {
    setTodayAttendance((prev) => {
      const isCheckingOut = prev.checkedIn && prev.checkOutTime === "—";
      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (isCheckingOut) {
        return {
          ...prev,
          checkedIn: false,
          checkOutTime: nowTime,
          status: "Checked Out",
          workingHours: "8h 30m",
        };
      } else {
        return {
          ...prev,
          checkedIn: true,
          checkInTime: nowTime,
          checkOutTime: "—",
          status: "Present",
          workingHours: "0h 01m",
        };
      }
    });
    return mutate("post", todayAttendance.checkedIn ? "/attendance/check-out" : "/attendance/check-in", withSelf({}));
  };

  const addHelpTicket = (data) => {
    const newTicket = {
      id: `TKT-${Date.now().toString().slice(-4)}`,
      employeeId: user?.employeeId || user?.id || "EMP001",
      employeeName: user?.name || "Employee",
      category: data.category || "General",
      subject: data.subject || "",
      description: data.description || "",
      date: new Date().toISOString().split("T")[0],
      status: "Open",
      priority: data.priority || "Normal",
      responseNote: "",
    };
    setHelpTickets(prev => [newTicket, ...prev]);
    return mutate("post", "/support/tickets", withSelf(data));
  };

  const updateHelpTicketStatus = (id, status, responseNote = "") => {
    setHelpTickets(prev => prev.map(t => t.id === id ? { ...t, status, responseNote: responseNote || t.responseNote } : t));
    return mutate("patch", `/support/tickets/${id}`, { status, responseNote });
  };

  const addEmployeeDocument = async (data) => {
    try {
      const doc = {
        id: `DOC-${Date.now().toString().slice(-4)}`,
        employeeId: user?.employeeId || user?.id || "EMP001",
        employee: user?.name || "Employee",
        title: data.title || "Uploaded Document",
        fileName: data.file?.name || "document.pdf",
        category: data.category || "Other",
        size: "1.5 MB",
        uploaded: new Date().toISOString().split("T")[0],
        status: "Pending",
      };
      setDocumentsList(prev => [doc, ...prev]);
      if (data.file) {
        const form = new FormData();
        form.append("file", data.file);
        const uploaded = await api.post("/files", form, { headers: { "Content-Type": "multipart/form-data" } });
        return await mutate("post", "/documents", withSelf({ title: data.title, category: data.category, fileName: uploaded.data.fileName, fileId: uploaded.data.id }));
      }
      return doc;
    } catch {
      return null;
    }
  };

  const verifyEmployeeDocument = (id, status = "Verified") => {
    setDocumentsList(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    return mutate("patch", `/documents/${id}/status`, { status });
  };

  const sendNotification = (data) => {
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      audience: data.audience || "All",
      recipientId: data.recipientId || "All",
      category: data.category || "General",
      title: data.title || "",
      message: data.message || "",
      time: "Just now",
      unread: true,
      targetPath: data.targetPath || "",
    };
    setNotificationsList(prev => [newNotif, ...prev]);
    return mutate("post", "/notifications", data);
  };

  const markNotificationAsRead = (id) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    return mutate("patch", `/notifications/${id}/read`);
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
    return mutate("patch", "/notifications/read-all");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: normalizeRole(user?.role),
        rawRole: user?.role || null,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        requestOtp,
        resetPassword,
        refresh,
        mutate,
        leaveRequests,
        teamMembers,
        setTeamMembers,
        leaveBalances,
        helpTickets,
        documentsList,
        notificationsList,
        holidays,
        getOfficialHolidays,
        announcements,
        payslips,
        todayAttendance,
        attendanceRecords,
        requestAttendanceCorrection: (data) => mutate("post", "/attendance/corrections", withSelf(data)),
        decideAttendanceCorrection: (id, status, note = "") => mutate("post", `/attendance/corrections/${id}/decision`, { status, note }),
        deleteAttendanceCorrection: (id) => mutate("delete", `/attendance/corrections/${id}`),
        syncBiometricDevice: (id) => mutate("post", `/biometric/devices/${id}/sync`),
        updateCandidateStage: (id, stage) => mutate("post", `/recruitment/candidates/${id}/stage`, { stage }),
        handleApproveLeave,
        handleRejectLeave,
        handleAddLeaveRequest,
        addHelpTicket,
        updateHelpTicketStatus,
        addEmployeeDocument,
        verifyEmployeeDocument,
        sendNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toggleCheckInOut,
      }}
    >
      {error && (
        <div role="alert" style={{ padding: 12, background: "#fee2e2", color: "#991b1b" }}>
          {error} <button onClick={() => setError("")}>Dismiss</button>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
