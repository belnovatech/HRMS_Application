import { FiClock } from "react-icons/fi";
import "./EmptyState.css";

export default function EmptyState({
  title,
  subtitle,
}) {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        <FiClock />
      </div>

      <h2>{title}</h2>

      <p>{subtitle}</p>

    </div>
  );
}