import { useState } from "react";
import "./RunPayroll.css";
import {
  FiChevronDown,
  FiChevronRight,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";

export default function RunPayroll() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const resetFlow = () => {
    setStep(1);
  };

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
              <h4>115 employees eligible for payroll this month</h4>
              <p>7 employees on hold · 1 new joiner</p>
            </div>

            <div className="wizard-footer">
              <button className="back-btn disabled">
                Back
              </button>

              <button
                className="primary-btn"
                onClick={nextStep}
              >
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
              <p>Processing 115 employee records</p>
            </div>

            <div className="wizard-footer">
              <button
                className="back-btn"
                onClick={() => setStep(1)}
              >
                Back
              </button>

              <button
                className="primary-btn"
                onClick={nextStep}
              >
                View Preview
                <FiChevronRight />
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
                <h3>₹36,00,000</h3>

                <span>Net Payable</span>
                <h3>₹31,20,000</h3>
              </div>

              <div>
                <span>Total Deductions</span>
                <h3>₹4,80,000</h3>

                <span>Employees</span>
                <h3>115</h3>
              </div>
            </div>

            <div className="wizard-footer">
              <button
                className="back-btn"
                onClick={() => setStep(2)}
              >
                Back
              </button>

              <button
                className="primary-btn"
                onClick={nextStep}
              >
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

              <h2>Payroll Processed Successfully!</h2>

              <p>
                ₹31.2L disbursed to 115 employees for
                June 2025
              </p>
            </div>

            <div className="wizard-footer">
              <button
                className="back-btn"
                onClick={() => setStep(3)}
              >
                Back
              </button>

              <button
                className="outline-btn"
                onClick={resetFlow}
              >
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
          <div
            className="step-wrapper"
            key={item}
          >
            <div
              className={`step-circle ${
                step > item
                  ? "completed"
                  : step === item
                  ? "active"
                  : ""
              }`}
            >
              {step > item ? <FiCheck /> : item}
            </div>

            <span
              className={
                step >= item
                  ? "step-label active"
                  : "step-label"
              }
            >
              {item === 1 && "Select Month"}
              {item === 2 && "Calculate"}
              {item === 3 && "Preview"}
              {item === 4 && "Confirm"}
            </span>

            {item < 4 && (
              <div
                className={`step-line ${
                  step > item
                    ? "line-active"
                    : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
}