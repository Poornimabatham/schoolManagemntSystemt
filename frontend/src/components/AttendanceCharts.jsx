import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/Charts.css";

const data = [
  { day: "Thu", value: 120 },
  { day: "Fri", value: 140 },
  { day: "Sat", value: 130 },
  { day: "Sun", value: 160 },
  { day: "Mon", value: 80 },
  { day: "Tue", value: 140 },
  { day: "Wed", value: 10 },
];

export default function AttendanceChart() {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Attendance Overview</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
