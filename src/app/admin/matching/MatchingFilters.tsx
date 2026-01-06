"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MatchingFiltersProps {
  currentFilters: {
    minScore: string;
    type: string;
    location: string;
  };
}

export default function MatchingFilters({
  currentFilters,
}: MatchingFiltersProps) {
  const router = useRouter();
  const [minScore, setMinScore] = useState(currentFilters.minScore);
  const [type, setType] = useState(currentFilters.type);
  const [location, setLocation] = useState(currentFilters.location);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (minScore && minScore !== "") {
      params.set("minScore", minScore);
    }
    if (type && type !== "all") {
      params.set("type", type);
    }
    if (location && location.trim() !== "") {
      params.set("location", location.trim());
    }

    router.push(`/admin/matching?${params.toString()}`);
  };

  const handleReset = () => {
    setMinScore("");
    setType("all");
    setLocation("");
    router.push("/admin/matching");
  };

  return (
    <div className="bg-zfp-dark rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-zfp-text mb-4">Filtry</h3>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {/* Minimální shoda */}
        <div>
          <label className="block text-sm font-semibold text-zfp-text mb-2">
            Minimální shoda (%)
          </label>
          <select
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            className="w-full px-3 py-2 border border-zfp-border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
          >
            <option value="">Vše</option>
            <option value="40">40% a více</option>
            <option value="50">50% a více</option>
            <option value="60">60% a více</option>
            <option value="70">70% a více</option>
            <option value="80">80% a více</option>
            <option value="90">90% a více</option>
          </select>
        </div>

        {/* Typ nemovitosti */}
        <div>
          <label className="block text-sm font-semibold text-zfp-text mb-2">
            Typ nemovitosti
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-zfp-border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
          >
            <option value="all">Všechny</option>
            <option value="byt">Byt</option>
            <option value="dum">Dům</option>
            <option value="pozemek">Pozemek</option>
          </select>
        </div>

        {/* Lokalita */}
        <div>
          <label className="block text-sm font-semibold text-zfp-text mb-2">
            Lokalita
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Např. Brno, Praha..."
            className="w-full px-3 py-2 border border-zfp-border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
          />
        </div>
      </div>

      {/* Tlačítka */}
      <div className="flex gap-3">
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-brand-orange text-white font-semibold rounded-lg hover:bg-brand-orange-hover transition-colors"
        >
          Použít filtry
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 text-zfp-text font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
