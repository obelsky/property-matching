import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { findTopMatchesForListing } from "@/lib/matching";
import { generatePublicToken } from "@/lib/publicToken";

// Force dynamic rendering (API route)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Získej data z JSON
    const type = data.property_type as string;
    const layout = data.category?.[0] || null;
    const city = data.preferred_location as string;
    const priceStr = data.budget_max;
    const areaStr = data.area_min_m2;
    const contact_name = data.contact_name as string;
    const contact_email = data.contact_email as string;
    const contact_phone = data.contact_phone as string | null;

    // Validace
    if (!type || !city || !contact_email) {
      return NextResponse.json(
        { error: "Povinná pole nejsou vyplněna" },
        { status: 400 }
      );
    }

    // Fotky - zatím prázdné pole (upload přidáme později)
    const photoUrls: string[] = [];

    // Vygeneruj public token pro self-service přístup
    const publicToken = generatePublicToken();

    // Vytvoř listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .insert({
        type,
        layout: layout || null,
        city,
        district: null,
        price: priceStr ? parseFloat(priceStr.toString()) : null,
        area_m2: areaStr ? parseFloat(areaStr.toString()) : null,
        contact_name,
        contact_email,
        contact_phone: contact_phone || null,
        photos: photoUrls,
        public_token: publicToken,
        latitude: null,
        longitude: null,
        details: data, // Ulož celý formulář jako JSON
      })
      .select()
      .single();

    if (listingError || !listing) {
      console.error("Listing error:", listingError);
      return NextResponse.json(
        { error: "Chyba při ukládání nabídky" },
        { status: 500 }
      );
    }

    // Najdi všechny requests pro matching
    const { data: requests, error: requestsError } = await supabase
      .from("requests")
      .select("*");

    if (requestsError) {
      console.error("Requests error:", requestsError);
      // Pokračuj i bez matches
      return NextResponse.json({ 
        success: true,
        listingId: listing.id,
        public_token: listing.public_token 
      });
    }

    // Spočítej top 10 matches
    const matches = findTopMatchesForListing(listing, requests || [], 10);

    // Ulož matches do DB
    if (matches.length > 0) {
      const matchRecords = matches.map((match) => ({
        listing_id: listing.id,
        request_id: match.request.id,
        score: match.score,
        reasons: match.reasons,
      }));

      const { error: matchesError } = await supabase
        .from("matches")
        .insert(matchRecords);

      if (matchesError) {
        console.error("Matches error:", matchesError);
      }
    }

    return NextResponse.json({ 
      success: true,
      listingId: listing.id,
      public_token: listing.public_token 
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
