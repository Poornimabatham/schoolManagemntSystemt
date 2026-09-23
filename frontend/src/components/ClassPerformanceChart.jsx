import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import "../styles/Charts.css";

const data = [
  { class: "Class 9", score: 70, color: "#f97316" },
  { class: "Class 2", score: 65, color: "#06b6d4" },
  { class: "Class 3", score: 75, color: "#6366f1" },
  { class: "Class 7", score: 60, color: "#a855f7" },
  { class: "Class 5", score: 68, color: "#10b981" },
];

export default function ClassPerformanceChart() {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Class Performance</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="class" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
