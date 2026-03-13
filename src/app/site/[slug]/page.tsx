import { getCampsiteBySlug, getAllCampsites } from "@/lib/data";
import { STATE_NAMES } from "@/lib/types";
import MapView from "@/components/MapView";
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
  return {
    title: `${site.name} — ${STATE_NAMES[site.state] || site.state}`,
    description: `${site.name} campsite in ${STATE_NAMES[site.state] || site.state}. Amenities, location, and details.`,
  };
}

function Info({ label, value }: { label: string; value: string }) {
  if (!value || value === "") return null;
  return (
    <div className="flex justify-between py-2 border-b border-base-300">
      <span className="font-medium">{label}</span>
      <span className="text-base-content/70">{value}</span>
    </div>
  );
}

function Amenity({ icon, label, available }: { icon: string; label: string; available: boolean }) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${available ? "bg-success/10 text-success" : "bg-base-200 text-base-content/40"}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      <span className="ml-auto text-xs">{available ? "✓" : "—"}</span>
    </div>
  );
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;
  const site = getCampsiteBySlug(slug);
  if (!site) notFound();

  const markers = [
    {
      lat: site.lat,
      lng: site.lon,
      label: site.name,
      popup: `<b>${site.name}</b><br/>${site.type === "caravan_site" ? "Caravan Park" : "Campsite"}`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href={`/state/${site.state.toLowerCase()}`}>{STATE_NAMES[site.state]}</Link></li>
          <li>{site.name}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{site.name}</h1>
            <p className="text-lg text-base-content/60">
              {site.type === "caravan_site" ? "Caravan Park" : "Campsite"} · {STATE_NAMES[site.state] || site.state}
            </p>
          </div>

          {site.description && (
            <div className="prose">
              <p>{site.description}</p>
            </div>
          )}

          <div className="rounded-xl overflow-hidden border border-base-300">
            <MapView markers={markers} center={[site.lat, site.lon]} zoom={13} height="400px" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg">Amenities</h2>
              <div className="grid grid-cols-1 gap-2">
                <Amenity icon="🚽" label="Toilets" available={site.toilets === "yes"} />
                <Amenity icon="🚿" label="Showers" available={site.showers === "yes"} />
                <Amenity icon="⚡" label="Power" available={site.power === "yes"} />
                <Amenity icon="💧" label="Drinking Water" available={site.water === "yes"} />
                <Amenity icon="🐕" label="Pet Friendly" available={site.pets === "yes"} />
              </div>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg">Details</h2>
              <Info label="Fee" value={site.fee === "no" ? "Free" : site.fee === "yes" ? "Paid" : ""} />
              <Info label="Operator" value={site.operator} />
              <Info label="Capacity" value={site.capacity} />
              <Info label="Address" value={site.addr} />
              <Info label="Phone" value={site.phone} />
              {site.website && (
                <div className="mt-3">
                  <a href={site.website} target="_blank" rel="noopener" className="btn btn-primary btn-sm w-full">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lon}`}
              target="_blank"
              rel="noopener"
              className="btn btn-accent w-full"
            >
              📍 Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
