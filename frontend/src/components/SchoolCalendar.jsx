import { useState } from "react";
import "../styles/WidgetCards.css";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function SchoolCalendar() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDay = getFirstDay(current.year, current.month);

  const prev = () => {
    setCurrent((c) =>
      c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 }
    );
  };

  const next = () => {
    setCurrent((c) =>
      c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 }
    );
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="widget-card">
      <h3 className="widget-title">School Calendar</h3>
      <div className="cal-header">
        <button className="cal-nav" onClick={prev}>‹</button>
        <span className="cal-month">{MONTHS[current.month]} {current.year}</span>
        <button className="cal-nav" onClick={next}>›</button>
      </div>
      <div className="cal-grid">
        {DAYS.map((d) => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`cal-day ${d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear() ? "today" : ""} ${!d ? "empty" : ""}`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
