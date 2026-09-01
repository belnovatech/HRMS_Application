import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import "./PortalLayout.css";

export default function ManagerLayout({ children, title = "Manager Dashboard", breadcrumb = "Manager" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="portal-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="portal-main">
        <Header
          title={title}
          breadcrumb={breadcrumb}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="portal-container">{children}</main>
      </div>
    </div>
  );
}
