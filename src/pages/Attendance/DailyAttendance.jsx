import EmptyState from "./components/EmptyState";
import "./DailyAttendance.css";

export default function DailyAttendance() {
  return (
    <div className="daily-page">
      <EmptyState
        title="Daily Attendance View"
        subtitle="Detailed attendance data and filters will appear here"
      />
    </div>
  );
}