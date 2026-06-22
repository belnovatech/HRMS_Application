import React from "react";
import "./LeaveTabs.css";

const LeaveTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "apply", label: "Apply" },
    { key: "approvals", label: "Approvals" },
    { key: "calendar", label: "Calendar" },
    { key: "policy", label: "Policy" },
  ];

  return (
    <div className="leave-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`leave-tab ${
            activeTab === tab.key ? "active" : ""
          }`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default LeaveTabs;