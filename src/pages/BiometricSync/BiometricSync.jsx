import "./BiometricSync.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import {
  FiSearch,
  FiMoon,
  FiBell,
  FiPlus,
  FiRefreshCw,
  FiSettings,
  FiTrash2,
  FiCpu,
  FiChevronRight,
} from "react-icons/fi";

export default function BiometricSync() {
  const devices = [
    {
      name: "Main Entrance",
      id: "DEV-001",
      location: "Mumbai HQ - Lobby",
      status: "Connected",
      sync: "2 min ago",
    },
    {
      name: "Floor 2 Entry",
      id: "DEV-002",
      location: "Mumbai HQ - 2F",
      status: "Connected",
      sync: "5 min ago",
    },
    {
      name: "Server Room",
      id: "DEV-003",
      location: "Mumbai HQ - Basement",
      status: "Syncing",
      sync: "Now",
    },
    {
      name: "Pune Branch",
      id: "DEV-004",
      location: "Pune Office",
      status: "Disconnected",
      sync: "2h ago",
    },
    {
      name: "Delhi Office",
      id: "DEV-005",
      location: "New Delhi",
      status: "Error",
      sync: "Failed",
    },
  ];

  return (
    <div className="bio-layout">
      <Sidebar />
    <div className="bio-main">
      <Header
        title="Biometric Sync"
        breadcrumb="Biometric"
      />
      <div className="bio-content">


        <div className="status-row">
          <div className="status-card green">
            <span></span>2 Connected
          </div>

          <div className="status-card blue">
            <span></span>1 Syncing
          </div>

          <div className="status-card orange">
            <span></span>1 Disconnected
          </div>

          <div className="status-card red">
            <span></span>1 Error
          </div>

          <button className="add-device">
            <FiPlus />
            Add Device
          </button>
        </div>

        <div className="device-card">
          <div className="device-header">
            <h3>Device Status</h3>

            <button className="sync-all">
              <FiRefreshCw />
              Sync All
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>DEVICE NAME</th>
                <th>DEVICE ID</th>
                <th>LOCATION</th>
                <th>STATUS</th>
                <th>LAST SYNC</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {devices.map((device, index) => (
                <tr key={index}>
                  <td>
                    <div className="device-name">
                      <div className="icon-box">
                        <FiCpu />
                      </div>

                      <span>{device.name}</span>
                    </div>
                  </td>

                  <td>{device.id}</td>

                  <td>{device.location}</td>

                  <td>
                    <span
                      className={`badge ${device.status.toLowerCase()}`}
                    >
                      {device.status}
                    </span>
                  </td>

                  <td>{device.sync}</td>

                  <td>
                    <div className="actions">
                      <FiRefreshCw />
                      <FiSettings />
                      <FiTrash2 />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}