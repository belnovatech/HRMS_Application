import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  {
    month: "Jan",
    casual: 12,
    sick: 20,
    earned: 25,
  },
  {
    month: "Feb",
    casual: 15,
    sick: 21,
    earned: 28,
  },
  {
    month: "Mar",
    casual: 10,
    sick: 21,
    earned: 25,
  },
  {
    month: "Apr",
    casual: 8,
    sick: 13,
    earned: 22,
  },
  {
    month: "May",
    casual: 13,
    sick: 20,
    earned: 26,
  },
  {
    month: "Jun",
    casual: 11,
    sick: 15,
    earned: 23,
  },
];

export default function LeaveChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="casual"
          stroke="#2975f0"
          fill="#2975f033"
        />

        <Area
          type="monotone"
          dataKey="sick"
          stroke="#ff4d4f"
          fill="#ff4d4f22"
        />

        <Area
          type="monotone"
          dataKey="earned"
          stroke="#52c41a"
          fill="#52c41a22"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}