import React, { useMemo, useState } from "react";
import "./Payroll.css";
import HRLayout from "../../../layouts/HRLayout";
import {
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiDownload,
  FiEye,
  FiFileText,
  FiPlay,
  FiUsers,
  FiX,
} from "react-icons/fi";

const EMPLOYEES = [
  {
    id: "EMP1001",
    name: "Rahul Kumar",
    department: "Engineering",
    initials: "RK",
    basic: 35000,
    hra: 14000,
    allowances: 8000,
    deductions: 6500,
  },
  {
    id: "EMP1002",
    name: "Priya Sharma",
    department: "HR",
    initials: "PS",
    basic: 28000,
    hra: 11200,
    allowances: 6000,
    deductions: 5160,
  },
  {
    id: "EMP1003",
    name: "Arjun Reddy",
    department: "Engineering",
    initials: "AR",
    basic: 55000,
    hra: 22000,
    allowances: 12000,
    deductions: 12100,
  },
  {
    id: "EMP1004",
    name: "Sneha Rao",
    department: "HR",
    initials: "SR",
    basic: 40000,
    hra: 16000,
    allowances: 9000,
    deductions: 8000,
  },
  {
    id: "EMP1005",
    name: "Vikram Singh",
    department: "Operations",
    initials: "VS",
    basic: 80000,
    hra: 32000,
    allowances: 18000,
    deductions: 19400,
  },
];

const PROCESS_STEPS = [
  "Select Month",
  "Fetch Attendance",
  "Calculate Salary",
  "Review",
  "Approve",
  "Process",
  "Generate Payslip",
];

const PROCESS_KEYS = [
  "month",
  "attendance",
  "calculate",
  "review",
  "approve",
  "process",
  "payslip",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getCurrentPayrollMonth() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
  };
}

function monthToKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function formatMonth(year, month) {
  return `${MONTH_NAMES[month]} ${year}`;
}

function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function calculateEmployee(employee, year, month) {
  const totalGross =
    employee.basic + employee.hra + employee.allowances;
  const monthDays = getMonthDays(year, month);

  // Small deterministic attendance adjustment so the selected month's
  // payroll is calculated automatically rather than using hard-coded totals.
  const workingDays = Math.max(20, Math.min(23, monthDays - 8));
  const paidDays = monthDays >= 31 ? 30 : monthDays - 1;

  const proratedBasic = Math.round(
    (employee.basic / 30) * Math.min(paidDays, 30)
  );
  const proratedHra = Math.round(
    (employee.hra / 30) * Math.min(paidDays, 30)
  );
  const proratedAllowances = Math.round(
    (employee.allowances / 30) * Math.min(paidDays, 30)
  );

  const gross = proratedBasic + proratedHra + proratedAllowances;
  const deductions = Math.round(
    employee.deductions * (Math.min(paidDays, 30) / 30)
  );
  const net = gross - deductions;

  return {
    ...employee,
    monthDays,
    workingDays,
    paidDays,
    basicPay: proratedBasic,
    hraPay: proratedHra,
    allowancePay: proratedAllowances,
    gross,
    deductions,
    net,
  };
}

