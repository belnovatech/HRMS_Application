import React from "react";
import "./Biometric.css";
import HRLayout from "../../../layouts/HRLayout";
import { FiRefreshCw, FiServer } from "react-icons/fi";

export default function Biometric() {
  const devices = [
    { name: "Main Entrance Gate #01", ip: "192.168.1.105", status: "Online", lastSync: "2 mins ago", records: 412 },
    { name: "Cafeteria Gate #02", ip: "192.168.1.106", status: "Online", lastSync: "5 mins ago", records: 289 },
    { name: "Server Room Entry #03", ip: "192.168.1.107", status: "Offline", lastSync: "2 hours ago", records: 45 },
  ];

  return (
    <HRLayout title="Biometric Device Sync" breadcrumb="Biometric">
      <div className="hr-bio-page-container">
        <div className="hr-page-intro">
          <h2>Biometric Hardware & Sync Terminal</h2>
          <p>Monitor physical access controllers, fingerprint/face scanners, and auto-sync attendance records.</p>
        </div>

        <div className="hr-bio-toolbar">
          <button type="button" className="hr-btn-sync-all">
            <FiRefreshCw /> Trigger Full Sync Now
          </button>
        </div>

        <div className="hr-bio-grid">
          {devices.map((dev) => (
            <div key={dev.name} className="hr-bio-card">
              <div className="hr-bio-head">
                <div className="hr-bio-icon"><FiServer /></div>
                <div>
                  <h3>{dev.name}</h3>
                  <small>IP: {dev.ip}</small>
                </div>
              </div>
              <div className="hr-bio-body">
                <p><strong>Status:</strong> <span className={`hr-bio-status ${dev.status.toLowerCase()}`}>{dev.status}</span></p>
                <p><strong>Today's Scans:</strong> {dev.records} logs</p>
                <small>Last auto-sync: {dev.lastSync}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HRLayout>
  );
}
