import { getAllCampsites } from "@/lib/data";
import MapView from "@/components/MapView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campsite Map — All Australian Campsites",
  description: "Interactive map of 8,600+ campsites and caravan parks across Australia.",
};

export default function MapPage() {
  const sites = getAllCampsites();
  const markers = sites.map((s) => ({
    lat: s.lat,
    lng: s.lon,
    label: s.name,
    popup: `<b>${s.name}</b><br/>${s.type === "caravan_site" ? "Caravan Park" : "Campsite"}<br/>${s.state}`,
    href: `/site/${s.slug}`,
  }));

  return (
    <div className="h-[calc(100vh-64px)]">
      <MapView markers={markers} zoom={5} height="100%" />
    </div>
  );
}
