import React, { useMemo, useState } from "react";
import "./Biometric.css";
import HRLayout from "../../../layouts/HRLayout";
import {
  FiActivity,
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiDownload,
  FiEdit3,
  FiEye,
  FiFileText,
  FiGlobe,
  FiLock,
  FiMonitor,
  FiMoreVertical,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSettings,
  FiShield,
  FiTrash2,
  FiUserCheck,
  FiUsers,
  FiWifi,
  FiWifiOff,
  FiX,
  FiZap,
} from "react-icons/fi";

import { MdFingerprint } from "react-icons/md";

const INITIAL_DEVICES = [
  {
    id: "BIO-001",
    name: "Main Entrance",
    location: "Mumbai HQ",
    zone: "Ground Floor",
    ip: "192.168.1.101",
    port: "4370",
    model: "ZKTeco SpeedFace-V5L",
    vendor: "ZKTeco",
    status: "Connected",
    mode: "Face + Fingerprint",
    lastSync: "2 min ago",
    lastHeartbeat: "12 sec ago",
    records: 1086,
    pending: 0,
    todayScans: 284,
    firmware: "6.3.1",
    attendanceMode: "IN / OUT",
    sync: "Automatic",
  },
  {
    id: "BIO-002",
    name: "Second Floor Gate",
    location: "Mumbai HQ",
    zone: "2nd Floor",
    ip: "192.168.1.102",
    port: "4370",
    model: "ZKTeco uFace 302",
    vendor: "ZKTeco",
    status: "Connected",
    mode: "Face + Fingerprint",
    lastSync: "5 min ago",
    lastHeartbeat: "18 sec ago",
    records: 420,
    pending: 0,
    todayScans: 196,
    firmware: "6.2.8",
    attendanceMode: "IN / OUT",
    sync: "Automatic",
  },
  {
    id: "BIO-003",
    name: "Cafeteria Entry",
    location: "Mumbai HQ",
    zone: "Basement",
    ip: "192.168.1.103",
    port: "4370",
    model: "Suprema FaceLite",
    vendor: "Suprema",
    status: "Syncing",
    mode: "Face Recognition",
    lastSync: "Syncing...",
    lastHeartbeat: "8 sec ago",
    records: 312,
    pending: 23,
    todayScans: 151,
    firmware: "2.7.4",
    attendanceMode: "IN / OUT",
    sync: "Automatic",
  },
  {
    id: "BIO-004",
    name: "Bangalore Office",
    location: "Bangalore",
    zone: "Entry Gate",
    ip: "10.0.0.51",
    port: "4370",
    model: "ZKTeco SpeedFace-V5L",
    vendor: "ZKTeco",
    status: "Disconnected",
    mode: "Face + Fingerprint",
    lastSync: "4h ago",
    lastHeartbeat: "4h ago",
    records: 740,
    pending: 37,
    todayScans: 0,
    firmware: "6.1.9",
    attendanceMode: "IN / OUT",
    sync: "Automatic",
  },
  {
    id: "BIO-005",
    name: "Delhi Branch",
    location: "Delhi",
    zone: "Main Gate",
    ip: "172.16.0.21",
    port: "4370",
    model: "Suprema BioStation 3",
    vendor: "Suprema",
    status: "Error",
    mode: "Fingerprint",
    lastSync: "1d ago",
    lastHeartbeat: "1d ago",
    records: 198,
    pending: 64,
    todayScans: 0,
    firmware: "3.4.2",
    attendanceMode: "IN / OUT",
    sync: "Automatic",
  },
];

const INITIAL_EVENTS = [
  {
    id: 1,
    device: "BIO-001",
    deviceName: "Main Entrance",
    employee: "Rahul Kumar",
    employeeId: "EMP1001",
    event: "Check In",
    method: "Face",
    time: "09:12 AM",
    result: "Accepted",
  },
  {
    id: 2,
    device: "BIO-001",
    deviceName: "Main Entrance",
    employee: "Priya Sharma",
    employeeId: "EMP1002",
    event: "Check In",
    method: "Fingerprint",
    time: "09:18 AM",
    result: "Accepted",
  },
  {
    id: 3,
    device: "BIO-002",
    deviceName: "Second Floor Gate",
    employee: "Arjun Reddy",
    employeeId: "EMP1003",
    event: "Check In",
    method: "Face",
    time: "09:24 AM",
    result: "Accepted",
  },
  {
    id: 4,
    device: "BIO-003",
    deviceName: "Cafeteria Entry",
    employee: "Sneha Rao",
    employeeId: "EMP1004",
    event: "Break Out",
    method: "Face",
    time: "01:08 PM",
    result: "Accepted",
  },
  {
    id: 5,
    device: "BIO-005",
    deviceName: "Delhi Branch",
    employee: "Vikram Singh",
    employeeId: "EMP1005",
    event: "Check In",
    method: "Fingerprint",
    time: "09:42 AM",
    result: "Device Error",
  },
  {
    id: 6,
    device: "BIO-001",
    deviceName: "Main Entrance",
    employee: "Meena Pillai",
    employeeId: "EMP1006",
    event: "Check Out",
    method: "Face",
    time: "06:18 PM",
    result: "Accepted",
  },
];

