import React, { useMemo, useState } from "react";
import "./HelpSupport.css";
import HRLayout from "../../../layouts/HRLayout";
import {
  FiBookOpen,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiHelpCircle,
  FiLifeBuoy,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiPlus,
  FiSearch,
  FiSend,
  FiShield,
  FiTool,
  FiUserPlus,
  FiX,
} from "react-icons/fi";

const BEL_HR_HELP_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Core HRMS administration and employee setup.",
    icon: FiBookOpen,
    count: 8,
  },
  {
    id: "employees",
    title: "Employee Management",
    description: "Employee records, onboarding and lifecycle actions.",
    icon: FiUserPlus,
    count: 12,
  },
  {
    id: "attendance",
    title: "Attendance & Biometric",
    description: "Devices, attendance rules, shifts and regularization.",
    icon: FiClock,
    count: 10,
  },
  {
    id: "leave",
    title: "Leave & Approvals",
    description: "Leave policies, balances and approval workflows.",
    icon: FiFileText,
    count: 9,
  },
  {
    id: "payroll",
    title: "Payroll & Payslips",
    description: "Payroll processing, deductions and payslip issues.",
    icon: FiShield,
    count: 11,
  },
  {
    id: "security",
    title: "Security & Access",
    description: "Roles, permissions, MFA and account security.",
    icon: FiTool,
    count: 7,
  },
];

const BEL_HR_FAQS = [
  {
    id: 1,
    category: "employees",
    question: "How do I add a new employee?",
    answer:
      "Open Employees from the HR Admin sidebar, select Add Employee, complete the mandatory profile and employment fields, upload required documents, then save the employee record.",
  },
  {
    id: 2,
    category: "employees",
    question: "How can I update an employee's department or designation?",
    answer:
      "Open the employee profile, choose Edit Employment Details, update the department, designation or reporting manager, and save the change. The action should be recorded in the employee audit history.",
  },
  {
    id: 3,
    category: "attendance",
    question: "How do I sync biometric attendance?",
    answer:
      "Go to Biometric from the HR Admin sidebar. You can sync an individual device, run a full sync, review the last sync time and inspect device logs for failures.",
  },
  {
    id: 4,
    category: "attendance",
    question: "What should I do when a biometric device is offline?",
    answer:
      "Open Biometric, check the device status and last successful sync, verify the device network/IP configuration, then use Sync Now. If the device remains unavailable, raise a support ticket with the device ID and error details.",
  },
  {
    id: 5,
    category: "leave",
    question: "How do I approve or reject a leave request?",
    answer:
      "Open Leave Management or Pending Approvals, review the employee's leave dates and balance, then select Approve or Reject. A rejection should include a clear reason for the employee.",
  },
  {
    id: 6,
    category: "payroll",
    question: "How is monthly payroll processed?",
    answer:
      "Select the payroll month, verify attendance and salary inputs, review calculated gross and deductions, complete the approval workflow, process payroll and generate payslips for eligible employees.",
  },
  {
    id: 7,
    category: "payroll",
    question: "How can I download an employee payslip?",
    answer:
      "Open Payroll, select the required payroll period and employee, then choose View Payslip. From the payslip view, use Download PDF to save the employee-specific document.",
  },
  {
    id: 8,
    category: "security",
    question: "How do I change role permissions?",
    answer:
      "Open Roles & Permissions, select the required role, review module-level permissions, update the required access and save the changes. Permission changes should be limited to authorized HR administrators.",
  },
  {
    id: 9,
    category: "getting-started",
    question: "Where can I configure company settings?",
    answer:
      "Open Settings from the HR Admin sidebar. Company profile, branches, departments, designations, shifts, leave policies, payroll, notifications, security and audit settings are managed from there.",
  },
  {
    id: 10,
    category: "security",
    question: "Where can I review administrator activity?",
    answer:
      "Open Settings and select Audit Logs. You can review configuration changes, security events, the user who performed the action, timestamp and result.",
  },
];

const BEL_HR_ARTICLES = [
  {
    id: "article-employee",
    title: "HR Admin Employee Management Guide",
    description: "Create, update, deactivate and manage employee lifecycle records.",
    category: "Employee Management",
    time: "6 min read",
    icon: FiUserPlus,
  },
  {
    id: "article-payroll",
    title: "Monthly Payroll Processing Guide",
    description: "Understand payroll preparation, review, approval and payslip generation.",
    category: "Payroll",
    time: "8 min read",
    icon: FiShield,
  },
  {
    id: "article-biometric",
    title: "Biometric & Attendance Troubleshooting",
    description: "Resolve device sync, connection and attendance-log issues.",
    category: "Attendance",
    time: "5 min read",
    icon: FiTool,
  },
  {
    id: "article-security",
    title: "Roles, Permissions & Security",
    description: "Configure RBAC, administrator access and security controls safely.",
    category: "Security",
    time: "7 min read",
    icon: FiShield,
  },
];

