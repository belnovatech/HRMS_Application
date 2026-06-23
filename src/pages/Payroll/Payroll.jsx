import { useState } from "react";
import "./Payroll.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import PayrollDashboard from "./components/PayrollDashboard";
import SalaryStructure from "./components/SalaryStructure";
import RunPayroll from "./components/RunPayroll";
import Payslips from "./components/Payslips";
import PayrollHistory from "./components/PayrollHistory";
import Header from "../../components/Header/Header";

const Payroll = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <>
      <Sidebar />
<div className="payroll-main">
  <Header
    title="Payroll"
    breadcrumb="Payroll"
  />


      <div className="payroll-container">


        <div className="payroll-tabs">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activeTab === "salary" ? "active" : ""}
            onClick={() => setActiveTab("salary")}
          >
            Salary Structure
          </button>

          <button
            className={activeTab === "run" ? "active" : ""}
            onClick={() => setActiveTab("run")}
          >
            Run Payroll
          </button>

          <button
            className={activeTab === "payslips" ? "active" : ""}
            onClick={() => setActiveTab("payslips")}
          >
            Payslips
          </button>

          <button
            className={activeTab === "history" ? "active" : ""}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        <div className="payroll-content">
          {activeTab === "dashboard" && <PayrollDashboard />}
          {activeTab === "salary" && <SalaryStructure />}
          {activeTab === "run" && <RunPayroll />}
          {activeTab === "payslips" && <Payslips />}
          {activeTab === "history" && <PayrollHistory />}
        </div>
      </div>
    </div>
    </>
  );
};

export default Payroll;