import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { findTopMatchesForRequest } from "@/lib/matching";
import { Listing } from "@/lib/types";
import { generatePublicToken } from "@/lib/publicToken";
import { geocodeAddress } from "@/lib/geocoding";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Získej data z formuláře
    const type = formData.get("type") as string;
    const layout_min = formData.get("layout_min") as string | null;
    const city = formData.get("city") as string;
    const district = formData.get("district") as string | null;
    const radiusStr = formData.get("radius_km") as string | null;
    const budgetStr = formData.get("budget_max") as string | null;
    const areaStr = formData.get("area_min_m2") as string | null;
    const contact_email = formData.get("contact_email") as string;
    const contact_phone = formData.get("contact_phone") as string | null;

    // Validace
    if (!type || !city || !contact_email) {
      return NextResponse.json(
        { error: "Povinná pole nejsou vyplněna" },
        { status: 400 }
      );
    }

    // Vygeneruj public token pro self-service přístup
    const publicToken = generatePublicToken();

    // Geocoding - získej lat/lon pro matching
    // Pro poptávky NEpotřebujeme zipcode (není v DB)
    const geoLocation = await geocodeAddress(city, null, district);

    // Vytvoř request
    const { data: req, error: reqError } = await supabase
      .from("requests")
      .insert({
        type,
        layout_min: layout_min || null,
        city,
        district: district || null,
        radius_km: radiusStr ? parseInt(radiusStr) : 20,
        budget_max: budgetStr ? parseFloat(budgetStr) : null,
        area_min_m2: areaStr ? parseFloat(areaStr) : null,
        contact_email,
        contact_phone: contact_phone || null,
        public_token: publicToken,
        latitude: geoLocation?.latitude || null,
        longitude: geoLocation?.longitude || null,
      })
      .select()
      .single();

    if (reqError || !req) {
      console.error("Request error:", reqError);
      return NextResponse.json(
        { error: "Chyba při ukládání poptávky" },
        { status: 500 }
      );
    }

    // Najdi všechny listings pro matching
    const { data: listings, error: listingsError } = await supabase
      .from("listings")
      .select("*");

    if (listingsError) {
      console.error("Listings error:", listingsError);
      // Pokračuj i bez matches
      return NextResponse.json({ 
        requestId: req.id,
        publicToken: req.public_token 
      });
    }

    // Spočítej top 10 matches
    const matches = findTopMatchesForRequest(req, listings || [], 10);

    // Ulož matches do DB
    if (matches.length > 0) {
      const matchRecords = matches.map((match) => ({
        listing_id: match.listing.id,
        request_id: req.id,
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
      requestId: req.id,
      publicToken: req.public_token 
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