function BelHelpStat({ value, label }) {
  return (
    <div className="bel-help-stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function BelHelpFaqItem({ item, isOpen, onToggle }) {
  return (
    <div className={`bel-help-faq-item ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="bel-help-faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{item.question}</span>
        <FiChevronDown aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="bel-help-faq-answer">
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpSupport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(1);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "Technical Issue",
    priority: "Medium",
    description: "",
  });

  const filteredFaqs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return BEL_HR_FAQS.filter((item) => {
      const categoryMatch =
        activeCategory === "all" || item.category === activeCategory;

      const searchMatch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchTerm]);

  const showToastMessage = (message) => {
    window.dispatchEvent(
      new CustomEvent("bel-help-support-toast", { detail: message })
    );
  };

  const handleTicketSubmit = (event) => {
    event.preventDefault();
    setTicketSubmitted(true);
    showToastMessage("Support ticket submitted successfully.");
  };

  const closeTicketModal = () => {
    setShowTicketModal(false);
    setTicketSubmitted(false);
    setTicketForm({
      subject: "",
      category: "Technical Issue",
      priority: "Medium",
      description: "",
    });
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    showToastMessage("Your message has been sent to the HRMS support desk.");
    setContactMessage("");
    setShowContactModal(false);
  };

  const scrollToFaq = () => {
    document
      .getElementById("bel-help-faq-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <HRLayout title="Help & Support" breadcrumb="HelpSupport">
      <div className="bel-help-page">
        <section className="bel-help-hero">
          <div className="bel-help-hero-copy">
            <div className="bel-help-eyebrow">
              <span className="bel-help-eyebrow-dot" />
              HR ADMIN SUPPORT CENTER
            </div>

            <h1>How can we help you?</h1>
            <p>
              Find HRMS guidance, troubleshoot system issues, or contact the
              support desk for assistance with your organization.
            </p>

            <div className="bel-help-search-box">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setActiveCategory("all");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") scrollToFaq();
                }}
                placeholder="Search employees, payroll, attendance, settings..."
                aria-label="Search help articles and frequently asked questions"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="bel-help-search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <FiX />
                </button>
              )}
              <button
                type="button"
                className="bel-help-search-button"
                onClick={scrollToFaq}
              >
                Search
              </button>
            </div>

            <div className="bel-help-popular-links">
              <span>Popular:</span>
              {[
                ["Payroll", "payroll"],
                ["Biometric", "attendance"],
                ["Leave", "leave"],
                ["Roles & Permissions", "security"],
              ].map(([label, category]) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setSearchTerm("");
                    setTimeout(scrollToFaq, 0);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="bel-help-hero-visual" aria-hidden="true">
            <div className="bel-help-orbit bel-help-orbit-one" />
            <div className="bel-help-orbit bel-help-orbit-two" />
            <div className="bel-help-hero-icon">
              <FiLifeBuoy />
            </div>
            <div className="bel-help-floating-card bel-help-floating-card-top">
              <FiCheck />
              <div>
                <strong>Support Online</strong>
                <span>HRMS assistance available</span>
              </div>
            </div>
            <div className="bel-help-floating-card bel-help-floating-card-bottom">
              <FiClock />
              <div>
                <strong>Response time</strong>
                <span>Usually within 4 business hours</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bel-help-stats-row" aria-label="Support center summary">
          <BelHelpStat value="54+" label="Knowledge articles" />
          <BelHelpStat value="24/7" label="Help center access" />
          <BelHelpStat value="< 4h" label="Typical support response" />
          <BelHelpStat value="99.9%" label="HRMS platform availability" />
        </section>

        <section className="bel-help-content-section">
          <div className="bel-help-section-heading">
            <div>
              <span className="bel-help-section-kicker">KNOWLEDGE BASE</span>
              <h2>Browse by HRMS area</h2>
              <p>Quickly find guidance for the modules you manage every day.</p>
            </div>
          </div>

          <div className="bel-help-category-grid">
            {BEL_HR_HELP_CATEGORIES.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  type="button"
                  className={`bel-help-category-card ${
                    activeCategory === category.id ? "is-selected" : ""
                  }`}
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSearchTerm("");
                    setTimeout(scrollToFaq, 0);
                  }}
                >
                  <span className="bel-help-category-icon">
                    <Icon />
                  </span>
                  <span className="bel-help-category-copy">
                    <strong>{category.title}</strong>
                    <span>{category.description}</span>
                  </span>
                  <span className="bel-help-category-count">
                    {category.count}
                  </span>
                  <FiChevronRight className="bel-help-category-arrow" />
                </button>
              );
            })}
          </div>
        </section>

        <section
          id="bel-help-faq-section"
          className="bel-help-main-grid"
        >
          <div className="bel-help-faq-panel">
            <div className="bel-help-panel-heading">
              <div>
                <span className="bel-help-section-kicker">QUICK ANSWERS</span>
                <h2>Frequently asked questions</h2>
                <p>
                  Practical answers for common HR administrator workflows.
                </p>
              </div>
              <span className="bel-help-result-count">
                {filteredFaqs.length} results
              </span>
            </div>

            <div className="bel-help-filter-row">
              <button
                type="button"
                className={activeCategory === "all" ? "is-active" : ""}
                onClick={() => setActiveCategory("all")}
              >
                All topics
              </button>

              {BEL_HR_HELP_CATEGORIES.slice(0, 5).map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={
                    activeCategory === category.id ? "is-active" : ""
                  }
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.title}
                </button>
              ))}
            </div>

            <div className="bel-help-faq-list">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((item) => (
                  <BelHelpFaqItem
                    key={item.id}
                    item={item}
                    isOpen={openFaq === item.id}
                    onToggle={() =>
                      setOpenFaq((current) =>
                        current === item.id ? null : item.id
                      )
                    }
                  />
                ))
              ) : (
                <div className="bel-help-empty-state">
                  <FiSearch />
                  <h3>No matching help articles</h3>
                  <p>
                    Try a different keyword or browse one of the HRMS areas
                    above.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("all");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="bel-help-side-column">
            <div className="bel-help-support-card">
              <div className="bel-help-support-card-icon">
                <FiMessageSquare />
              </div>
              <span className="bel-help-section-kicker">NEED MORE HELP?</span>
              <h2>Contact the HRMS support desk</h2>
              <p>
                Raise a support request for technical issues, configuration
                problems, access issues or unexpected system behavior.
              </p>

              <button
                type="button"
                className="bel-help-primary-action"
                onClick={() => setShowTicketModal(true)}
              >
                <FiSend />
                Raise a Support Ticket
              </button>

              <button
                type="button"
                className="bel-help-secondary-action"
                onClick={() => setShowContactModal(true)}
              >
                <FiMail />
                Email Support
              </button>

              <div className="bel-help-contact-details">
                <div>
                  <FiMail />
                  <span>
                    <strong>Support Email</strong>
                    support@belnova.com
                  </span>
                </div>
                <div>
                  <FiPhone />
                  <span>
                    <strong>Support Hotline</strong>
                    1800-123-4567
                  </span>
                </div>
                <div>
                  <FiClock />
                  <span>
                    <strong>Support Hours</strong>
                    Mon - Fri · 9:00 AM - 6:00 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="bel-help-status-card">
              <div className="bel-help-status-head">
                <span className="bel-help-status-indicator" />
                <strong>All HRMS systems operational</strong>
              </div>
              <p>
                No active platform incidents are currently reported.
              </p>
              <button
                type="button"
                onClick={() => showToastMessage("System status is operational.")}
              >
                View system status <FiChevronRight />
              </button>
            </div>
          </aside>
        </section>

        <section className="bel-help-articles-section">
          <div className="bel-help-section-heading">
            <div>
              <span className="bel-help-section-kicker">ADMIN GUIDES</span>
              <h2>Recommended resources</h2>
              <p>Step-by-step guides for important HR administrator tasks.</p>
            </div>
            <button
              type="button"
              className="bel-help-view-all"
              onClick={() => {
                setActiveCategory("all");
                setSearchTerm("");
                scrollToFaq();
              }}
            >
              View all FAQs <FiChevronRight />
            </button>
          </div>

          <div className="bel-help-article-grid">
            {BEL_HR_ARTICLES.map((article) => {
              const Icon = article.icon;

              return (
                <button
                  type="button"
                  className="bel-help-article-card"
                  key={article.id}
                  onClick={() =>
                    showToastMessage(`${article.title} opened.`)
                  }
                >
                  <span className="bel-help-article-icon">
                    <Icon />
                  </span>
                  <span className="bel-help-article-content">
                    <span className="bel-help-article-category">
                      {article.category}
                    </span>
                    <strong>{article.title}</strong>
                    <span>{article.description}</span>
                  </span>
                  <span className="bel-help-article-footer">
                    {article.time}
                    <FiChevronRight />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bel-help-emergency-banner">
          <div className="bel-help-emergency-icon">
            <FiPhone />
          </div>
          <div>
            <span className="bel-help-section-kicker">URGENT BUSINESS ISSUE</span>
            <h2>Critical payroll, security or attendance outage?</h2>
            <p>
              For production-impacting issues, contact the support hotline and
              include your organization, module, affected users and error
              details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTicketModal(true)}
          >
            Contact Support <FiChevronRight />
          </button>
        </section>

        {showTicketModal && (
          <div
            className="bel-help-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeTicketModal();
            }}
          >
            <form className="bel-help-modal" onSubmit={handleTicketSubmit}>
              <div className="bel-help-modal-header">
                <div>
                  <span className="bel-help-modal-icon"><FiLifeBuoy /></span>
                  <div>
                    <h2>Raise a Support Ticket</h2>
                    <p>Provide enough detail for the support team to investigate quickly.</p>
                  </div>
                </div>
                <button type="button" onClick={closeTicketModal} aria-label="Close">
                  <FiX />
                </button>
              </div>

              {!ticketSubmitted ? (
                <>
                  <div className="bel-help-modal-form-grid">
                    <label>
                      <span>Issue Subject</span>
                      <input
                        required
                        value={ticketForm.subject}
                        onChange={(event) =>
                          setTicketForm((current) => ({
                            ...current,
                            subject: event.target.value,
                          }))
                        }
                        placeholder="e.g. Biometric device not syncing"
                      />
                    </label>

                    <label>
                      <span>Category</span>
                      <select
                        value={ticketForm.category}
                        onChange={(event) =>
                          setTicketForm((current) => ({
                            ...current,
                            category: event.target.value,
                          }))
                        }
                      >
                        <option>Technical Issue</option>
                        <option>Employee Management</option>
                        <option>Attendance & Biometric</option>
                        <option>Leave & Approvals</option>
                        <option>Payroll</option>
                        <option>Security & Access</option>
                        <option>Other</option>
                      </select>
                    </label>

                    <label>
                      <span>Priority</span>
                      <select
                        value={ticketForm.priority}
                        onChange={(event) =>
                          setTicketForm((current) => ({
                            ...current,
                            priority: event.target.value,
                          }))
                        }
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </label>

                    <label className="bel-help-modal-full-field">
                      <span>Issue Description</span>
                      <textarea
                        required
                        rows="5"
                        value={ticketForm.description}
                        onChange={(event) =>
                          setTicketForm((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Describe what happened, when it started, affected module/users and any error message."
                      />
                    </label>
                  </div>

                  <div className="bel-help-modal-note">
                    <FiShield />
                    Do not include passwords, authentication codes or other
                    sensitive credentials in a support ticket.
                  </div>

                  <div className="bel-help-modal-actions">
                    <button type="button" onClick={closeTicketModal}>
                      Cancel
                    </button>
                    <button type="submit" className="bel-help-primary-action">
                      <FiSend /> Submit Ticket
                    </button>
                  </div>
                </>
              ) : (
                <div className="bel-help-ticket-success">
                  <div className="bel-help-success-icon">✓</div>
                  <h3>Support request submitted</h3>
                  <p>
                    Your ticket has been recorded. The support team will review
                    it during the configured support window.
                  </p>
                  <button
                    type="button"
                    className="bel-help-primary-action"
                    onClick={closeTicketModal}
                  >
                    Done
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {showContactModal && (
          <div
            className="bel-help-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowContactModal(false);
            }}
          >
            <form
              className="bel-help-modal bel-help-contact-modal"
              onSubmit={handleContactSubmit}
            >
              <div className="bel-help-modal-header">
                <div>
                  <span className="bel-help-modal-icon"><FiMail /></span>
                  <div>
                    <h2>Email Support</h2>
                    <p>Send a message to the HRMS support desk.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>

              <div className="bel-help-direct-contact">
                <FiMail />
                <div>
                  <strong>support@belnova.com</strong>
                  <span>Mon - Fri · 9:00 AM - 6:00 PM</span>
                </div>
              </div>

              <label className="bel-help-message-field">
                <span>Message</span>
                <textarea
                  required
                  rows="6"
                  value={contactMessage}
                  onChange={(event) => setContactMessage(event.target.value)}
                  placeholder="Tell the support team how they can help..."
                />
              </label>

              <div className="bel-help-modal-actions">
                <button type="button" onClick={() => setShowContactModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="bel-help-primary-action">
                  <FiSend /> Send Message
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </HRLayout>
  );
}
