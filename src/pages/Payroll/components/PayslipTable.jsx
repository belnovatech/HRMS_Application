import { useState } from "react";
import "./PayslipTable.css";
import {
  FiEye,
  FiDownload,
  FiShare2,
  FiFileText,
} from "react-icons/fi";

const employees = [
  {
    id: 1,
    name: "Arjun Mehta",
    initials: "AM",
    color: "#52C41A",
    month: "Jun 2025",
    gross: "₹85,000",
    deduction: "-₹12,500",
    net: "₹72,500",
  },
  {
    id: 2,
    name: "Priya Sharma",
    initials: "PS",
    color: "#FAAD14",
    month: "Jun 2025",
    gross: "₹85,000",
    deduction: "-₹12,500",
    net: "₹72,500",
  },
  {
    id: 3,
    name: "Rahul Verma",
    initials: "RV",
    color: "#13C2C2",
    month: "Jun 2025",
    gross: "₹85,000",
    deduction: "-₹12,500",
    net: "₹72,500",
  },
  {
    id: 4,
    name: "Sneha Patel",
    initials: "SP",
    color: "#722ED1",
    month: "Jun 2025",
    gross: "₹85,000",
    deduction: "-₹12,500",
    net: "₹72,500",
  },
  {
    id: 5,
    name: "Vikram Singh",
    initials: "VS",
    color: "#52C41A",
    month: "Jun 2025",
    gross: "₹85,000",
    deduction: "-₹12,500",
    net: "₹72,500",
  },
];

export default function PayslipTable() {
const [selectedEmployee, setSelectedEmployee] = useState(null);

const viewPayslip = (emp) => {
  setSelectedEmployee(emp);
};

const downloadPayslip = (emp) => {
  const link = document.createElement("a");
  link.href = "/samplePayslip.pdf";
  link.download = `${emp.name}-Payslip.pdf`;
  link.click();
};

const sharePayslip = async (emp) => {
  if (navigator.share) {
    await navigator.share({
      title: "Payslip",
      text: `Payslip for ${emp.name}`,
      url: window.location.href,
    });
  }
};

  const exportCSV = () => {
    const csv =
      "Employee,Month,Net Pay\n" +
      employees
        .map(
          (e) =>
            `${e.name},${e.month},${e.net}`
        )
        .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = "Payslips.csv";
    a.click();
  };

  return (
    <>
      <div className="table-actions">
        <button
          className="export-btn"
          onClick={exportCSV}
        >
          <FiFileText />
          Export CSV
        </button>
      </div>

      <table className="payslip-table">
        <thead>
          <tr>
            <th>EMPLOYEE</th>
            <th>MONTH</th>
            <th>GROSS</th>
            <th>DEDUCTIONS</th>
            <th>NET PAY</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                <div className="emp-info">
                  <div
                    className="avatar"
                    style={{
                      background: emp.color,
                    }}
                  >
                    {emp.initials}
                  </div>

                  {emp.name}
                </div>
              </td>

              <td>{emp.month}</td>

              <td>{emp.gross}</td>

              <td className="red">
                {emp.deduction}
              </td>

              <td className="net-pay">
                {emp.net}
              </td>

              <td>
                <span className="status">
                  Active
                </span>
              </td>

              <td>
                <div className="actions">
                  <button
                    onClick={() =>
                      viewPayslip(emp)
                    }
                  >
                    <FiEye />
                  </button>

                  <button
                    onClick={() =>
                      downloadPayslip(emp)
                    }
                  >
                    <FiDownload />
                  </button>

                  <button
                    onClick={() =>
                      sharePayslip(emp)
                    }
                  >
                    <FiShare2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployee && (
        <div className="preview-modal">
          <div className="modal-content">
            <h3>
              {selectedEmployee.name}
            </h3>

            <p>
              Net Salary :
              {selectedEmployee.net}
            </p>

            <button
              className="close-btn"
              onClick={() =>
                setSelectedEmployee(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}