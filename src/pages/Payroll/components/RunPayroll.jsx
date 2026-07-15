// import { useState } from "react";
// import "./RunPayroll.css";
// import {
//   FiChevronDown,
//   FiChevronRight,
//   FiCheck,
//   FiRefreshCw,
// } from "react-icons/fi";

// export default function RunPayroll() {
//   const [step, setStep] = useState(1);

//   const nextStep = () => {
//     if (step < 4) setStep(step + 1);
//   };

//   const resetFlow = () => {
//     setStep(1);
//   };

//   const renderStepContent = () => {
//     switch (step) {
//       case 1:
//         return (
//           <>
//             <div className="field-group">
//               <label>Payroll Month</label>

//               <div className="select-box">
//                 <span>June 2025</span>
//                 <FiChevronDown />
//               </div>
//             </div>

//             <div className="payroll-info">
//               <h4>115 employees eligible for payroll this month</h4>
//               <p>7 employees on hold · 1 new joiner</p>
//             </div>

//             <div className="wizard-footer">
//               <button className="back-btn disabled">
//                 Back
//               </button>

//               <button
//                 className="primary-btn"
//                 onClick={nextStep}
//               >
//                 Calculate
//                 <FiChevronRight />
//               </button>
//             </div>
//           </>
//         );

//       case 2:
//         return (
//           <>
//             <div className="calculation-box">
//               <div className="loader-circle">
//                 <FiRefreshCw />
//               </div>

//               <h3>Calculating salaries...</h3>
//               <p>Processing 115 employee records</p>
//             </div>

//             <div className="wizard-footer">
//               <button
//                 className="back-btn"
//                 onClick={() => setStep(1)}
//               >
//                 Back
//               </button>

//               <button
//                 className="primary-btn"
//                 onClick={nextStep}
//               >
//                 View Preview
//                 <FiChevronRight />
//               </button>
//             </div>
//           </>
//         );

//       case 3:
//         return (
//           <>
//             <div className="preview-card">
//               <div>
//                 <span>Total Gross</span>
//                 <h3>₹36,00,000</h3>

//                 <span>Net Payable</span>
//                 <h3>₹31,20,000</h3>
//               </div>

//               <div>
//                 <span>Total Deductions</span>
//                 <h3>₹4,80,000</h3>

//                 <span>Employees</span>
//                 <h3>115</h3>
//               </div>
//             </div>

//             <div className="wizard-footer">
//               <button
//                 className="back-btn"
//                 onClick={() => setStep(2)}
//               >
//                 Back
//               </button>

//               <button
//                 className="primary-btn"
//                 onClick={nextStep}
//               >
//                 Confirm & Process
//                 <FiChevronRight />
//               </button>
//             </div>
//           </>
//         );

//       case 4:
//         return (
//           <>
//             <div className="success-box">
//               <div className="success-icon">
//                 <FiCheck />
//               </div>

//               <h2>Payroll Processed Successfully!</h2>

//               <p>
//                 ₹31.2L disbursed to 115 employees for
//                 June 2025
//               </p>
//             </div>

//             <div className="wizard-footer">
//               <button
//                 className="back-btn"
//                 onClick={() => setStep(3)}
//               >
//                 Back
//               </button>

//               <button
//                 className="outline-btn"
//                 onClick={resetFlow}
//               >
//                 Run Another
//               </button>
//             </div>
//           </>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="run-payroll-card">
//       <h2>Run Payroll</h2>

//       <div className="stepper">
//         {[1, 2, 3, 4].map((item) => (
//           <div
//             className="step-wrapper"
//             key={item}
//           >
//             <div
//               className={`step-circle ${
//                 step > item
//                   ? "completed"
//                   : step === item
//                   ? "active"
//                   : ""
//               }`}
//             >
//               {step > item ? <FiCheck /> : item}
//             </div>

//             <span
//               className={
//                 step >= item
//                   ? "step-label active"
//                   : "step-label"
//               }
//             >
//               {item === 1 && "Select Month"}
//               {item === 2 && "Calculate"}
//               {item === 3 && "Preview"}
//               {item === 4 && "Confirm"}
//             </span>

//             {item < 4 && (
//               <div
//                 className={`step-line ${
//                   step > item
//                     ? "line-active"
//                     : ""
//                 }`}
//               />
//             )}
//           </div>
//         ))}
//       </div>

