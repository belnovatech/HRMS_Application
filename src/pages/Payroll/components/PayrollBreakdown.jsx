import "./PayrollBreakdown.css";

const PayrollBreakdown = () => {
  const data = [
    {
      label: "Basic Salary",
      value: "₹19,80,000",
      width: "65%",
    },
    {
      label: "HRA",
      value: "₹5,94,000",
      width: "22%",
    },
    {
      label: "Special Allowance",
      value: "₹2,97,000",
      width: "12%",
    },
    {
      label: "Bonus",
      value: "₹2,49,000",
      width: "10%",
    },
  ];

  return (
    <div className="breakdown-card">
      <h3>
        Payroll Breakdown — Jun 2025
      </h3>

      {data.map((item, index) => (
        <div
          key={index}
          className="breakdown-item"
        >
          <div className="breakdown-header">
            <span>{item.label}</span>

            <span>{item.value}</span>
          </div>

          <div className="progress">
            <div
              className="progress-fill"
              style={{
                width: item.width,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PayrollBreakdown;