import "./Recruitment.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import Header from "../../components/Header/Header";
import {
  FiPlus,
  FiEdit2,
  FiBriefcase,
  FiX,
} from "react-icons/fi";

export default function Recruitment() {
  const [showModal, setShowModal] = useState(false);

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      posted: "Posted Jun 10",
      applicants: 24,
      status: "Active",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      posted: "Posted Jun 05",
      applicants: 18,
      status: "Active",
    },
    {
      id: 3,
      title: "Data Scientist",
      department: "Analytics",
      posted: "Posted May 28",
      applicants: 31,
      status: "Active",
    },
  ]);

  const pipeline = {
    Applied: [
      {
        initials: "AG",
        name: "Aarti Gupta",
        role: "DevOps Engineer",
        exp: "5 yrs",
        color: "#52c41a",
      },
      {
        initials: "NM",
        name: "Nisha Malhotra",
        role: "HR Executive",
        exp: "2 yrs",
        color: "#7265f6",
      },
    ],

    Screening: [
      {
        initials: "SJ",
        name: "Saurabh Jain",
        role: "Data Scientist",
        exp: "3 yrs",
        color: "#6d3bd2",
      },
    ],

    Interview: [
      {
        initials: "RK",
        name: "Rishi Kapoor",
        role: "Frontend Dev",
        exp: "4 yrs",
        color: "#24bfc4",
      },
    ],

    Offer: [
      {
        initials: "MI",
        name: "Meera Iyer",
        role: "Product Manager",
        exp: "6 yrs",
        color: "#2f80ed",
      },
    ],

    Hired: [
      {
        initials: "PR",
        name: "Prakash Rao",
        role: "Backend Dev",
        exp: "7 yrs",
        color: "#f5a623",
      },
    ],
  };

  const getBadgeClass = (stage) => {
    switch (stage) {
      case "Applied":
        return "badge applied";

      case "Screening":
        return "badge screening";

      case "Interview":
        return "badge interview";

      case "Offer":
        return "badge offer";

      case "Hired":
        return "badge hired";

      default:
        return "badge";
    }
  };

  return (
<>
  <Sidebar />

  <div className="recruitment-main">
    <Header
      title="Recruitment"
      breadcrumb="Recruitment"
    />

    <div className="recruitment-container">



        <div className="pipeline-header">
          <h2 className="pipeline-title">
            Candidate Pipeline
          </h2>

          <button
            className="post-job-btn"
            onClick={() => setShowModal(true)}
          >
            <FiPlus />
            Post Job
          </button>
        </div>

        <div className="pipeline-grid">
          {Object.entries(pipeline).map(
            ([stage, candidates]) => (
              <div
                className="pipeline-column"
                key={stage}
              >
                <div className="column-header">
                  <span>{stage.toUpperCase()}</span>

                  <span className="column-count">
                    {candidates.length}
                  </span>
                </div>

                {candidates.map((candidate) => (
                  <div
                    key={candidate.name}
                    className="candidate-card"
                  >
                    <div className="candidate-top">
                      <div
                        className="candidate-avatar"
                        style={{
                          background:
                            candidate.color,
                        }}
                      >
                        {candidate.initials}
                      </div>

                      <div>
                        <h4 className="candidate-name">
                          {candidate.name}
                        </h4>

                        <p className="candidate-role">
                          {candidate.role}
                        </p>
                      </div>
                    </div>

                    <div className="candidate-bottom">
                      <span className="candidate-exp">
                        {candidate.exp}
                      </span>

                      <span
                        className={getBadgeClass(
                          stage
                        )}
                      >
                        {stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        <div className="jobs-card">

          <div className="jobs-header">
            Active Job Posts
          </div>

          {jobs.map((job) => (
            <div
              className="job-row"
              key={job.id}
            >
              <div className="job-left">

                <div className="job-icon">
                  <FiBriefcase />
                </div>

                <div>
                  <h4 className="job-title">
                    {job.title}
                  </h4>

                  <p className="job-subtitle">
                    {job.department} • {job.posted}
                  </p>
                </div>

              </div>

              <div className="job-right">

                <div className="applicant-box">
                  <h3>{job.applicants}</h3>
                  <span>applicants</span>
                </div>

                <span className="active-tag">
                  {job.status}
                </span>

                <button className="view-btn">
                  View
                </button>

                <button className="edit-btn">
                  <FiEdit2 />
                </button>

              </div>
            </div>
          ))}
        </div>
                {showModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div
              className="job-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="modal-header">
                <h3>Post New Job</h3>

                <button
                  className="close-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  <FiX />
                </button>
              </div>

              <div className="form-group">
                <label>Job Title</label>

                <input
                  type="text"
                  placeholder="Enter job title"
                />
              </div>

              <div className="form-group">
                <label>Department</label>

                <input
                  type="text"
                  placeholder="Enter department"
                />
              </div>

              <div className="form-group">
                <label>Location</label>

                <input
                  type="text"
                  placeholder="Enter location"
                />
              </div>

              <div className="form-group">
                <label>Experience</label>

                <input
                  type="text"
                  placeholder="Required experience"
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  rows="5"
                  placeholder="Job description"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="submit-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Post Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}