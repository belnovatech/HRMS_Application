import React, { useMemo, useState, useEffect, useCallback } from "react";
import "./Recruitment.css";
import HRLayout from "../../../layouts/HRLayout";
import api from "../../../api/axiosInstance";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiChevronDown,
  FiEye,
  FiFilter,
  FiDownload,
  FiPlus,
  FiSearch,
  FiSend,
  FiX,
} from "react-icons/fi";

const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

const STAGE_CLASS = {
  Applied: "applied",
  Screening: "screening",
  Interview: "interview",
  Offer: "offer",
  Hired: "hired",
  Rejected: "rejected",
};

const AVATAR_COLORS = ["red", "lime", "green", "teal", "purple"];

function initials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function downloadCsv(filename, headers, rows) {
  const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function StatCard({ value, label }) {
  return (
    <div className={`bel-recruit-stat bel-recruit-stat--${STAGE_CLASS[label]}`}>
      <strong>{value}</strong>
      <span>
        <i />
        {label}
      </span>
    </div>
  );
}

function CandidateCard({ candidate, index, onAdvance, onReject, onView, onOffer }) {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <article className="bel-recruit-candidate-card">
      <div className="bel-recruit-candidate-main">
        <span className={`bel-recruit-avatar bel-recruit-avatar--${avatarColor}`}>
          {initials(candidate.name)}
        </span>
        <div className="bel-recruit-candidate-info">
          <strong>{candidate.name}</strong>
          <span>{candidate.role}</span>
        </div>
      </div>

      <div className="bel-recruit-candidate-meta">
        <span>Applied {candidate.applied}</span>
        <b>{candidate.experience}</b>
      </div>

      <div className="bel-recruit-candidate-actions">
        <button type="button" onClick={() => onView(candidate)}>
          <FiEye />
          View
        </button>

        {candidate.stage === "Offer" ? (
          <button
            type="button"
            className="bel-recruit-offer-button"
            onClick={() => onOffer(candidate)}
          >
            <FiSend />
            Send Offer
          </button>
        ) : candidate.stage !== "Rejected" && candidate.stage !== "Hired" ? (
          <>
            <button
              type="button"
              className="bel-recruit-advance-button"
              onClick={() => onAdvance(candidate.id)}
            >
              <FiArrowRight />
              Advance
            </button>
            <button
              type="button"
              className="bel-recruit-reject-button"
              onClick={() => onReject(candidate.id)}
            >
              <FiX />
              Reject
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}

export default function Recruitment() {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  const stageCounts = useMemo(() => {
    return {
      Applied: candidates.filter((c) => c.stage === "Applied").length,
      Screening: candidates.filter((c) => c.stage === "Screening").length,
      Interview: candidates.filter((c) => c.stage === "Interview").length,
      Offer: candidates.filter((c) => c.stage === "Offer").length,
      Hired: candidates.filter((c) => c.stage === "Hired").length,
      Rejected: candidates.filter((c) => c.stage === "Rejected").length,
    };
  }, [candidates]);
  const [stageFilter, setStageFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [modal, setModal] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState("");

  const fetchRecruitmentData = useCallback(async () => {
    try {
      const [candRes, jobRes] = await Promise.allSettled([
        api.get("/recruitment/candidates"),
        api.get("/recruitment/jobs")
      ]);

      if (candRes.status === "fulfilled" && Array.isArray(candRes.value.data) && candRes.value.data.length > 0) {
        setCandidates(candRes.value.data);
      }
      if (jobRes.status === "fulfilled" && Array.isArray(jobRes.value.data) && jobRes.value.data.length > 0) {
        setJobs(jobRes.value.data);
      }
    } catch (err) {
      console.warn("Recruitment fetch notice:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchRecruitmentData();
  }, [fetchRecruitmentData]);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesStage =
        stageFilter === "All" || candidate.stage === stageFilter;

      const matchesSearch =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.role.toLowerCase().includes(query) ||
        candidate.id.toLowerCase().includes(query);

      return matchesStage && matchesSearch;
    });
  }, [candidates, search, stageFilter]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesDepartment =
        departmentFilter === "All" || job.dept === departmentFilter;

      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.dept.toLowerCase().includes(query);

      return matchesDepartment && matchesSearch;
    });
  }, [jobs, search, departmentFilter]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const advanceCandidate = async (candidateId) => {
    const candidate = candidates.find((item) => item.id === candidateId);
    if (!candidate) return;

    const currentIndex = STAGES.indexOf(candidate.stage);
    const nextStage = STAGES[Math.min(currentIndex + 1, 4)];

    if (candidate.stage === nextStage) return;

    try {
      await api.post(`/recruitment/candidates/${candidateId}/stage`, { stage: nextStage });
    } catch (err) {
      console.warn("Stage update API notice:", err.message);
    }

    setCandidates((current) =>
      current.map((item) =>
        item.id === candidateId ? { ...item, stage: nextStage } : item
      )
    );

    showToast(`Candidate moved to ${nextStage}.`);
  };

  const rejectCandidate = async (candidateId) => {
    const candidate = candidates.find((item) => item.id === candidateId);
    if (!candidate || candidate.stage === "Rejected") return;

    try {
      await api.post(`/recruitment/candidates/${candidateId}/stage`, { stage: "Rejected" });
    } catch (err) {
      console.warn("Stage update API notice:", err.message);
    }

    setCandidates((current) =>
      current.map((item) =>
        item.id === candidateId ? { ...item, stage: "Rejected" } : item
      )
    );

    showToast("Candidate moved to Rejected.");
  };

  const sendOffer = async (candidateId) => {
    const candidate = candidates.find((item) => item.id === candidateId);
    if (!candidate) return;

    try {
      await api.post(`/recruitment/candidates/${candidateId}/stage`, { stage: "Offer" });
    } catch (err) {
      console.warn("Offer stage API notice:", err.message);
    }

    setCandidates((current) =>
      current.map((item) =>
        item.id === candidateId ? { ...item, stage: "Offer" } : item
      )
    );

    showToast("Offer released and candidate moved to Offer stage.");
  };

  const createJob = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const title = form.get("title");
    const dept = form.get("department");
    const openings = Number(form.get("openings")) || 1;

    const newJob = {
      id: `JOB-${101 + jobs.length}`,
      title,
      dept,
      openings,
      applicants: 0,
      status: "Active",
    };

    setJobs((current) => [newJob, ...current]);
    setModal(null);
    event.currentTarget.reset();
    showToast("Job posted successfully.");
  };

  const toggleJobStatus = (jobId) => {
    setJobs((current) =>
      current.map((job) =>
        job.id === jobId
          ? { ...job, status: job.status === "Active" ? "Closed" : "Active" }
          : job
      )
    );

    showToast("Job status updated.");
  };

  const viewCandidatesForJob = (job) => {
    setSelectedJob(job);
    setModal("jobCandidates");
  };

  const exportRecruitment = () => {
    if (activeTab === "pipeline") {
      downloadCsv(
        "recruitment-candidate-pipeline.csv",
        ["Candidate ID", "Candidate", "Role", "Stage", "Applied", "Experience"],
        filteredCandidates.map((candidate) => [
          candidate.id,
          candidate.name,
          candidate.role,
          candidate.stage,
          candidate.applied,
          candidate.experience,
        ])
      );
    } else {
      downloadCsv(
        "recruitment-open-positions.csv",
        ["Job ID", "Position", "Department", "Openings", "Applicants", "Status"],
        filteredJobs.map((job) => [
          job.id,
          job.title,
          job.dept,
          job.openings,
          job.applicants,
          job.status,
        ])
      );
    }

    showToast("Recruitment data exported.");
  };

  const clearFilters = () => {
    setStageFilter("All");
    setDepartmentFilter("All");
    setSearch("");
  };

  return (
    <HRLayout title="Recruitment" breadcrumb="Recruitment">
      <div className="bel-recruit-page">
        <header className="bel-recruit-header">
          <div>
            <h1>Recruitment</h1>
            <p>Manage job postings, candidates and hiring pipeline</p>
          </div>

          <button
            type="button"
            className="bel-recruit-post-button"
            onClick={() => setModal("postJob")}
          >
            <FiPlus />
            Post Job
          </button>
        </header>

        <section className="bel-recruit-stats">
          <StatCard value={stageCounts.Applied} label="Applied" />
          <StatCard value={stageCounts.Screening} label="Screening" />
          <StatCard value={stageCounts.Interview} label="Interview" />
          <StatCard value={stageCounts.Offer} label="Offer" />
          <StatCard value={stageCounts.Hired} label="Hired" />
          <StatCard value={stageCounts.Rejected} label="Rejected" />
        </section>

        <div className="bel-recruit-toolbar">
          <nav className="bel-recruit-tabs">
            <button
              type="button"
              className={activeTab === "pipeline" ? "is-active" : ""}
              onClick={() => setActiveTab("pipeline")}
            >
              Candidate Pipeline
            </button>
            <button
              type="button"
              className={activeTab === "jobs" ? "is-active" : ""}
              onClick={() => setActiveTab("jobs")}
            >
              Open Positions
            </button>
          </nav>

          <div className="bel-recruit-controls">
            <div className="bel-recruit-search">
              <FiSearch />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  activeTab === "pipeline"
                    ? "Search candidates..."
                    : "Search positions..."
                }
              />
            </div>

            <div className="bel-recruit-filter-wrap">
              <button
                type="button"
                className="bel-recruit-filter-button"
                onClick={() => setShowFilters((value) => !value)}
              >
                <FiFilter />
                Filters
                <FiChevronDown className={showFilters ? "rotate" : ""} />
              </button>

              {showFilters && (
                <div className="bel-recruit-filter-menu">
                  {activeTab === "pipeline" ? (
                    <>
                      <label>
                        Stage
                        <select
                          value={stageFilter}
                          onChange={(event) => setStageFilter(event.target.value)}
                        >
                          <option>All</option>
                          {STAGES.map((stage) => (
                            <option key={stage}>{stage}</option>
                          ))}
                        </select>
                      </label>
                    </>
                  ) : (
                    <label>
                      Department
                      <select
                        value={departmentFilter}
                        onChange={(event) =>
                          setDepartmentFilter(event.target.value)
                        }
                      >
                        <option>All</option>
                        <option>Engineering</option>
                        <option>Product</option>
                        <option>Human Resources</option>
                        <option>Marketing</option>
                      </select>
                    </label>
                  )}

                  <button
                    type="button"
                    className="bel-recruit-clear-filter"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {activeTab === "pipeline" ? (
          <section className="bel-recruit-pipeline">
            {STAGES.slice(0, 4).map((stage) => {
              const stageCandidates = filteredCandidates.filter(
                (candidate) => candidate.stage === stage
              );

              return (
                <div
                  className={`bel-recruit-stage bel-recruit-stage--${STAGE_CLASS[stage]}`}
                  key={stage}
                >
                  <div className="bel-recruit-stage-heading">
                    <div>
                      <i />
                      <strong>{stage}</strong>
                    </div>
                    <span>{stageCandidates.length}</span>
                  </div>

                  <div className="bel-recruit-stage-list">
                    {stageCandidates.length > 0 ? (
                      stageCandidates.map((candidate, index) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          index={index}
                          onAdvance={advanceCandidate}
                          onReject={rejectCandidate}
                          onView={(value) => {
                            setSelectedCandidate(value);
                            setModal("candidate");
                          }}
                          onOffer={(value) => {
                            setSelectedCandidate(value);
                            setModal("offer");
                          }}
                        />
                      ))
                    ) : (
                      <div className="bel-recruit-empty">
                        No candidates in {stage}.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          <section className="bel-recruit-jobs-card">
            <div className="bel-recruit-jobs-header">
              <div>
                <h2>Open Positions</h2>
                <p>Manage active vacancies and review applicants.</p>
              </div>
              <span>{filteredJobs.length} positions</span>
            </div>

            <div className="bel-recruit-jobs-scroll">
              <table className="bel-recruit-jobs-table">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Openings</th>
                    <th>Applicants</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-secondary)" }}>
                        No open job positions found.
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div className="bel-recruit-job-name">
                          <span>
                            <FiBriefcase />
                          </span>
                          <strong>{job.title}</strong>
                        </div>
                      </td>
                      <td>{job.dept}</td>
                      <td className="bel-recruit-number">{job.openings}</td>
                      <td>{job.applicants}</td>
                      <td>
                        <span
                          className={`bel-recruit-job-status ${
                            job.status === "Active" ? "active" : "closed"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td>
                        <div className="bel-recruit-job-actions">
                          <button
                            type="button"
                            onClick={() => viewCandidatesForJob(job)}
                          >
                            View Candidates <FiArrowRight />
                          </button>
                          <button
                            type="button"
                            className="bel-recruit-job-toggle"
                            onClick={() => toggleJobStatus(job.id)}
                          >
                            {job.status === "Active" ? "Close" : "Reopen"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))) }
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="bel-recruit-export-row">
          <button type="button" onClick={exportRecruitment}>
            <FiDownload />
            Export {activeTab === "pipeline" ? "Candidates" : "Positions"}
          </button>
        </div>

        {modal === "postJob" && (
          <div className="bel-recruit-modal-backdrop">
            <form className="bel-recruit-modal" onSubmit={createJob}>
              <div className="bel-recruit-modal-header">
                <div>
                  <h2>Post New Job</h2>
                  <p>Create a new vacancy for the hiring pipeline.</p>
                </div>
                <button type="button" onClick={() => setModal(null)}>
                  <FiX />
                </button>
              </div>

              <div className="bel-recruit-form-grid">
                <label>
                  Job Title
                  <input name="title" required placeholder="e.g. Senior React Developer" />
                </label>
                <label>
                  Department
                  <select name="department" defaultValue="Engineering" required>
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Human Resources</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                    <option>Operations</option>
                  </select>
                </label>
                <label>
                  Openings
                  <input name="openings" type="number" min="1" defaultValue="1" required />
                </label>
              </div>

              <div className="bel-recruit-modal-footer">
                <button
                  type="button"
                  className="bel-recruit-modal-cancel"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="bel-recruit-modal-primary">
                  <FiPlus />
                  Post Job
                </button>
              </div>
            </form>
          </div>
        )}

        {modal === "candidate" && selectedCandidate && (
          <div className="bel-recruit-modal-backdrop">
            <div className="bel-recruit-modal bel-recruit-candidate-modal">
              <div className="bel-recruit-modal-header">
                <div>
                  <h2>Candidate Details</h2>
                  <p>{selectedCandidate.id}</p>
                </div>
                <button type="button" onClick={() => setModal(null)}>
                  <FiX />
                </button>
              </div>

              <div className="bel-recruit-detail-profile">
                <span className="bel-recruit-detail-avatar">
                  {initials(selectedCandidate.name)}
                </span>
                <div>
                  <strong>{selectedCandidate.name}</strong>
                  <span>{selectedCandidate.role}</span>
                </div>
                <b className={`bel-recruit-detail-stage bel-recruit-detail-stage--${STAGE_CLASS[selectedCandidate.stage]}`}>
                  {selectedCandidate.stage}
                </b>
              </div>

              <div className="bel-recruit-detail-grid">
                <div>
                  <span>Experience</span>
                  <strong>{selectedCandidate.experience}</strong>
                </div>
                <div>
                  <span>Applied</span>
                  <strong>{selectedCandidate.applied}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{selectedCandidate.email}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{selectedCandidate.phone}</strong>
                </div>
              </div>

              <div className="bel-recruit-modal-footer">
                <button
                  type="button"
                  className="bel-recruit-modal-cancel"
                  onClick={() => setModal(null)}
                >
                  Close
                </button>
                {selectedCandidate.stage !== "Rejected" &&
                  selectedCandidate.stage !== "Hired" &&
                  selectedCandidate.stage !== "Offer" && (
                    <button
                      type="button"
                      className="bel-recruit-modal-primary"
                      onClick={() => {
                        advanceCandidate(selectedCandidate.id);
                        setModal(null);
                      }}
                    >
                      <FiArrowRight />
                      Advance Candidate
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}

        {modal === "offer" && selectedCandidate && (
          <div className="bel-recruit-modal-backdrop">
            <div className="bel-recruit-modal">
              <div className="bel-recruit-modal-header">
                <div>
                  <h2>Send Offer</h2>
                  <p>Send an offer to {selectedCandidate.name}.</p>
                </div>
                <button type="button" onClick={() => setModal(null)}>
                  <FiX />
                </button>
              </div>

              <div className="bel-recruit-offer-summary">
                <FiSend />
                <div>
                  <strong>{selectedCandidate.name}</strong>
                  <span>{selectedCandidate.role}</span>
                </div>
              </div>

              <div className="bel-recruit-form-grid">
                <label>
                  Annual CTC
                  <input defaultValue="₹12,00,000" />
                </label>
                <label>
                  Joining Date
                  <input type="date" />
                </label>
              </div>

              <div className="bel-recruit-modal-footer">
                <button
                  type="button"
                  className="bel-recruit-modal-cancel"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bel-recruit-modal-primary"
                  onClick={() => sendOffer(selectedCandidate.id)}
                >
                  <FiSend />
                  Send Offer
                </button>
              </div>
            </div>
          </div>
        )}

        {modal === "jobCandidates" && selectedJob && (
          <div className="bel-recruit-modal-backdrop">
            <div className="bel-recruit-modal">
              <div className="bel-recruit-modal-header">
                <div>
                  <h2>{selectedJob.title}</h2>
                  <p>{selectedJob.dept} · {selectedJob.applicants} applicants</p>
                </div>
                <button type="button" onClick={() => setModal(null)}>
                  <FiX />
                </button>
              </div>

              <div className="bel-recruit-applicant-list">
                {candidates.slice(0, Math.min(5, selectedJob.applicants || 5)).map(
                  (candidate, index) => (
                    <button
                      type="button"
                      key={candidate.id}
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setModal("candidate");
                      }}
                    >
                      <span className={`bel-recruit-avatar bel-recruit-avatar--${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
                        {initials(candidate.name)}
                      </span>
                      <span>
                        <strong>{candidate.name}</strong>
                        <small>{candidate.role}</small>
                      </span>
                      <FiArrowRight />
                    </button>
                  )
                )}
              </div>

              <div className="bel-recruit-modal-footer">
                <button
                  type="button"
                  className="bel-recruit-modal-cancel"
                  onClick={() => setModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="bel-recruit-toast">
            <FiCheck />
            {toast}
          </div>
        )}
      </div>
    </HRLayout>
  );
}
