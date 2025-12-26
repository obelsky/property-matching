import { NextRequest, NextResponse } from "next/server";
import { supabase, uploadPhotos } from "@/lib/supabase";
import { findTopMatchesForListing } from "@/lib/matching";
import { Request } from "@/lib/types";
import { generatePublicToken } from "@/lib/publicToken";
import { geocodeAddress } from "@/lib/geocoding";

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
    const formData = await request.formData();

    // Získej data z formuláře
    const type = formData.get("type") as string;
    const layout = formData.get("layout") as string | null;
    const city = formData.get("city") as string;
    const district = formData.get("district") as string | null;
    const zipcode = formData.get("zipcode") as string | null;
    const priceStr = formData.get("price") as string | null;
    const areaStr = formData.get("area_m2") as string | null;
    const contact_email = formData.get("contact_email") as string;
    const contact_phone = formData.get("contact_phone") as string | null;

    // Validace
    if (!type || !city || !contact_email) {
      return NextResponse.json(
        { error: "Povinná pole nejsou vyplněna" },
        { status: 400 }
      );
    }

    // Upload fotek
    const photoFiles: File[] = [];
    const formEntries = Array.from(formData.entries());
    for (const [key, value] of formEntries) {
      if (key.startsWith("photo_") && value instanceof File) {
        photoFiles.push(value);
      }
    }

    const photoUrls = photoFiles.length > 0 ? await uploadPhotos(photoFiles) : [];

    // Vygeneruj public token pro self-service přístup
    const publicToken = generatePublicToken();

    // Geocoding - DOČASNĚ VYPNUTO (network disabled)
    // TODO: Zapnout až bude network enabled
    // const geoLocation = await geocodeAddress(city, zipcode, district);
    
    // Vytvoř listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .insert({
        type,
        layout: layout || null,
        city,
        district: district || null,
        zipcode: zipcode || null,
        price: priceStr ? parseFloat(priceStr) : null,
        area_m2: areaStr ? parseFloat(areaStr) : null,
        contact_email,
        contact_phone: contact_phone || null,
        photos: photoUrls,
        public_token: publicToken,
        latitude: null, // Geocoding disabled
        longitude: null, // Geocoding disabled
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
        listingId: listing.id,
        publicToken: listing.public_token 
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
      listingId: listing.id,
      publicToken: listing.public_token 
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
