import "./RolesPermissions.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import Header from "../../components/Header/Header";

export default function RolesPermissions() {
  const roles = [
    "Super Admin",
    "HR Manager",
    "Manager",
    "Finance",
    "Employee",
  ];

  const permissions = [
    {
      category: "Employees",
      items: [
        {
          name: "Create",
          roles: {
            "Super Admin": true,
            "HR Manager": true,
            Manager: false,
            Finance: false,
            Employee: false,
          },
        },
        {
          name: "Edit",
          roles: {
            "Super Admin": true,
            "HR Manager": true,
            Manager: false,
            Finance: false,
            Employee: false,
          },
        },
        {
          name: "Delete",
          roles: {
            "Super Admin": true,
            "HR Manager": false,
            Manager: false,
            Finance: false,
            Employee: false,
          },
        },
        {
          name: "View",
          roles: {
            "Super Admin": true,
            "HR Manager": true,
            Manager: true,
            Finance: false,
            Employee: false,
          },
        },
      ],
    },

    {
      category: "Attendance",
      items: [
        {
          name: "View",
          roles: {
            "Super Admin": true,
            "HR Manager": true,
            Manager: true,
            Finance: false,
            Employee: true,
          },
        },
        {
          name: "Edit",
          roles: {
            "Super Admin": true,
            "HR Manager": true,
            Manager: false,
            Finance: false,
            Employee: false,
          },
        },
        {
          name: "Correct",
          roles: {
            "Super Admin": true,
            "HR Manager": false,
            Manager: false,
            Finance: false,
            Employee: false,
          },
        },
      ],
    },

    {
      category: "Payroll",
      items: [
        {
          name: "Manage",
          roles: {
            "Super Admin": true,
            "HR Manager": false,
            Manager: false,
            Finance: true,
            Employee: false,
          },
        },
        {
          name: "View",
          roles: {
            "Super Admin": true,
            "HR Manager": false,
            Manager: false,
            Finance: true,
            Employee: false,
          },
        },
        {
          name: "Run",
          roles: {
            "Super Admin": true,
            "HR Manager": false,
            Manager: false,
            Finance: true,
            Employee: false,
          },
        },
      ],
    },

    {
      category: "Reports",
      items: [
        {
          name: "View",
          roles: {
            "Super Admin": true,
            "HR Manager": true,
            Manager: true,
            Finance: true,
            Employee: false,
          },
        },
        {
          name: "Export",
          roles: {
            "Super Admin": true,
            "HR Manager": true,
            Manager: false,
            Finance: true,
            Employee: false,
          },
        },
      ],
    },

    {
      category: "Documents",
      items: [
        {
          name: "Upload",
          roles: {
            "Super Admin": true,
            "HR Manager": true,
            Manager: false,
            Finance: false,
            Employee: false,
          },
        },
        {
          name: "Download",
          roles: {
            "Super Admin": true,
            "HR Manager": true,
            Manager: false,
            Finance: false,
            Employee: true,
          },
        },
        {
          name: "Delete",
          roles: {
            "Super Admin": true,
            "HR Manager": false,
            Manager: false,
            Finance: false,
            Employee: false,
          },
        },
      ],
    },
  ];

  const [selectedRole, setSelectedRole] =
    useState("Super Admin");

  return (
    <>
      <Sidebar />
  <div className="roles-main">
    <Header
      title="Roles & Permissions"
      breadcrumb="Roles & Permissions"
    />
      <div className="roles-container">


        <div className="role-tabs">
          {roles.map((role) => (
            <button
              key={role}
              className={`role-pill ${
                selectedRole === role ? "active" : ""
              }`}
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="permission-card">
          <div className="card-header">
            <h3>Permission Matrix</h3>
            <p>
              Configure access control for each role
            </p>
          </div>

          <table>
            <thead>
              <tr>
                <th>PERMISSION</th>

                {roles.map((role) => (
                  <th
                    key={role}
                    className={
                      selectedRole === role
                        ? "highlight-col"
                        : ""
                    }
                  >
                    {role.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {permissions.map((section) => (
                <>
                  {section.items.map(
                    (permission, index) => (
                      <tr key={permission.name}>
                        <td>
                          {index === 0 && (
                            <div className="category">
                              {section.category}
                            </div>
                          )}

                          <div>
                            {permission.name}
                          </div>
                        </td>

                        {roles.map((role) => (
                          <td
                            key={role}
                            className={
                              selectedRole === role
                                ? "highlight-cell"
                                : ""
                            }
                          >
                            <input
                              type="checkbox"
                              checked={
                                permission.roles[role]
                              }
                              readOnly
                            />
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </>
  );
}