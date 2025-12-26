import { supabase } from "@/lib/supabase";
import { verifyRequestToken } from "@/lib/publicToken";
import Link from "next/link";
import PublicUpdateForm from "@/components/PublicUpdateForm";

// Force dynamic rendering (depends on DB + token)
export const dynamic = 'force-dynamic';

async function getRequestData(id: string, token: string) {
  // Ověř token
  const isValid = await verifyRequestToken(id, token);
  if (!isValid) return null;

  // Načti poptávku
  const { data: request } = await supabase
    .from("requests")
    .select("*, agent:agents(name)")
    .eq("id", id)
    .single();

  if (!request) return null;

  // Načti top 3 shody (nabídky)
  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      listing:listings(id, type, layout, city, district, price, area_m2)
    `)
    .eq("request_id", id)
    .order("score", { ascending: false })
    .limit(3);

  return { request, matches: matches || [] };
}

// Helper pro překlad časového horizontu
function formatTimeframe(value: string): string {
  const timeframeLabels: Record<string, string> = {
    'asap': 'Co nejdříve',
    '3months': 'Do 3 měsíců',
    '6months': 'Do 6 měsíců',
    '1year': 'Do 1 roku',
    'flexible': 'Nemám časový limit',
  };
  return timeframeLabels[value] || value;
}

export default async function MojePoptavkaPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token?: string };
}) {
  if (!searchParams.token) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Chybí autorizační token</h1>
      </div>
    );
  }

  const data = await getRequestData(params.id, searchParams.token);

  if (!data) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Neplatný odkaz</h1>
        <p className="text-gray-600 mt-4">
          Tento odkaz není platný nebo vypršel.
        </p>
      </div>
    );
  }

  const { request, matches } = data;

  const propertyTypeLabels = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
  };

  const statusLabels = {
    new: "Nová",
    active: "Aktivní",
    paused: "Pozastavená",
    resolved: "Vyřešená",
    archived: "Archivovaná",
  };

  return (
    <div className="bg-zfp-bg-light py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
            Vaše poptávka
          </h1>
          <p className="text-gray-600">
            Zde můžete sledovat stav vaší poptávky a nalezené shody
          </p>
        </div>

        {/* Váš záznam */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-heading font-bold text-zfp-text mb-4">
            {/* Typ nemovitosti */}
            {request.type === "byt" && request.layout_min && (
              <>
                {propertyTypeLabels[request.type as keyof typeof propertyTypeLabels]}{" "}
                {request.layout_min}+
              </>
            )}
            {request.type === "dum" && (
              <>
                {propertyTypeLabels[request.type as keyof typeof propertyTypeLabels]}
                {request.layout_min && ` ${request.layout_min}`}
              </>
            )}
            {request.type !== "byt" && request.type !== "dum" && (
              propertyTypeLabels[request.type as keyof typeof propertyTypeLabels]
            )}
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-600">Lokalita:</span>
              <span className="ml-2 font-semibold">{request.city}</span>
              {request.district && (
                <span className="text-gray-500"> ({request.district})</span>
              )}
            </div>
            {request.budget_max && (
              <div>
                <span className="text-gray-600">Max. rozpočet:</span>
                <span className="ml-2 font-semibold">
                  {request.budget_max.toLocaleString("cs-CZ")} Kč
                </span>
              </div>
            )}
            {request.area_min_m2 && (
              <div>
                <span className="text-gray-600">Min. plocha:</span>
                <span className="ml-2 font-semibold">{request.area_min_m2} m²</span>
              </div>
            )}
          </div>

          {/* Detailní informace z formuláře */}
          {request.details && typeof request.details === 'object' && Object.keys(request.details).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Vaše preference:</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                {/* Kategorie */}
                {(request.details as any).category && Array.isArray((request.details as any).category) && (request.details as any).category.length > 0 && (
                  <div>
                    <span className="text-gray-600">Dispozice:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(request.details as any).category.map((cat: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Floor preference */}
                {(request.details as any).floor_preference && Array.isArray((request.details as any).floor_preference) && (request.details as any).floor_preference.length > 0 && (
                  <div>
                    <span className="text-gray-600">Patro:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(request.details as any).floor_preference.map((floor: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                          {floor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred state */}
                {(request.details as any).preferred_state && Array.isArray((request.details as any).preferred_state) && (request.details as any).preferred_state.length > 0 && (
                  <div>
                    <span className="text-gray-600">Stav:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(request.details as any).preferred_state.map((state: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred construction */}
                {(request.details as any).preferred_construction && Array.isArray((request.details as any).preferred_construction) && (request.details as any).preferred_construction.length > 0 && (
                  <div>
                    <span className="text-gray-600">Konstrukce:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(request.details as any).preferred_construction.map((constr: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                          {constr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred comfort */}
                {(request.details as any).preferred_comfort && Array.isArray((request.details as any).preferred_comfort) && (request.details as any).preferred_comfort.length > 0 && (
                  <div>
                    <span className="text-gray-600">Vybavení:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(request.details as any).preferred_comfort.map((comfort: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-xs">
                          {comfort}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Financing methods */}
                {(request.details as any).financing_methods && Array.isArray((request.details as any).financing_methods) && (request.details as any).financing_methods.length > 0 && (
                  <div>
                    <span className="text-gray-600">Financování:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(request.details as any).financing_methods.map((method: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeframe */}
                {(request.details as any).timeframe && (
                  <div>
                    <span className="text-gray-600">Časový horizont:</span>
                    <p className="mt-1 text-gray-900">{formatTimeframe((request.details as any).timeframe)}</p>
                  </div>
                )}
              </div>

              {/* Note */}
              {(request.details as any).note && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-gray-600 text-sm">Poznámka:</span>
                  <p className="mt-1 text-gray-900 text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">
                    {(request.details as any).note}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Status */}
          <div className="mt-4 p-4 bg-zfp-bg-light rounded-lg">
            <div className="text-sm">
              <span className="font-semibold">Stav:</span>
              <span className="ml-2">
                {statusLabels[request.status as keyof typeof statusLabels]}
              </span>
            </div>
            <div className="text-sm mt-2 text-gray-600">
              {request.agent
                ? `Aktuálně řeší makléř ${request.agent.name}`
                : "Zatím čeká na přiřazení"}
            </div>
          </div>
        </div>

        {/* Nalezené shody */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-heading font-bold text-zfp-text mb-4">
            Našli jsme {matches.length} možných protějšků
          </h2>

          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match: any) => (
                <div key={match.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">
                        {
                          propertyTypeLabels[
                            match.listing?.type as keyof typeof propertyTypeLabels
                          ]
                        }
                        {match.listing?.layout && ` ${match.listing.layout}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {match.listing?.city}
                        {match.listing?.district &&
                          `, ${match.listing.district}`}
                      </p>
                    </div>
                    <div className="bg-brand-orange text-white px-3 py-1 rounded-full font-semibold text-sm">
                      {match.score}% shoda
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                    {match.listing?.price && (
                      <div>
                        Cena: {match.listing.price.toLocaleString("cs-CZ")} Kč
                      </div>
                    )}
                    {match.listing?.area_m2 && (
                      <div>Plocha: {match.listing.area_m2} m²</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Zatím jsme nenašli žádné vhodné nabídky.
            </p>
          )}
        </div>

        {/* Formulář pro upřesnění */}
        <PublicUpdateForm
          type="request"
          id={params.id}
          token={searchParams.token}
          currentData={{
            budget: request.budget_max,
            area: request.area_min_m2,
            location: request.district || "",
          }}
        />

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Tento odkaz je soukromý. Nesdílejte ho s nikým dalším.</p>
          <Link
            href="/"
            className="text-brand-orange hover:underline mt-2 inline-block"
          >
            ← Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </div>
  );
}
