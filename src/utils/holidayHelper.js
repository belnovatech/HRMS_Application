/**
 * Dynamic Holiday Calendar Utility
 * Generates and structures official company holidays dynamically for any year (2026, 2027, etc.)
 */

export function getOfficialHolidays(year = 2026) {
  const y = Number(year) || 2026;

  // Key dynamic dates per year
  const variableDates = {
    2025: {
      mahaShivratri: "2025-02-26",
      holi: "2025-03-14",
      goodFriday: "2025-04-18",
      eid: "2025-03-31",
      rakshaBandhan: "2025-08-09",
      janmashtami: "2025-08-16",
      ganeshChaturthi: "2025-08-27",
      dussehra: "2025-10-02",
      diwali: "2025-10-20",
    },
    2026: {
      mahaShivratri: "2026-02-15",
      holi: "2026-03-04",
      goodFriday: "2026-04-03",
      eid: "2026-03-20",
      rakshaBandhan: "2026-08-28",
      janmashtami: "2026-09-04",
      ganeshChaturthi: "2026-09-14",
      dussehra: "2026-10-20",
      diwali: "2026-11-08",
    },
    2027: {
      mahaShivratri: "2027-03-06",
      holi: "2027-03-22",
      goodFriday: "2027-03-26",
      eid: "2027-03-09",
      rakshaBandhan: "2027-08-17",
      janmashtami: "2027-08-25",
      ganeshChaturthi: "2027-09-04",
      dussehra: "2027-10-09",
      diwali: "2027-10-28",
    },
    2028: {
      mahaShivratri: "2028-02-24",
      holi: "2028-03-11",
      goodFriday: "2028-04-14",
      eid: "2028-02-27",
      rakshaBandhan: "2028-08-05",
      janmashtami: "2028-08-13",
      ganeshChaturthi: "2028-08-24",
      dussehra: "2028-09-28",
      diwali: "2028-10-17",
    }
  };

  const v = variableDates[y] || {
    mahaShivratri: `${y}-02-20`,
    holi: `${y}-03-15`,
    goodFriday: `${y}-04-05`,
    eid: `${y}-03-25`,
    rakshaBandhan: `${y}-08-20`,
    janmashtami: `${y}-08-28`,
    ganeshChaturthi: `${y}-09-10`,
    dussehra: `${y}-10-15`,
    diwali: `${y}-11-04`,
  };

  const list = [
    {
      name: "New Year's Day",
      date: `${y}-01-01`,
      type: "Optional",
      description: "First day of the new calendar year",
    },
    {
      name: "Republic Day",
      date: `${y}-01-26`,
      type: "National",
      description: "Celebration of the Constitution of India",
    },
    {
      name: "Maha Shivratri",
      date: v.mahaShivratri,
      type: "Optional",
      description: "Hindu festival celebrated annually in honor of the god Shiva",
    },
    {
      name: "Holi",
      date: v.holi,
      type: "National",
      description: "Spring festival of colours and joy",
    },
    {
      name: "Good Friday",
      date: v.goodFriday,
      type: "National",
      description: "Commemoration of the crucifixion of Jesus Christ",
    },
    {
      name: "Eid al-Fitr",
      date: v.eid,
      type: "National",
      description: "Islamic celebration marking the end of Ramadan",
    },
    {
      name: "Independence Day",
      date: `${y}-08-15`,
      type: "National",
      description: "National day commemorating the nation's independence",
    },
    {
      name: "Raksha Bandhan",
      date: v.rakshaBandhan,
      type: "Optional",
      description: "Celebration of affection and protection",
    },
    {
      name: "Ganesh Chaturthi",
      date: v.ganeshChaturthi,
      type: "National",
      description: "Celebrates the arrival of Lord Ganesha to earth",
    },
    {
      name: "Gandhi Jayanti",
      date: `${y}-10-02`,
      type: "National",
      description: "Birthday of Mahatma Gandhi",
    },
    {
      name: "Dussehra (Vijayadashami)",
      date: v.dussehra,
      type: "National",
      description: "Celebration of the victory of good over evil",
    },
    {
      name: "Diwali (Deepavali)",
      date: v.diwali,
      type: "National",
      description: "Grand festival of lights and prosperity",
    },
    {
      name: "Christmas Day",
      date: `${y}-12-25`,
      type: "National",
      description: "Celebration of the birth of Jesus Christ",
    },
  ];

  return list.map((item, idx) => {
    const d = new Date(`${item.date}T00:00:00`);
    const day = Number.isNaN(d.getTime())
      ? "Holiday"
      : d.toLocaleDateString("en-US", { weekday: "long" });
    return {
      id: `HOL-${y}-${idx + 1}`,
      ...item,
      day,
      year: y,
    };
  });
}
