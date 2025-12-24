import { supabase } from "@/lib/supabase";
import { Request, Agent } from "@/lib/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import RequestMetaForm from "./RequestMetaForm";

// Helper pro formátování důvodů shody (stejný jako u nabídky)
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

async function getRequestWithMatches(id: string) {
  const { data: request } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single();

  if (!request) return null;

  const { data: matches } = await supabase
    .from("matches")
    .select(
      `
      *,
      listing:listings(*)
    `
    )
    .eq("request_id", id)
    .order("score", { ascending: false });

  // Načti všechny agenty pro select
  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .order("name");

  return { request, matches: matches || [], agents: agents || [] };
}

// Helper pro kontrolu chybějících dat
function getMissingFields(request: Request): string[] {
  const missing: string[] = [];
  if (!request.budget_max) missing.push("max. rozpočet");
  if (!request.area_min_m2) missing.push("minimální plocha");
  if (!request.city || request.city.trim() === "") missing.push("lokalita");
  return missing;
}

export default async function AdminRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Kontrola autentizace
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const data = await getRequestWithMatches(params.id);

  if (!data) {
    return (
      <div className="bg-zfp-bg-light py-12">
        <div className="container max-w-2xl text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-heading font-bold text-zfp-text mb-4">
              Poptávka nenalezena
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

  const { request, matches, agents } = data;

  const propertyTypeLabels = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
  };

  const missingFields = getMissingFields(request);

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

        {/* Detail poptávky */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
                {
                  propertyTypeLabels[
                    request.type as keyof typeof propertyTypeLabels
                  ]
                }
                {request.layout_min && ` ${request.layout_min}+`}
              </h1>
              <p className="text-gray-600">
                {request.city}
                {request.district && `, ${request.district}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">ID</p>
              <p className="text-xs text-gray-400 font-mono">{request.id}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Parametry</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Typ:</dt>
                  <dd className="font-semibold">
                    {
                      propertyTypeLabels[
                        request.type as keyof typeof propertyTypeLabels
                      ]
                    }
                  </dd>
                </div>
                {request.layout_min && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Min. dispozice:</dt>
                    <dd className="font-semibold">{request.layout_min}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Lokalita:</dt>
                  <dd className="font-semibold">
                    {request.city}
                    {request.district && ` (${request.district})`}
                  </dd>
                </div>
                {request.budget_max && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Max. rozpočet:</dt>
                    <dd className="font-semibold">
                      {request.budget_max.toLocaleString("cs-CZ")} Kč
                    </dd>
                  </div>
                )}
                {request.area_min_m2 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Min. plocha:</dt>
                    <dd className="font-semibold">{request.area_min_m2} m²</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Kontakt</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">E-mail:</dt>
                  <dd className="font-semibold">{request.contact_email}</dd>
                </div>
                {request.contact_phone && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Telefon:</dt>
                    <dd className="font-semibold">{request.contact_phone}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Vytvořeno:</dt>
                  <dd className="font-semibold">
                    {new Date(request.created_at).toLocaleDateString("cs-CZ")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Status a Makléř */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-heading font-bold text-zfp-text mb-6">
            Správa poptávky
          </h2>
          <div className="max-w-md">
            <RequestMetaForm
              requestId={request.id}
              currentStatus={request.status}
              currentAgentId={request.agent_id}
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
                        <Link
                          href={`/admin/listings/${match.listing.id}`}
                          className="text-brand-orange hover:text-brand-orange-hover"
                        >
                          {
                            propertyTypeLabels[
                              match.listing
                                .type as keyof typeof propertyTypeLabels
                            ]
                          }
                          {match.listing.layout &&
                            ` ${match.listing.layout}`}
                        </Link>
                      </h4>
                      <p className="text-sm text-gray-600">
                        {match.listing.city}
                        {match.listing.district &&
                          `, ${match.listing.district}`}
                      </p>
                    </div>
                    <div className="bg-brand-orange text-white px-4 py-2 rounded-full font-semibold">
                      {match.score}%
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-4 text-sm mb-3">
                    {match.listing.price && (
                      <div>
                        <dt className="text-gray-500">Cena:</dt>
                        <dd className="font-semibold">
                          {match.listing.price.toLocaleString("cs-CZ")} Kč
                        </dd>
                      </div>
                    )}
                    {match.listing.area_m2 && (
                      <div>
                        <dt className="text-gray-500">Plocha:</dt>
                        <dd className="font-semibold">
                          {match.listing.area_m2} m²
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-gray-500">Kontakt:</dt>
                      <dd className="font-semibold">
                        {match.listing.contact_email}
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
