import "./AttendanceTable.css";

export default function AttendanceTable() {
  const employees = [
    {
      name: "Arjun Mehta",
      date: "Jun 18",
      checkIn: "09:02 AM",
      checkOut: "06:15 PM",
      hours: "9h 13m",
      status: "Present",
    },
    {
      name: "Priya Sharma",
      date: "Jun 18",
      checkIn: "08:55 AM",
      checkOut: "05:58 PM",
      hours: "9h 03m",
      status: "Present",
    },
    {
      name: "Rahul Verma",
      date: "Jun 18",
      checkIn: "09:45 AM",
      checkOut: "06:30 PM",
      hours: "8h 45m",
      status: "Late",
    },
    {
      name: "Sneha Patel",
      date: "Jun 18",
      checkIn: "--",
      checkOut: "--",
      hours: "--",
      status: "On Leave",
    },
    {
      name: "Vikram Singh",
      date: "Jun 18",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
      hours: "8h",
      status: "WFH",
    },
  ];

  return (
    <table className="attendance-table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Date</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Work Hours</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {employees.map((emp, index) => (
          <tr key={index}>
            <td>{emp.name}</td>
            <td>{emp.date}</td>
            <td>{emp.checkIn}</td>
            <td>{emp.checkOut}</td>
            <td>{emp.hours}</td>
            <td>
              <span className={`status ${emp.status.toLowerCase().replace(" ", "-")}`}>
                {emp.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}