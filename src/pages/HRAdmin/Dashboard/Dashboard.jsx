import React from "react";
import "./Dashboard.css";
import HRLayout from "../../../layouts/HRLayout";
import DashboardHeader from "./DashboardHeader";
import StatCards from "./StatCards";
import AttendanceTrend from "./AttendanceTrend";
import DepartmentDistribution from "./DepartmentDistribution";
import PendingApprovals from "./PendingApprovals";
import Birthdays from "./Birthdays";
import UpcomingHolidays from "./UpcomingHolidays";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";

export default function Dashboard() {
  return (
    <HRLayout title="Executive Dashboard" breadcrumb="Dashboard">
      <div className="hradmin-dashboard-page-container">
        {/* Top Header */}
        <DashboardHeader />

        {/* Statistic Cards (Row of 6) */}
        <StatCards />

        {/* Two-Column Dashboard Layout */}
        <div className="hradmin-dashboard-main-grid">
          {/* LEFT / MAIN COLUMN */}
          <div className="hradmin-dashboard-col-left">
            <AttendanceTrend />
            <PendingApprovals />
            <RecentActivity />
          </div>

          {/* RIGHT / SIDE COLUMN */}
          <div className="hradmin-dashboard-col-right">
            <DepartmentDistribution />
            <Birthdays />
            <UpcomingHolidays />
            <QuickActions />
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
