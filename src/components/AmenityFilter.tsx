"use client";

import { useState, useMemo } from "react";
import { Campsite } from "@/lib/types";
import CampsiteCard from "./CampsiteCard";

const FILTERS = [
  { key: "fee", label: "🆓 Free", match: "no" },
  { key: "toilets", label: "🚽 Toilets", match: "yes" },
  { key: "showers", label: "🚿 Showers", match: "yes" },
  { key: "power", label: "⚡ Power", match: "yes" },
  { key: "water", label: "💧 Water", match: "yes" },
  { key: "pets", label: "🐕 Pets", match: "yes" },
] as const;

const TYPE_FILTERS = [
  { key: "camp_site", label: "⛺ Campsites" },
  { key: "caravan_site", label: "🚐 Caravan Parks" },
] as const;

const PAGE_SIZE = 30;

export default function AmenityFilter({ sites }: { sites: Campsite[] }) {
  const [active, setActive] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const toggle = (key: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = sites;
    if (typeFilter) {
      result = result.filter((s) => s.type === typeFilter);
    }
    for (const f of FILTERS) {
      if (active.has(f.key)) {
        result = result.filter((s) => (s as unknown as Record<string, string>)[f.key] === f.match);
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.operator && s.operator.toLowerCase().includes(q))
      );
    }
    return result;
  }, [sites, active, typeFilter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search campsites..."
        className="input input-bordered w-full max-w-md"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t.key}
            className={`btn btn-sm ${typeFilter === t.key ? "btn-primary" : "btn-outline"}`}
            onClick={() => { setTypeFilter(typeFilter === t.key ? null : t.key); setPage(1); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Amenity filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`btn btn-sm ${active.has(f.key) ? "btn-accent" : "btn-outline"}`}
            onClick={() => toggle(f.key)}
          >
            {f.label}
          </button>
        ))}
        {active.size > 0 && (
          <button className="btn btn-sm btn-ghost" onClick={() => { setActive(new Set()); setPage(1); }}>
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-base-content/60">
        {filtered.length.toLocaleString()} campsite{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((site) => (
          <CampsiteCard key={site.slug} site={site} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="btn btn-sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            ← Prev
          </button>
          <span className="btn btn-sm btn-ghost no-animation">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
