import React, { createContext, useContext, useState, useEffect } from "react";
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("belnova_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem("belnova_leave_requests");
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem("belnova_team_members");
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  const [leaveBalances, setLeaveBalances] = useState(() => {
    const saved = localStorage.getItem("belnova_leave_balances");
    return saved ? JSON.parse(saved) : EMPLOYEE_LEAVE_BALANCES;
  });

  const [helpTickets, setHelpTickets] = useState(() => {
    const saved = localStorage.getItem("belnova_help_tickets");
    return saved ? JSON.parse(saved) : INITIAL_HELP_TICKETS;
  });

  const [documentsList, setDocumentsList] = useState(() => {
    const saved = localStorage.getItem("belnova_documents");
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [notificationsList, setNotificationsList] = useState(() => {
    const saved = localStorage.getItem("belnova_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [holidays] = useState(HOLIDAYS_LIST);
  const [announcements] = useState(ANNOUNCEMENTS_LIST);
  const [payslips] = useState(PAYSLIPS_LIST);

  // Employee attendance state for today
  const [todayAttendance, setTodayAttendance] = useState(() => {
    const saved = localStorage.getItem("belnova_today_attendance");
    return saved
      ? JSON.parse(saved)
      : {
          checkedIn: true,
          checkInTime: "09:02 AM",
          checkOutTime: "—",
          status: "Present",
          workingHours: "6h 15m",
        };
  });

  // LocalStorage Effects
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
    localStorage.setItem("belnova_leave_balances", JSON.stringify(leaveBalances));
  }, [leaveBalances]);

  useEffect(() => {
    localStorage.setItem("belnova_today_attendance", JSON.stringify(todayAttendance));
  }, [todayAttendance]);

  useEffect(() => {
    localStorage.setItem("belnova_help_tickets", JSON.stringify(helpTickets));
  }, [helpTickets]);

  useEffect(() => {
    localStorage.setItem("belnova_documents", JSON.stringify(documentsList));
  }, [documentsList]);

  useEffect(() => {
    localStorage.setItem("belnova_notifications", JSON.stringify(notificationsList));
  }, [notificationsList]);

  // Global Notification Dispatcher
  const sendNotification = ({
    audience = "All",
    recipientId = null,
    category = "General",
    title,
    message,
    targetPath = "",
  }) => {
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-5)}`,
      audience,
      recipientId,
      category,
      title,
      message,
      time: "Just now",
      unread: true,
      targetPath,
      createdAt: new Date().toISOString(),
    };
    setNotificationsList((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsAsRead = (roleFilter) => {
    setNotificationsList((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    );
  };

  // Smart Role-Based Login Handler
  const login = (identifier, password) => {
    const cleanId = identifier.trim().toLowerCase();

    if (!cleanId || !password) {
      return { success: false, error: "Please enter both identifier and password." };
    }

    let matchedUser = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        (u.username && u.username.toLowerCase() === cleanId) ||
        (u.employeeId && u.employeeId.toLowerCase() === cleanId)
    );

    if (!matchedUser) {
      if (cleanId.includes("@hr.com") || cleanId.startsWith("hr")) {
        matchedUser = {
          id: "HR001",
          email: identifier,
          role: "hr",
          name: "HR Administrator",
          designation: "HR Manager",
          department: "Human Resources",
          avatar: "HR",
          avatarBg: "#2563eb",
        };
      } else if (cleanId.includes("mgr") || cleanId.includes("manager")) {
        matchedUser = {
          id: "MGR001",
          email: identifier,
          role: "manager",
          name: "Engineering Manager",
          designation: "Team Manager",
          department: "Engineering",
          avatar: "TM",
          avatarBg: "#7c3aed",
        };
      } else if (cleanId.startsWith("emp") || cleanId.startsWith("bel") || cleanId.includes("@")) {
        matchedUser = {
          id: cleanId.toUpperCase(),
          employeeId: cleanId.toUpperCase(),
          email: identifier,
          role: "employee",
          name: "Employee User",
          designation: "Software Engineer",
          department: "Engineering",
          reportsTo: "Vikramaditya Rao",
          avatar: "EU",
          avatarBg: "#10b981",
        };
      } else {
        matchedUser = {
          id: "EMP001",
          employeeId: cleanId.toUpperCase(),
          role: "employee",
          name: "Arjun Mehta",
          designation: "Senior Engineer",
          department: "Engineering",
          avatar: "AM",
          avatarBg: "#10b981",
        };
      }
    }

    const authUser = {
      ...matchedUser,
      token: `mock_jwt_token_${Date.now()}`,
    };

    setUser(authUser);
    localStorage.setItem("token", authUser.token);

    return {
      success: true,
      role: authUser.role,
      user: authUser,
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("belnova_user");
    localStorage.removeItem("token");
  };

  // Leave Actions & Notifications
  const handleApproveLeave = (leaveId) => {
    let targetReq = null;
    let wasAlreadyApproved = false;

    setLeaveRequests((prev) =>
      prev.map((req) => {
        if (req.id === leaveId) {
          if (req.status === "Approved") {
            wasAlreadyApproved = true;
          }
          targetReq = { ...req, status: "Approved" };
          return targetReq;
        }
        return req;
      })
    );

    if (targetReq && !wasAlreadyApproved) {
      sendNotification({
        audience: "Employee",
        recipientId: targetReq.employeeId,
        category: "Leave",
        title: "Leave Request Approved",
        message: `Your ${targetReq.leaveType} request (${targetReq.startDate} to ${targetReq.endDate}) has been Approved.`,
        targetPath: "/employee/leave",
      });

      // Deduct balance if casual or sick
      const durDays = parseInt(targetReq.duration) || 1;
      const typeKey = targetReq.leaveType.toLowerCase().includes("sick")
        ? "sick"
        : targetReq.leaveType.toLowerCase().includes("earned")
        ? "earned"
        : "casual";

      setLeaveBalances((prev) => {
        const current = prev[typeKey] || { available: 5, used: 0, total: 10 };
        return {
          ...prev,
          [typeKey]: {
            ...current,
            available: Math.max(0, current.available - durDays),
            used: current.used + durDays,
          },
        };
      });
    }
  };

  const handleRejectLeave = (leaveId, reason = "") => {
    let targetReq = null;
    let wasAlreadyRejected = false;

    setLeaveRequests((prev) =>
      prev.map((req) => {
        if (req.id === leaveId) {
          if (req.status === "Rejected") {
            wasAlreadyRejected = true;
          }
          targetReq = { ...req, status: "Rejected", rejectReason: reason };
          return targetReq;
        }
        return req;
      })
    );

    if (targetReq && !wasAlreadyRejected) {
      sendNotification({
        audience: "Employee",
        recipientId: targetReq.employeeId,
        category: "Leave",
        title: "Leave Request Rejected",
        message: `Your ${targetReq.leaveType} request (${targetReq.startDate} to ${targetReq.endDate}) was Rejected.${reason ? ` Reason: ${reason}` : ""}`,
        targetPath: "/employee/leave",
      });
    }
  };

  const handleAddLeaveRequest = (newLeave) => {
    const created = {
      id: `LR-${Date.now().toString().slice(-3)}`,
      employeeId: user?.employeeId || "EMP001",
      employeeName: user?.name || "Arjun Mehta",
      initials: user?.avatar || "AM",
      avatarBg: "#10b981",
      leaveType: newLeave.leaveType,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      duration: `${newLeave.duration || 1} Day(s)`,
      reason: newLeave.reason,
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };

    setLeaveRequests((prev) => [created, ...prev]);

    sendNotification({
      audience: "HR",
      category: "Leave",
      title: "New Leave Request Submitted",
      message: `${created.employeeName} (${created.employeeId}) submitted a ${created.leaveType} request.`,
      targetPath: "/hr/leave-management",
    });
  };

  // Help & Support Actions
  const addHelpTicket = (ticketData) => {
    const created = {
      id: `EMP-${Date.now().toString().slice(-6)}`,
      employeeId: user?.employeeId || "EMP001",
      employeeName: user?.name || "Arjun Mehta",
      category: ticketData.category,
      subject: ticketData.subject,
      description: ticketData.description,
      date: new Date().toISOString().split("T")[0],
      status: "Open",
      priority: "Normal",
      responseNote: "",
    };

    setHelpTickets((prev) => [created, ...prev]);

    sendNotification({
      audience: "HR",
      category: "Support",
      title: "New Support Ticket Received",
      message: `${created.employeeName} opened ticket "${created.subject}" (${created.category}).`,
      targetPath: "/hr/help",
    });

    return created;
  };

  const updateHelpTicketStatus = (ticketId, status, responseNote = "") => {
    let target = null;
    let isSameState = false;

    setHelpTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          if (t.status === status && t.responseNote === responseNote) {
            isSameState = true;
          }
          target = { ...t, status, responseNote };
          return target;
        }
        return t;
      })
    );

    if (target && !isSameState) {
      sendNotification({
        audience: "Employee",
        recipientId: target.employeeId,
        category: "Support",
        title: `Support Ticket ${status}`,
        message: `Your ticket "${target.subject}" status is now ${status}.${responseNote ? ` Note: ${responseNote}` : ""}`,
        targetPath: "/employee/help",
      });
    }
  };

  // Documents Actions
  const addEmployeeDocument = (docData) => {
    const created = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      employeeId: user?.employeeId || "EMP001",
      employee: user?.name || "Arjun Mehta",
      title: docData.title,
      fileName: docData.fileName || `${docData.title.replace(/\s+/g, "_")}.pdf`,
      category: docData.category || "General",
      size: docData.size || "1.5 MB",
      uploaded: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    setDocumentsList((prev) => [created, ...prev]);

    sendNotification({
      audience: "HR",
      category: "Documents",
      title: "Document Uploaded for Verification",
      message: `${created.employee} uploaded ${created.title} (${created.category}).`,
      targetPath: "/hr/documents",
    });

    return created;
  };

  const verifyEmployeeDocument = (docId, newStatus = "Verified") => {
    let target = null;
    let isAlreadyStatus = false;

    setDocumentsList((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          if (d.status === newStatus) {
            isAlreadyStatus = true;
          }
          target = { ...d, status: newStatus };
          return target;
        }
        return d;
      })
    );

    if (target && !isAlreadyStatus) {
      sendNotification({
        audience: "Employee",
        recipientId: target.employeeId,
        category: "Documents",
        title: `Document ${newStatus}`,
        message: `Your document "${target.title}" has been ${newStatus}.`,
        targetPath: "/employee/documents",
      });
    }
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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        logout,
        leaveRequests,
        teamMembers,
        setTeamMembers,
        leaveBalances,
        helpTickets,
        documentsList,
        notificationsList,
        holidays,
        announcements,
        payslips,
        todayAttendance,
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
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
