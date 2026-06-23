import "./PayrollWizard.css";

export default function PayrollWizard({
  step,
  setStep,
}) {
  return (
    <>
      <div className="wizard-steps">
        <div className={step >= 1 ? "active-step" : ""}>
          1
        </div>

        <div className={step >= 2 ? "active-step" : ""}>
          2
        </div>

        <div className={step >= 3 ? "active-step" : ""}>
          3
        </div>

        <div className={step >= 4 ? "active-step" : ""}>
          4
        </div>
      </div>

      {step === 1 && (
        <div className="wizard-body">
          <select>
            <option>
              June 2025
            </option>
          </select>

          <button
            onClick={() => setStep(2)}
          >
            Calculate
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-body">
          <h3>
            Calculating salaries...
          </h3>

          <button
            onClick={() => setStep(3)}
          >
            View Preview
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="wizard-body">
          <div className="summary-grid">
            <div>
              Gross ₹36,00,000
            </div>

            <div>
              Deductions ₹4,80,000
            </div>

            <div>
              Net ₹31,20,000
            </div>

            <div>
              Employees 115
            </div>
          </div>

          <button
            onClick={() => setStep(4)}
          >
            Confirm & Process
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="wizard-body">
          <h2>
            Payroll Processed
            Successfully
          </h2>

          <button
            onClick={() => setStep(1)}
          >
            Run Another
          </button>
        </div>
      )}
    </>
  );
}