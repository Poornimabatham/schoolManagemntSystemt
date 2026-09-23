import "../styles/Charts.css";

const activities = [
  { type: "student", text: "Student enrolled — Zafar (Class 9)", time: "2 days ago" },
  { type: "student", text: "Student enrolled — Areeb Chauhan...", time: "2 days ago" },
  { type: "student", text: "Student enrolled — Ayesha Farooq...", time: "2 days ago" },
  { type: "fee", text: "Fee payment received — Anas Rast...", time: "3 days ago" },
  { type: "fee", text: "Fee payment received — Marium C...", time: "3 days ago" },
];

export default function RecentActivity() {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Recent Activity</h3>
      <div className="activity-list">
        {activities.map((a, i) => (
          <div key={i} className="activity-item">
            <div className={`activity-icon ${a.type}`}>
              {a.type === "student" ? "👤" : "💳"}
            </div>
            <div className="activity-info">
              <span className="activity-text">{a.text}</span>
              <span className="activity-time">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