const EMPLOYEES = [
  { id: "EMP1001", name: "Rahul Kumar" },
  { id: "EMP1002", name: "Priya Sharma" },
  { id: "EMP1003", name: "Arjun Reddy" },
  { id: "EMP1004", name: "Sneha Rao" },
  { id: "EMP1005", name: "Vikram Singh" },
  { id: "EMP1006", name: "Meena Pillai" },
];

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function Biometric() {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSyncLog, setShowSyncLog] = useState(false);
  const [toast, setToast] = useState("");
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncingDevice, setSyncingDevice] = useState(null);
  const [newDevice, setNewDevice] = useState({
    name: "",
    location: "Mumbai HQ",
    zone: "",
    ip: "",
    port: "4370",
    model: "ZKTeco SpeedFace-V5L",
    mode: "Face + Fingerprint",
  });

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__belBioToastTimer);
    window.__belBioToastTimer = window.setTimeout(() => setToast(""), 2800);
  };

  const stats = useMemo(() => {
    const total = devices.length;
    const connected = devices.filter((item) => item.status === "Connected").length;
    const syncing = devices.filter((item) => item.status === "Syncing").length;
    const disconnected = devices.filter(
      (item) => item.status === "Disconnected"
    ).length;
    const errors = devices.filter((item) => item.status === "Error").length;
    const pending = devices.reduce((sum, item) => sum + item.pending, 0);
    const scans = devices.reduce((sum, item) => sum + item.todayScans, 0);

    return { total, connected, syncing, disconnected, errors, pending, scans };
  }, [devices]);

  const locations = useMemo(
    () => ["All", ...new Set(devices.map((item) => item.location))],
    [devices]
  );

  const filteredDevices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return devices.filter((device) => {
      const matchesSearch =
        !query ||
        device.name.toLowerCase().includes(query) ||
        device.id.toLowerCase().includes(query) ||
        device.ip.toLowerCase().includes(query) ||
        device.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || device.status === statusFilter;

      const matchesLocation =
        locationFilter === "All" || device.location === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [devices, search, statusFilter, locationFilter]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      if (!query) return true;
      return (
        event.employee.toLowerCase().includes(query) ||
        event.employeeId.toLowerCase().includes(query) ||
        event.deviceName.toLowerCase().includes(query) ||
        event.event.toLowerCase().includes(query)
      );
    });
  }, [events, search]);

  const addEvent = (device, eventName = "Manual Sync") => {
    setEvents((current) => [
      {
        id: Date.now(),
        device: device.id,
        deviceName: device.name,
        employee: "System",
        employeeId: "SYSTEM",
        event: eventName,
        method: "Device Sync",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        result: "Accepted",
      },
      ...current,
    ]);
  };

  const syncDevice = (deviceId) => {
    const device = devices.find((item) => item.id === deviceId);
    if (!device || syncingDevice) return;

    setSyncingDevice(deviceId);

    setDevices((current) =>
      current.map((item) =>
        item.id === deviceId
          ? { ...item, status: "Syncing", lastSync: "Syncing..." }
          : item
      )
    );

    window.setTimeout(() => {
      setDevices((current) =>
        current.map((item) =>
          item.id === deviceId
            ? {
                ...item,
                status: "Connected",
                lastSync: "Just now",
                lastHeartbeat: "5 sec ago",
                pending: 0,
                records: item.records + item.pending,
              }
            : item
        )
      );

      addEvent(device, "Sync Completed");
      setSyncingDevice(null);
      showToast(`${device.name} synced successfully.`);
    }, 1300);
  };

  const syncAll = () => {
    if (isSyncingAll) return;

    setIsSyncingAll(true);
    setDevices((current) =>
      current.map((item) =>
        item.status === "Disconnected" || item.status === "Error"
          ? item
          : { ...item, status: "Syncing", lastSync: "Syncing..." }
      )
    );

    window.setTimeout(() => {
      setDevices((current) =>
        current.map((item) => {
          if (item.status === "Disconnected" || item.status === "Error") {
            return item;
          }

          return {
            ...item,
            status: "Connected",
            lastSync: "Just now",
            lastHeartbeat: "4 sec ago",
            records: item.records + item.pending,
            pending: 0,
          };
        })
      );

      setIsSyncingAll(false);
      showToast("Full biometric synchronization completed.");
    }, 1800);
  };

  const testConnection = (deviceId) => {
    const device = devices.find((item) => item.id === deviceId);
    if (!device) return;

    showToast(`Connection test started for ${device.name}.`);

    window.setTimeout(() => {
      const isReachable = device.status !== "Disconnected";

      setDevices((current) =>
        current.map((item) =>
          item.id === deviceId
            ? {
                ...item,
                lastHeartbeat: isReachable ? "Just now" : item.lastHeartbeat,
                status: isReachable ? "Connected" : "Disconnected",
              }
            : item
        )
      );

      showToast(
        isReachable
          ? `${device.name} is reachable.`
          : `${device.name} is not reachable.`
      );
    }, 850);
  };

  const toggleDevice = (deviceId) => {
    setDevices((current) =>
      current.map((item) =>
        item.id === deviceId
          ? {
              ...item,
              status:
                item.status === "Disconnected" ? "Connected" : "Disconnected",
            }
          : item
      )
    );

    const device = devices.find((item) => item.id === deviceId);
    showToast(
      device?.status === "Disconnected"
        ? `${device.name} enabled.`
        : `${device.name} disconnected from sync.`
    );
  };

  const removeDevice = (deviceId) => {
    const device = devices.find((item) => item.id === deviceId);
    if (!device) return;

    if (
      !window.confirm(
        `Remove ${device.name} (${device.id}) from biometric management?`
      )
    ) {
      return;
    }

    setDevices((current) => current.filter((item) => item.id !== deviceId));
    setSelectedDevice(null);
    showToast(`${device.name} removed.`);
  };

  const handleAddDevice = (event) => {
    event.preventDefault();

    if (!newDevice.name.trim() || !newDevice.ip.trim()) {
      showToast("Device name and IP address are required.");
      return;
    }

    const id = `BIO-${String(devices.length + 1).padStart(3, "0")}`;

    const created = {
      id,
      name: newDevice.name.trim(),
      location: newDevice.location,
      zone: newDevice.zone.trim() || "Main Entry",
      ip: newDevice.ip.trim(),
      port: newDevice.port || "4370",
      model: newDevice.model,
      vendor: newDevice.model.includes("Suprema") ? "Suprema" : "ZKTeco",
      status: "Disconnected",
      mode: newDevice.mode,
      lastSync: "Never",
      lastHeartbeat: "Not available",
      records: 0,
      pending: 0,
      todayScans: 0,
      firmware: "Not detected",
      attendanceMode: "IN / OUT",
      sync: "Automatic",
    };

    setDevices((current) => [...current, created]);
    setNewDevice({
      name: "",
      location: "Mumbai HQ",
      zone: "",
      ip: "",
      port: "4370",
      model: "ZKTeco SpeedFace-V5L",
      mode: "Face + Fingerprint",
    });
    setShowAddDevice(false);
    showToast(`${created.name} added. Test the connection to activate it.`);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setLocationFilter("All");
    setShowFilters(false);
  };

  const exportDeviceRegister = () => {
    const headers = [
      "Device ID",
      "Device Name",
      "Location",
      "Zone",
      "IP Address",
      "Port",
      "Model",
      "Status",
      "Biometric Mode",
      "Last Sync",
      "Pending Records",
      "Today's Scans",
    ];

    const rows = devices.map((device) => [
      device.id,
      device.name,
      device.location,
      device.zone,
      device.ip,
      device.port,
      device.model,
      device.status,
      device.mode,
      device.lastSync,
      device.pending,
      device.todayScans,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "HRMS-Biometric-Device-Register.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("Biometric device register exported.");
  };

  return (
    <HRLayout title="Biometric Integration" breadcrumb="Biometric">
      <div className="bel-biometric-page">
        <header className="bel-biometric-header">
          <div>
            <h1>Biometric Integration</h1>
            <p>Manage biometric devices and attendance synchronization</p>
          </div>

          <div className="bel-biometric-header-actions">
            <button
              type="button"
              className="bel-biometric-secondary-button"
              onClick={syncAll}
              disabled={isSyncingAll}
            >
              <FiRefreshCw className={isSyncingAll ? "bel-bio-spin" : ""} />
              {isSyncingAll ? "Syncing..." : "Sync All"}
            </button>

            <button
              type="button"
              className="bel-biometric-primary-button"
              onClick={() => setShowAddDevice(true)}
            >
              <FiPlus />
              Add Device
            </button>
          </div>
        </header>

        <section className="bel-biometric-kpi-grid">
          <div className="bel-biometric-kpi-card">
            <div className="bel-biometric-kpi-icon total">
              <FiMonitor />
            </div>
            <div>
              <strong>{stats.total}</strong>
              <span>Total Devices</span>
            </div>
          </div>

          <div className="bel-biometric-kpi-card">
            <div className="bel-biometric-kpi-icon connected">
              <FiWifi />
            </div>
            <div>
              <strong>{stats.connected}</strong>
              <span>Connected</span>
            </div>
          </div>

          <div className="bel-biometric-kpi-card">
            <div className="bel-biometric-kpi-icon syncing">
              <FiRefreshCw />
            </div>
            <div>
              <strong>{stats.syncing}</strong>
              <span>Syncing</span>
            </div>
          </div>

          <div className="bel-biometric-kpi-card">
            <div className="bel-biometric-kpi-icon disconnected">
              <FiWifiOff />
            </div>
            <div>
              <strong>{stats.disconnected}</strong>
              <span>Disconnected</span>
            </div>
          </div>

          <div className="bel-biometric-kpi-card">
            <div className="bel-biometric-kpi-icon error">
              <FiAlertCircle />
            </div>
            <div>
              <strong>{stats.errors}</strong>
              <span>Errors</span>
            </div>
          </div>
        </section>

        <section className="bel-biometric-operational-strip">
          <div>
            <FiActivity />
            <span>Today's biometric scans</span>
            <strong>{formatNumber(stats.scans)}</strong>
          </div>
          <div>
            <FiClock />
            <span>Pending sync records</span>
            <strong>{formatNumber(stats.pending)}</strong>
          </div>
          <div>
            <FiShield />
            <span>Attendance source</span>
            <strong>Verified Devices</strong>
          </div>
          <div>
            <FiZap />
            <span>Sync mode</span>
            <strong>Automatic</strong>
          </div>
        </section>

        <nav className="bel-biometric-tabs" aria-label="Biometric sections">
          <button
            type="button"
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Device Overview
          </button>
          <button
            type="button"
            className={activeTab === "activity" ? "active" : ""}
            onClick={() => setActiveTab("activity")}
          >
            Attendance Activity
          </button>
          <button
            type="button"
            className={activeTab === "health" ? "active" : ""}
            onClick={() => setActiveTab("health")}
          >
            System Health
          </button>
          <button
            type="button"
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Integration Settings
          </button>
        </nav>

        {activeTab === "overview" && (
          <>
            <section className="bel-biometric-toolbar">
              <div className="bel-biometric-search">
                <FiSearch />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search device, IP address, location..."
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              <div className="bel-biometric-toolbar-actions">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter by device status"
                >
                  <option>All</option>
                  <option>Connected</option>
                  <option>Syncing</option>
                  <option>Disconnected</option>
                  <option>Error</option>
                </select>

                <select
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                  aria-label="Filter by location"
                >
                  {locations.map((location) => (
                    <option key={location}>{location}</option>
                  ))}
                </select>

                <button
                  type="button"
                  className="bel-biometric-filter-button"
                  onClick={() => setShowFilters((value) => !value)}
                >
                  Filters
                </button>

                <button
                  type="button"
                  className="bel-biometric-export-button"
                  onClick={exportDeviceRegister}
                >
                  <FiDownload />
                  Export
                </button>
              </div>

              {showFilters && (
                <div className="bel-biometric-filter-panel">
                  <div>
                    <strong>Device Filters</strong>
                    <small>Refine the biometric device inventory.</small>
                  </div>
                  <label>
                    Status
                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value)
                      }
                    >
                      <option>All</option>
                      <option>Connected</option>
                      <option>Syncing</option>
                      <option>Disconnected</option>
                      <option>Error</option>
                    </select>
                  </label>
                  <label>
                    Location
                    <select
                      value={locationFilter}
                      onChange={(event) =>
                        setLocationFilter(event.target.value)
                      }
                    >
                      {locations.map((location) => (
                        <option key={location}>{location}</option>
                      ))}
                    </select>
                  </label>
                  <div>
                    <button type="button" onClick={resetFilters}>
                      Clear
                    </button>
                    <button
                      type="button"
                      className="primary"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="bel-biometric-section-heading">
              <div>
                <h2>Registered Biometric Devices</h2>
                <p>
                  Fingerprint, face-recognition and access terminals connected
                  to HR attendance.
                </p>
              </div>
              <span>
                {filteredDevices.length} of {devices.length} devices
              </span>
            </section>

            <section className="bel-biometric-device-grid">
              {filteredDevices.map((device) => (
                <article className="bel-biometric-device-card" key={device.id}>
                  <div className="bel-biometric-device-top">
                    <div className="bel-biometric-device-symbol">
                    <MdFingerprint />
                    </div>

                    <span
                      className={`bel-biometric-device-status ${getStatusClass(
                        device.status
                      )}`}
                    >
                      {device.status === "Connected" && <FiWifi />}
                      {device.status === "Syncing" && (
                        <FiRefreshCw className="bel-bio-spin" />
                      )}
                      {device.status === "Disconnected" && <FiWifiOff />}
                      {device.status === "Error" && <FiAlertCircle />}
                      {device.status}
                    </span>
                  </div>

                  <div className="bel-biometric-device-heading">
                    <div>
                      <h3>{device.name}</h3>
                      <p>
                        {device.location} — {device.zone}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`More actions for ${device.name}`}
                      onClick={() => setSelectedDevice(device)}
                    >
                      <FiMoreVertical />
                    </button>
                  </div>

                  <div className="bel-biometric-device-meta">
                    <div>
                      <span>Device ID</span>
                      <strong>{device.id}</strong>
                    </div>
                    <div>
                      <span>IP Address</span>
                      <strong>{device.ip}</strong>
                    </div>
                    <div>
                      <span>Last Sync</span>
                      <strong>{device.lastSync}</strong>
                    </div>
                    <div>
                      <span>Records Synced</span>
                      <strong>{formatNumber(device.records)}</strong>
                    </div>
                  </div>

                  <div className="bel-biometric-device-footer">
                    <div className="bel-biometric-method">
                      <FiShield />
                      {device.mode}
                    </div>
                    {device.pending > 0 && (
                      <span className="bel-biometric-pending">
                        {device.pending} pending
                      </span>
                    )}
                  </div>

                  <div className="bel-biometric-device-actions">
                    <button
                      type="button"
                      className="bel-biometric-sync-button"
                      disabled={syncingDevice === device.id}
                      onClick={() => syncDevice(device.id)}
                    >
                      <FiRefreshCw
                        className={
                          syncingDevice === device.id ? "bel-bio-spin" : ""
                        }
                      />
                      {syncingDevice === device.id ? "Syncing..." : "Sync Now"}
                    </button>

                    <button
                      type="button"
                      className="bel-biometric-logs-button"
                      onClick={() => {
                        setSelectedDevice(device);
                        setShowSyncLog(true);
                      }}
                    >
                      Logs
                    </button>
                  </div>
                </article>
              ))}
            </section>

            {filteredDevices.length === 0 && (
              <div className="bel-biometric-empty">
                <FiMonitor />
                <strong>No biometric devices found</strong>
                <span>Try changing the search or filters.</span>
                <button type="button" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "activity" && (
          <section className="bel-biometric-activity-card">
            <div className="bel-biometric-panel-heading">
              <div>
                <h2>Attendance Device Activity</h2>
                <p>
                  Recent events received from registered biometric terminals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSyncLog(true)}
              >
                <FiFileText />
                View Sync Logs
              </button>
            </div>

            <div className="bel-biometric-activity-summary">
              <div>
                <strong>{formatNumber(stats.scans)}</strong>
                <span>Today's scans</span>
              </div>
              <div>
                <strong>{formatNumber(events.length)}</strong>
                <span>Recent events</span>
              </div>
              <div>
                <strong>{stats.pending}</strong>
                <span>Pending records</span>
              </div>
              <div>
                <strong>{stats.errors}</strong>
                <span>Device errors</span>
              </div>
            </div>

            <div className="bel-biometric-activity-table-wrap">
              <table className="bel-biometric-activity-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Device</th>
                    <th>Event</th>
                    <th>Method</th>
                    <th>Time</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <div className="bel-biometric-employee-cell">
                          <span>
                            {getInitials(event.employee)}
                          </span>
                          <div>
                            <strong>{event.employee}</strong>
                            <small>{event.employeeId}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{event.deviceName}</strong>
                        <small>{event.device}</small>
                      </td>
                      <td>{event.event}</td>
                      <td>
                        <span className="bel-biometric-method-pill">
                          {event.method}
                        </span>
                      </td>
                      <td>{event.time}</td>
                      <td>
                        <span
                          className={`bel-biometric-result ${event.result
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {event.result === "Accepted" ? (
                            <FiCheckCircle />
                          ) : (
                            <FiAlertCircle />
                          )}
                          {event.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "health" && (
          <section className="bel-biometric-health-grid">
            <div className="bel-biometric-health-main">
              <div className="bel-biometric-panel-heading">
                <div>
                  <h2>Biometric Infrastructure Health</h2>
                  <p>
                    Live operational view of device connectivity and sync
                    readiness.
                  </p>
                </div>
                <span className="bel-biometric-health-live">
                  <i />
                  Live
                </span>
              </div>

              <div className="bel-biometric-health-list">
                {devices.map((device) => (
                  <div className="bel-biometric-health-row" key={device.id}>
                    <div className="bel-biometric-health-device">
                      <div className="bel-biometric-health-icon">
                        <FiCpu />
                      </div>
                      <div>
                        <strong>{device.name}</strong>
                        <small>
                          {device.id} · {device.ip}
                        </small>
                      </div>
                    </div>

                    <div className="bel-biometric-health-bar">
                      <div>
                        <span>Connectivity</span>
                        <strong>
                          {device.status === "Connected"
                            ? "100%"
                            : device.status === "Syncing"
                            ? "82%"
                            : "0%"}
                        </strong>
                      </div>
                      <div className="bel-biometric-progress">
                        <i
                          style={{
                            width:
                              device.status === "Connected"
                                ? "100%"
                                : device.status === "Syncing"
                                ? "82%"
                                : "4%",
                          }}
                        />
                      </div>
                    </div>

                    <span
                      className={`bel-biometric-health-status ${getStatusClass(
                        device.status
                      )}`}
                    >
                      {device.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bel-biometric-health-side">
              <div className="bel-biometric-health-score">
                <span>System Health</span>
                <strong>
                  {Math.round(
                    ((stats.connected + stats.syncing) / Math.max(stats.total, 1)) *
                      100
                  )}
                  %
                </strong>
                <small>
                  Based on device connectivity and synchronization status
                </small>
              </div>

              <div className="bel-biometric-health-checks">
                <div>
                  <FiCheckCircle />
                  <span>Attendance ingestion</span>
                  <strong>Healthy</strong>
                </div>
                <div>
                  <FiCheckCircle />
                  <span>Automatic synchronization</span>
                  <strong>Enabled</strong>
                </div>
                <div>
                  <FiAlertCircle />
                  <span>Devices requiring attention</span>
                  <strong>{stats.disconnected + stats.errors}</strong>
                </div>
                <div>
                  <FiLock />
                  <span>Raw biometric storage</span>
                  <strong>Not stored</strong>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="bel-biometric-settings-card">
            <div className="bel-biometric-panel-heading">
              <div>
                <h2>Biometric Integration Settings</h2>
                <p>
                  Enterprise attendance integration defaults and security
                  controls.
                </p>
              </div>
              <FiSettings />
            </div>

            <div className="bel-biometric-settings-grid">
              <div>
                <FiRefreshCw />
                <div>
                  <strong>Automatic synchronization</strong>
                  <span>Pull attendance events from devices automatically.</span>
                </div>
                <label className="bel-biometric-toggle">
                  <input type="checkbox" defaultChecked />
                  <span />
                </label>
              </div>

              <div>
                <FiUserCheck />
                <div>
                  <strong>Duplicate event protection</strong>
                  <span>
                    Prevent duplicate punches from creating duplicate
                    attendance entries.
                  </span>
                </div>
                <label className="bel-biometric-toggle">
                  <input type="checkbox" defaultChecked />
                  <span />
                </label>
              </div>

              <div>
                <FiClock />
                <div>
                  <strong>Grace-period validation</strong>
                  <span>
                    Apply configured shift grace periods before marking late
                    arrival.
                  </span>
                </div>
                <label className="bel-biometric-toggle">
                  <input type="checkbox" defaultChecked />
                  <span />
                </label>
              </div>

              <div>
                <FiShield />
                <div>
                  <strong>Device authentication</strong>
                  <span>
                    Only registered and authenticated devices can submit
                    attendance events.
                  </span>
                </div>
                <label className="bel-biometric-toggle">
                  <input type="checkbox" defaultChecked />
                  <span />
                </label>
              </div>

              <div>
                <FiGlobe />
                <div>
                  <strong>Network policy</strong>
                  <span>Private network / VPN endpoints only.</span>
                </div>
                <strong className="bel-biometric-setting-value">
                  Restricted
                </strong>
              </div>

              <div>
                <FiLock />
                <div>
                  <strong>Biometric privacy</strong>
                  <span>
                    HRMS stores attendance events and device references, not
                    raw fingerprint or face images.
                  </span>
                </div>
                <strong className="bel-biometric-setting-value">
                  Protected
                </strong>
              </div>
            </div>

            <div className="bel-biometric-settings-footer">
              <span>Changes are applied to new synchronization cycles.</span>
              <button
                type="button"
                onClick={() => showToast("Biometric settings saved.")}
              >
                Save Settings
              </button>
            </div>
          </section>
        )}

        {selectedDevice && !showSyncLog && (
          <div
            className="bel-biometric-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedDevice(null);
              }
            }}
          >
            <div className="bel-biometric-device-modal">
              <div className="bel-biometric-modal-header">
                <div>
                  <div className="bel-biometric-modal-icon">
                   <MdFingerprint />
                  </div>
                  <div>
                    <h2>{selectedDevice.name}</h2>
                    <p>
                      {selectedDevice.id} · {selectedDevice.model}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDevice(null)}
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>

              <div className="bel-biometric-modal-status-row">
                <span
                  className={`bel-biometric-device-status ${getStatusClass(
                    selectedDevice.status
                  )}`}
                >
                  {selectedDevice.status}
                </span>
                <span>{selectedDevice.mode}</span>
              </div>

              <div className="bel-biometric-modal-details">
                <div>
                  <span>Location</span>
                  <strong>
                    {selectedDevice.location} — {selectedDevice.zone}
                  </strong>
                </div>
                <div>
                  <span>IP Address</span>
                  <strong>{selectedDevice.ip}</strong>
                </div>
                <div>
                  <span>Port</span>
                  <strong>{selectedDevice.port}</strong>
                </div>
                <div>
                  <span>Firmware</span>
                  <strong>{selectedDevice.firmware}</strong>
                </div>
                <div>
                  <span>Last Heartbeat</span>
                  <strong>{selectedDevice.lastHeartbeat}</strong>
                </div>
                <div>
                  <span>Attendance Mode</span>
                  <strong>{selectedDevice.attendanceMode}</strong>
                </div>
                <div>
                  <span>Sync Policy</span>
                  <strong>{selectedDevice.sync}</strong>
                </div>
                <div>
                  <span>Pending Records</span>
                  <strong>{selectedDevice.pending}</strong>
                </div>
              </div>

              <div className="bel-biometric-modal-actions">
                <button
                  type="button"
                  onClick={() => syncDevice(selectedDevice.id)}
                >
                  <FiRefreshCw />
                  Sync Now
                </button>
                <button
                  type="button"
                  onClick={() => testConnection(selectedDevice.id)}
                >
                  <FiActivity />
                  Test Connection
                </button>
                <button
                  type="button"
                  onClick={() => toggleDevice(selectedDevice.id)}
                >
                  <FiWifiOff />
                  {selectedDevice.status === "Disconnected"
                    ? "Enable Device"
                    : "Disconnect"}
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => removeDevice(selectedDevice.id)}
                >
                  <FiTrash2 />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {showSyncLog && (
          <div
            className="bel-biometric-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowSyncLog(false);
              }
            }}
          >
            <div className="bel-biometric-log-modal">
              <div className="bel-biometric-modal-header">
                <div>
                  <div className="bel-biometric-modal-icon">
                    <FiActivity />
                  </div>
                  <div>
                    <h2>
                      {selectedDevice
                        ? `${selectedDevice.name} — Activity`
                        : "Biometric Sync Activity"}
                    </h2>
                    <p>Recent synchronization and attendance events</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSyncLog(false)}
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>

              <div className="bel-biometric-log-list">
                {filteredEvents
                  .filter(
                    (event) =>
                      !selectedDevice || event.device === selectedDevice.id
                  )
                  .slice(0, 8)
                  .map((event) => (
                    <div key={event.id}>
                      <span className="bel-biometric-log-dot">
                        <FiCheck />
                      </span>
                      <div>
                        <strong>
                          {event.event} · {event.employee}
                        </strong>
                        <small>
                          {event.deviceName} · {event.method} · {event.time}
                        </small>
                      </div>
                      <span
                        className={`bel-biometric-result ${event.result
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {event.result}
                      </span>
                    </div>
                  ))}

                {filteredEvents.length === 0 && (
                  <div className="bel-biometric-log-empty">
                    No activity available.
                  </div>
                )}
              </div>

              <div className="bel-biometric-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowSyncLog(false);
                    if (selectedDevice) syncDevice(selectedDevice.id);
                  }}
                >
                  <FiRefreshCw />
                  Sync Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowSyncLog(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddDevice && (
          <div
            className="bel-biometric-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowAddDevice(false);
              }
            }}
          >
            <form
              className="bel-biometric-add-modal"
              onSubmit={handleAddDevice}
            >
              <div className="bel-biometric-modal-header">
                <div>
                  <div className="bel-biometric-modal-icon">
                    <FiPlus />
                  </div>
                  <div>
                    <h2>Add Biometric Device</h2>
                    <p>
                      Register a fingerprint or face-recognition terminal.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDevice(false)}
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>

              <div className="bel-biometric-form-grid">
                <label>
                  Device Name
                  <input
                    type="text"
                    value={newDevice.name}
                    placeholder="e.g. Main Entrance"
                    onChange={(event) =>
                      setNewDevice((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Location
                  <select
                    value={newDevice.location}
                    onChange={(event) =>
                      setNewDevice((current) => ({
                        ...current,
                        location: event.target.value,
                      }))
                    }
                  >
                    <option>Mumbai HQ</option>
                    <option>Bangalore</option>
                    <option>Delhi</option>
                    <option>Hyderabad</option>
                    <option>Chennai</option>
                    <option>Pune</option>
                  </select>
                </label>

                <label>
                  Zone / Gate
                  <input
                    type="text"
                    value={newDevice.zone}
                    placeholder="e.g. Ground Floor"
                    onChange={(event) =>
                      setNewDevice((current) => ({
                        ...current,
                        zone: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  IP Address
                  <input
                    type="text"
                    value={newDevice.ip}
                    placeholder="192.168.1.110"
                    onChange={(event) =>
                      setNewDevice((current) => ({
                        ...current,
                        ip: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Port
                  <input
                    type="text"
                    value={newDevice.port}
                    onChange={(event) =>
                      setNewDevice((current) => ({
                        ...current,
                        port: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Device Model
                  <select
                    value={newDevice.model}
                    onChange={(event) =>
                      setNewDevice((current) => ({
                        ...current,
                        model: event.target.value,
                      }))
                    }
                  >
                    <option>ZKTeco SpeedFace-V5L</option>
                    <option>ZKTeco uFace 302</option>
                    <option>Suprema FaceLite</option>
                    <option>Suprema BioStation 3</option>
                  </select>
                </label>

                <label className="bel-biometric-form-full">
                  Biometric Mode
                  <select
                    value={newDevice.mode}
                    onChange={(event) =>
                      setNewDevice((current) => ({
                        ...current,
                        mode: event.target.value,
                      }))
                    }
                  >
                    <option>Face + Fingerprint</option>
                    <option>Face Recognition</option>
                    <option>Fingerprint</option>
                    <option>Face + PIN</option>
                  </select>
                </label>
              </div>

              <div className="bel-biometric-security-note">
                <FiShield />
                <span>
                  Device credentials should be stored securely by the backend.
                  This UI does not expose or store biometric templates.
                </span>
              </div>

              <div className="bel-biometric-modal-actions">
                <button type="button" onClick={() => setShowAddDevice(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  <FiPlus />
                  Register Device
                </button>
              </div>
            </form>
          </div>
        )}

        {toast && (
          <div className="bel-biometric-toast">
            <FiCheckCircle />
            {toast}
          </div>
        )}
      </div>
    </HRLayout>
  );
}
