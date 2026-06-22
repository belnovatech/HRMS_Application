import EmptyState from "./components/EmptyState";
import "./Overtime.css";

export default function Overtime() {
  return (
    <div className="overtime-page">
      <EmptyState
        title="Overtime Approvals"
        subtitle="Detailed overtime approval data and filters will appear here"
      />
    </div>
  );
}