//       {renderStepContent()}
//     </div>
//   );
// }






import { useState } from "react";
import "./RunPayroll.css";
import {
  FiChevronDown,
  FiChevronRight,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";
import { calculateAllPayroll } from "../../../services/payrollService";

export default function RunPayroll() {
  const [step, setStep] = useState(1);
  const [payrollData, setPayrollData] = useState(null);
  const [error, setError] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const resetFlow = () => {
    setStep(1);
    setPayrollData(null);
    setError(null);
  };

  const runCalculation = async () => {
    try {
      setError(null);
      setCalculating(true);
      setStep(2);

      const res = await calculateAllPayroll();
      setPayrollData(res.data);

      setStep(3);
    } catch (err) {
      console.error("Payroll calculation failed:", err);
      setError("Failed to calculate payroll. Please try again.");
      setStep(1);
    } finally {
      setCalculating(false);
    }
  };

  // Derive summary totals from API response (shape may vary — adjust once backend confirms structure)
  const summary = payrollData
    ? {
        totalGross:
          payrollData.total_earnings ??
          payrollData.totalGross ??
          "N/A",
        totalDeductions:
          payrollData.total_deductions ??
          payrollData.totalDeductions ??
          "N/A",
        netPayable:
          payrollData.net_pay ?? payrollData.netPayable ?? "N/A",
        employeeCount:
          payrollData.employee_count ??
          (Array.isArray(payrollData) ? payrollData.length : "N/A"),
      }
    : null;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="field-group">
              <label>Payroll Month</label>

              <div className="select-box">
                <span>June 2025</span>
                <FiChevronDown />
              </div>
            </div>

            <div className="payroll-info">
              <h4>Ready to calculate payroll</h4>
              <p>
                Click Calculate to fetch payroll data from the server
              </p>
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="wizard-footer">
              <button className="back-btn disabled">Back</button>

              <button className="primary-btn" onClick={runCalculation}>
                Calculate
                <FiChevronRight />
              </button>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="calculation-box">
              <div className="loader-circle">
                <FiRefreshCw />
              </div>

              <h3>Calculating salaries...</h3>
              <p>Fetching data from server</p>
            </div>

            <div className="wizard-footer">
              <button
                className="back-btn"
                onClick={() => setStep(1)}
                disabled={calculating}
              >
                Back
              </button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="preview-card">
              <div>
                <span>Total Gross</span>
                <h3>₹{summary?.totalGross}</h3>

                <span>Net Payable</span>
                <h3>₹{summary?.netPayable}</h3>
              </div>

              <div>
                <span>Total Deductions</span>
                <h3>₹{summary?.totalDeductions}</h3>

                <span>Employees</span>
                <h3>{summary?.employeeCount}</h3>
              </div>
            </div>

            <div className="wizard-footer">
              <button className="back-btn" onClick={() => setStep(1)}>
                Back
              </button>

              <button className="primary-btn" onClick={nextStep}>
                Confirm & Process
                <FiChevronRight />
              </button>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div className="success-box">
              <div className="success-icon">
                <FiCheck />
              </div>

              <h2>Payroll Calculated</h2>

              <p>
                Note: There is currently no backend endpoint to actually
                process/disburse payroll — this step only reflects the
                calculated preview above. A "process payroll" API is
                needed from the backend to make this step real.
              </p>
            </div>

            <div className="wizard-footer">
              <button className="back-btn" onClick={() => setStep(3)}>
                Back
              </button>

              <button className="outline-btn" onClick={resetFlow}>
                Run Another
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="run-payroll-card">
      <h2>Run Payroll</h2>

      <div className="stepper">
        {[1, 2, 3, 4].map((item) => (
          <div className="step-wrapper" key={item}>
            <div
              className={`step-circle ${
                step > item ? "completed" : step === item ? "active" : ""
              }`}
            >
              {step > item ? <FiCheck /> : item}
            </div>

            <span
              className={step >= item ? "step-label active" : "step-label"}
            >
              {item === 1 && "Select Month"}
              {item === 2 && "Calculate"}
              {item === 3 && "Preview"}
              {item === 4 && "Confirm"}
            </span>

            {item < 4 && (
              <div
                className={`step-line ${step > item ? "line-active" : ""}`}
              />
            )}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
}