import "./Settings.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import {
  FiBriefcase,
  FiMapPin,
  FiLayers,
  FiTag,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiCreditCard,
  FiBell,
  FiMail,
  FiActivity,
  FiGlobe,
  FiChevronRight,
} from "react-icons/fi";

export default function Settings() {
  const settingsCards = [
    {
      title: "Company Profile",
      description:
        "Update company name, logo, contact info",
      icon: <FiBriefcase />,
    },
    {
      title: "Branches",
      description:
        "Manage office locations and branches",
      icon: <FiMapPin />,
    },
    {
      title: "Departments",
      description:
        "Add and organize departments",
      icon: <FiLayers />,
    },
    {
      title: "Designations",
      description:
        "Manage job titles and designations",
      icon: <FiTag />,
    },
    {
      title: "Holidays",
      description:
        "Configure public and company holidays",
      icon: <FiCalendar />,
    },
    {
      title: "Shift Policies",
      description:
        "Set up shift timings and rules",
      icon: <FiClock />,
    },
    {
      title: "Payroll Rules",
      description:
        "Configure salary computation rules",
      icon: <FiDollarSign />,
    },
    {
      title: "Tax Configuration",
      description:
        "TDS, PF, ESI settings",
      icon: <FiCreditCard />,
    },
    {
      title: "Notifications",
      description:
        "Email and push notification settings",
      icon: <FiBell />,
    },
    {
      title: "Email Templates",
      description:
        "Customize outgoing email templates",
      icon: <FiMail />,
    },
    {
      title: "Audit Logs",
      description:
        "View all system activity logs",
      icon: <FiActivity />,
    },
    {
      title: "API Integrations",
      description:
        "Connect third-party services",
      icon: <FiGlobe />,
    },
  ];

  return (
<>
  <Sidebar />

  <div className="settings-main">
    <Header
      title="Settings"
      breadcrumb="Settings"
    />

    <div className="settings-container">

        <div className="settings-grid">
          {settingsCards.map((card) => (
            <div
              className="settings-card"
              key={card.title}
            >
              <div className="card-left">

                <div className="icon-box">
                  {card.icon}
                </div>

                <div>
                  <h3>{card.title}</h3>

                  <p>
                    {card.description}
                  </p>
                </div>

              </div>

              <FiChevronRight className="arrow" />
            </div>
          ))}
        </div>

      </div>
      </div>
    </>
  );
}