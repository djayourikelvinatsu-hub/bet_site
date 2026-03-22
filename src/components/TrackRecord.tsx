import "./TrackRecord.css";

const recentWins = [
  {
    id: 1,
    sport: "NFL",
    matchup: "Chiefs vs 49ers",
    pick: "Chiefs Moneyline (+110)",
    result: "WIN",
    date: "Feb 11, 2024",
    profit: "+1.1U",
  },
  {
    id: 2,
    sport: "NBA",
    matchup: "Lakers vs Celtics",
    pick: "Over 235.5",
    result: "WIN",
    date: "Mar 15, 2024",
    profit: "+1.0U",
  },
  {
    id: 3,
    sport: "MLB",
    matchup: "Yankees vs Red Sox",
    pick: "Yankees -1.5 (+135)",
    result: "WIN",
    date: "Apr 02, 2024",
    profit: "+1.35U",
  },
  {
    id: 4,
    sport: "NBA",
    matchup: "Nuggets vs Timberwolves",
    pick: "Nuggets 1st Half -2.5",
    result: "WIN",
    date: "May 10, 2024",
    profit: "+1.0U",
  },
  {
    id: 5,
    sport: "UFC",
    matchup: "Jones vs Miocic",
    pick: "Jones by KO/TKO (+150)",
    result: "WIN",
    date: "Nov 16, 2024",
    profit: "+1.5U",
  },
  {
    id: 6,
    sport: "NFL",
    matchup: "Ravens vs Steelers",
    pick: "Under 41",
    result: "WIN",
    date: "Dec 21, 2024",
    profit: "+1.0U",
  },
];

export function TrackRecord() {
  return (
    <section className="track-record" id="track-record">
      <div className="container">
        <div className="track-record__header">
          <h2>Recent <span className="text-gradient">Winners</span></h2>
          <p>We let our results do the talking. Here are some of our recent massive hits.</p>
        </div>

        <div className="track-record__grid">
          {recentWins.map((win) => (
            <div key={win.id} className="win-card">
              <div className="win-card__header">
                <span className="sport-badge">{win.sport}</span>
                <span className="win-date">{win.date}</span>
              </div>
              <h3 className="matchup">{win.matchup}</h3>
              <div className="pick-details">
                <span className="pick-label">Pick:</span>
                <span className="pick-value">{win.pick}</span>
              </div>
              <div className="win-card__footer">
                <div className="result-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {win.result}
                </div>
                <span className="profit">{win.profit}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="track-record__cta">
          <a href="#pricing" className="btn btn--primary">Get Today's Picks</a>
        </div>
      </div>
    </section>
  );
}
