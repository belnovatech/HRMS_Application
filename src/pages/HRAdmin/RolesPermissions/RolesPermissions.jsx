import React, { useMemo, useState } from "react";
import "./RolesPermissions.css";
import HRLayout from "../../../layouts/HRLayout";
import {
  FiCheck,
  FiChevronDown,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";

const MODULES = [
  "Employees",
  "Attendance",
  "Leave",
  "Payroll",
  "Documents",
  "Reports",
  "Recruitment",
  "Settings",
  "Biometric",
  "Audit Logs",
];

const PERMISSION_KEYS = ["view", "create", "edit", "delete", "approve", "export"];

const PERMISSION_LABELS = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  approve: "Approve",
  export: "Export",
};

const INITIAL_ROLES = [
  {
    id: "ROLE-001",
    role: "Super Admin",
    description: "Full platform administration and security control",
    users: 2,
    status: "Active",
    scope: "Organization-wide",
    permissions: {
      Employees: ["view", "create", "edit", "delete", "approve", "export"],
      Attendance: ["view", "create", "edit", "delete", "approve", "export"],
      Leave: ["view", "create", "edit", "delete", "approve", "export"],
      Payroll: ["view", "create", "edit", "delete", "approve", "export"],
      Documents: ["view", "create", "edit", "delete", "approve", "export"],
      Reports: ["view", "create", "edit", "delete", "approve", "export"],
      Recruitment: ["view", "create", "edit", "delete", "approve", "export"],
      Settings: ["view", "create", "edit", "delete", "approve", "export"],
      Biometric: ["view", "create", "edit", "delete", "approve", "export"],
      "Audit Logs": ["view", "export"],
    },
  },
  {
    id: "ROLE-002",
    role: "HR Administrator",
    description: "Manage employees, HR operations and approvals",
    users: 6,
    status: "Active",
    scope: "All HR modules",
    permissions: {
      Employees: ["view", "create", "edit", "delete", "export"],
      Attendance: ["view", "create", "edit", "approve", "export"],
      Leave: ["view", "create", "edit", "approve", "export"],
      Payroll: ["view", "create", "edit", "approve", "export"],
      Documents: ["view", "create", "edit", "delete", "export"],
      Reports: ["view", "export"],
      Recruitment: ["view", "create", "edit", "approve", "export"],
      Settings: ["view"],
      Biometric: ["view", "edit"],
      "Audit Logs": ["view", "export"],
    },
  },
  {
    id: "ROLE-003",
    role: "HR Executive",
    description: "Day-to-day HR operations and employee services",
    users: 9,
    status: "Active",
    scope: "HR operations",
    permissions: {
      Employees: ["view", "create", "edit", "export"],
      Attendance: ["view", "edit", "export"],
      Leave: ["view", "create", "edit", "approve", "export"],
      Payroll: ["view", "export"],
      Documents: ["view", "create", "edit", "export"],
      Reports: ["view", "export"],
      Recruitment: ["view", "create", "edit"],
      Settings: [],
      Biometric: ["view"],
      "Audit Logs": ["view"],
    },
  },
  {
    id: "ROLE-004",
    role: "Department Manager",
    description: "Team-level management, approvals and reporting",
    users: 24,
    status: "Active",
    scope: "Assigned department",
    permissions: {
      Employees: ["view"],
      Attendance: ["view", "approve", "export"],
      Leave: ["view", "approve", "export"],
      Payroll: ["view"],
      Documents: ["view", "create", "edit"],
      Reports: ["view", "export"],
      Recruitment: ["view", "approve"],
      Settings: [],
      Biometric: [],
      "Audit Logs": [],
    },
  },
  {
    id: "ROLE-005",
    role: "Finance Manager",
    description: "Payroll, financial reports and compensation access",
    users: 5,
    status: "Active",
    scope: "Finance & payroll",
    permissions: {
      Employees: ["view", "export"],
      Attendance: ["view", "export"],
      Leave: ["view", "export"],
      Payroll: ["view", "create", "edit", "approve", "export"],
      Documents: ["view", "export"],
      Reports: ["view", "export"],
      Recruitment: [],
      Settings: [],
      Biometric: [],
      "Audit Logs": ["view", "export"],
    },
  },
  {
    id: "ROLE-006",
    role: "Employee",
    description: "Self-service access for individual employee data",
    users: 1248,
    status: "Active",
    scope: "Own records",
    permissions: {
      Employees: ["view"],
      Attendance: ["view", "create"],
      Leave: ["view", "create"],
      Payroll: ["view"],
      Documents: ["view", "create"],
      Reports: [],
      Recruitment: [],
      Settings: ["view"],
      Biometric: [],
      "Audit Logs": [],
    },
  },
];

