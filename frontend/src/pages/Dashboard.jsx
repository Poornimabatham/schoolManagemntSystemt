import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Dashboard.css";
import AttendanceChart from "../components/AttendanceCharts";
import FeeChart from "../components/FeeChart";
import ClassPerformanceChart from "../components/ClassPerformanceChart";
import RecentActivity from "../components/RecentActivity";
import UpcomingExams from "../components/UpcomingExams";
import PendingFees from "../components/PendingFees";
import SchoolCalendar from "../components/SchoolCalendar";

export default function Dashboard() {
  const [totalStudents, setTotalStudents] = useState("Loading...");

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await api.get("http://localhost:5000/api/dashbaord/count");
        if (response.data.success) {
          setTotalStudents(response.data.count);
        } else {
          setTotalStudents(0);
        }
      } catch (error) {
        console.error("Failed to fetch student count:", error);
        setTotalStudents("Error");
      }
    };

    fetchStudentCount();
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
      value: "32",
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
          <div className="dashboard-card" key={card.label} style={{ background: card.bg }}>
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
        <AttendanceChart />
        <FeeChart />
      </div>

      <div className="charts-bottom">
        <ClassPerformanceChart />
        <RecentActivity />
      </div>

      <div className="widgets-row">
        <UpcomingExams />
        <PendingFees />
        <SchoolCalendar />
      </div>
    </div>
  );
}