export interface Campsite {
  name: string;
  lat: number;
  lon: number;
  slug: string;
  type: string;
  fee: string;
  power: string;
  water: string;
  toilets: string;
  showers: string;
  pets: string;
  phone: string;
  website: string;
  addr: string;
  state: string;
  operator: string;
  capacity: string;
  description: string;
}

export const STATE_NAMES: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

export const STATE_EMOJIS: Record<string, string> = {
  NSW: "🏔️",
  VIC: "🌿",
  QLD: "☀️",
  SA: "🍷",
  WA: "🌊",
  TAS: "🌲",
  NT: "🏜️",
  ACT: "🏛️",
};