function formatINR(value, compact = false) {
  if (compact) {
    if (Math.abs(value) >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    }
    if (Math.abs(value) >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    }
    if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function escapeCsv(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadCsv(filename, headers, rows) {
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function EmployeeAvatar({ initials, index }) {
  const classes = ["blue", "yellow", "green", "cyan", "indigo"];
  return (
    <span
      className={`bel-payroll-avatar bel-payroll-avatar--${
        classes[index % classes.length]
      }`}
    >
      {initials}
    </span>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`bel-payroll-stat bel-payroll-stat--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <i />
    </div>
  );
}

function PayrollStatus({ status }) {
  const isProcessed = status === "Processed";

  return (
    <span
      className={`bel-payroll-status ${
        isProcessed ? "bel-payroll-status--processed" : "bel-payroll-status--pending"
      }`}
    >
      {isProcessed ? <FiCheckCircle /> : <span />}
      {status}
    </span>
  );
}

export default function Payroll() {
  const currentMonth = getCurrentPayrollMonth();

  const [selectedYear, setSelectedYear] = useState(currentMonth.year);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.month);
  const [activeTab, setActiveTab] = useState("employees");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [processedEmployees, setProcessedEmployees] = useState({});
  const [processStep, setProcessStep] = useState(0);
  const [modal, setModal] = useState(null);

  const payrollMonth = formatMonth(selectedYear, selectedMonth);
  const payrollKey = monthToKey(selectedYear, selectedMonth);

  const employeePayroll = useMemo(
    () =>
      EMPLOYEES.map((employee) =>
        calculateEmployee(employee, selectedYear, selectedMonth)
      ),
    [selectedYear, selectedMonth]
  );

  const selectedEmployee = employeePayroll.find(
    (employee) => employee.id === selectedEmployeeId
  );

  const monthTotalGross = employeePayroll.reduce(
    (sum, employee) => sum + employee.gross,
    0
  );

  const monthTotalDeductions = employeePayroll.reduce(
    (sum, employee) => sum + employee.deductions,
    0
  );

  const monthTotalNet = employeePayroll.reduce(
    (sum, employee) => sum + employee.net,
    0
  );

  const monthProcessedCount = employeePayroll.filter(
    (employee) => processedEmployees[`${payrollKey}-${employee.id}`]
  ).length;

  const previousMonths = useMemo(() => {
    const values = [];
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(selectedYear, selectedMonth - i, 1);
      values.push({
        label: MONTH_NAMES[date.getMonth()].slice(0, 3),
        year: date.getFullYear(),
        month: date.getMonth(),
        value: calculateEmployee(EMPLOYEES[0], date.getFullYear(), date.getMonth()).gross,
      });
    }
    return values;
  }, [selectedYear, selectedMonth]);

  const closeModal = () => setModal(null);

  const changeMonth = (direction) => {
    const date = new Date(selectedYear, selectedMonth + direction, 1);
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth());
    setProcessStep(0);
  };

  const selectEmployee = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setProcessStep(0);
  };

  const runPayroll = () => {
    if (!selectedEmployee) {
      window.alert("Please select an employee before running payroll.");
      return;
    }

    setProcessedEmployees((current) => ({
      ...current,
      [`${payrollKey}-${selectedEmployee.id}`]: true,
    }));

    setProcessStep((current) => Math.max(current, 2));
    setActiveTab("processing");
  };

  const moveProcessStep = (direction) => {
    if (!selectedEmployee) {
      window.alert("Please select an employee first.");
      return;
    }

    setProcessStep((current) =>
      Math.max(0, Math.min(PROCESS_STEPS.length - 1, current + direction))
    );
  };

  const generatePayslip = () => {
    if (!selectedEmployee) {
      window.alert("Select an employee first.");
      return;
    }

    setProcessedEmployees((current) => ({
      ...current,
      [`${payrollKey}-${selectedEmployee.id}`]: true,
    }));

    setProcessStep(PROCESS_STEPS.length - 1);
    setModal("payslip");
  };

  const exportMonthSummary = () => {
    const headers = [
      "Employee ID",
      "Employee",
      "Department",
      "Payroll Month",
      "Basic",
      "HRA",
      "Allowances",
      "Gross",
      "Deductions",
      "Net Salary",
      "Status",
    ];

    const rows = employeePayroll.map((employee) => [
      employee.id,
      employee.name,
      employee.department,
      payrollMonth,
      formatINR(employee.basicPay),
      formatINR(employee.hraPay),
      formatINR(employee.allowancePay),
      formatINR(employee.gross),
      formatINR(employee.deductions),
      formatINR(employee.net),
      processedEmployees[`${payrollKey}-${employee.id}`]
        ? "Processed"
        : "Pending",
    ]);

    downloadCsv(
      `payroll-${MONTH_NAMES[selectedMonth].toLowerCase()}-${selectedYear}.csv`,
      headers,
      rows
    );
  };

  const exportSelectedPayslip = () => {
    if (!selectedEmployee) {
      window.alert("Please select an employee first.");
      return;
    }

    const headers = [
      "Payroll Month",
      "Employee ID",
      "Employee",
      "Department",
      "Basic",
      "HRA",
      "Allowances",
      "Gross Salary",
      "Deductions",
      "Net Salary",
      "Paid Days",
    ];

    const rows = [
      [
        payrollMonth,
        selectedEmployee.id,
        selectedEmployee.name,
        selectedEmployee.department,
        formatINR(selectedEmployee.basicPay),
        formatINR(selectedEmployee.hraPay),
        formatINR(selectedEmployee.allowancePay),
        formatINR(selectedEmployee.gross),
        formatINR(selectedEmployee.deductions),
        formatINR(selectedEmployee.net),
        selectedEmployee.paidDays,
      ],
    ];

    downloadCsv(
      `payslip-${selectedEmployee.id}-${monthToKey(
        selectedYear,
        selectedMonth
      )}.csv`,
      headers,
      rows
    );
  };

  const processSelectedEmployee = () => {
    if (!selectedEmployee) {
      window.alert("Select an employee before processing payroll.");
      return;
    }

    setProcessedEmployees((current) => ({
      ...current,
      [`${payrollKey}-${selectedEmployee.id}`]: true,
    }));
    setProcessStep(PROCESS_STEPS.length - 2);
  };

  return (
    <HRLayout title="Payroll" breadcrumb="Payroll">
      <div className="bel-payroll-page">
        <header className="bel-payroll-header">
          <div>
            <h1>Payroll</h1>
            <p>{payrollMonth} payroll cycle</p>
          </div>

          <div className="bel-payroll-header-actions">
            <button
              type="button"
              className="bel-payroll-export-button"
              onClick={exportMonthSummary}
            >
              <FiDownload />
              Export
            </button>

            <button
              type="button"
              className="bel-payroll-run-button"
              onClick={runPayroll}
            >
              <FiPlay />
              Run Payroll
            </button>
          </div>
        </header>

        <div className="bel-payroll-month-control">
          <button type="button" onClick={() => changeMonth(-1)}>
            Previous Month
          </button>

          <select
            value={payrollKey}
            onChange={(event) => {
              const [year, month] = event.target.value.split("-").map(Number);
              setSelectedYear(year);
              setSelectedMonth(month - 1);
              setProcessStep(0);
            }}
            aria-label="Select payroll month"
          >
            {Array.from({ length: 13 }).map((_, index) => {
              const date = new Date(
                currentMonth.year,
                currentMonth.month - 6 + index,
                1
              );
              const value = monthToKey(date.getFullYear(), date.getMonth());

              return (
                <option key={value} value={value}>
                  {formatMonth(date.getFullYear(), date.getMonth())}
                </option>
              );
            })}
          </select>

          <button type="button" onClick={() => changeMonth(1)}>
            Next Month
          </button>
        </div>

        <section className="bel-payroll-stats">
          <StatCard
            label="Total Gross"
            value={formatINR(monthTotalGross, true)}
            tone="gross"
          />
          <StatCard
            label="Total Deductions"
            value={formatINR(monthTotalDeductions, true)}
            tone="deductions"
          />
          <StatCard
            label="Net Payroll"
            value={formatINR(monthTotalNet, true)}
            tone="net"
          />
          <StatCard
            label="Employees Paid"
            value={`${monthProcessedCount} / ${EMPLOYEES.length}`}
            tone="paid"
          />
        </section>

        <nav className="bel-payroll-tabs">
          <button
            type="button"
            className={activeTab === "employees" ? "is-active" : ""}
            onClick={() => setActiveTab("employees")}
          >
            Employee Payroll
          </button>
          <button
            type="button"
            className={activeTab === "processing" ? "is-active" : ""}
            onClick={() => setActiveTab("processing")}
          >
            Processing Steps
          </button>
          <button
            type="button"
            className={activeTab === "analytics" ? "is-active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </nav>

        {activeTab === "employees" && (
          <section className="bel-payroll-table-card">
            <div className="bel-payroll-table-topbar">
              <div>
                <h2>Employee Payroll — {payrollMonth}</h2>
                <p>Select an employee to calculate, process and generate their payslip.</p>
              </div>

              <span className="bel-payroll-selected-indicator">
                <FiUsers />
                {selectedEmployee
                  ? `${selectedEmployee.name} selected`
                  : "No employee selected"}
              </span>
            </div>

            <div className="bel-payroll-table-scroll">
              <table className="bel-payroll-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Basic</th>
                    <th>HRA</th>
                    <th>Allowances</th>
                    <th>Gross</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {employeePayroll.map((employee, index) => {
                    const isSelected = selectedEmployeeId === employee.id;
                    const isProcessed =
                      processedEmployees[`${payrollKey}-${employee.id}`];

                    return (
                      <tr
                        key={employee.id}
                        className={isSelected ? "is-selected" : ""}
                        onClick={() => selectEmployee(employee.id)}
                      >
                        <td>
                          <label className="bel-payroll-employee">
                            <input
                              type="radio"
                              name="payrollEmployee"
                              checked={isSelected}
                              onChange={() => selectEmployee(employee.id)}
                              onClick={(event) => event.stopPropagation()}
                            />
                            <EmployeeAvatar
                              initials={employee.initials}
                              index={index}
                            />
                            <span>
                              <strong>{employee.name}</strong>
                              <small>
                                {employee.department} · {employee.id}
                              </small>
                            </span>
                          </label>
                        </td>
                        <td>{formatINR(employee.basicPay)}</td>
                        <td>{formatINR(employee.hraPay)}</td>
                        <td>{formatINR(employee.allowancePay)}</td>
                        <td className="bel-payroll-gross">
                          {formatINR(employee.gross)}
                        </td>
                        <td className="bel-payroll-deduction">
                          {formatINR(employee.deductions)}
                        </td>
                        <td className="bel-payroll-net">
                          {formatINR(employee.net)}
                        </td>
                        <td>
                          <div className="bel-payroll-row-actions">
                            <button
                              type="button"
                              className="bel-payroll-view-button"
                              onClick={(event) => {
                                event.stopPropagation();
                                selectEmployee(employee.id);
                                setModal("payslip");
                              }}
                            >
                              <FiEye />
                              View Payslip
                            </button>

                            {isProcessed && (
                              <span className="bel-payroll-row-processed">
                                <FiCheckCircle />
                                Paid
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bel-payroll-selection-footer">
              <div>
                <FiUsers />
                {selectedEmployee
                  ? `Selected: ${selectedEmployee.name} (${selectedEmployee.id})`
                  : "Select an employee to enable payroll actions"}
              </div>

              <div>
                <button
                  type="button"
                  className="bel-payroll-secondary-action"
                  onClick={processSelectedEmployee}
                >
                  <FiCheck />
                  Process Selected
                </button>
                <button
                  type="button"
                  className="bel-payroll-primary-action"
                  onClick={generatePayslip}
                >
                  <FiFileText />
                  Generate Payslip
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "processing" && (
          <section className="bel-payroll-processing-card">
            <div className="bel-payroll-processing-heading">
              <div>
                <h2>Payroll Processing — {payrollMonth}</h2>
                <p>
                  {selectedEmployee
                    ? `Processing payroll for ${selectedEmployee.name} (${selectedEmployee.id})`
                    : "Select an employee from Employee Payroll before starting."}
                </p>
              </div>

              {selectedEmployee && (
                <span className="bel-payroll-processing-employee">
                  {selectedEmployee.name}
                </span>
              )}
            </div>

            <div className="bel-payroll-stepper">
              <div className="bel-payroll-step-line" />

              {PROCESS_STEPS.map((step, index) => {
                const completed = index < processStep;
                const current = index === processStep;

                return (
                  <div
                    className={`bel-payroll-step ${
                      completed ? "is-complete" : ""
                    } ${current ? "is-current" : ""}`}
                    key={step}
                  >
                    <span>
                      {completed ? <FiCheck /> : index + 1}
                    </span>
                    <strong>{step}</strong>
                  </div>
                );
              })}
            </div>

            <div className="bel-payroll-processing-actions">
              <button
                type="button"
                className="bel-payroll-secondary-action"
                disabled={!selectedEmployee || processStep === 0}
                onClick={() => moveProcessStep(-1)}
              >
                Previous
              </button>

              <button
                type="button"
                className="bel-payroll-primary-action"
                disabled={!selectedEmployee}
                onClick={() => {
                  if (processStep >= PROCESS_STEPS.length - 1) {
                    generatePayslip();
                  } else {
                    moveProcessStep(1);
                  }
                }}
              >
                {processStep >= PROCESS_STEPS.length - 1
                  ? "Generate Payslip"
                  : "Next Step →"}
              </button>
            </div>
          </section>
        )}

        {activeTab === "analytics" && (
          <section className="bel-payroll-analytics-card">
            <div className="bel-payroll-analytics-header">
              <div>
                <h2>Payroll Trend — Last 6 Months</h2>
                <p>
                  Gross payroll calculated from the employee compensation data.
                </p>
              </div>
              <strong>{formatINR(monthTotalGross, true)}</strong>
            </div>

            <div className="bel-payroll-chart">
              <div className="bel-payroll-y-labels">
                <span>₹60L</span>
                <span>₹45L</span>
                <span>₹30L</span>
                <span>₹15L</span>
                <span>₹0L</span>
              </div>

              <div className="bel-payroll-chart-area">
                <div className="bel-payroll-grid-lines">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>

                <div className="bel-payroll-bars">
                  {previousMonths.map((item) => {
                    const maxValue = Math.max(
                      ...previousMonths.map((month) => month.value)
                    );
                    const height = Math.max(
                      20,
                      Math.min(100, (item.value / maxValue) * 78)
                    );

                    return (
                      <button
                        type="button"
                        className="bel-payroll-bar-column"
                        key={`${item.year}-${item.month}`}
                        title={`${formatMonth(
                          item.year,
                          item.month
                        )}: ${formatINR(item.value)}`}
                        onClick={() => {
                          setSelectedYear(item.year);
                          setSelectedMonth(item.month);
                        }}
                      >
                        <span
                          className="bel-payroll-bar"
                          style={{ height: `${height}%` }}
                        />
                        <small>{item.label}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {modal === "payslip" && selectedEmployee && (
          <div
            className="bel-payroll-modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            <div className="bel-payroll-payslip-modal">
              <div className="bel-payroll-modal-header">
                <div>
                  <h2>Payslip</h2>
                  <p>
                    {payrollMonth} · {selectedEmployee.id}
                  </p>
                </div>
                <button type="button" onClick={closeModal} aria-label="Close">
                  <FiX />
                </button>
              </div>

              <div className="bel-payroll-payslip-body">
                <div className="bel-payroll-payslip-identity">
                  <EmployeeAvatar initials={selectedEmployee.initials} index={0} />
                  <div>
                    <strong>{selectedEmployee.name}</strong>
                    <span>
                      {selectedEmployee.department} · {selectedEmployee.id}
                    </span>
                  </div>
                  <PayrollStatus
                    status={
                      processedEmployees[
                        `${payrollKey}-${selectedEmployee.id}`
                      ]
                        ? "Processed"
                        : "Pending"
                    }
                  />
                </div>

                <div className="bel-payroll-payslip-grid">
                  <div>
                    <span>Basic Salary</span>
                    <strong>{formatINR(selectedEmployee.basicPay)}</strong>
                  </div>
                  <div>
                    <span>HRA</span>
                    <strong>{formatINR(selectedEmployee.hraPay)}</strong>
                  </div>
                  <div>
                    <span>Allowances</span>
                    <strong>{formatINR(selectedEmployee.allowancePay)}</strong>
                  </div>
                  <div>
                    <span>Paid Days</span>
                    <strong>{selectedEmployee.paidDays}</strong>
                  </div>
                  <div>
                    <span>Gross Salary</span>
                    <strong>{formatINR(selectedEmployee.gross)}</strong>
                  </div>
                  <div>
                    <span>Deductions</span>
                    <strong className="deduction">
                      {formatINR(selectedEmployee.deductions)}
                    </strong>
                  </div>
                </div>

                <div className="bel-payroll-net-box">
                  <span>Net Salary</span>
                  <strong>{formatINR(selectedEmployee.net)}</strong>
                </div>
              </div>

              <div className="bel-payroll-modal-footer">
                <button
                  type="button"
                  className="bel-payroll-secondary-action"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="bel-payroll-primary-action"
                  onClick={exportSelectedPayslip}
                >
                  <FiDownload />
                  Download Payslip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRLayout>
  );
}
