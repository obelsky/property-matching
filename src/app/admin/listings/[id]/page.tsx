import { supabase } from "@/lib/supabase";
import { Listing, MatchWithRequest } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

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

  return { listing, matches: matches || [] };
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

  const { listing, matches } = data;

  const propertyTypeLabels = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
  };

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
                {listing.area_m2 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Plocha:</dt>
                    <dd className="font-semibold">{listing.area_m2} m²</dd>
                  </div>
                )}
                {listing.price && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Cena:</dt>
                    <dd className="font-semibold">
                      {listing.price.toLocaleString("cs-CZ")} Kč
                    </dd>
                  </div>
                )}
                {listing.zipcode && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">PSČ:</dt>
                    <dd className="font-semibold">{listing.zipcode}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Kontakt</h3>
              <dl className="space-y-2">
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
