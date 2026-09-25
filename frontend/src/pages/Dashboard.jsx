import { useEffect, useState, lazy, Suspense } from "react";
import api from "../api/axios";
import "../styles/Dashboard.css";

// Lazy-loaded components — code is fetched only when this component renders
const AttendanceChart = lazy(() => import("../components/AttendanceCharts"));
const FeeChart = lazy(() => import("../components/FeeChart"));
const ClassPerformanceChart = lazy(() => import("../components/ClassPerformanceChart"));
const RecentActivity = lazy(() => import("../components/RecentActivity"));
const UpcomingExams = lazy(() => import("../components/UpcomingExams"));
const PendingFees = lazy(() => import("../components/PendingFees"));
const SchoolCalendar = lazy(() => import("../components/SchoolCalendar"));

export default function Dashboard() {
  const [totalStudents, setTotalStudents] = useState("Loading...");
  const [totalClasses, setTotalClasses] = useState("Loading...");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const [studentResult, classResult] = await Promise.allSettled([
        api.get("/dashbaord/count"),
        api.get("/classes/count")
      ]);

      // Handle student count result
      if (studentResult.status === "fulfilled" && studentResult.value.data.success) {
        setTotalStudents(studentResult.value.data.count);
      } else {
        console.error("Failed to fetch student count:", studentResult.reason);
        setTotalStudents("Error");
      }

      // Handle class count result
      if (classResult.status === "fulfilled" && classResult.value.data.success) {
        setTotalClasses(classResult.value.data.count);
      } else {
        console.error("Failed to fetch class count:", classResult.reason);
        setTotalClasses("Error");
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: "🎓",
      bg: "linear-gradient(90deg, #3F2B96 0%, #A8C0FF 100%)"
    },
    {
      label: "Total Teachers",
      value: "84",
      icon: "👨‍🏫",
      bg: "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)"
    },
    {
      label: "Total Classes",
      value: totalClasses,
      icon: "📚",
      bg: "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)"
    },
    {
      label: "Fees Collected",
      value: "₹4,20,000",
      icon: "💰",
      bg: "linear-gradient(90deg, #FF8008 0%, #FFC837 100%)"
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {cards.map((card) => (
          <div
            className="dashboard-card"
            key={card.label}
            style={{ background: card.bg }}
          >
            <div className="card-icon" style={{ background: card.bg }}>
              {card.icon}
            </div>
            <div className="card-info">
              <span className="card-value">{card.value}</span>
              <span className="card-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <Suspense fallback={<div className="loading-box">Loading charts...</div>}>
          <AttendanceChart />
          <FeeChart />
        </Suspense>
      </div>

      <div className="charts-bottom">
        <Suspense fallback={<div className="loading-box">Loading...</div>}>
          <ClassPerformanceChart />
          <RecentActivity />
        </Suspense>
      </div>

      <div className="widgets-row">
        <Suspense fallback={<div className="loading-box">Loading widgets...</div>}>
          <UpcomingExams />
          <PendingFees />
          <SchoolCalendar />
        </Suspense>
      </div>
    </div>
  );
}