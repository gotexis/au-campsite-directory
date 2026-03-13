import { Campsite } from "@/lib/types";
import Link from "next/link";

function AmenityBadge({ label, active }: { label: string; active: boolean }) {
  if (!active) return null;
  return (
    <span className="badge badge-sm badge-outline gap-1">{label}</span>
  );
}

export default function CampsiteCard({ site }: { site: Campsite }) {
  return (
    <Link
      href={`/site/${site.slug}`}
      className="card bg-base-100 shadow-md hover:shadow-xl transition-all border border-base-300 hover:border-primary"
    >
      <div className="card-body p-4">
        <h3 className="card-title text-base">{site.name}</h3>
        <p className="text-sm text-base-content/60">
          {site.state} · {site.type === "caravan_site" ? "Caravan Park" : "Campsite"}
          {site.operator && ` · ${site.operator}`}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          <AmenityBadge label="🚿 Showers" active={site.showers === "yes"} />
          <AmenityBadge label="🚽 Toilets" active={site.toilets === "yes"} />
          <AmenityBadge label="⚡ Power" active={site.power === "yes"} />
          <AmenityBadge label="💧 Water" active={site.water === "yes"} />
          <AmenityBadge label="🐕 Pets" active={site.pets === "yes"} />
          <AmenityBadge label="🆓 Free" active={site.fee === "no"} />
        </div>
      </div>
    </Link>
  );
}
