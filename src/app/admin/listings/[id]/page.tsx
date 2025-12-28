import { supabase } from "@/lib/supabase";
import { Listing, MatchWithRequest, Agent } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import ListingMetaForm from "./ListingMetaForm";

// Force dynamic rendering (depends on DB + auth)
export const dynamic = 'force-dynamic';

// Helper pro formátování důvodů shody
function formatMatchReason(key: string, value: any): string {
  switch (key) {
    case "type":
      return value ? "✓ Typ: shoda" : "✗ Typ: neshoda";
    case "city":
      return value ? "✓ Lokalita: shoda (město)" : "✗ Lokalita: mimo město";
    case "district":
      return value ? "✓ Lokalita: shoda (okres)" : "";
    case "price":
      if (value === "within_budget") return "✓ Cena: v rozpočtu";
      if (value === "slightly_over") return "⚠ Cena: mírně nad";
      if (value === "missing") return "⚠ Cena: chybí";
      return "✗ Cena: mimo rozpočet";
    case "area":
      if (value === "sufficient") return "✓ Plocha: splňuje";
      if (value === "close") return "⚠ Plocha: mírně pod";
      if (value === "missing") return "⚠ Plocha: chybí";
      return "✗ Plocha: mimo";
    case "layout":
      if (value === "match") return "✓ Dispozice: shoda";
      if (value === "close") return "⚠ Dispozice: o 1 menší";
      if (value === "n/a") return "— Dispozice: N/A";
      return "✗ Dispozice: mimo";
    default:
      return "";
  }
}

async function getListingWithMatches(id: string) {
  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!listing) return null;

  const { data: matches } = await supabase
    .from("matches")
    .select(
      `
      *,
      request:requests(*)
    `
    )
    .eq("listing_id", id)
    .order("score", { ascending: false });

  // Načti všechny agenty pro select
  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .order("name");

  return { listing, matches: matches || [], agents: agents || [] };
}

// Helper pro kontrolu chybějících dat
function getMissingFields(listing: Listing): string[] {
  const missing: string[] = [];
  if (!listing.price) missing.push("cena");
  if (!listing.area_m2) missing.push("plocha");
  if (!listing.city || listing.city.trim() === "") missing.push("lokalita");
  return missing;
}

