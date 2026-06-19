import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Engineering", value: 35 },
  { name: "Sales", value: 25 },
  { name: "HR", value: 10 },
  { name: "Finance", value: 12 },
  { name: "Marketing", value: 18 },
];

const COLORS = [
  "#2975f0",
  "#6c63ff",
  "#52c41a",
  "#faad14",
  "#ff4d4f",
];

export default function DepartmentChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}