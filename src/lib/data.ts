import campsitesData from "@/data/campsites.json";
import { Campsite } from "./types";

const campsites: Campsite[] = campsitesData as Campsite[];

export function getAllCampsites(): Campsite[] {
  return campsites;
}

export function getCampsitesByState(state: string): Campsite[] {
  return campsites.filter((c) => c.state === state);
}

export function getCampsiteBySlug(slug: string): Campsite | undefined {
  return campsites.find((c) => c.slug === slug);
}

export function getStatesWithCounts(): { state: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const c of campsites) {
    counts[c.state] = (counts[c.state] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAmenityStats() {
  const total = campsites.length;
  return {
    total,
    free: campsites.filter((c) => c.fee === "no").length,
    power: campsites.filter((c) => c.power === "yes").length,
    toilets: campsites.filter((c) => c.toilets === "yes").length,
    showers: campsites.filter((c) => c.showers === "yes").length,
    water: campsites.filter((c) => c.water === "yes").length,
    pets: campsites.filter((c) => c.pets === "yes").length,
  };
}