export default async function AdminListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Kontrola autentizace
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const data = await getListingWithMatches(params.id);

  if (!data) {
    return (
      <div className="bg-zfp-bg-light py-12">
        <div className="container max-w-2xl text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-heading font-bold text-zfp-text mb-4">
              Nabídka nenalezena
            </h1>
            <Link
              href="/admin"
              className="btn-primary inline-block"
            >
              Zpět na admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { listing, matches, agents } = data;

  const propertyTypeLabels = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
  };

  const missingFields = getMissingFields(listing);

  return (
    <div className="bg-zfp-bg-light py-12">
      <div className="container max-w-5xl">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-brand-orange hover:text-brand-orange-hover"
          >
            ← Zpět na admin
          </Link>
        </div>

        {/* Upozornění na chybějící data */}
        {missingFields.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Nízká kvalita dat – shody mohou být nepřesné
                </h3>
                <p className="text-sm text-yellow-800">
                  Chybí: {missingFields.join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detail nabídky */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
                {
                  propertyTypeLabels[
                    listing.type as keyof typeof propertyTypeLabels
                  ]
                }
                {listing.layout && ` ${listing.layout}`}
              </h1>
              <p className="text-gray-600">
                {listing.city}
                {listing.district && `, ${listing.district}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">ID</p>
              <p className="text-xs text-gray-400 font-mono">{listing.id}</p>
            </div>
          </div>

          {/* Fotky */}
          {listing.photos && listing.photos.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Fotografie</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.photos.map((photo: string, idx: number) => (
                  <div key={idx} className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={photo}
                      alt={`Foto ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detaily */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Parametry</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Typ:</dt>
                  <dd className="font-semibold">
                    {
                      propertyTypeLabels[
                        listing.type as keyof typeof propertyTypeLabels
                      ]
                    }
                  </dd>
                </div>
                {listing.layout && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Dispozice:</dt>
                    <dd className="font-semibold">{listing.layout}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Lokalita:</dt>
                  <dd className="font-semibold">
                    {listing.city}
                    {listing.district && `, ${listing.district}`}
                  </dd>
                </div>
                {listing.price && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Cena:</dt>
                    <dd className="font-semibold">
                      {listing.price.toLocaleString("cs-CZ")} Kč
                    </dd>
                  </div>
                )}
                {listing.area_m2 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Plocha:</dt>
                    <dd className="font-semibold">{listing.area_m2} m²</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Kontakt</h3>
              <dl className="space-y-2">
                {listing.contact_name && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Jméno:</dt>
                    <dd className="font-semibold">{listing.contact_name}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">E-mail:</dt>
                  <dd className="font-semibold">{listing.contact_email}</dd>
                </div>
                {listing.contact_phone && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Telefon:</dt>
                    <dd className="font-semibold">{listing.contact_phone}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Vytvořeno:</dt>
                  <dd className="font-semibold">
                    {new Date(listing.created_at).toLocaleDateString("cs-CZ")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Detailní informace z formuláře */}
        {listing.details && Object.keys(listing.details).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-heading font-bold text-zfp-text mb-6">
              Detailní informace z formuláře
            </h2>

            <div className="space-y-6">
              {/* Kategorie (dispozice) */}
              {listing.details.category && listing.details.category.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Kategorie / Dispozice:</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.details.category.map((cat: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Umístění v domě (jen pro byty) */}
              {listing.type === 'byt' && listing.details.floor_preference && listing.details.floor_preference.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Umístění v domě:</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.details.floor_preference.map((floor: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {floor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stav nemovitosti */}
              {listing.details.preferred_state && listing.details.preferred_state.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Stav nemovitosti:</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.details.preferred_state.map((state: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {state}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Typ konstrukce */}
              {listing.details.preferred_construction && listing.details.preferred_construction.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Typ konstrukce:</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.details.preferred_construction.map((type: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Vybavení */}
              {listing.details.preferred_comfort && listing.details.preferred_comfort.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Vybavení:</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.details.preferred_comfort.map((feature: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Poznámka */}
              {listing.details.note && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Poznámka od klienta:</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{listing.details.note}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Poznámky od zadavatele */}
        {listing.public_note && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📝</span>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Změny od zadavatele
                </h3>
                <div className="bg-white rounded p-4 text-sm">
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {listing.public_note}
                  </pre>
                </div>
                <p className="text-xs text-yellow-800 mt-2">
                  💡 Zadavatel upřesnil údaje přes veřejný odkaz
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status a Makléř */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-heading font-bold text-zfp-text mb-6">
            Správa nabídky
          </h2>
          <div className="max-w-md">
            <ListingMetaForm
              listingId={listing.id}
              currentStatus={listing.status}
              currentAgentId={listing.agent_id}
              agents={agents}
            />
          </div>
        </div>

        {/* Matches */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-heading font-bold text-zfp-text mb-6">
            Nalezené shody ({matches.length})
          </h2>

          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match: any) => (
                <div
                  key={match.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {
                          propertyTypeLabels[
                            match.request
                              .type as keyof typeof propertyTypeLabels
                          ]
                        }
                        {match.request.layout_min &&
                          ` ${match.request.layout_min}+`}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {match.request.city}
                        {match.request.district &&
                          `, ${match.request.district}`}
                      </p>
                    </div>
                    <div className="bg-brand-orange text-white px-4 py-2 rounded-full font-semibold">
                      {match.score}%
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-4 text-sm mb-3">
                    {match.request.budget_max && (
                      <div>
                        <dt className="text-gray-500">Max. rozpočet:</dt>
                        <dd className="font-semibold">
                          {match.request.budget_max.toLocaleString("cs-CZ")} Kč
                        </dd>
                      </div>
                    )}
                    {match.request.area_min_m2 && (
                      <div>
                        <dt className="text-gray-500">Min. plocha:</dt>
                        <dd className="font-semibold">
                          {match.request.area_min_m2} m²
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-gray-500">Kontakt:</dt>
                      <dd className="font-semibold">
                        {match.request.contact_email}
                      </dd>
                    </div>
                  </dl>

                  {match.reasons && (
                    <div className="bg-zfp-bg-light rounded p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Důvody shody:
                      </p>
                      <ul className="space-y-1 text-sm">
                        {Object.entries(match.reasons)
                          .map(([key, value]) => formatMatchReason(key, value))
                          .filter((text) => text !== "")
                          .map((text, idx) => (
                            <li key={idx} className={
                              text.startsWith("✓") ? "text-green-700" :
                              text.startsWith("⚠") ? "text-orange-600" :
                              text.startsWith("✗") ? "text-red-600" :
                              "text-gray-600"
                            }>
                              {text}
                            </li>
                          ))}
                      </ul>
                      
                      {/* Technické detaily v rozbalovači */}
                      <details className="mt-4">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                          Technické detaily (JSON)
                        </summary>
                        <pre className="text-xs text-gray-700 overflow-x-auto mt-2 bg-white p-2 rounded">
                          {JSON.stringify(match.reasons, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Zatím nejsou žádné shody.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
