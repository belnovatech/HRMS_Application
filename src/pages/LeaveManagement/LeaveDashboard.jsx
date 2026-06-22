import React from "react";
import LeaveStatsCards from "./components/LeaveStatsCards";
import LeaveApprovalTable from "./components/LeaveApprovalTable";

export default function LeaveDashboard() {
  return (
    <>
      <LeaveStatsCards />
      <LeaveApprovalTable />
    </>
  );
}