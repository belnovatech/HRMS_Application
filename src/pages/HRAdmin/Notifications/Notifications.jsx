import React from "react";
import "./Notifications.css";
import HRLayout from "../../../layouts/HRLayout";
import { FiBell, FiSend, FiCheckCircle } from "react-icons/fi";

export default function Notifications() {
  const notifs = [
    { title: "Quarterly Performance Reviews Open", target: "All Employees", time: "Today, 10:00 AM", status: "Sent" },
    { title: "System Maintenance Notice - Sep 15", target: "All Portals", time: "Yesterday", status: "Sent" },
    { title: "August Payroll Slip Disbursal Alert", target: "All Staff", time: "Aug 31, 2026", status: "Sent" },
  ];

  return (
    <HRLayout title="Announcements & Notifications" breadcrumb="Notifications">
      <div className="hr-notif-page-container">
        <div className="hr-page-intro">
          <h2>Broadcast Broadcasts & Company Announcements</h2>
          <p>Send company-wide push announcements, emergency alerts, or policy updates.</p>
        </div>

        <div className="hr-notif-toolbar">
          <button type="button" className="hr-btn-new-announcement">
            <FiSend /> Broadcast New Announcement
          </button>
        </div>

        <div className="hr-notif-card-list">
          {notifs.map((n) => (
            <div key={n.title} className="hr-notif-row-card">
              <div className="hr-notif-icon-col">
                <FiBell />
              </div>
              <div className="hr-notif-info-col">
                <h3>{n.title}</h3>
                <p>Target Audience: <strong>{n.target}</strong></p>
                <small>Broadcast Time: {n.time}</small>
              </div>
              <span className="hr-notif-sent-badge">
                <FiCheckCircle /> {n.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </HRLayout>
  );
}
