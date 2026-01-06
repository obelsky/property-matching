import { supabase } from "@/lib/supabase";
import { verifyListingToken } from "@/lib/publicToken";
import Link from "next/link";
import PublicUpdateForm from "@/components/PublicUpdateForm";
import { EditIcon } from "@/components/Icons";
import Image from "next/image";

// Force dynamic rendering (depends on DB + token)
export const dynamic = 'force-dynamic';

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
      <p className="text-zfp-text-muted mt-4">Tento odkaz není platný nebo vypršel.</p>
    </div>;
  }

  const { listing, matches } = data;

  const propertyTypeLabels: Record<string, string> = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
    komercni: "Komerční",
    ostatni: "Ostatní",
  };

  const statusLabels: Record<string, string> = {
    new: "Nová",
    verified: "Ověřená",
    active: "Aktivní",
    reserved: "Rezervovaná",
    closed: "Uzavřená",
    archived: "Archivovaná",
  };

  // Parse details from JSONB
  const details = listing.details || {};

  return (
    <div className="bg-zfp-darker py-12">
      <div className="container max-w-4xl">
        {/* Back link */}
        <Link 
          href="/admin" 
          className="inline-flex items-center text-brand-orange hover:text-brand-orange-hover mb-6"
        >
          ← Zpět na admin
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
                {propertyTypeLabels[listing.type as keyof typeof propertyTypeLabels]}
                {details.category?.[0] && ` ${details.category[0]}`}
              </h1>
              <p className="text-zfp-text-muted">{listing.city || details.preferred_location}</p>
            </div>
            <div className="text-right text-sm text-zfp-text-muted">
              <div>ID</div>
              <div className="font-mono">{listing.id}</div>
            </div>
          </div>
        </div>

        {/* Parametry */}
        <div className="bg-zfp-dark rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-heading font-bold text-zfp-text mb-4">
            Parametry
          </h2>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 text-sm mb-4">
            {/* Levý sloupec */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zfp-text-muted">Typ:</span>
                <span className="font-semibold text-right">
                  {propertyTypeLabels[listing.type]}
                </span>
              </div>
              {details.category?.[0] && (
                <div className="flex justify-between">
                  <span className="text-zfp-text-muted">Dispozice:</span>
                  <span className="font-semibold text-right">{details.category[0]}</span>
                </div>
              )}
              {details.preferred_location && (
                <div className="flex justify-between">
                  <span className="text-zfp-text-muted">Lokalita:</span>
                  <span className="font-semibold text-right">{details.preferred_location}</span>
                </div>
              )}
              {(listing.price || details.budget_max) && (
                <div className="flex justify-between">
                  <span className="text-zfp-text-muted">Cena:</span>
                  <span className="font-semibold text-right">
                    {(listing.price || details.budget_max).toLocaleString("cs-CZ")} Kč
                  </span>
                </div>
              )}
              {(listing.area_m2 || details.area_min_m2) && (
                <div className="flex justify-between">
                  <span className="text-zfp-text-muted">Plocha:</span>
                  <span className="font-semibold text-right">
                    {listing.area_m2 || details.area_min_m2} m²
                  </span>
                </div>
              )}
            </div>

            {/* Pravý sloupec - Kontakt */}
            <div className="space-y-3">
              <h3 className="font-semibold text-zfp-text mb-2">Kontakt</h3>
              {(listing.contact_name || details.contact_name) && (
                <div className="flex justify-between">
                  <span className="text-zfp-text-muted">Jméno:</span>
                  <span className="font-semibold text-right">
                    {listing.contact_name || details.contact_name}
                  </span>
                </div>
              )}
              {(listing.contact_email || details.contact_email) && (
                <div className="flex justify-between">
                  <span className="text-zfp-text-muted">E-mail:</span>
                  <span className="font-semibold text-right">
                    {listing.contact_email || details.contact_email}
                  </span>
                </div>
              )}
              {(listing.contact_phone || details.contact_phone) && (
                <div className="flex justify-between">
                  <span className="text-zfp-text-muted">Telefon:</span>
                  <span className="font-semibold text-right">
                    {listing.contact_phone || details.contact_phone}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zfp-text-muted">Vytvořeno:</span>
                <span className="font-semibold text-right">
                  {new Date(listing.created_at).toLocaleDateString("cs-CZ")}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 p-4 bg-zfp-darker rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">Stav: </span>
                <span className="text-zfp-text">
                  {statusLabels[listing.status as keyof typeof statusLabels]}
                </span>
              </div>
              {listing.agent && (
                <div className="text-sm text-zfp-text-muted">
                  Aktuálně řeší makléř {listing.agent.name}
                </div>
              )}
              {!listing.agent && (
                <div className="text-sm text-zfp-text-muted">
                  Zatím čeká na přiřazení
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fotografie */}
        {listing.photos && listing.photos.length > 0 && (
          <div className="bg-zfp-dark rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-heading font-bold text-zfp-text mb-4">
              Fotografie ({listing.photos.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listing.photos.map((photo: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={photo}
                    alt={`Fotka ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailní informace z formuláře */}
        {details && Object.keys(details).length > 0 && (
          <div className="bg-zfp-dark rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-heading font-bold text-zfp-text mb-4">
              Detailní informace z formuláře
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Kategorie */}
              {details.category && details.category.length > 0 && (
                <div>
                  <h3 className="font-semibold text-zfp-text mb-2">Kategorie:</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.category.map((cat: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Umístění v domě (jen pro byty) */}
              {listing.type === 'byt' && details.floor_preference && details.floor_preference.length > 0 && (
                <div>
                  <h3 className="font-semibold text-zfp-text mb-2">Umístění v domě:</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.floor_preference.map((floor: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {floor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stav nemovitosti */}
              {(details.property_state || details.preferred_state) && (details.property_state?.length > 0 || details.preferred_state?.length > 0) && (
                <div>
                  <h3 className="font-semibold text-zfp-text mb-2">Stav nemovitosti:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(details.property_state || details.preferred_state).map((state: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-sm">
                        {state}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Typ konstrukce */}
              {(details.construction_type || details.preferred_construction) && (details.construction_type?.length > 0 || details.preferred_construction?.length > 0) && (
                <div>
                  <h3 className="font-semibold text-zfp-text mb-2">Typ konstrukce:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(details.construction_type || details.preferred_construction).map((type: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Vybavení */}
              {(details.comfort_features || details.preferred_comfort) && (details.comfort_features?.length > 0 || details.preferred_comfort?.length > 0) && (
                <div>
                  <h3 className="font-semibold text-zfp-text mb-2">Vybavení:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(details.comfort_features || details.preferred_comfort).map((feature: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Poznámka */}
            {details.note && (
              <div className="mt-6 p-4 bg-zfp-card rounded-lg">
                <h3 className="font-semibold text-zfp-text mb-2">Poznámka od klienta:</h3>
                <p className="text-zfp-text whitespace-pre-wrap">{details.note}</p>
              </div>
            )}
          </div>
        )}

        {/* Nalezené shody */}
        <div className="bg-zfp-dark rounded-xl shadow-lg p-6 mb-6">
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
                      <p className="text-sm text-zfp-text-muted">
                        {match.request?.city}
                        {match.request?.district && `, ${match.request.district}`}
                      </p>
                    </div>
                    <div className="bg-brand-orange text-white px-3 py-1 rounded-full font-semibold text-sm">
                      {match.score}% shoda
                    </div>
                  </div>

                  {match.request?.budget_max && (
                    <div className="text-sm text-zfp-text-muted">
                      Max. rozpočet: {match.request.budget_max.toLocaleString("cs-CZ")} Kč
                    </div>
                  )}
                  {match.request?.area_min_m2 && (
                    <div className="text-sm text-zfp-text-muted">
                      Min. plocha: {match.request.area_min_m2} m²
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-zfp-text-muted py-8">
              Zatím nejsou žádné shody.
            </p>
          )}
        </div>

        {/* Upravit údaje */}
        <div className="bg-zfp-dark rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-heading font-bold text-zfp-text mb-4">
            Chcete upřesnit údaje?
          </h2>
          <p className="text-zfp-text-muted mb-4">
            Můžete doplnit nebo upřesnit informace o vaší nabídce.
          </p>
          <Link 
            href={`/moje/nabidka/${params.id}/edit?token=${searchParams.token}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <EditIcon className="w-5 h-5" />
            CHCI UPŘESNIT ÚDAJE
          </Link>
        </div>
      </div>
    </div>
  );
}
