import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import "../styles/Charts.css";

const data = [
  { month: "Mar", collected: 300000, pending: 0 },
  { month: "Apr", collected: 550000, pending: 0 },
  { month: "May", collected: 200000, pending: 0 },
  { month: "Jun", collected: 400000, pending: 0 },
  { month: "Jul", collected: 500000, pending: 0 },
  { month: "Aug", collected: 0, pending: 950000 },
];

export default function FeeChart() {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Fee Collection</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="collected" fill="#f97316" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pending" fill="#38bdf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
