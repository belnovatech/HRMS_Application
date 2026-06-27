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
    <>
      <Sidebar />

      <div className="main-content">

        <Header
          title="Manager Portal"
          breadcrumb="Manager"
        />

        <div className="manager-page">

          {/* KPI Cards */}

          <div className="manager-stats">

            <div className="manager-stat-card">

              <div>

                <p>TEAM MEMBERS</p>

                <h2>8</h2>

              </div>

              <div className="icon users">
                <FiUsers />
              </div>

            </div>

            <div className="manager-stat-card">

              <div>

                <p>PRESENT TODAY</p>

                <h2>6</h2>

              </div>

              <div className="icon success">
                <FiCheckCircle />
              </div>

            </div>

            <div className="manager-stat-card">

              <div>

                <p>PENDING APPROVALS</p>

                <h2>3</h2>

              </div>

              <div className="icon warning">
                <FiAlertCircle />
              </div>

            </div>

            <div className="manager-stat-card">

              <div>

                <p>AVG PERFORMANCE</p>

                <h2>87%</h2>

              </div>

              <div className="icon purple">
                <FiTrendingUp />
              </div>

            </div>

          </div>

          {/* Bottom Section */}

          <div className="manager-grid">

            {/* Team Overview */}

            <div className="manager-card">

              <h2>Team Overview</h2>

              <div className="team-list">

                {teamMembers.map((member, index) => (

                  <div
                    key={index}
                    className="team-row"
                  >

                    <div className="team-left">

                      <div
                        className="avatar"
                        style={{
                          background: member.color,
                        }}
                      >
                        {member.initials}
                      </div>

                      <div>

                        <h3>{member.name}</h3>

                        <span>{member.role}</span>

                      </div>

                    </div>

                    <div className="team-right">

                      <span
                        className={
                          member.status === "Active"
                            ? "status active"
                            : "status leave"
                        }
                      >
                        {member.status}
                      </span>

                      <div className="performance">

                        <strong>{member.performance}</strong>

                        <small>performance</small>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* Pending Approvals */}

            <div className="manager-card">

              <h2>Pending Approvals</h2>

              <div className="approval-list">

                {approvals.map((item, index) => (

                  <div
                    key={index}
                    className="approval-row"
                  >

                    <div className="approval-left">

                      <div className="approval-avatar">
                        {item.initials}
                      </div>

                      <div>

                        <h3>{item.name}</h3>

                        <span>{item.reason}</span>

                      </div>

                    </div>

                    <div className="approval-actions">

                      <button className="approve">

                        <FiCheck />

                      </button>

                      <button className="reject">

                        <FiX />

                      </button>

                    </div>

                  </div>

                ))}

                <button className="view-btn">

                  View All Requests

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}