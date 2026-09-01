import React, { createContext, useContext, useState, useEffect } from "react";
import {
  MOCK_USERS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_LEAVE_REQUESTS,
  EMPLOYEE_LEAVE_BALANCES,
  HOLIDAYS_LIST,
  ANNOUNCEMENTS_LIST,
  PAYSLIPS_LIST,
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

  const [teamMembers] = useState(() => {
    const saved = localStorage.getItem("belnova_team_members");
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  const [leaveBalances] = useState(EMPLOYEE_LEAVE_BALANCES);
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
    localStorage.setItem("belnova_today_attendance", JSON.stringify(todayAttendance));
  }, [todayAttendance]);

  // Smart Role-Based Login Handler
  const login = (identifier, password) => {
    const cleanId = identifier.trim().toLowerCase();

    if (!cleanId || !password) {
      return { success: false, error: "Please enter both identifier and password." };
    }

    // 1. Try matching against explicit mock user dataset
    let matchedUser = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        (u.username && u.username.toLowerCase() === cleanId) ||
        (u.employeeId && u.employeeId.toLowerCase() === cleanId)
    );

    // 2. Intelligent fallback role identification if custom credentials are entered
    if (!matchedUser) {
      if (cleanId.includes("@hr.com") || cleanId.startsWith("hr")) {
        matchedUser = {
          id: "HR-GEN",
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
          id: "MGR-GEN",
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
        // Default to employee
        matchedUser = {
          id: "EMP-GEN",
          employeeId: cleanId.toUpperCase(),
          role: "employee",
          name: "Employee User",
          designation: "Associate",
          department: "Operations",
          avatar: "EU",
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

  // Action helpers
  const handleApproveLeave = (leaveId) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === leaveId ? { ...req, status: "Approved" } : req))
    );
  };

  const handleRejectLeave = (leaveId) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === leaveId ? { ...req, status: "Rejected" } : req))
    );
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
        leaveBalances,
        holidays,
        announcements,
        payslips,
        todayAttendance,
        handleApproveLeave,
        handleRejectLeave,
        handleAddLeaveRequest,
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
