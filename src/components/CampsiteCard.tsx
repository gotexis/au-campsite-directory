import { Campsite, STATE_NAMES } from "@/lib/types";
import Link from "next/link";

const AMENITY_ICONS: { key: keyof Campsite; icon: string; label: string; match: string }[] = [
  { key: "showers", icon: "🚿", label: "Showers", match: "yes" },
  { key: "toilets", icon: "🚽", label: "Toilets", match: "yes" },
  { key: "power", icon: "⚡", label: "Power", match: "yes" },
  { key: "water", icon: "💧", label: "Water", match: "yes" },
  { key: "pets", icon: "🐕", label: "Pets OK", match: "yes" },
];

// Deterministic color based on state
const STATE_GRADIENTS: Record<string, string> = {
  NSW: "from-blue-800/40 to-blue-600/40",
  VIC: "from-emerald-800/40 to-emerald-600/40",
  QLD: "from-amber-800/40 to-amber-600/40",
  SA: "from-purple-800/40 to-purple-600/40",
  WA: "from-cyan-800/40 to-cyan-600/40",
  TAS: "from-teal-800/40 to-teal-600/40",
  NT: "from-orange-800/40 to-orange-600/40",
  ACT: "from-indigo-800/40 to-indigo-600/40",
};

export default function CampsiteCard({ site }: { site: Campsite }) {
  const gradient = STATE_GRADIENTS[site.state] || "from-green-800/40 to-green-600/40";
  const isFree = site.fee === "no";
  const isCaravan = site.type === "caravan_site";
  const amenities = AMENITY_ICONS.filter((a) => (site as unknown as Record<string, string>)[a.key] === a.match);

  return (
    <Link
      href={`/site/${site.slug}`}
      className="card bg-base-100 shadow-md hover:shadow-xl transition-all border border-base-300 hover:border-primary group"
    >
      {/* Color header strip */}
      <div className={`bg-gradient-to-r ${gradient} h-24 rounded-t-xl flex items-center justify-center relative`}>
        <span className="text-4xl opacity-80">{isCaravan ? "🚐" : "⛺"}</span>
        {isFree && (
          <span className="absolute top-2 right-2 badge badge-accent badge-sm font-bold">FREE</span>
        )}
      </div>
      <div className="card-body p-4 pt-3">
        <h3 className="card-title text-base group-hover:text-primary transition-colors line-clamp-1">
          {site.name}
        </h3>
        <p className="text-sm text-base-content/60">
          {STATE_NAMES[site.state] || site.state} · {isCaravan ? "Caravan Park" : "Campsite"}
          {site.operator && <span className="block text-xs mt-0.5">{site.operator}</span>}
        </p>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {amenities.map((a) => (
              <span
                key={a.key}
                className="badge badge-sm bg-success/10 text-success border-success/20 gap-1"
                title={a.label}
              >
                {a.icon} {a.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
