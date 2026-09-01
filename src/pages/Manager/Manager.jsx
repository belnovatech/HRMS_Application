import "./Manager.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import {
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiCheck,
  FiX,
} from "react-icons/fi";

export default function Manager() {
  const teamMembers = [
    {
      initials: "AM",
      color: "#52c41a",
      name: "Arjun Mehta",
      role: "Senior Engineer",
      status: "Active",
      performance: "92%",
    },
    {
      initials: "PS",
      color: "#faad14",
      name: "Priya Sharma",
      role: "HR Manager",
      status: "Active",
      performance: "92%",
    },
    {
      initials: "RV",
      color: "#13c2c2",
      name: "Rahul Verma",
      role: "Sales Lead",
      status: "Active",
      performance: "92%",
    },
    {
      initials: "SP",
      color: "#722ed1",
      name: "Sneha Patel",
      role: "Finance Analyst",
      status: "On Leave",
      performance: "92%",
    },
    {
      initials: "VS",
      color: "#52c41a",
      name: "Vikram Singh",
      role: "DevOps Engineer",
      status: "Active",
      performance: "92%",
    },
  ];

  const approvals = [
    {
      initials: "DK",
      name: "Deepak Kumar",
      reason: "Casual Leave · 2 day(s)",
    },
    {
      initials: "KN",
      name: "Kavya Nair",
      reason: "Sick Leave · 1 day(s)",
    },
  ];

  return (
    <div className="mgrdash-shell">
      <Sidebar />

      <main className="mgrdash-content">
        <Header title="Manager Portal" breadcrumb="Manager" />

        <section className="mgrdash-page">
          <div className="mgrdash-page-intro">
            <div className="mgrdash-page-title">
              <span className="mgrdash-breadcrumb">BELNOVA HRMS</span>
              <span className="mgrdash-breadcrumb-separator">&gt;</span>
              <span className="mgrdash-breadcrumb-current">Manager Dashboard</span>
              <h1>Manager Portal</h1>
            </div>
          </div>

          <div className="mgrdash-stats" aria-label="Manager statistics">
            <div className="mgrdash-stat-card">
              <div className="mgrdash-stat-content">
                <p>TEAM MEMBERS</p>
                <h2>8</h2>
              </div>
              <div className="mgrdash-stat-icon mgrdash-icon-users">
                <FiUsers />
              </div>
            </div>

            <div className="mgrdash-stat-card">
              <div className="mgrdash-stat-content">
                <p>PRESENT TODAY</p>
                <h2>6</h2>
              </div>
              <div className="mgrdash-stat-icon mgrdash-icon-success">
                <FiCheckCircle />
              </div>
            </div>

            <div className="mgrdash-stat-card">
              <div className="mgrdash-stat-content">
                <p>PENDING APPROVALS</p>
                <h2>3</h2>
              </div>
              <div className="mgrdash-stat-icon mgrdash-icon-warning">
                <FiAlertCircle />
              </div>
            </div>

            <div className="mgrdash-stat-card">
              <div className="mgrdash-stat-content">
                <p>AVG PERFORMANCE</p>
                <h2>87%</h2>
              </div>
              <div className="mgrdash-stat-icon mgrdash-icon-purple">
                <FiTrendingUp />
              </div>
            </div>
          </div>

          <div className="mgrdash-grid">
            <section className="mgrdash-card mgrdash-team-card">
              <div className="mgrdash-card-header">
                <div>
                  <h2>Team Overview</h2>
                  <p>Current team activity and performance</p>
                </div>
                <span className="mgrdash-count">{teamMembers.length}</span>
              </div>

              <div className="mgrdash-team-list">
                {teamMembers.map((member, index) => (
                  <div className="mgrdash-team-row" key={`${member.name}-${index}`}>
                    <div className="mgrdash-team-member">
                      <div
                        className="mgrdash-avatar"
                        style={{ background: member.color }}
                      >
                        {member.initials}
                      </div>

                      <div className="mgrdash-member-info">
                        <h3>{member.name}</h3>
                        <span>{member.role}</span>
                      </div>
                    </div>

                    <div className="mgrdash-team-meta">
                      <span
                        className={
                          member.status === "Active"
                            ? "mgrdash-status mgrdash-status-active"
                            : "mgrdash-status mgrdash-status-leave"
                        }
                      >
                        <span className="mgrdash-status-dot" />
                        {member.status}
                      </span>

                      <div className="mgrdash-performance">
                        <strong>{member.performance}</strong>
                        <small>performance</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mgrdash-card mgrdash-approval-card">
              <div className="mgrdash-card-header">
                <div>
                  <h2>Pending Approvals</h2>
                  <p>Requests waiting for your action</p>
                </div>
                <span className="mgrdash-count mgrdash-count-warning">
                  {approvals.length}
                </span>
              </div>

              <div className="mgrdash-approval-list">
                {approvals.map((item, index) => (
                  <div
                    className="mgrdash-approval-row"
                    key={`${item.name}-${index}`}
                  >
                    <div className="mgrdash-approval-member">
                      <div className="mgrdash-approval-avatar">
                        {item.initials}
                      </div>

                      <div className="mgrdash-approval-info">
                        <h3>{item.name}</h3>
                        <span>{item.reason}</span>
                      </div>
                    </div>

                    <div className="mgrdash-approval-actions">
                      <button
                        type="button"
                        className="mgrdash-approve"
                        aria-label={`Approve request from ${item.name}`}
                      >
                        <FiCheck />
                      </button>

                      <button
                        type="button"
                        className="mgrdash-reject"
                        aria-label={`Reject request from ${item.name}`}
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))}

                <button type="button" className="mgrdash-view-btn">
                  View All Requests
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
