import { getAllCampsites, getStatesWithCounts, getAmenityStats } from "@/lib/data";
import { STATE_NAMES, STATE_EMOJIS } from "@/lib/types";
import CampsiteCard from "@/components/CampsiteCard";
import Link from "next/link";

export default function Home() {
  const stats = getAmenityStats();
  const states = getStatesWithCounts();
  const featured = getAllCampsites().filter((c) => c.toilets === "yes" && c.showers === "yes").slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="hero min-h-[45vh] bg-gradient-to-br from-green-900 to-green-700 text-white">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">
              🏕️ Find Your Perfect Campsite
            </h1>
            <p className="text-lg opacity-90 mb-6">
              {stats.total.toLocaleString()} campsites and caravan parks across
              Australia. Free camps, powered sites, amenities — all in one place.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/map" className="btn btn-lg btn-accent">
                🗺️ View Map
              </Link>
              <Link href="/states" className="btn btn-lg btn-outline btn-accent">
                Browse by State
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Stats */}
        <section className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-200">
          <div className="stat">
            <div className="stat-title">Total Campsites</div>
            <div className="stat-value text-primary">{stats.total.toLocaleString()}</div>
            <div className="stat-desc">From OpenStreetMap</div>
          </div>
          <div className="stat">
            <div className="stat-title">Free Camping</div>
            <div className="stat-value text-accent">{stats.free.toLocaleString()}</div>
            <div className="stat-desc">No fee required</div>
          </div>
          <div className="stat">
            <div className="stat-title">With Toilets</div>
            <div className="stat-value">{stats.toilets.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Powered Sites</div>
            <div className="stat-value">{stats.power.toLocaleString()}</div>
          </div>
        </section>

        {/* Browse by State */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Browse by State</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {states.map(({ state, count }) => (
              <Link
                key={state}
                href={`/state/${state.toLowerCase()}`}
                className="card bg-base-200 hover:bg-base-300 transition-colors shadow"
              >
                <div className="card-body items-center text-center p-4">
                  <span className="text-3xl">{STATE_EMOJIS[state] || "📍"}</span>
                  <h3 className="font-bold">{STATE_NAMES[state] || state}</h3>
                  <p className="text-sm text-base-content/60">
                    {count.toLocaleString()} sites
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Featured Campsites</h2>
          <p className="text-base-content/60 mb-4">
            Campsites with both showers and toilets
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((site) => (
              <CampsiteCard key={site.slug} site={site} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
