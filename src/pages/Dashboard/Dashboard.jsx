import "./Dashboard.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import {
  FiUsers,
  FiCheckCircle,
  FiX,
  FiCalendar,
  FiAlertCircle,
  FiDollarSign,
} from "react-icons/fi";

import PayrollChart from "../../components/Charts/PayrollChart/PayrollChart";
import LeaveChart from "../../components/Charts/LeaveTrend/LeaveChart";
import AttendanceChart from "../../components/Charts/AttendanceChart/Attendancechart";
import DepartmentChart from "../../components/Charts/DepartmentChart/DepartmentChart";

const stats = [
  {
    title: "TOTAL EMPLOYEES",
    value: "115",
    change: "+3 this month",
    icon: <FiUsers />,
    bg: "#eaf2ff",
    color: "#2563eb",
  },
  {
    title: "PRESENT TODAY",
    value: "98",
    change: "+5%",
    icon: <FiCheckCircle />,
    bg: "#eaf8ed",
    color: "#22c55e",
  },
  {
    title: "ABSENT",
    value: "7",
    change: "-2",
    icon: <FiX />,
    bg: "#fdecec",
    color: "#ef4444",
  },
  {
    title: "ON LEAVE",
    value: "10",
    change: "6 casual, 4 sick",
    icon: <FiCalendar />,
    bg: "#fff6e6",
    color: "#f59e0b",
  },
  {
    title: "PENDING APPROVALS",
    value: "14",
    change: "+4",
    icon: <FiAlertCircle />,
    bg: "#f3efff",
    color: "#8b5cf6",
  },
  {
    title: "MONTHLY PAYROLL",
    value: "₹31.2L",
    change: "+8.2%",
    icon: <FiDollarSign />,
    bg: "#eaf2ff",
    color: "#2563eb",
  },
];

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Header />

        {/* STATS */}
        <div className="stats-grid">
          {stats.map((item, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-info">
                <span>{item.title}</span>

                <h2>{item.value}</h2>

                <p>{item.change}</p>
              </div>

              <div
                className="stat-icon"
                style={{
                  background: item.bg,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Attendance + Department */}
        <div className="chart-row">
          <div className="chart-card large">
            <h3>Attendance Trend</h3>

            <AttendanceChart />
          </div>

          <div className="chart-card">
            <h3>Dept. Distribution</h3>

            <DepartmentChart />
          </div>
        </div>

        {/* Payroll + Leave */}
        <div className="chart-row">
          <div className="chart-card">
            <h3>Payroll Expenses (₹ Lakhs)</h3>

            <PayrollChart />
          </div>

          <div className="chart-card">
            <h3>Leave Trends</h3>

            <LeaveChart />
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="bottom-row">

          {/* Quick Actions */}
          <div className="widget">
            <h3>Quick Actions</h3>

            <div className="quick-grid">
              <div className="quick-card">
                <FiUsers />
                <span>Add Employee</span>
              </div>

              <div className="quick-card">
                <FiDollarSign />
                <span>Run Payroll</span>
              </div>

              <div className="quick-card">
                <FiCalendar />
                <span>Approve Leave</span>
              </div>

              <div className="quick-card">
                <FiAlertCircle />
                <span>Sync Biometric</span>
              </div>
            </div>
          </div>

          {/* Celebrations */}
          <div className="widget">
            <h3>Today's Celebrations 🎉</h3>

            <div className="celebration-item">
              <div className="cele-avatar green">
                AM
              </div>

              <div>
                <h4>Arjun Mehta</h4>
                <p>Birthday 🎂</p>
              </div>
            </div>

            <div className="celebration-item">
              <div className="cele-avatar cyan">
                KN
              </div>

              <div>
                <h4>Kavya Nair</h4>
                <p>Work Anniversary 🏆 3 years</p>
              </div>
            </div>

            <div className="holiday-section">
              <h4>Upcoming Holidays</h4>

              <div className="holiday-item">
                <span>Jul 17</span>
                <span>Muharram</span>
              </div>

              <div className="holiday-item">
                <span>Jul 29</span>
                <span>Bakrid</span>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="widget">
            <h3>Recent Activity</h3>

            <div className="activity-item">
              <strong>Employee added</strong>
              <p>Vikram Singh joined Engineering</p>
              <span>2h ago</span>
            </div>

            <div className="activity-item">
              <strong>Leave approved</strong>
              <p>Rahul Verma's earned leave approved</p>
              <span>4h ago</span>
            </div>

            <div className="activity-item">
              <strong>Payroll ran</strong>
              <p>May payroll processed ₹31.2L</p>
              <span>1d ago</span>
            </div>

            <div className="activity-item">
              <strong>Attendance corrected</strong>
              <p>Anita Roy correction for Jun 15</p>
              <span>2d ago</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}