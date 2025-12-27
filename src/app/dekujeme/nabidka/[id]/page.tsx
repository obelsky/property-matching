import { supabase } from "@/lib/supabase";
import MatchCard from "@/components/MatchCard";
import Link from "next/link";
import CopyLink from "@/components/CopyLink";
import { CheckCircleIcon, HouseIcon } from "@/components/Icons";

// Force dynamic rendering (depends on DB)
export const dynamic = 'force-dynamic';

async function getListingWithMatches(id: string) {
  // Získej listing (včetně public_token)
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (listingError || !listing) {
    return null;
  }

  // Získej top 3 matches s request daty
  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select(
      `
      *,
      request:requests(*)
    `
    )
    .eq("listing_id", id)
    .order("score", { ascending: false })
    .limit(3);

  if (matchesError) {
    console.error("Matches error:", matchesError);
    return { listing, matches: [] };
  }

  return { listing, matches: matches || [] };
}

export default async function DekujemeNabidkaPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getListingWithMatches(params.id);

  if (!data) {
    return (
      <div className="bg-zfp-bg-light py-12">
        <div className="container max-w-2xl text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-heading font-bold text-zfp-text mb-4">
              Nabídka nenalezena
            </h1>
            <Link href="/" className="btn-primary inline-block">
              Zpět na hlavní stránku
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
    komercni: "Komerční",
    ostatni: "Ostatní",
  };

  return (
    <div className="bg-zfp-bg-light py-12">
      <div className="container max-w-5xl">
        {/* Poděkování */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
            Děkujeme za vaši nabídku!
          </h1>
          <p className="text-gray-600 mb-4">
            Vaše nabídka byla úspěšně zaregistrována. Hledáme vhodné zájemce.
          </p>
          <div className="bg-zfp-bg-light rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-700">
              <strong>Vaše nabídka:</strong>{" "}
              {propertyTypeLabels[listing.type as keyof typeof propertyTypeLabels]}
              {listing.layout && ` ${listing.layout}`}, {listing.city}
            </p>
          </div>
        </div>

        {/* Soukromý odkaz */}
        {listing.public_token && (
          <div className="mb-8">
            <CopyLink
              url={`${process.env.NEXT_PUBLIC_BASE_URL || "https://property-matching-omega.vercel.app"}/moje/nabidka/${listing.id}?token=${listing.public_token}`}
              label="📎 Váš soukromý odkaz"
            />
          </div>
        )}

        {/* Matches */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-heading font-bold text-zfp-text mb-2">
            {matches.length > 0
              ? "Našli jsme potenciální zájemce"
              : "Zatím jsme nenašli přesné shody"}
          </h2>
          <p className="text-gray-600 mb-6">
            {matches.length > 0
              ? "Zde jsou nejlepší shody s poptávkami v naší databázi:"
              : "Jakmile se objeví vhodná poptávka, dáme vám vědět."}
          </p>

          {matches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match: any) => (
                <MatchCard
                  key={match.id}
                  item={match.request}
                  score={match.score}
                  reasons={match.reasons}
                  type="request"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HouseIcon className="mx-auto w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-600">
                Zatím nemáme v databázi poptávky, které by odpovídaly vaší nabídce.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/" className="btn-primary">
              Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
