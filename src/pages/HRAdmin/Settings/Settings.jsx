import React from "react";
import "./Settings.css";
import HRLayout from "../../../layouts/HRLayout";


export default function Settings() {
  return (
    <HRLayout title="System Settings" breadcrumb="Settings">
      <div className="hr-settings-page-container">
        <div className="hr-page-intro">
          <h2>HRMS Application Settings</h2>
          <p>Configure company profile, work hours, attendance rules, and global preferences.</p>
        </div>

        <div className="hr-settings-card">
          <h3>Company Information</h3>
          <div className="hr-settings-form">
            <div className="hr-form-group">
              <label>Company Name</label>
              <input type="text" defaultValue="BELNOVA Technologies Pvt Ltd" />
            </div>
            <div className="hr-form-group">
              <label>HQ Address</label>
              <input type="text" defaultValue="Outer Ring Road, Bellandur, Bangalore, KA 560103" />
            </div>
            <div className="hr-form-group">
              <label>Official HR Support Email</label>
              <input type="email" defaultValue="hr.support@belnova.com" />
            </div>
          </div>
        </div>

        <div className="hr-settings-card">
          <h3>Standard Working Hours</h3>
          <div className="hr-settings-form row">
            <div className="hr-form-group">
              <label>Shift Start Time</label>
              <input type="time" defaultValue="09:00" />
            </div>
            <div className="hr-form-group">
              <label>Shift End Time</label>
              <input type="time" defaultValue="18:00" />
            </div>
            <div className="hr-form-group">
              <label>Grace Period (Mins)</label>
              <input type="number" defaultValue="15" />
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
