import { getCampsitesByState, getStatesWithCounts } from "@/lib/data";
import { STATE_NAMES, STATE_EMOJIS } from "@/lib/types";
import AmenityFilter from "@/components/AmenityFilter";
import { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ state: string }>;
}

export function generateStaticParams() {
  return getStatesWithCounts().map(({ state }) => ({
    state: state.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const upper = state.toUpperCase();
  const name = STATE_NAMES[upper] || upper;
  const count = getCampsitesByState(upper).length;
  return {
    title: `${count} Campsites in ${name}`,
    description: `Browse ${count} campsites and caravan parks in ${name}, Australia. Filter by amenities, find free camps, powered sites, and more.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const upper = state.toUpperCase();
  const name = STATE_NAMES[upper] || upper;
  const emoji = STATE_EMOJIS[upper] || "📍";
  const sites = getCampsitesByState(upper);

  const free = sites.filter((s) => s.fee === "no").length;
  const caravan = sites.filter((s) => s.type === "caravan_site").length;
  const camp = sites.length - caravan;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/states">States</Link></li>
          <li>{name}</li>
        </ul>
      </div>

      {/* State hero */}
      <div className="bg-gradient-to-r from-green-900/80 to-green-700/80 rounded-xl p-6 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">{emoji} Campsites in {name}</h1>
        <div className="flex flex-wrap gap-6 text-sm opacity-90 mt-3">
          <span>⛺ {camp.toLocaleString()} campsites</span>
          <span>🚐 {caravan.toLocaleString()} caravan parks</span>
          {free > 0 && <span>🆓 {free.toLocaleString()} free</span>}
        </div>
      </div>

      <AmenityFilter sites={sites} />
    </div>
  );
}
