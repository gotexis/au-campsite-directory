import { getCampsiteBySlug, getAllCampsites, getCampsitesByState } from "@/lib/data";
import { STATE_NAMES, Campsite } from "@/lib/types";
import MapView from "@/components/MapView";
import CampsiteCard from "@/components/CampsiteCard";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCampsites().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = getCampsiteBySlug(slug);
  if (!site) return { title: "Not Found" };
  const stateName = STATE_NAMES[site.state] || site.state;
  const typeLabel = site.type === "caravan_site" ? "Caravan Park" : "Campsite";
  const amenities = [
    site.toilets === "yes" && "Toilets",
    site.showers === "yes" && "Showers",
    site.power === "yes" && "Power",
    site.water === "yes" && "Water",
    site.pets === "yes" && "Pet-friendly",
  ].filter(Boolean);
  return {
    title: `${site.name} — ${typeLabel} in ${stateName}`,
    description: `${site.name} is a ${typeLabel.toLowerCase()} in ${stateName}, Australia.${amenities.length ? ` Amenities: ${amenities.join(", ")}.` : ""} View on map, get directions, and find nearby campsites.`,
    openGraph: {
      title: `${site.name} — ${typeLabel} in ${stateName}`,
      description: `Explore ${site.name} ${typeLabel.toLowerCase()} in ${stateName}. Free campsite directory with map view.`,
    },
  };
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getNearby(site: Campsite, limit = 6): (Campsite & { distance: number })[] {
  const stateSites = getCampsitesByState(site.state);
  return stateSites
    .filter((s) => s.slug !== site.slug)
    .map((s) => ({ ...s, distance: haversine(site.lat, site.lon, s.lat, s.lon) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

function Info({ label, value, icon }: { label: string; value: string; icon?: string }) {
  if (!value || value === "") return null;
  return (
    <div className="flex justify-between py-2.5 border-b border-base-300 last:border-0">
      <span className="font-medium flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <span className="text-base-content/70 text-right">{value}</span>
    </div>
  );
}

function Amenity({ icon, label, available }: { icon: string; label: string; available: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
        available ? "bg-success/10 text-success border border-success/20" : "bg-base-200 text-base-content/30"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      <span className="ml-auto text-xs font-bold">{available ? "✓" : "—"}</span>
    </div>
  );
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;
  const site = getCampsiteBySlug(slug);
  if (!site) notFound();

  const stateName = STATE_NAMES[site.state] || site.state;
  const typeLabel = site.type === "caravan_site" ? "Caravan Park" : "Campsite";
  const isFree = site.fee === "no";
  const nearby = getNearby(site);

  const markers = [
    {
      lat: site.lat,
      lng: site.lon,
      label: site.name,
      popup: `<b>${site.name}</b><br/>${typeLabel}`,
    },
  ];

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Campground",
    name: site.name,
    description: `${site.name} ${typeLabel.toLowerCase()} in ${stateName}, Australia`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.lat,
      longitude: site.lon,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: stateName,
      addressCountry: "AU",
      ...(site.addr && { streetAddress: site.addr }),
    },
    ...(site.phone && { telephone: site.phone }),
    ...(site.website && { url: site.website }),
    ...(isFree && { isAccessibleForFree: true }),
    amenityFeature: [
      site.toilets === "yes" && { "@type": "LocationFeatureSpecification", name: "Toilets", value: true },
      site.showers === "yes" && { "@type": "LocationFeatureSpecification", name: "Showers", value: true },
      site.power === "yes" && { "@type": "LocationFeatureSpecification", name: "Power hookup", value: true },
      site.water === "yes" && { "@type": "LocationFeatureSpecification", name: "Drinking water", value: true },
      site.pets === "yes" && { "@type": "LocationFeatureSpecification", name: "Pet-friendly", value: true },
    ].filter(Boolean),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLd} />

      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href={`/state/${site.state.toLowerCase()}`}>{stateName}</Link></li>
          <li>{site.name}</li>
        </ul>
      </div>

      {/* Hero header */}
      <div className="bg-gradient-to-r from-green-900/80 to-green-700/80 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{site.type === "caravan_site" ? "🚐" : "⛺"}</span>
              <h1 className="text-3xl lg:text-4xl font-bold">{site.name}</h1>
            </div>
            <p className="text-lg opacity-90">
              {typeLabel} · {stateName}
              {site.operator && <span> · Operated by {site.operator}</span>}
            </p>
          </div>
          <div className="flex gap-2">
            {isFree && <span className="badge badge-accent badge-lg font-bold">🆓 FREE</span>}
            {site.power === "yes" && <span className="badge badge-info badge-lg">⚡ Powered</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {site.description && (
            <div className="prose max-w-none">
              <p>{site.description}</p>
            </div>
          )}

          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-base-300 shadow-lg">
            <MapView markers={markers} center={[site.lat, site.lon]} zoom={13} height="400px" />
          </div>

          {/* Quick location info */}
          <div className="bg-base-200 rounded-lg p-4 text-sm text-base-content/70">
            <span className="font-medium">📍 Coordinates:</span> {site.lat.toFixed(4)}°S, {site.lon.toFixed(4)}°E
          </div>

          {/* Nearby campsites */}
          {nearby.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Nearby Campsites</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearby.map((n) => (
                  <div key={n.slug} className="relative">
                    <CampsiteCard site={n} />
                    <span className="absolute top-2 left-2 badge badge-sm badge-neutral">
                      {n.distance < 1 ? `${Math.round(n.distance * 1000)}m` : `${n.distance.toFixed(1)}km`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Amenities */}
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title text-lg">🏕️ Amenities</h2>
              <div className="grid grid-cols-1 gap-2">
                <Amenity icon="🚽" label="Toilets" available={site.toilets === "yes"} />
                <Amenity icon="🚿" label="Showers" available={site.showers === "yes"} />
                <Amenity icon="⚡" label="Power Hookup" available={site.power === "yes"} />
                <Amenity icon="💧" label="Drinking Water" available={site.water === "yes"} />
                <Amenity icon="🐕" label="Pet Friendly" available={site.pets === "yes"} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title text-lg">📋 Details</h2>
              <Info label="Fee" value={site.fee === "no" ? "Free" : site.fee === "yes" ? "Paid" : ""} icon="💰" />
              <Info label="Operator" value={site.operator} icon="🏢" />
              <Info label="Capacity" value={site.capacity} icon="👥" />
              <Info label="Address" value={site.addr} icon="📍" />
              <Info label="Phone" value={site.phone} icon="📞" />
              {site.website && (
                <div className="mt-3">
                  <a href={site.website} target="_blank" rel="noopener" className="btn btn-primary btn-sm w-full">
                    🌐 Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
              target="_blank"
              rel="noopener"
              className="btn btn-accent w-full"
            >
              📍 Get Directions
            </a>
            <a
              href={`https://www.google.com/maps/@${site.lat},${site.lon},14z`}
              target="_blank"
              rel="noopener"
              className="btn btn-outline w-full"
            >
              🗺️ View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
