export interface LineupArtist {
  name: string;
  time: string;
  role: "headliner" | "support" | "opening";
}

export interface Event {
  slug: string;
  title: string;
  artist: string;
  date: string;           // ISO 8601
  doors: string;          // "22:00"
  showTime: string;       // "23:30"
  venue: string;
  genre: string[];
  description: string;
  price: number | null;   // null = libre
  capacity: number;
  isSoldOut: boolean;
  imageUrl: string;
  lineup: LineupArtist[];
  allowsRegistration?: boolean;
}

export interface Registration {
  name: string;
  email: string;
  slug: string;
  registeredAt: string;   // ISO 8601
}

export type VoteOption = "yes" | "maybe" | "no";

export interface VoteCount {
  yes: number;
  maybe: number;
  no: number;
}
