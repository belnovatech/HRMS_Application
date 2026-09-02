import React from "react";
import "./CompanyPdfHeader.css";
import { COMPANY_DETAILS } from "../../constants/companyDetails";

export default function CompanyPdfHeader({
  documentTitle = "Document Title",
  documentSubtitle = "",
  period = ""
}) {
  return (
    <div className="belnova-pdf-header-wrapper">
      <div className="belnova-pdf-header-container">
        {/* Left Column: Company Logo */}
        <div className="belnova-pdf-header-left">
          <img
            src={COMPANY_DETAILS.logoUrl}
            alt={COMPANY_DETAILS.name}
            className="belnova-pdf-logo"
          />
        </div>

        {/* Center Column: Company Information */}
        <div className="belnova-pdf-header-center">
          <h1 className="belnova-pdf-company-name">{COMPANY_DETAILS.name}</h1>
          <p className="belnova-pdf-company-address">{COMPANY_DETAILS.addressLine1}</p>
          <p className="belnova-pdf-company-address">{COMPANY_DETAILS.addressLine2}</p>
        </div>

        {/* Right Column: Document Information */}
        <div className="belnova-pdf-header-right">
          <h2 className="belnova-pdf-doc-title">{documentTitle}</h2>
          {period && <p className="belnova-pdf-doc-period">{period}</p>}
          {documentSubtitle && !period && (
            <p className="belnova-pdf-doc-subtitle">{documentSubtitle}</p>
          )}
        </div>
      </div>

      {/* Horizontal Divider Line */}
      <hr className="belnova-pdf-header-divider" />
    </div>
  );
}
