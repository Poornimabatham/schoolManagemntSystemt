import "../styles/WidgetCards.css";

const exams = [
  { title: "Unit Test 2 — English", date: "Aug 28, 2026", daysLeft: 9 },
  { title: "Unit Test 2 — English", date: "Aug 28, 2026", daysLeft: 9 },
  { title: "Unit Test 2 — English", date: "Aug 28, 2026", daysLeft: 9 },
  { title: "Unit Test 2 — English", date: "Aug 28, 2026", daysLeft: 9 },
  { title: "Unit Test 2 — English", date: "Aug 28, 2026", daysLeft: 9 },
];

export default function UpcomingExams() {
  return (
    <div className="widget-card">
      <h3 className="widget-title">Upcoming Exams</h3>
      <div className="exam-list">
        {exams.map((exam, i) => (
          <div key={i} className="exam-item">
            <div className="exam-icon">📄</div>
            <div className="exam-info">
              <span className="exam-name">{exam.title}</span>
              <span className="exam-date">📅 {exam.date}</span>
            </div>
            <span className="exam-badge">In {exam.daysLeft} days</span>
          </div>
        ))}
      </div>
    </div>
  );
}
