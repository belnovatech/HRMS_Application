// import { useState } from "react";
// import "./PayslipTable.css";
// import {
//   FiEye,
//   FiDownload,
//   FiShare2,
//   FiFileText,
// } from "react-icons/fi";

// const employees = [
//   {
//     id: 1,
//     name: "Arjun Mehta",
//     initials: "AM",
//     color: "#52C41A",
//     month: "Jun 2025",
//     gross: "₹85,000",
//     deduction: "-₹12,500",
//     net: "₹72,500",
//   },
//   {
//     id: 2,
//     name: "Priya Sharma",
//     initials: "PS",
//     color: "#FAAD14",
//     month: "Jun 2025",
//     gross: "₹85,000",
//     deduction: "-₹12,500",
//     net: "₹72,500",
//   },
//   {
//     id: 3,
//     name: "Rahul Verma",
//     initials: "RV",
//     color: "#13C2C2",
//     month: "Jun 2025",
//     gross: "₹85,000",
//     deduction: "-₹12,500",
//     net: "₹72,500",
//   },
//   {
//     id: 4,
//     name: "Sneha Patel",
//     initials: "SP",
//     color: "#722ED1",
//     month: "Jun 2025",
//     gross: "₹85,000",
//     deduction: "-₹12,500",
//     net: "₹72,500",
//   },
//   {
//     id: 5,
//     name: "Vikram Singh",
//     initials: "VS",
//     color: "#52C41A",
//     month: "Jun 2025",
//     gross: "₹85,000",
//     deduction: "-₹12,500",
//     net: "₹72,500",
//   },
// ];

// export default function PayslipTable() {
// const [selectedEmployee, setSelectedEmployee] = useState(null);

// const viewPayslip = (emp) => {
//   setSelectedEmployee(emp);
// };

// const downloadPayslip = (emp) => {
//   const link = document.createElement("a");
//   link.href = "/samplePayslip.pdf";
//   link.download = `${emp.name}-Payslip.pdf`;
//   link.click();
// };

// const sharePayslip = async (emp) => {
//   if (navigator.share) {
//     await navigator.share({
//       title: "Payslip",
//       text: `Payslip for ${emp.name}`,
//       url: window.location.href,
//     });
//   }
// };

//   const exportCSV = () => {
//     const csv =
//       "Employee,Month,Net Pay\n" +
//       employees
//         .map(
//           (e) =>
//             `${e.name},${e.month},${e.net}`
//         )
//         .join("\n");

//     const blob = new Blob([csv], {
//       type: "text/csv",
//     });

//     const url =
//       window.URL.createObjectURL(blob);

//     const a =
//       document.createElement("a");

//     a.href = url;
//     a.download = "Payslips.csv";
//     a.click();
//   };

//   return (
//     <>
//       <div className="table-actions">
//         <button
//           className="export-btn"
//           onClick={exportCSV}
//         >
//           <FiFileText />
//           Export CSV
//         </button>
//       </div>

//       <table className="payslip-table">
//         <thead>
//           <tr>
//             <th>EMPLOYEE</th>
//             <th>MONTH</th>
//             <th>GROSS</th>
//             <th>DEDUCTIONS</th>
//             <th>NET PAY</th>
//             <th>STATUS</th>
//             <th>ACTIONS</th>
//           </tr>
//         </thead>

//         <tbody>
//           {employees.map((emp) => (
//             <tr key={emp.id}>
//               <td>
//                 <div className="emp-info">
//                   <div
//                     className="avatar"
//                     style={{
//                       background: emp.color,
//                     }}
//                   >
//                     {emp.initials}
//                   </div>

//                   {emp.name}
//                 </div>
//               </td>

//               <td>{emp.month}</td>

//               <td>{emp.gross}</td>

//               <td className="red">
//                 {emp.deduction}
//               </td>

//               <td className="net-pay">
//                 {emp.net}
//               </td>

//               <td>
//                 <span className="status">
//                   Active
//                 </span>
//               </td>

//               <td>
//                 <div className="actions">
//                   <button
//                     onClick={() =>
//                       viewPayslip(emp)
//                     }
//                   >
//                     <FiEye />
//                   </button>

//                   <button
//                     onClick={() =>
//                       downloadPayslip(emp)
//                     }
//                   >
//                     <FiDownload />
//                   </button>

//                   <button
//                     onClick={() =>
//                       sharePayslip(emp)
//                     }
//                   >
//                     <FiShare2 />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {selectedEmployee && (
//         <div className="preview-modal">
//           <div className="modal-content">
//             <h3>
//               {selectedEmployee.name}
//             </h3>

//             <p>
//               Net Salary :
//               {selectedEmployee.net}
//             </p>

