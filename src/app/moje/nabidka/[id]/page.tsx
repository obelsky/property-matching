import { supabase } from "@/lib/supabase";
import { verifyListingToken } from "@/lib/publicToken";
import Link from "next/link";
import PublicUpdateForm from "@/components/PublicUpdateForm";

async function getListingData(id: string, token: string) {
  // Ověř token
  const isValid = await verifyListingToken(id, token);
  if (!isValid) return null;

  // Načti nabídku
  const { data: listing } = await supabase
    .from("listings")
    .select("*, agent:agents(name)")
    .eq("id", id)
    .single();

  if (!listing) return null;

  // Načti top 3 shody
  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      request:requests(id, type, layout_min, city, district, budget_max, area_min_m2)
    `)
    .eq("listing_id", id)
    .order("score", { ascending: false })
    .limit(3);

  return { listing, matches: matches || [] };
}

export default async function MojeNabidkaPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token?: string };
}) {
  if (!searchParams.token) {
    return <div className="container py-12 text-center">
      <h1 className="text-2xl font-bold text-red-600">Chybí autorizační token</h1>
    </div>;
  }

  const data = await getListingData(params.id, searchParams.token);

  if (!data) {
    return <div className="container py-12 text-center">
      <h1 className="text-2xl font-bold text-red-600">Neplatný odkaz</h1>
      <p className="text-gray-600 mt-4">Tento odkaz není platný nebo vypršel.</p>
    </div>;
  }

  const { listing, matches } = data;

  const propertyTypeLabels = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
  };

  const statusLabels = {
    new: "Nová",
    verified: "Ověřená",
    active: "Aktivní",
    reserved: "Rezervovaná",
    closed: "Uzavřená",
    archived: "Archivovaná",
  };

  return (
    <div className="bg-zfp-bg-light py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
            Vaše nabídka
          </h1>
          <p className="text-gray-600">
            Zde můžete sledovat stav vaší nabídky a nalezené shody
          </p>
        </div>

        {/* Váš záznam */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-heading font-bold text-zfp-text mb-4">
            {propertyTypeLabels[listing.type as keyof typeof propertyTypeLabels]}
            {listing.layout && ` ${listing.layout}`}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Lokalita:</span>
              <span className="ml-2 font-semibold">{listing.city}</span>
            </div>
            {listing.price && (
              <div>
                <span className="text-gray-600">Cena:</span>
                <span className="ml-2 font-semibold">{listing.price.toLocaleString("cs-CZ")} Kč</span>
              </div>
            )}
            {listing.area_m2 && (
              <div>
                <span className="text-gray-600">Plocha:</span>
                <span className="ml-2 font-semibold">{listing.area_m2} m²</span>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mt-4 p-4 bg-zfp-bg-light rounded-lg">
            <div className="text-sm">
              <span className="font-semibold">Stav:</span>
              <span className="ml-2">{statusLabels[listing.status as keyof typeof statusLabels]}</span>
            </div>
            <div className="text-sm mt-2 text-gray-600">
              {listing.agent 
                ? `Aktuálně řeší makléř ${listing.agent.name}`
                : "Zatím čeká na přiřazení"}
            </div>
          </div>
        </div>

        {/* Nalezené shody */}
        <div className="bg-white rounded-xl shadow-lg p-6">
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
                        {propertyTypeLabels[match.request?.type as keyof typeof propertyTypeLabels]}
                        {match.request?.layout_min && ` ${match.request.layout_min}+`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {match.request?.city}
                        {match.request?.district && `, ${match.request.district}`}
                      </p>
                    </div>
                    <div className="bg-brand-orange text-white px-3 py-1 rounded-full font-semibold text-sm">
                      {match.score}% shoda
                    </div>
                  </div>

                  {match.request?.budget_max && (
                    <div className="text-sm text-gray-600">
                      Max. rozpočet: {match.request.budget_max.toLocaleString("cs-CZ")} Kč
                    </div>
                  )}
                  {match.request?.area_min_m2 && (
                    <div className="text-sm text-gray-600">
                      Min. plocha: {match.request.area_min_m2} m²
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Zatím jsme nenašli žádné vhodné poptávky.
            </p>
          )}
        </div>

        {/* Formulář pro upřesnění */}
        <PublicUpdateForm
          type="listing"
          id={params.id}
          token={searchParams.token}
          currentData={{
            price: listing.price,
            area: listing.area_m2,
            location: listing.district || "",
          }}
        />

        {/* Footer info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Tento odkaz je soukromý. Nesdílejte ho s nikým dalším.</p>
          <Link href="/" className="text-brand-orange hover:underline mt-2 inline-block">
            ← Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </div>
  );
}
