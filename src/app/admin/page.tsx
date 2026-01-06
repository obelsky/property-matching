import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import DashboardFilters from "@/components/DashboardFilters";

// Force dynamic rendering (depends on DB + auth)
export const dynamic = 'force-dynamic';

async function getAdminData(onlyUnassigned: boolean = false) {
  let listingsQuery = supabase
    .from("listings")
    .select(`*, agent:agents(id, name)`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (onlyUnassigned) {
    listingsQuery = listingsQuery.is("agent_id", null);
  }

  const { data: listings } = await listingsQuery;

  let requestsQuery = supabase
    .from("requests")
    .select(`*, agent:agents(id, name)`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (onlyUnassigned) {
    requestsQuery = requestsQuery.is("agent_id", null);
  }

  const { data: requests } = await requestsQuery;

  const listingsWithMatches = await Promise.all(
    (listings || []).map(async (listing) => {
      const { count } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true })
        .eq("listing_id", listing.id);

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

  const { count: unassignedListingsCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .is("agent_id", null);

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

  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);
  
  const { count: newListings24h } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneDayAgo.toISOString());

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

  const listingStatusLabels = {
    new: "Nová",
    verified: "Ověřená",
    active: "Aktivní",
    reserved: "Rezervovaná",
    closed: "Uzavřená",
    archived: "Archivovaná",
  };

  const requestStatusLabels = {
    new: "Nová",
    active: "Aktivní",
    paused: "Pozastavená",
    resolved: "Vyřešená",
    archived: "Archivovaná",
  };

  return (
    <div className="bg-zfp-darker min-h-screen py-12">
      <div className="container max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading text-zfp-text mb-2">
              Admin Dashboard
            </h1>
            <p className="text-zfp-text-muted">Přehled nabídek a poptávek</p>
          </div>
          <LogoutButton />
        </div>

        {/* Navigace */}
        <AdminNav />

        {/* Filtry */}
        <DashboardFilters />

        {/* Statistiky */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-sm font-medium text-zfp-text-muted mb-2">
              Celkem nabídek
            </h3>
            <p className="text-3xl font-bold text-brand-gold">
              {listings.length}
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-zfp-text-muted mb-2">
              Celkem poptávek
            </h3>
            <p className="text-3xl font-bold text-brand-gold">
              {requests.length}
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-zfp-text-muted mb-2">
              Bez makléře
            </h3>
            <p className="text-3xl font-bold text-warning">
              {alerts.unassignedListings}
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-zfp-text-muted mb-2">
              Nové za 24h
            </h3>
            <p className="text-3xl font-bold text-success">
              {alerts.newListings24h}
            </p>
          </div>
        </div>

        {/* Alert boxy */}
        {(alerts.unassignedListings > 0 || alerts.weakRequests > 0) && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {alerts.unassignedListings > 0 && (
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-medium text-warning">{alerts.unassignedListings} nabídek bez makléře</p>
                    <p className="text-sm text-zfp-text-muted">Přiřaďte makléře k novým nabídkám</p>
                  </div>
                </div>
              </div>
            )}
            {alerts.weakRequests > 0 && (
              <div className="bg-error/10 border border-error/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-medium text-error">{alerts.weakRequests} poptávek bez silné shody</p>
                    <p className="text-sm text-zfp-text-muted">Shoda pod 60% - potřeba více nabídek</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nabídky */}
        <div className="card-dark p-6 mb-8">
          <h2 className="text-2xl font-heading text-zfp-text mb-6">
            Poslední nabídky
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zfp-border">
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Typ</th>
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Lokalita</th>
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Cena</th>
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Kontakt</th>
                  <th className="text-center py-3 px-2 font-medium text-zfp-text-muted text-sm">Matches</th>
                  <th className="text-center py-3 px-2 font-medium text-zfp-text-muted text-sm">Top shoda</th>
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Stav</th>
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Makléř</th>
                  <th className="text-right py-3 px-2 font-medium text-zfp-text-muted text-sm">Akce</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-zfp-border hover:bg-zfp-card transition-colors">
                    <td className="py-3 px-2 text-sm text-zfp-text">
                      {propertyTypeLabels[listing.type as keyof typeof propertyTypeLabels]}
                      {listing.layout && ` ${listing.layout}`}
                    </td>
                    <td className="py-3 px-2 text-sm text-zfp-text">
                      {listing.city}
                      {listing.district && `, ${listing.district}`}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <span className="text-brand-gold font-medium">
                        {listing.price ? `${listing.price.toLocaleString("cs-CZ")} Kč` : "—"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-zfp-text-muted">{listing.contact_email}</td>
                    <td className="py-3 px-2 text-sm text-center">
                      <span className="badge badge-orange">{listing.matchCount}</span>
                    </td>
                    <td className="py-3 px-2 text-sm text-center">
                      {listing.topScore !== null ? (
                        <span className="text-brand-gold font-medium">{listing.topScore}%</span>
                      ) : (
                        <span className="text-zfp-text-subtle">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <span className="badge badge-gold">
                        {listingStatusLabels[listing.status as keyof typeof listingStatusLabels] || listing.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-zfp-text-muted">
                      {listing.agent?.name || "—"}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <Link
                        href={`/admin/listings/${listing.id}`}
                        className="text-brand-gold hover:text-brand-orange font-medium transition-colors"
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
        <div className="card-dark p-6">
          <h2 className="text-2xl font-heading text-zfp-text mb-6">
            Poslední poptávky
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zfp-border">
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Typ</th>
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Lokalita</th>
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Max. rozpočet</th>
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Kontakt</th>
                  <th className="text-center py-3 px-2 font-medium text-zfp-text-muted text-sm">Matches</th>
                  <th className="text-center py-3 px-2 font-medium text-zfp-text-muted text-sm">Top shoda</th>
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Stav</th>
                  <th className="text-left py-3 px-2 font-medium text-zfp-text-muted text-sm">Makléř</th>
                  <th className="text-right py-3 px-2 font-medium text-zfp-text-muted text-sm">Akce</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b border-zfp-border hover:bg-zfp-card transition-colors">
                    <td className="py-3 px-2 text-sm text-zfp-text">
                      {propertyTypeLabels[request.type as keyof typeof propertyTypeLabels]}
                      {request.layout_min && ` ${request.layout_min}+`}
                    </td>
                    <td className="py-3 px-2 text-sm text-zfp-text">
                      {request.city}
                      {request.district && `, ${request.district}`}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <span className="text-brand-gold font-medium">
                        {request.budget_max ? `${request.budget_max.toLocaleString("cs-CZ")} Kč` : "—"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-zfp-text-muted">{request.contact_email}</td>
                    <td className="py-3 px-2 text-sm text-center">
                      <span className="badge badge-orange">{request.matchCount}</span>
                    </td>
                    <td className="py-3 px-2 text-sm text-center">
                      {request.topScore !== null ? (
                        <span className="text-brand-gold font-medium">{request.topScore}%</span>
                      ) : (
                        <span className="text-zfp-text-subtle">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <span className="badge badge-gold">
                        {requestStatusLabels[request.status as keyof typeof requestStatusLabels] || request.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-zfp-text-muted">
                      {request.agent?.name || "—"}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <Link
                        href={`/admin/requests/${request.id}`}
                        className="text-brand-gold hover:text-brand-orange font-medium transition-colors"
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
