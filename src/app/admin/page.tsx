import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "./actions";
import LogoutButton from "@/components/LogoutButton";

async function getAdminData() {
  // Získej poslední listings
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  // Získej poslední requests
  const { data: requests } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  // Spočítej celkové počty matches a najdi top score
  const listingsWithMatches = await Promise.all(
    (listings || []).map(async (listing) => {
      const { count } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true })
        .eq("listing_id", listing.id);

      // Získej nejvyšší score
      const { data: topMatch } = await supabase
        .from("matches")
        .select("score")
        .eq("listing_id", listing.id)
        .order("score", { ascending: false })
        .limit(1)
        .single();

      return { 
        ...listing, 
        matchCount: count || 0,
        topScore: topMatch?.score || null
      };
    })
  );

  const requestsWithMatches = await Promise.all(
    (requests || []).map(async (request) => {
      const { count } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true })
        .eq("request_id", request.id);

      // Získej nejvyšší score
      const { data: topMatch } = await supabase
        .from("matches")
        .select("score")
        .eq("request_id", request.id)
        .order("score", { ascending: false })
        .limit(1)
        .single();

      return { 
        ...request, 
        matchCount: count || 0,
        topScore: topMatch?.score || null
      };
    })
  );

  return { listings: listingsWithMatches, requests: requestsWithMatches };
}

export default async function AdminPage() {
  // Kontrola autentizace
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const { listings, requests } = await getAdminData();

  const propertyTypeLabels = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
  };

  return (
    <div className="bg-zfp-bg-light py-12">
      <div className="container max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Přehled nabídek a poptávek</p>
          </div>
          <LogoutButton />
        </div>

        {/* Statistiky */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Celkem nabídek
            </h3>
            <p className="text-3xl font-bold text-brand-orange">
              {listings.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Celkem poptávek
            </h3>
            <p className="text-3xl font-bold text-brand-orange">
              {requests.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Celkem matchů
            </h3>
            <p className="text-3xl font-bold text-brand-orange">
              {listings.reduce((sum, l) => sum + l.matchCount, 0)}
            </p>
          </div>
        </div>

        {/* Nabídky */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-heading font-bold text-zfp-text mb-4">
            Poslední nabídky
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Typ
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Lokalita
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Cena
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Kontakt
                  </th>
                  <th className="text-center py-3 px-2 font-semibold text-sm">
                    Matches
                  </th>
                  <th className="text-center py-3 px-2 font-semibold text-sm">
                    Nejlepší shoda
                  </th>
                  <th className="text-right py-3 px-2 font-semibold text-sm">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm">
                      {
                        propertyTypeLabels[
                          listing.type as keyof typeof propertyTypeLabels
                        ]
                      }
                      {listing.layout && ` ${listing.layout}`}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {listing.city}
                      {listing.district && `, ${listing.district}`}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {listing.price
                        ? `${listing.price.toLocaleString("cs-CZ")} Kč`
                        : "—"}
                    </td>
                    <td className="py-3 px-2 text-sm">{listing.contact_email}</td>
                    <td className="py-3 px-2 text-sm text-center">
                      <span className="bg-brand-orange text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {listing.matchCount}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-center">
                      {listing.topScore !== null ? (
                        <span className="text-brand-orange font-semibold">
                          {listing.topScore}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <Link
                        href={`/admin/listings/${listing.id}`}
                        className="text-brand-orange hover:text-brand-orange-hover font-semibold"
                      >
                        Detail →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Poptávky */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-heading font-bold text-zfp-text mb-4">
            Poslední poptávky
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Typ
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Lokalita
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Max. rozpočet
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Kontakt
                  </th>
                  <th className="text-center py-3 px-2 font-semibold text-sm">
                    Matches
                  </th>
                  <th className="text-center py-3 px-2 font-semibold text-sm">
                    Nejlepší shoda
                  </th>
                  <th className="text-right py-3 px-2 font-semibold text-sm">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm">
                      {
                        propertyTypeLabels[
                          request.type as keyof typeof propertyTypeLabels
                        ]
                      }
                      {request.layout_min && ` ${request.layout_min}+`}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {request.city}
                      {request.district && `, ${request.district}`}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {request.budget_max
                        ? `${request.budget_max.toLocaleString("cs-CZ")} Kč`
                        : "—"}
                    </td>
                    <td className="py-3 px-2 text-sm">{request.contact_email}</td>
                    <td className="py-3 px-2 text-sm text-center">
                      <span className="bg-brand-orange text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {request.matchCount}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-center">
                      {request.topScore !== null ? (
                        <span className="text-brand-orange font-semibold">
                          {request.topScore}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <span className="text-gray-400 text-xs">TODO</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
