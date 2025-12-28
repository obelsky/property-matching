import { supabase } from "@/lib/supabase";
import { Request, MatchWithListing } from "@/lib/types";
import MatchCard from "@/components/MatchCard";
import Link from "next/link";
import CopyLink from "@/components/CopyLink";

// Force dynamic rendering (depends on DB)
export const dynamic = 'force-dynamic';

async function getRequestWithMatches(id: string) {
  // Získej request (včetně public_token)
  const { data: request, error: requestError } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single();

  if (requestError || !request) {
    return null;
  }

  // Získej top 3 matches s listing daty
  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select(
      `
      *,
      listing:listings(*)
    `
    )
    .eq("request_id", id)
    .order("score", { ascending: false })
    .limit(3);

  if (matchesError) {
    console.error("Matches error:", matchesError);
    return { request, matches: [] };
  }

  return { request, matches: matches || [] };
}

export default async function DekujemePoptavkaPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getRequestWithMatches(params.id);

  if (!data) {
    return (
      <div className="bg-zfp-bg-light py-12">
        <div className="container max-w-2xl text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-heading font-bold text-zfp-text mb-4">
              Poptávka nenalezena
            </h1>
            <Link href="/" className="btn-primary inline-block">
              Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { request, matches } = data;

  const propertyTypeLabels = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
  };

  return (
    <div className="bg-zfp-bg-light py-12">
      <div className="container max-w-5xl">
        {/* Poděkování */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
            Děkujeme za vaši poptávku!
          </h1>
          <p className="text-gray-600 mb-4">
            Vaše poptávka byla úspěšně zaregistrována. Hledáme vhodné nabídky.
          </p>
          <div className="bg-zfp-bg-light rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-700">
              <strong>Vaše poptávka:</strong>{" "}
              {propertyTypeLabels[request.type as keyof typeof propertyTypeLabels]}
              {request.layout_min && ` ${request.layout_min}+`}, {request.city}
            </p>
          </div>
        </div>

        {/* Soukromý odkaz */}
        {request.public_token && (
          <div className="mb-8">
            <CopyLink
              url={`${process.env.NEXT_PUBLIC_BASE_URL || "https://property-matching-omega.vercel.app"}/moje/poptavka/${request.id}?token=${request.public_token}`}
            />
          </div>
        )}

        {/* Financování - pokud vybrali Hypotéku nebo Kombinované */}
        {request.details?.financing_methods && 
         (request.details.financing_methods.includes("Hypotéka") || 
          request.details.financing_methods.includes("Kombinované")) && (
          <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-2xl shadow-xl p-8 mb-8 border border-purple-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  S financováním vám rádi pomůžeme
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Vidíme, že plánujete financování hypotékou. Náš hypoteční specialista pro vás během jednoho hovoru připraví nezávaznou nabídku na míru. Srovnáme podmínky napříč bankami a najdeme tu nejvýhodnější variantu.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/hypotecni-kalkulacka"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Vyzkoušet hypoteční kalkulačku
                  </a>
                  <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Zdarma a bez závazků</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matches */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-heading font-bold text-zfp-text mb-2">
            {matches.length > 0
              ? "Našli jsme potenciální nabídky"
              : "Zatím jsme nenašli přesné shody"}
          </h2>
          <p className="text-gray-600 mb-6">
            {matches.length > 0
              ? "Zde jsou nejlepší shody s nabídkami v naší databázi:"
              : "Jakmile se objeví vhodná nabídka, dáme vám vědět."}
          </p>

          {matches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match: any) => (
                <MatchCard
                  key={match.id}
                  item={match.listing}
                  score={match.score}
                  reasons={match.reasons}
                  type="listing"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <p className="text-gray-600">
                Zatím nemáme v databázi nabídky, které by odpovídaly vašim
                požadavkům.
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
