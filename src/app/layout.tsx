import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AU Campsite Directory — Free Camps, Caravan Parks & Amenities",
    template: "%s | AU Campsite Directory",
  },
  description:
    "Find 8,600+ campsites and caravan parks across Australia. Filter by amenities, view on map, completely free.",
  openGraph: {
    title: "AU Campsite Directory",
    description:
      "Find 8,600+ campsites and caravan parks across Australia. Filter by amenities, view on map, completely free.",
    url: "https://campsites.rollersoft.com.au",
    siteName: "AU Campsite Directory",
    locale: "en_AU",
    type: "website",
  },
  alternates: {
    canonical: "https://campsites.rollersoft.com.au",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="forest">
      <body className="min-h-screen bg-base-100 flex flex-col">
        <header className="navbar bg-primary text-primary-content shadow-lg">
          <div className="container mx-auto px-4 flex justify-between">
            <a className="text-xl font-bold" href="/">
              🏕️ AU Campsite Directory
            </a>
            <nav className="flex gap-4 text-sm">
              <a href="/states" className="hover:underline">
                By State
              </a>
              <a href="/map" className="hover:underline">
                Map
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="footer footer-center p-6 bg-base-200 text-base-content">
          <p>
            © {new Date().getFullYear()} AU Campsite Directory. Data from{" "}
            <a
              href="https://www.openstreetmap.org"
              className="link"
              target="_blank"
            >
              OpenStreetMap
            </a>
            . Built by{" "}
            <a href="https://rollersoft.com.au" className="link" target="_blank">
              Rollersoft
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
