import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSave,
} from "react-icons/fi";
import "./SalaryStructure.css";

export default function SalaryStructure() {
  const [components, setComponents] = useState([
    { name: "Basic Salary", percentage: 55 },
    { name: "HRA", percentage: 20 },
    { name: "Special Allowance", percentage: 15 },
    { name: "Bonus", percentage: 10 },
  ]);

  const handleDelete = (index) => {
    const updated = [...components];
    updated.splice(index, 1);
    setComponents(updated);
  };

  const handleEdit = (index) => {
    const newName = prompt(
      "Component Name",
      components[index].name
    );

    const newPercentage = prompt(
      "Percentage",
      components[index].percentage
    );

    if (!newName || !newPercentage) return;

    const updated = [...components];

    updated[index] = {
      name: newName,
      percentage: Number(newPercentage),
    };

    setComponents(updated);
  };

  const handleAdd = () => {
    const name = prompt("Component Name");
    const percentage = prompt("Percentage");

    if (!name || !percentage) return;

    setComponents([
      ...components,
      {
        name,
        percentage: Number(percentage),
      },
    ]);
  };

  const handleSave = () => {
    alert(
      "Salary Structure Saved Successfully"
    );

    console.log(
      "Saved Components:",
      components
    );
  };

  const totalPercentage =
    components.reduce(
      (sum, item) =>
        sum + item.percentage,
      0
    );

  return (
    <div className="salary-structure-card">
      <div className="salary-header">
        <div>
          <h2>
            Salary Structure Configuration
          </h2>

          <p>
            Configure salary breakup
            components
          </p>
        </div>

        <button
          className="save-btn"
          onClick={handleSave}
        >
          <FiSave />
          Save Structure
        </button>
      </div>

      <div className="summary-card">
        <div>
          <span>Total Components</span>
          <h3>{components.length}</h3>
        </div>

        <div>
          <span>Total Allocation</span>
          <h3>
            {totalPercentage}%
          </h3>
        </div>
      </div>

      <table className="salary-table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Percentage</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {components.map(
            (item, index) => (
              <tr key={index}>
                <td>
                  <div className="component-name">
                    {item.name}
                  </div>
                </td>

                <td>
                  <span className="percentage-badge">
                    {item.percentage}%
                  </span>
                </td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(index)
                      }
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(index)
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <button
        className="add-btn"
        onClick={handleAdd}
      >
        <FiPlus />
        Add Component
      </button>
    </div>
  );
}