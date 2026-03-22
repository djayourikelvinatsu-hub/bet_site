import { useEffect, useState } from "react";

function formatNow() {
  const now = new Date();
  const weekday = now.toLocaleDateString("en-GB", { weekday: "long" });
  const date = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return { weekday, date, time };
}

export function useLiveClock() {
  const [clock, setClock] = useState(formatNow);

  useEffect(() => {
    const id = window.setInterval(() => setClock(formatNow), 1000);
    return () => window.clearInterval(id);
  }, []);

  return clock;
}
