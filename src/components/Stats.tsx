import "./Stats.css";

const items = [
  {
    value: "85%",
    label: "Tracked win rate",
    icon: (
      <svg className="stats__icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 19V5M8 19v-6M12 19V9M16 19v-4M20 19v-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "500+",
    label: "Tips shared monthly",
    icon: (
      <svg className="stats__icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 8h12M6 12h8M6 16h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    value: "24/7",
    label: "SMS alerts",
    icon: (
      <svg className="stats__icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function Stats() {
  return (
    <section className="stats" aria-label="Highlights">
      <div className="stats__grid">
        {items.map((item) => (
          <div key={item.label} className="stats__item">
            <span className="stats__icon-wrap">{item.icon}</span>
            <span className="stats__value">{item.value}</span>
            <span className="stats__label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