const ROLE_COLORS = ["purple", "blue", "indigo", "green", "orange", "cyan"];

function clonePermissions(permissions) {
  return Object.fromEntries(
    Object.entries(permissions).map(([module, actions]) => [module, [...actions]])
  );
}

function emptyPermissions() {
  return Object.fromEntries(MODULES.map((module) => [module, []]));
}

function countPermissions(permissions) {
  return Object.values(permissions).reduce(
    (total, actions) => total + actions.length,
    0
  );
}

function RoleIcon({ index }) {
  return (
    <span className={`bel-rbac-role-icon bel-rbac-role-icon--${ROLE_COLORS[index % ROLE_COLORS.length]}`}>
      <FiShield />
    </span>
  );
}

export default function RolesPermissions() {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState(INITIAL_ROLES[0].id);
  const [draftPermissions, setDraftPermissions] = useState(
    clonePermissions(INITIAL_ROLES[0].permissions)
  );
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [dirty, setDirty] = useState(false);
  const [roleForm, setRoleForm] = useState({
    role: "",
    description: "",
    users: "0",
    scope: "Organization-wide",
  });

  const selectedRole = roles.find((role) => role.id === selectedRoleId) || roles[0];

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return roles.filter((role) => {
      const matchesSearch =
        !query ||
        role.role.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query);

      const matchesFilter =
        roleFilter === "All" || role.status === roleFilter;

      return matchesSearch && matchesFilter;
    });
  }, [roles, search, roleFilter]);

  const totalUsers = roles.reduce((sum, role) => sum + role.users, 0);
  const activeRoles = roles.filter((role) => role.status === "Active").length;

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const selectRole = (role) => {
    if (dirty) {
      const shouldContinue = window.confirm(
        "You have unsaved permission changes. Discard them and switch roles?"
      );
      if (!shouldContinue) return;
    }

    setSelectedRoleId(role.id);
    setDraftPermissions(clonePermissions(role.permissions));
    setDirty(false);
  };

  const isPermissionEnabled = (module, permission) =>
    draftPermissions[module]?.includes(permission);

  const togglePermission = (module, permission) => {
    if (selectedRole.role === "Super Admin") {
      showToast("Super Admin permissions cannot be restricted.");
      return;
    }

    setDraftPermissions((current) => {
      const existing = current[module] || [];
      const next = existing.includes(permission)
        ? existing.filter((item) => item !== permission)
        : [...existing, permission];

      return {
        ...current,
        [module]: next,
      };
    });

    setDirty(true);
  };

  const toggleModule = (module, enabled) => {
    if (selectedRole.role === "Super Admin") {
      showToast("Super Admin permissions cannot be restricted.");
      return;
    }

    setDraftPermissions((current) => ({
      ...current,
      [module]: enabled ? [...PERMISSION_KEYS] : [],
    }));

    setDirty(true);
  };

  const toggleAllPermission = (permission, enabled) => {
    if (selectedRole.role === "Super Admin") {
      showToast("Super Admin permissions cannot be restricted.");
      return;
    }

    setDraftPermissions((current) => {
      const next = { ...current };

      MODULES.forEach((module) => {
        const existing = next[module] || [];
        next[module] = enabled
          ? Array.from(new Set([...existing, permission]))
          : existing.filter((item) => item !== permission);
      });

      return next;
    });

    setDirty(true);
  };

  const saveChanges = () => {
    setRoles((current) =>
      current.map((role) =>
        role.id === selectedRole.id
          ? {
              ...role,
              permissions: clonePermissions(draftPermissions),
            }
          : role
      )
    );

    setDirty(false);
    showToast(`${selectedRole.role} permissions saved successfully.`);
  };

  const resetChanges = () => {
    setDraftPermissions(clonePermissions(selectedRole.permissions));
    setDirty(false);
    showToast("Unsaved permission changes were discarded.");
  };

  const openEditRole = () => {
    setRoleForm({
      role: selectedRole.role,
      description: selectedRole.description,
      users: String(selectedRole.users),
      scope: selectedRole.scope,
    });
    setModal("editRole");
  };

  const submitRole = (event) => {
    event.preventDefault();

    const roleName = roleForm.role.trim();
    if (!roleName) return;

    if (modal === "editRole") {
      setRoles((current) =>
        current.map((role) =>
          role.id === selectedRole.id
            ? {
                ...role,
                role: roleName,
                description: roleForm.description.trim() || "Custom HRMS role",
                users: Number(roleForm.users) || 0,
                scope: roleForm.scope,
              }
            : role
        )
      );
      setModal(null);
      showToast("Role details updated.");
      return;
    }

    const newRole = {
      id: `ROLE-${String(roles.length + 1).padStart(3, "0")}`,
      role: roleName,
      description: roleForm.description.trim() || "Custom HRMS role",
      users: Number(roleForm.users) || 0,
      status: "Active",
      scope: roleForm.scope,
      permissions: emptyPermissions(),
    };

    setRoles((current) => [...current, newRole]);
    setSelectedRoleId(newRole.id);
    setDraftPermissions(emptyPermissions());
    setDirty(false);
    setModal(null);
    setRoleForm({
      role: "",
      description: "",
      users: "0",
      scope: "Organization-wide",
    });
    showToast("New role created successfully.");
  };

  const deleteRole = () => {
    if (selectedRole.role === "Super Admin") {
      showToast("The Super Admin role cannot be deleted.");
      return;
    }

    if (selectedRole.users > 0) {
      showToast("Reassign users before deleting this role.");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete the ${selectedRole.role} role? This action cannot be undone.`
    );

    if (!shouldDelete) return;

    const remainingRoles = roles.filter((role) => role.id !== selectedRole.id);
    const nextRole = remainingRoles[0];

    setRoles(remainingRoles);
    setSelectedRoleId(nextRole.id);
    setDraftPermissions(clonePermissions(nextRole.permissions));
    setDirty(false);
    showToast("Role deleted.");
  };

  const exportRoles = () => {
    const rows = roles.flatMap((role) =>
      MODULES.flatMap((module) =>
        PERMISSION_KEYS.map((permission) => [
          role.role,
          role.status,
          role.users,
          role.scope,
          module,
          permission,
          role.permissions[module]?.includes(permission) ? "Allowed" : "Denied",
        ])
      )
    );

    const escape = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [
      [
        "Role",
        "Status",
        "Assigned Users",
        "Scope",
        "Module",
        "Permission",
        "Access",
      ],
      ...rows,
    ]
      .map((row) => row.map(escape).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "roles-and-permissions.csv";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    showToast("Roles and permissions exported.");
  };

  const hasAnyPermission = (module) =>
    (draftPermissions[module] || []).length > 0;

  const hasEveryPermission = (permission) =>
    MODULES.every((module) =>
      (draftPermissions[module] || []).includes(permission)
    );

  return (
    <HRLayout title="Roles & Permissions" breadcrumb="Roles & Permissions">
      <div className="bel-rbac-page">
        <header className="bel-rbac-header">
          <div>
            <h1>Roles &amp; Permissions</h1>
            <p>Configure access control for users, modules and business operations</p>
          </div>

          <div className="bel-rbac-header-actions">
            <button
              type="button"
              className="bel-rbac-export-button"
              onClick={exportRoles}
            >
              Export
            </button>
            <button
              type="button"
              className="bel-rbac-add-role-button"
              onClick={() => {
                setRoleForm({
                  role: "",
                  description: "",
                  users: "0",
                  scope: "Organization-wide",
                });
                setModal("addRole");
              }}
            >
              <FiPlus />
              Add Role
            </button>
          </div>
        </header>

        <section className="bel-rbac-summary">
          <div className="bel-rbac-summary-card">
            <span><FiShield /></span>
            <div>
              <strong>{roles.length}</strong>
              <small>Total Roles</small>
            </div>
          </div>

          <div className="bel-rbac-summary-card">
            <span><FiUsers /></span>
            <div>
              <strong>{totalUsers.toLocaleString()}</strong>
              <small>Assigned Users</small>
            </div>
          </div>

          <div className="bel-rbac-summary-card">
            <span><FiCheck /></span>
            <div>
              <strong>{activeRoles}</strong>
              <small>Active Roles</small>
            </div>
          </div>

          <div className="bel-rbac-summary-card">
            <span>✓</span>
            <div>
              <strong>{countPermissions(draftPermissions)}</strong>
              <small>Selected Role Permissions</small>
            </div>
          </div>
        </section>

        <section className="bel-rbac-main-layout">
          <aside className="bel-rbac-sidebar">
            <div className="bel-rbac-sidebar-heading">
              <div>
                <h2>System Roles</h2>
                <p>Select a role to manage access</p>
              </div>
              <span>{roles.length}</span>
            </div>

            <div className="bel-rbac-sidebar-search">
              <FiSearch />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search roles..."
              />
            </div>

            <div className="bel-rbac-role-filter">
              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
              >
                <FiChevronDown className={showFilters ? "is-open" : ""} />
                {roleFilter === "All" ? "All roles" : roleFilter}
              </button>

              {showFilters && (
                <div className="bel-rbac-filter-popover">
                  {["All", "Active", "Inactive"].map((filter) => (
                    <button
                      type="button"
                      key={filter}
                      className={roleFilter === filter ? "is-selected" : ""}
                      onClick={() => {
                        setRoleFilter(filter);
                        setShowFilters(false);
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bel-rbac-role-list">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => {
                  const originalIndex = roles.findIndex((item) => item.id === role.id);
                  const selected = role.id === selectedRole.id;

                  return (
                    <button
                      type="button"
                      key={role.id}
                      className={`bel-rbac-role-item ${selected ? "is-selected" : ""}`}
                      onClick={() => selectRole(role)}
                    >
                      <RoleIcon index={originalIndex} />
                      <span className="bel-rbac-role-item-content">
                        <strong>{role.role}</strong>
                        <small>{role.description}</small>
                        <em>
                          <FiUsers />
                          {role.users.toLocaleString()} {role.users === 1 ? "user" : "users"}
                        </em>
                      </span>
                      <span
                        className={`bel-rbac-role-status ${
                          role.status === "Active" ? "active" : "inactive"
                        }`}
                      />
                    </button>
                  );
                })
              ) : (
                <div className="bel-rbac-no-results">No roles found.</div>
              )}
            </div>

            <div className="bel-rbac-sidebar-footer">
              <button
                type="button"
                onClick={() => {
                  setRoleForm({
                    role: "",
                    description: "",
                    users: "0",
                    scope: "Organization-wide",
                  });
                  setModal("addRole");
                }}
              >
                <FiPlus />
                Create Custom Role
              </button>
            </div>
          </aside>

          <main className="bel-rbac-permissions-panel">
            <div className="bel-rbac-panel-header">
              <div className="bel-rbac-panel-title">
                <RoleIcon index={roles.findIndex((role) => role.id === selectedRole.id)} />
                <div>
                  <div className="bel-rbac-title-line">
                    <h2>{selectedRole.role}</h2>
                    <span className="bel-rbac-active-pill">
                      {selectedRole.status}
                    </span>
                  </div>
                  <p>{selectedRole.description}</p>
                </div>
              </div>

              <div className="bel-rbac-panel-actions">
                <button type="button" onClick={openEditRole}>
                  <FiEdit2 />
                  Edit Role
                </button>
                <button type="button" className="danger" onClick={deleteRole}>
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="bel-rbac-role-meta">
              <div>
                <span>Assigned Users</span>
                <strong>{selectedRole.users.toLocaleString()}</strong>
              </div>
              <div>
                <span>Access Scope</span>
                <strong>{selectedRole.scope}</strong>
              </div>
              <div>
                <span>Permissions</span>
                <strong>{countPermissions(draftPermissions)} enabled</strong>
              </div>
              <div>
                <span>Role ID</span>
                <strong>{selectedRole.id}</strong>
              </div>
            </div>

            <div className="bel-rbac-permission-toolbar">
              <div>
                <h3>Module Permissions</h3>
                <p>Control which actions this role can perform across HRMS modules.</p>
              </div>

              <div className="bel-rbac-permission-toolbar-actions">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedRole.role === "Super Admin") {
                      showToast("Super Admin permissions are always enabled.");
                      return;
                    }
                    const enableAll = !MODULES.every((module) =>
                      PERMISSION_KEYS.every((permission) =>
                        draftPermissions[module]?.includes(permission)
                      )
                    );
                    setDraftPermissions(
                      enableAll
                        ? Object.fromEntries(
                            MODULES.map((module) => [module, [...PERMISSION_KEYS]])
                          )
                        : emptyPermissions()
                    );
                    setDirty(true);
                  }}
                >
                  Select All
                </button>
                <button type="button" onClick={resetChanges} disabled={!dirty}>
                  Reset
                </button>
              </div>
            </div>

            <div className="bel-rbac-permission-scroll">
              <table className="bel-rbac-permission-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    {PERMISSION_KEYS.map((permission) => (
                      <th key={permission}>
                        <label className="bel-rbac-column-check">
                          <input
                            type="checkbox"
                            checked={hasEveryPermission(permission)}
                            disabled={selectedRole.role === "Super Admin"}
                            onChange={(event) =>
                              toggleAllPermission(permission, event.target.checked)
                            }
                          />
                          <span />
                          {PERMISSION_LABELS[permission]}
                        </label>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {MODULES.map((module) => (
                    <tr key={module}>
                      <td>
                        <div className="bel-rbac-module-name">
                          <span className="bel-rbac-module-dot" />
                          <strong>{module}</strong>
                        </div>
                      </td>

                      {PERMISSION_KEYS.map((permission) => {
                        const enabled = isPermissionEnabled(module, permission);

                        return (
                          <td key={`${module}-${permission}`}>
                            <label className="bel-rbac-check">
                              <input
                                type="checkbox"
                                checked={enabled}
                                disabled={selectedRole.role === "Super Admin"}
                                onChange={() =>
                                  togglePermission(module, permission)
                                }
                              />
                              <span>
                                {enabled && <FiCheck />}
                              </span>
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bel-rbac-permission-mobile">
              {MODULES.map((module) => (
                <div className="bel-rbac-mobile-module" key={module}>
                  <div className="bel-rbac-mobile-module-head">
                    <strong>{module}</strong>
                    <button
                      type="button"
                      onClick={() => toggleModule(module, !hasAnyPermission(module))}
                    >
                      {hasAnyPermission(module) ? "Clear" : "All"}
                    </button>
                  </div>

                  <div className="bel-rbac-mobile-permissions">
                    {PERMISSION_KEYS.map((permission) => {
                      const enabled = isPermissionEnabled(module, permission);

                      return (
                        <label key={permission} className="bel-rbac-mobile-check">
                          <input
                            type="checkbox"
                            checked={enabled}
                            disabled={selectedRole.role === "Super Admin"}
                            onChange={() => togglePermission(module, permission)}
                          />
                          <span>{enabled && <FiCheck />}</span>
                          {PERMISSION_LABELS[permission]}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="bel-rbac-save-bar">
              <div>
                <strong>
                  {dirty ? "You have unsaved permission changes." : "Permissions are up to date."}
                </strong>
                <span>
                  {selectedRole.role === "Super Admin"
                    ? "Super Admin has unrestricted access across the system."
                    : "Changes are applied to this role only and do not affect other roles."}
                </span>
              </div>

              <div>
                {dirty && (
                  <button type="button" className="bel-rbac-discard-button" onClick={resetChanges}>
                    Discard
                  </button>
                )}
                <button
                  type="button"
                  className="bel-rbac-save-button"
                  onClick={saveChanges}
                  disabled={!dirty || selectedRole.role === "Super Admin"}
                >
                  <FiCheck />
                  Save Changes
                </button>
              </div>
            </div>
          </main>
        </section>

        {modal && (
          <div className="bel-rbac-modal-backdrop">
            <form className="bel-rbac-modal" onSubmit={submitRole}>
              <div className="bel-rbac-modal-header">
                <div>
                  <h2>{modal === "editRole" ? "Edit Role" : "Create Custom Role"}</h2>
                  <p>
                    {modal === "editRole"
                      ? "Update role information and access scope."
                      : "Create a role and configure its permissions after creation."}
                  </p>
                </div>
                <button type="button" onClick={() => setModal(null)}>
                  <FiX />
                </button>
              </div>

              <div className="bel-rbac-form">
                <label>
                  Role Name
                  <input
                    value={roleForm.role}
                    onChange={(event) =>
                      setRoleForm((current) => ({
                        ...current,
                        role: event.target.value,
                      }))
                    }
                    placeholder="e.g. Payroll Specialist"
                    required
                  />
                </label>

                <label>
                  Description
                  <textarea
                    value={roleForm.description}
                    onChange={(event) =>
                      setRoleForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Describe what this role is responsible for"
                    rows="3"
                  />
                </label>

                <div className="bel-rbac-form-two">
                  <label>
                    Assigned Users
                    <input
                      type="number"
                      min="0"
                      value={roleForm.users}
                      onChange={(event) =>
                        setRoleForm((current) => ({
                          ...current,
                          users: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    Access Scope
                    <select
                      value={roleForm.scope}
                      onChange={(event) =>
                        setRoleForm((current) => ({
                          ...current,
                          scope: event.target.value,
                        }))
                      }
                    >
                      <option>Organization-wide</option>
                      <option>All HR modules</option>
                      <option>Assigned department</option>
                      <option>Finance & payroll</option>
                      <option>Own records</option>
                      <option>Custom scope</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="bel-rbac-modal-footer">
                <button type="button" onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  {modal === "editRole" ? <FiCheck /> : <FiPlus />}
                  {modal === "editRole" ? "Save Role" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        )}

        {toast && (
          <div className="bel-rbac-toast">
            <FiCheck />
            {toast}
          </div>
        )}
      </div>
    </HRLayout>
  );
}
