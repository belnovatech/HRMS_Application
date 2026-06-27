import "./SelfService.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import {
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiAlertCircle,
  FiDownload,
  FiUpload,
  FiUser,
  FiGlobe,
  FiStar,
  FiBook,
  FiCheckCircle,
} from "react-icons/fi";

export default function SelfService() {

  const stats = [
    {
      title: "Days Present",
      value: "17 / 18",
      icon: <FiCheckCircle />,
      color: "green",
    },
    {
      title: "Leave Balance",
      value: "20 Days",
      icon: <FiCalendar />,
      color: "blue",
    },
    {
      title: "Net Salary",
      value: "₹72,500",
      icon: <FiDollarSign />,
      color: "purple",
    },
    {
      title: "Tickets Open",
      value: "01",
      icon: <FiAlertCircle />,
      color: "orange",
    },
  ];

  const actions = [
    {
      icon: <FiClock />,
      title: "Mark Attendance",
      color: "blue",
    },
    {
      icon: <FiCalendar />,
      title: "Apply Leave",
      color: "green",
    },
    {
      icon: <FiDownload />,
      title: "Download Payslip",
      color: "purple",
    },
    {
      icon: <FiUpload />,
      title: "Upload Documents",
      color: "orange",
    },
    {
      icon: <FiAlertCircle />,
      title: "Raise Ticket",
      color: "red",
    },
    {
      icon: <FiUser />,
      title: "View Profile",
      color: "blue",
    },
  ];

  const attendance = [
    {
      day: "Mon, Jun 16",
      time: "09:02 AM → 06:15 PM",
      status: "Present",
    },
    {
      day: "Tue, Jun 17",
      time: "09:10 AM → 06:00 PM",
      status: "Present",
    },
    {
      day: "Wed, Jun 18",
      time: "09:02 AM → —",
      status: "Present",
    },
  ];

  const announcements = [
    {
      icon: <FiGlobe />,
      title: "WFH Policy Update",
      date: "Jun 15",
    },
    {
      icon: <FiStar />,
      title: "Team Outing - Jun 28",
      date: "Jun 12",
    },
    {
      icon: <FiBook />,
      title: "Mandatory Training",
      date: "Jun 10",
    },
  ];

  return (
    <>
      <Sidebar />

      <div className="main-content">

        <Header
          title="Self Service"
          breadcrumb="Employee / Self Service"
        />

        <div className="ss-page">

          {/* ================= HERO ================= */}

          <section className="ss-hero">

            <div className="ss-user">

              <div className="ss-avatar">
                AM
              </div>

              <div>

                <p className="ss-good">
                  Good Morning,
                </p>

                <h1>
                  Arjun Mehta
                </h1>

                <p className="ss-role">
                  Senior Engineer • BEL-001 • Jun 18, 2025
                </p>

              </div>

            </div>

            <div className="ss-checkin">

              <h2>09:02</h2>

              <span>
                Check-in Time
              </span>

            </div>

          </section>

          {/* ================= STATS ================= */}

          <section className="ss-stats">

            {stats.map((item, index) => (

              <div
                key={index}
                className="ss-stat-card"
              >

                <div
                  className={`ss-icon ${item.color}`}
                >

                  {item.icon}

                </div>

                <div>

                  <small>
                    {item.title}
                  </small>

                  <h3>
                    {item.value}
                  </h3>

                </div>

              </div>

            ))}

          </section>
                    {/* ================= CONTENT ================= */}

          <section className="ss-content">

            {/* ================= QUICK ACTIONS ================= */}

            <div className="ss-card">

              <div className="ss-card-header">

                <h3>Quick Actions</h3>

              </div>

              <div className="ss-actions-grid">

                {actions.map((item, index) => (

                  <div
                    key={index}
                    className="ss-action-card"
                  >

                    <div
                      className={`ss-action-icon ${item.color}`}
                    >
                      {item.icon}
                    </div>

                    <span>
                      {item.title}
                    </span>

                  </div>

                ))}

              </div>

            </div>

            {/* ================= ATTENDANCE ================= */}

            <div className="ss-card">

              <div className="ss-card-header">

                <h3>Attendance This Week</h3>

              </div>

              <div className="ss-attendance-list">

                {attendance.map((item, index) => (

                  <div
                    key={index}
                    className="ss-attendance-row"
                  >

                    <div className="ss-attendance-info">

                      <h4>
                        {item.day}
                      </h4>

                      <p>
                        {item.time}
                      </p>

                    </div>

                    <span className="ss-status">

                      {item.status}

                    </span>

                  </div>

                ))}

              </div>

            </div>

            {/* ================= ANNOUNCEMENTS ================= */}

            <div className="ss-card">

              <div className="ss-card-header">

                <h3>Announcements</h3>

              </div>

              <div className="ss-announcement-list">

                {announcements.map((item, index) => (

                  <div
                    key={index}
                    className="ss-announcement"
                  >

                    <div className="ss-announcement-icon">

                      {item.icon}

                    </div>

                    <div className="ss-announcement-text">

                      <h4>
                        {item.title}
                      </h4>

                      <span>
                        {item.date}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </section>

        </div>

      </div>

    </>

  );

}