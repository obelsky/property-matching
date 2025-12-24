import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "./actions";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import DashboardFilters from "@/components/DashboardFilters";
import AlertBox from "@/components/AlertBox";

async function getAdminData(onlyUnassigned: boolean = false) {
  // Query pro listings - volitelně filtruj jen bez makléře
  let listingsQuery = supabase
    .from("listings")
    .select(`*, agent:agents(id, name)`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (onlyUnassigned) {
    listingsQuery = listingsQuery.is("agent_id", null);
  }

  const { data: listings } = await listingsQuery;

  // Query pro requests - volitelně filtruj jen bez makléře
  let requestsQuery = supabase
    .from("requests")
    .select(`*, agent:agents(id, name)`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (onlyUnassigned) {
    requestsQuery = requestsQuery.is("agent_id", null);
  }

  const { data: requests } = await requestsQuery;

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

  // METRIKY PRO ALERT BOXY
  
  // 1. Počet nabídek bez makléře
  const { count: unassignedListingsCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .is("agent_id", null);

  // 2. Počet poptávek bez shody nad 60%
  // Musíme načíst všechny poptávky a jejich top score
  const { data: allRequests } = await supabase
    .from("requests")
    .select("id");
  
  let weakRequestsCount = 0;
  if (allRequests) {
    for (const req of allRequests) {
      const { data: topMatch } = await supabase
        .from("matches")
        .select("score")
        .eq("request_id", req.id)
        .order("score", { ascending: false })
        .limit(1)
        .single();
      
      if (!topMatch || topMatch.score < 60) {
        weakRequestsCount++;
      }
    }
  }

  // 3. Nové nabídky za 24h
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);
  
  const { count: newListings24h } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneDayAgo.toISOString());

  // 4. Shody starší 3 dní (bez řešení)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const { count: oldMatches } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })
    .lt("created_at", threeDaysAgo.toISOString());

  return { 
    listings: listingsWithMatches, 
    requests: requestsWithMatches,
    alerts: {
      unassignedListings: unassignedListingsCount || 0,
      weakRequests: weakRequestsCount,
      newListings24h: newListings24h || 0,
      oldMatches: oldMatches || 0,
    }
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { unassigned?: string };
}) {
  // Kontrola autentizace
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const onlyUnassigned = searchParams.unassigned === "true";
  const { listings, requests, alerts } = await getAdminData(onlyUnassigned);

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

        {/* Navigace */}
        <AdminNav />

        {/* Filtry */}
        <DashboardFilters />

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

        {/* Alert boxy - Co hoří */}
        <div className="mb-8">
          <h2 className="text-xl font-heading font-bold text-zfp-text mb-4">
            ⚠️ Vyžaduje pozornost
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AlertBox
              count={alerts.unassignedListings}
              label="Bez makléře"
              description="Nabídky čekají na přiřazení"
              href="/admin?unassigned=true"
              color="red"
            />
            <AlertBox
              count={alerts.weakRequests}
              label="Slabé shody"
              description="Poptávky bez shody nad 60%"
              href="/admin/matching?minScore=0&attention=weak"
              color="red"
            />
            <AlertBox
              count={alerts.newListings24h}
              label="Nové za 24h"
              description="Nabídky za poslední den"
              href="/admin#new24h"
              color="red"
            />
            <AlertBox
              count={alerts.oldMatches}
              label="Staré shody"
              description="Bez řešení 3+ dní"
              href="/admin/matching?olderThanDays=3"
              color="orange"
            />
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
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Stav
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Makléř
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
                      <div className="flex items-center gap-2">
                        <span>
                          {listing.price
                            ? `${listing.price.toLocaleString("cs-CZ")} Kč`
                            : "—"}
                        </span>
                        {/* Quality badges */}
                        {!listing.price && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            chybí cena
                          </span>
                        )}
                        {!listing.area_m2 && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            chybí plocha
                          </span>
                        )}
                        {(!listing.city || listing.city.trim() === "") && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            chybí lokalita
                          </span>
                        )}
                      </div>
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
                    <td className="py-3 px-2 text-sm">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {listing.agent ? (
                        <span className="text-gray-700">{listing.agent.name}</span>
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
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Stav
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-sm">
                    Makléř
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
                      <div className="flex items-center gap-2">
                        <span>
                          {request.budget_max
                            ? `${request.budget_max.toLocaleString("cs-CZ")} Kč`
                            : "—"}
                        </span>
                        {/* Quality badges */}
                        {!request.budget_max && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            chybí rozpočet
                          </span>
                        )}
                        {!request.area_min_m2 && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            chybí plocha
                          </span>
                        )}
                        {(!request.city || request.city.trim() === "") && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            chybí lokalita
                          </span>
                        )}
                      </div>
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
                    <td className="py-3 px-2 text-sm">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {request.agent ? (
                        <span className="text-gray-700">{request.agent.name}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <Link
                        href={`/admin/requests/${request.id}`}
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
      </div>
    </div>
  );
}
