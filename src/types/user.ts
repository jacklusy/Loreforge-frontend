export interface UserProfile {
  id: number;
  email: string;
  created_at: string;
}

export interface ActivityEntry {
  id: number;
  event_type: string;
  ip_address: string | null;
  created_at: string;
}
