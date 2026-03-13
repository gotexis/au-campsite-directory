import { getCampsitesByState, getStatesWithCounts } from "@/lib/data";
import { STATE_NAMES } from "@/lib/types";
import CampsiteCard from "@/components/CampsiteCard";
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
  return {
    title: `Campsites in ${name}`,
    description: `Browse campsites and caravan parks in ${name}, Australia.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const upper = state.toUpperCase();
  const name = STATE_NAMES[upper] || upper;
  const sites = getCampsitesByState(upper);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/states">States</Link></li>
          <li>{name}</li>
        </ul>
      </div>
      <h1 className="text-4xl font-bold mb-2">Campsites in {name}</h1>
      <p className="text-base-content/60 mb-8">
        {sites.length.toLocaleString()} campsites and caravan parks
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.slice(0, 60).map((site) => (
          <CampsiteCard key={site.slug} site={site} />
        ))}
      </div>
      {sites.length > 60 && (
        <p className="text-center mt-8 text-base-content/60">
          Showing 60 of {sites.length.toLocaleString()} campsites. Full list coming soon.
        </p>
      )}
    </div>
  );
}
