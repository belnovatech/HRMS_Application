import ShiftCard from "./components/ShiftCard";
import "./Shifts.css";

export default function Shifts() {
  return (
    <div className="shifts-grid">

      <ShiftCard
        title="Morning Shift"
        time="9:00 AM - 6:00 PM"
        employees={68}
        iconClass="blue"
      />

      <ShiftCard
        title="Evening Shift"
        time="2:00 PM - 11:00 PM"
        employees={22}
        iconClass="purple"
      />

      <ShiftCard
        title="Night Shift"
        time="10:00 PM - 7:00 AM"
        employees={15}
        iconClass="orange"
      />

      <ShiftCard
        title="Flexible Shift"
        time="Any 9 hrs"
        employees={10}
        iconClass="green"
      />

    </div>
  );
}