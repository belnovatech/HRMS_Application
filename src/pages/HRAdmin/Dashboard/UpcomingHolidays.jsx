import React, { useMemo } from "react";
import "./UpcomingHolidays.css";
import { useAuth } from "../../../context/AuthContext";
import { getOfficialHolidays } from "../../../utils/holidayHelper";

export default function UpcomingHolidays() {
  const { holidays = [] } = useAuth();
  const currentYear = new Date().getFullYear();

  const formattedHolidays = useMemo(() => {
    const all = holidays.length > 0 ? holidays : getOfficialHolidays(currentYear);
    const todayStr = new Date().toLocaleDateString("en-CA");
    const upcoming = all
      .filter((h) => !h.date || h.date >= todayStr)
      .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));

    const list = upcoming.length > 0 ? upcoming : all;

    return list.map((h, idx) => {
      const d = h.date ? new Date(h.date.includes("T") ? h.date : `${h.date}T00:00:00`) : null;
      return {
        id: h.id || `h-${idx}`,
        month: d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("en-US", { month: "short" }) : "Hol",
        day: d && !Number.isNaN(d.getTime()) ? d.getDate() : "—",
        name: h.name,
        weekday: h.day || (d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("en-US", { weekday: "long" }) : "Company Holiday")
      };
    });
  }, [holidays, currentYear]);

  return (
    <div className="hradmin-dashboard-holidays-card">
      <div className="hradmin-dashboard-holidays-header">
        <h3 className="hradmin-dashboard-card-title">🗓️ Upcoming Holidays</h3>
      </div>

      <div className="hradmin-dashboard-holidays-list">
        {formattedHolidays.length > 0 ? (
          formattedHolidays.slice(0, 4).map((h) => (
            <div key={h.id} className="hradmin-dashboard-holiday-item">
              <div className="hradmin-dashboard-holiday-date-col">
                <span className="hradmin-dashboard-holiday-month">{h.month}</span>
                <span className="hradmin-dashboard-holiday-day">{h.day}</span>
              </div>

              <div className="hradmin-dashboard-holiday-info">
                <h4 className="hradmin-dashboard-holiday-name">{h.name}</h4>
                <span className="hradmin-dashboard-holiday-weekday">{h.weekday}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "20px 0", color: "#64748b", textAlign: "center", fontSize: "14px" }}>
            No upcoming holidays scheduled.
          </div>
        )}
      </div>
    </div>
  );
}
