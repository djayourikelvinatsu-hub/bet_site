export type UserRole = "user" | "admin";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  is_vip: boolean;
  vip_expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BookingSlipRow = {
  id: string;
  league: string;
  fixture: string;
  market: string;
  bookmaker: string;
  kickoff: string;
  tier: "free" | "vip";
  sort_order: number;
  created_at: string;
  updated_at: string;
};
