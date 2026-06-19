import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", present: 88, absent: 8 },
  { month: "Feb", present: 91, absent: 5 },
  { month: "Mar", present: 85, absent: 7 },
  { month: "Apr", present: 94, absent: 2 },
  { month: "May", present: 89, absent: 8 },
  { month: "Jun", present: 95, absent: 3 },
];

export default function AttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />

        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey="present"
          stroke="#2563eb"
          strokeWidth={3}
          name="Present %"
        />

        <Line
          type="monotone"
          dataKey="absent"
          stroke="#ef4444"
          strokeWidth={3}
          name="Absent %"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}