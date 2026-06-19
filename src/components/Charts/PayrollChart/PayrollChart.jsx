import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", payroll: 2.4 },
  { month: "Feb", payroll: 2.6 },
  { month: "Mar", payroll: 2.5 },
  { month: "Apr", payroll: 2.8 },
  { month: "May", payroll: 2.7 },
  { month: "Jun", payroll: 3.1 },
];

export default function PayrollChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="payroll"
          fill="#2975f0"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}