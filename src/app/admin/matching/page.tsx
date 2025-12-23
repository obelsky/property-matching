import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import LogoutButton from "@/components/LogoutButton";
import MatchingFilters from "./MatchingFilters";

// Interface pro match s oběma entitami
interface MatchWithBoth {
  id: string;
  score: number;
  created_at: string;
  listing: {
    id: string;
    type: string;
    layout: string | null;
    city: string;
    district: string | null;
    price: number | null;
  };
  request: {
    id: string;
    type: string;
    layout_min: string | null;
    city: string;
    district: string | null;
    budget_max: number | null;
  };
}

// Načte matchy s filtry
async function getMatches(searchParams: {
  minScore?: string;
  type?: string;
  location?: string;
}) {
  let query = supabase
    .from("matches")
    .select(
      `
      id,
      score,
      created_at,
      listing:listings!listing_id (
        id,
        type,
        layout,
        city,
        district,
        price
      ),
      request:requests!request_id (
        id,
        type,
        layout_min,
        city,
        district,
        budget_max
      )
    `
    )
    .order("score", { ascending: false });

  // Filtr: minimální score
  if (searchParams.minScore) {
    const minScore = parseInt(searchParams.minScore);
    if (!isNaN(minScore)) {
      query = query.gte("score", minScore);
    }
  }

  const { data: matches, error } = await query;

  if (error) {
    console.error("Error fetching matches:", error);
    return [];
  }

  // Client-side filtry (protože Supabase neumí JOIN filtry snadno)
  let filtered = (matches as any[]) || [];

  // Filtr: typ nemovitosti
  if (searchParams.type && searchParams.type !== "all") {
    filtered = filtered.filter(
      (m) =>
        m.listing?.type === searchParams.type ||
        m.request?.type === searchParams.type
    );
  }

  // Filtr: lokalita (substring v city nebo district)
  if (searchParams.location && searchParams.location.trim() !== "") {
    const locationLower = searchParams.location.toLowerCase().trim();
    filtered = filtered.filter((m) => {
      const listingCity = m.listing?.city?.toLowerCase() || "";
      const listingDistrict = m.listing?.district?.toLowerCase() || "";
      const requestCity = m.request?.city?.toLowerCase() || "";
      const requestDistrict = m.request?.district?.toLowerCase() || "";

      return (
        listingCity.includes(locationLower) ||
        listingDistrict.includes(locationLower) ||
        requestCity.includes(locationLower) ||
        requestDistrict.includes(locationLower)
      );
    });
  }

  return filtered as MatchWithBoth[];
}

export default async function MatchingPage({
  searchParams,
}: {
  searchParams: { minScore?: string; type?: string; location?: string };
}) {
  // Kontrola autentizace
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const matches = await getMatches(searchParams);

  const propertyTypeLabels: Record<string, string> = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
  };

  return (
    <div className="bg-zfp-bg-light py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
              Párování
            </h1>
            <p className="text-gray-600">
              Přehled všech nalezených shod mezi nabídkami a poptávkami
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Navigace */}
        <AdminNav />

        {/* Filtry */}
        <MatchingFilters
          currentFilters={{
            minScore: searchParams.minScore || "",
            type: searchParams.type || "all",
            location: searchParams.location || "",
          }}
        />

        {/* Statistika */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-gray-600">Nalezeno shod:</span>
              <span className="ml-2 text-2xl font-bold text-brand-orange">
                {matches.length}
              </span>
            </div>
            {searchParams.minScore && (
              <div className="text-sm text-gray-600">
                (min. shoda: {searchParams.minScore}%)
              </div>
            )}
          </div>
        </div>

        {/* Tabulka matchů */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Shoda
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Nabídka
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Poptávka
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Vytvořeno
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.length > 0 ? (
                  matches.map((match) => (
                    <tr key={match.id} className="border-b hover:bg-gray-50">
                      {/* Score */}
                      <td className="py-3 px-2">
                        <span className="inline-block bg-brand-orange text-white px-3 py-1 rounded-full font-semibold text-sm">
                          {match.score}%
                        </span>
                      </td>

                      {/* Nabídka */}
                      <td className="py-3 px-2">
                        {match.listing ? (
                          <div className="text-sm">
                            <div className="font-semibold text-zfp-text">
                              {propertyTypeLabels[match.listing.type] || match.listing.type}
                              {match.listing.layout && ` ${match.listing.layout}`}
                            </div>
                            <div className="text-gray-600">
                              {match.listing.city}
                              {match.listing.district &&
                                `, ${match.listing.district}`}
                            </div>
                            {match.listing.price && (
                              <div className="text-gray-500 text-xs">
                                {match.listing.price.toLocaleString("cs-CZ")} Kč
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Nabídka nenalezena
                          </span>
                        )}
                      </td>

                      {/* Poptávka */}
                      <td className="py-3 px-2">
                        {match.request ? (
                          <div className="text-sm">
                            <div className="font-semibold text-zfp-text">
                              {propertyTypeLabels[match.request.type] || match.request.type}
                              {match.request.layout_min &&
                                ` ${match.request.layout_min}+`}
                            </div>
                            <div className="text-gray-600">
                              {match.request.city}
                              {match.request.district &&
                                `, ${match.request.district}`}
                            </div>
                            {match.request.budget_max && (
                              <div className="text-gray-500 text-xs">
                                Max:{" "}
                                {match.request.budget_max.toLocaleString(
                                  "cs-CZ"
                                )}{" "}
                                Kč
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Poptávka nenalezena
                          </span>
                        )}
                      </td>

                      {/* Datum */}
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {new Date(match.created_at).toLocaleDateString(
                          "cs-CZ"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-gray-500"
                    >
                      {searchParams.minScore ||
                      searchParams.type ||
                      searchParams.location
                        ? "Žádné shody neodpovídají vybraným filtrům."
                        : "Zatím nejsou žádné shody."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