//             <button
//               className="close-btn"
//               onClick={() =>
//                 setSelectedEmployee(null)
//               }
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useState, useEffect } from "react";
import "./PayslipTable.css";
import {
  FiEye,
  FiDownload,
  FiShare2,
  FiFileText,
} from "react-icons/fi";
import { getAllPayslips } from "../../../services/payrollService";

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const AVATAR_COLORS = ["#52C41A", "#FAAD14", "#13C2C2", "#722ED1", "#FA541C"];

const formatCurrency = (value) =>
  `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getInitials = (empId) => `E${empId}`;

export default function PayslipTable() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllPayslips();
      setPayslips(res.data || []);
    } catch (err) {
      console.error("Failed to fetch payslips:", err);
      setError("Failed to load payslips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const viewPayslip = (emp) => {
    setSelectedEmployee(emp);
  };

  const downloadPayslip = (emp) => {
    // No dedicated download endpoint yet — using placeholder for now.
    const link = document.createElement("a");
    link.href = "/samplePayslip.pdf";
    link.download = `Employee-${emp.emp_id}-Payslip.pdf`;
    link.click();
  };

  const sharePayslip = async (emp) => {
    if (navigator.share) {
      await navigator.share({
        title: "Payslip",
        text: `Payslip for Employee #${emp.emp_id}`,
        url: window.location.href,
      });
    }
  };

  const exportCSV = () => {
    const csv =
      "Employee ID,Month,Year,Net Pay\n" +
      payslips
        .map(
          (p) =>
            `${p.emp_id},${MONTH_NAMES[p.month_id] || p.month_id},${p.year_id},${p.net_pay}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Payslips.csv";
    a.click();
  };

  if (loading) {
    return <div className="payslip-loading">Loading payslips...</div>;
  }

  if (error) {
    return (
      <div className="payslip-error">
        <p>{error}</p>
        <button onClick={fetchPayslips}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className="table-actions">
        <button className="export-btn" onClick={exportCSV}>
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
          {payslips.length === 0 ? (
            <tr>
              <td colSpan={7} className="no-data">
                No payslips found.
              </td>
            </tr>
          ) : (
            payslips.map((emp, index) => (
              <tr key={emp.id}>
                <td>
                  <div className="emp-info">
                    <div
                      className="avatar"
                      style={{
                        background:
                          AVATAR_COLORS[index % AVATAR_COLORS.length],
                      }}
                    >
                      {getInitials(emp.emp_id)}
                    </div>
                    Employee #{emp.emp_id}
                  </div>
                </td>

                <td>
                  {MONTH_NAMES[emp.month_id] || emp.month_id} {emp.year_id}
                </td>

                <td>{formatCurrency(emp.total_earnings)}</td>

                <td className="red">
                  -{formatCurrency(emp.total_deductions)}
                </td>

                <td className="net-pay">{formatCurrency(emp.net_pay)}</td>

                <td>
                  <span
                    className={`status ${
                      emp.is_active ? "" : "inactive"
                    }`}
                  >
                    {emp.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <div className="actions">
                    <button onClick={() => viewPayslip(emp)}>
                      <FiEye />
                    </button>

                    <button onClick={() => downloadPayslip(emp)}>
                      <FiDownload />
                    </button>

                    <button onClick={() => sharePayslip(emp)}>
                      <FiShare2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedEmployee && (
        <div className="preview-modal">
          <div className="modal-content">
            <h3>Employee #{selectedEmployee.emp_id}</h3>

            <p>
              {MONTH_NAMES[selectedEmployee.month_id] ||
                selectedEmployee.month_id}{" "}
              {selectedEmployee.year_id}
            </p>

            <div className="modal-breakdown">
              <p>Basic: {formatCurrency(selectedEmployee.basic)}</p>
              <p>HRA: {formatCurrency(selectedEmployee.hra)}</p>
              <p>
                Conveyance: {formatCurrency(selectedEmployee.conveyance)}
              </p>
              <p>
                Medical Allowance:{" "}
                {formatCurrency(selectedEmployee.medical_allowance)}
              </p>
              <p>
                Special Allowance:{" "}
                {formatCurrency(selectedEmployee.special_allowance)}
              </p>
              <p>
                Total Earnings:{" "}
                {formatCurrency(selectedEmployee.total_earnings)}
              </p>
              <p>
                Total Deductions:{" "}
                {formatCurrency(selectedEmployee.total_deductions)}
              </p>
              <p>
                <strong>
                  Net Pay: {formatCurrency(selectedEmployee.net_pay)}
                </strong>
              </p>
            </div>

            <button
              className="close-btn"
              onClick={() => setSelectedEmployee(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}