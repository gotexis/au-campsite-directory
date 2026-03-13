import { getStatesWithCounts } from "@/lib/data";
import { STATE_NAMES, STATE_EMOJIS } from "@/lib/types";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Campsites by State",
  description: "Find campsites in every Australian state and territory.",
};

export default function StatesPage() {
  const states = getStatesWithCounts();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Campsites by State</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {states.map(({ state, count }) => (
          <Link
            key={state}
            href={`/state/${state.toLowerCase()}`}
            className="card bg-base-200 hover:bg-base-300 transition-colors shadow-lg"
          >
            <div className="card-body items-center text-center">
              <span className="text-5xl mb-2">{STATE_EMOJIS[state] || "📍"}</span>
              <h2 className="card-title">{STATE_NAMES[state] || state}</h2>
              <p className="text-2xl font-bold text-primary">{count.toLocaleString()}</p>
              <p className="text-sm text-base-content/60">campsites</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
