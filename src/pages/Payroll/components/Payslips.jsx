import "./Payslips.css";
import PayslipTable from "./PayslipTable";
import { FiPrinter } from "react-icons/fi";

export default function Payslips() {
  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="payslip-card">
      <div className="payslip-header">
        <h2>Payslip Generator</h2>

        <button
          className="print-btn"
          onClick={handlePrintAll}
        >
          <FiPrinter />
          Print All
        </button>
      </div>

      <PayslipTable />
    </div>
  );
}