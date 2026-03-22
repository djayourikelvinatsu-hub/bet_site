export type BookingCode = {
  id: string;
  league: string;
  fixture: string;
  market: string;
  code: string;
  bookmaker: string;
  kickoff: string;
  isPremium?: boolean;
};

export const mockFreeCodes: BookingCode[] = [
  {
    id: "1",
    league: "Premier League",
    fixture: "Arsenal vs Chelsea",
    market: "Over 2.5 goals",
    code: "8X4K2P9",
    bookmaker: "Betway",
    kickoff: "Today · 17:30 GMT",
  },
  {
    id: "2",
    league: "La Liga",
    fixture: "Real Madrid vs Valencia",
    market: "Home win & BTTS",
    code: "ZQ7M1R4",
    bookmaker: "1xBet",
    kickoff: "Today · 20:00 GMT",
  },
  {
    id: "3",
    league: "Serie A",
    fixture: "Inter vs Napoli",
    market: "Double chance 1X",
    code: "—",
    bookmaker: "Premium",
    kickoff: "Tomorrow · 19:45 GMT",
    isPremium: true,
  },
];
