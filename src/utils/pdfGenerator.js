import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { COMPANY_DETAILS } from "../constants/companyDetails";

/**
 * Returns HTML string for the standard Company PDF Header
 */
export const getCompanyPdfHeaderHtml = ({
  documentTitle = "Document",
  documentSubtitle = "",
  period = ""
}) => {
  return `
    <div style="width: 100%; box-sizing: border-box; padding: 10px 0 5px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #ffffff;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
        <tr>
          <!-- Left: Logo -->
          <td style="width: 25%; vertical-align: middle; text-align: left;">
            <img src="${COMPANY_DETAILS.logoUrl}" alt="${COMPANY_DETAILS.name}" style="max-width: 140px; max-height: 55px; object-fit: contain;" />
          </td>
          <!-- Center: Company Details -->
          <td style="width: 50%; vertical-align: middle; text-align: center;">
            <div style="font-size: 15px; font-weight: 800; color: #000000; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 3px;">
              ${COMPANY_DETAILS.name}
            </div>
            <div style="font-size: 10px; color: #334155; line-height: 1.35;">
              ${COMPANY_DETAILS.addressLine1}
            </div>
            <div style="font-size: 10px; color: #334155; line-height: 1.35;">
              ${COMPANY_DETAILS.addressLine2}
            </div>
          </td>
          <!-- Right: Document Title & Period -->
          <td style="width: 25%; vertical-align: middle; text-align: right;">
            <div style="font-size: 13px; font-weight: 600; color: #1e293b;">
              ${documentTitle}
            </div>
            ${
              period
                ? `<div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 3px;">${period}</div>`
                : documentSubtitle
                ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">${documentSubtitle}</div>`
                : ""
            }
          </td>
        </tr>
      </table>
      <div style="border-top: 1.5px solid #000000; width: 100%; margin-top: 5px; margin-bottom: 15px;"></div>
    </div>
  `;
};

/**
 * Downloads a screenshot-exact Payslip PDF matching the reference image.
 */
export const downloadPayslipPdf = async (slip = {}, user = {}) => {
  const monthStr = slip.month || "Aug 2026";
  const employeeName = user.name || slip.employeeName || "Harish Yadav Pilli";
  const designation = user.designation || slip.designation || "Associate Software Engineer";
  const employeeId = user.employeeId || slip.employeeId || "BLN001";
  const joinDate = user.joinDate || slip.joinDate || "11/05/2026";
  const payPeriod = slip.payPeriod || "June";
  const payDate = slip.payDate || "05/09/2026";
  const pfNo = user.pfNo || slip.pfNo || "N/A";
  const uan = user.uan || slip.uan || "101864402517";
  const bankAcc = user.bankAcc || slip.bankAcc || "922010041338296";
  const ifsc = user.ifsc || slip.ifsc || "UTIB0001030";
  const pan = user.pan || slip.pan || "FWGPB3338P";
  const bankName = user.bankName || slip.bankName || "Axis Bank";

  const netSalary = slip.netSalary || "₹20,000";
  const grossSalary = slip.grossSalary || "₹22,000.00";
  const deductions = slip.deductions || "₹2,000.00";

  // Temporary container element for high-res PDF canvas rendering
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "794px"; // A4 width at 96 DPI
  container.style.background = "#ffffff";
  container.style.padding = "35px 40px";
  container.style.boxSizing = "border-box";
  container.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  container.style.color = "#000000";

  container.innerHTML = `
    <!-- Standard Header -->
    ${getCompanyPdfHeaderHtml({
      documentTitle: "Payslip for the Month",
      period: monthStr
    })}

    <!-- Body Content -->
    <div style="margin-top: 15px;">
      <!-- Employee Summary Title & Grid -->
      <div style="font-size: 13px; font-weight: 800; letter-spacing: 0.5px; color: #000000; margin-bottom: 12px; text-transform: uppercase;">
        EMPLOYEE SUMMARY
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <!-- Left Details -->
          <td style="width: 60%; vertical-align: top; padding-right: 15px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.8;">
              <tr>
                <td style="width: 130px; font-weight: 500; color: #000000;">Employee Name</td>
                <td style="font-weight: 700; color: #000000;">: ${employeeName}</td>
              </tr>
              <tr>
                <td style="font-weight: 500; color: #000000;">Designation</td>
                <td style="font-weight: 700; color: #000000;">: ${designation}</td>
              </tr>
              <tr>
                <td style="font-weight: 500; color: #000000;">Employee ID</td>
                <td style="font-weight: 700; color: #000000;">: ${employeeId}</td>
              </tr>
              <tr>
                <td style="font-weight: 500; color: #000000;">Date of Joining</td>
                <td style="font-weight: 700; color: #000000;">: ${joinDate}</td>
              </tr>
              <tr>
                <td style="font-weight: 500; color: #000000;">Pay Period</td>
                <td style="font-weight: 700; color: #000000;">: ${payPeriod}</td>
              </tr>
              <tr>
                <td style="font-weight: 500; color: #000000;">Pay Date</td>
                <td style="font-weight: 700; color: #000000;">: ${payDate}</td>
              </tr>
            </table>
          </td>

          <!-- Right Net Pay Box -->
          <td style="width: 40%; vertical-align: top;">
            <div style="background: #e0f2fe; border: 1.5px solid #0284c7; border-radius: 12px; padding: 14px 18px;">
              <div style="font-size: 20px; font-weight: 800; color: #000000; margin-bottom: 2px;">
                ${netSalary}
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #334155; margin-bottom: 12px;">
                Total Net Pay
              </div>
              <div style="font-size: 11px; color: #000000; display: flex; justify-content: space-between; margin-bottom: 3px;">
                <span>Paid Days</span>
                <span style="font-weight: 700;">: 30</span>
              </div>
              <div style="font-size: 11px; color: #000000; display: flex; justify-content: space-between;">
                <span>LOP Days</span>
                <span style="font-weight: 700;">: 0</span>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <!-- Dashed Line -->
      <div style="border-top: 1px dashed #94a3b8; width: 100%; margin: 15px 0;"></div>

      <!-- Bank & Account Meta Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; line-height: 1.7;">
        <tr>
          <td style="width: 120px;">PF A/C Number</td>
          <td style="width: 220px; font-weight: 700;">: ${pfNo}</td>
          <td style="width: 100px;">UAN</td>
          <td style="font-weight: 700;">: ${uan}</td>
        </tr>
        <tr>
          <td>Bank Account No</td>
          <td style="font-weight: 700;">: ${bankAcc}</td>
          <td>IFSC</td>
          <td style="font-weight: 700;">: ${ifsc}</td>
        </tr>
        <tr>
          <td>PAN</td>
          <td style="font-weight: 700;">: ${pan}</td>
          <td>Bank Name</td>
          <td style="font-weight: 700;">: ${bankName}</td>
        </tr>
      </table>

      <!-- Earnings & Deductions Table Card -->
      <div style="border: 1.5px solid #000000; border-radius: 14px; overflow: hidden; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: #ffffff; border-bottom: 1px dashed #94a3b8;">
              <th style="text-align: left; padding: 10px 14px; font-weight: 800; font-size: 12px;">EARNINGS</th>
              <th style="text-align: right; padding: 10px 14px; font-weight: 800; font-size: 12px;">AMOUNT</th>
              <th style="text-align: left; padding: 10px 14px; font-weight: 800; font-size: 12px; border-left: 1px solid #e2e8f0;">DEDUCTIONS</th>
              <th style="text-align: right; padding: 10px 14px; font-weight: 800; font-size: 12px;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px 14px;">Basic</td>
              <td style="text-align: right; padding: 8px 14px; font-weight: 700;">₹11,000.00</td>
              <td style="padding: 8px 14px; border-left: 1px solid #e2e8f0;">EPF Contribution</td>
              <td style="text-align: right; padding: 8px 14px; font-weight: 700;">₹1,800.00</td>
            </tr>
            <tr>
              <td style="padding: 8px 14px;">House Rent Allowance</td>
              <td style="text-align: right; padding: 8px 14px; font-weight: 700;">₹5,500.00</td>
              <td style="padding: 8px 14px; border-left: 1px solid #e2e8f0;">Professional Tax</td>
              <td style="text-align: right; padding: 8px 14px; font-weight: 700;">₹200.00</td>
            </tr>
            <tr>
              <td style="padding: 8px 14px;">LTA</td>
              <td style="text-align: right; padding: 8px 14px; font-weight: 700;">₹1,100.00</td>
              <td style="padding: 8px 14px; border-left: 1px solid #e2e8f0;"></td>
              <td style="text-align: right; padding: 8px 14px;"></td>
            </tr>
            <tr>
              <td style="padding: 8px 14px;">Fixed Allowance</td>
              <td style="text-align: right; padding: 8px 14px; font-weight: 700;">₹4,400.00</td>
              <td style="padding: 8px 14px; border-left: 1px solid #e2e8f0;"></td>
              <td style="text-align: right; padding: 8px 14px;"></td>
            </tr>
            <tr style="border-top: 1px solid #000000; font-weight: 800; font-size: 11.5px;">
              <td style="padding: 10px 14px;">Gross Earnings</td>
              <td style="text-align: right; padding: 10px 14px;">${grossSalary}</td>
              <td style="padding: 10px 14px; border-left: 1px solid #e2e8f0;">Total Deductions</td>
              <td style="text-align: right; padding: 10px 14px;">${deductions}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total Net Payable Shaded Bar -->
      <div style="border: 1.5px solid #000000; border-radius: 10px; overflow: hidden; margin-bottom: 15px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 14px; background: #ffffff;">
              <div style="font-size: 12px; font-weight: 800; color: #000000;">TOTAL NET PAYABLE</div>
              <div style="font-size: 10px; color: #475569;">Gross Earnings - Total Deductions</div>
            </td>
            <td style="width: 180px; padding: 10px 14px; background: #e0f2fe; text-align: right; font-size: 15px; font-weight: 800; color: #000000; border-left: 1.5px solid #000000;">
              ${netSalary}
            </td>
          </tr>
        </table>
      </div>

      <!-- Amount In Words -->
      <div style="text-align: center; font-size: 11px; color: #000000; margin-bottom: 25px;">
        Amount In Words : <strong>Rupees Twenty Thousand Only</strong>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1.5px solid #000000; width: 100%; margin-bottom: 12px;"></div>
      <div style="text-align: center; font-size: 10px; color: #475569;">
        -- This is a system generated document. --
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Payslip_${monthStr.replace(/\s+/g, "_")}.pdf`);
  } catch (err) {
    console.error("Failed to generate PDF", err);
  } finally {
    document.body.removeChild(container);
  }
};

/**
 * Download any report table as PDF with standard company header
 */
export const downloadReportPdf = async (
  title = "Report",
  period = "",
  headers = [],
  rows = [],
  filename = "Report.pdf"
) => {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "794px";
  container.style.background = "#ffffff";
  container.style.padding = "30px";
  container.style.boxSizing = "border-box";
  container.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";

  const headerHtml = getCompanyPdfHeaderHtml({
    documentTitle: title,
    period: period || "Generated Report"
  });

  const tableHeaderHtml = headers
    .map(
      (h) =>
        `<th style="border: 1px solid #cbd5e1; padding: 8px 10px; background: #f8fafc; font-size: 11px; text-align: left; font-weight: 700;">${h}</th>`
    )
    .join("");

  const tableRowsHtml = rows
    .map(
      (r) =>
        `<tr>${r
          .map(
            (c) =>
              `<td style="border: 1px solid #e2e8f0; padding: 7px 10px; font-size: 10px; color: #334155;">${c}</td>`
          )
          .join("")}</tr>`
    )
    .join("");

  container.innerHTML = `
    ${headerHtml}
    <div style="margin-top: 15px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead><tr>${tableHeaderHtml}</tr></thead>
        <tbody>${tableRowsHtml}</tbody>
      </table>
      <div style="margin-top: 20px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px;">
        -- Confidential • Generated from BELNOVA HRMS Platform --
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (err) {
    console.error("Failed to export report PDF", err);
  } finally {
    document.body.removeChild(container);
  }
};
