import "./Stats.css";

const items = [
  { value: "85%", label: "Tracked win rate" },
  { value: "500+", label: "Tips shared monthly" },
  { value: "24/7", label: "SMS alerts" },
];

export function Stats() {
  return (
    <section className="stats" aria-label="Highlights">
      <div className="stats__grid">
        {items.map((item) => (
          <div key={item.label} className="stats__item">
            <span className="stats__value">{item.value}</span>
            <span className="stats__label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
