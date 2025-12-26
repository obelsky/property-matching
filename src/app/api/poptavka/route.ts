import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { findTopMatchesForRequest } from "@/lib/matching";
import { Listing } from "@/lib/types";
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
    // NOVÝ: Přijímá JSON místo FormData
    const formData = await request.json();

    // Rozbal data
    const {
      request_kind,
      property_type,
      preferred_location,
      radius_km,
      category,
      area_min_m2,
      area_max_m2,
      budget_min,
      budget_max,
      contact_name,
      contact_email,
      contact_phone,
      early_submit,
      ...details
    } = formData;

    // Validace základních polí
    if (!request_kind || !property_type || !preferred_location || !contact_email) {
      return NextResponse.json(
        { error: "Povinná pole nejsou vyplněna" },
        { status: 400 }
      );
    }

    // Vygeneruj public token
    const publicToken = generatePublicToken();

    // Geocoding - DOČASNĚ VYPNUTO (network disabled)
    // TODO: Zapnout až bude network enabled
    // const geoLocation = await geocodeAddress(preferred_location, null, null);

    // Layout_min: první kategorie (pro matching)
    const layout_min = category && category.length > 0 ? category[0] : null;

    // Vytvoř request
    const { data: req, error: reqError } = await supabase
      .from("requests")
      .insert({
        request_kind,
        type: property_type,
        layout_min,
        city: preferred_location,
        district: null, // Můžeme parsovat z lokality později
        radius_km: radius_km || 20,
        budget_min: budget_min || null,
        budget_max: budget_max || null,
        area_min_m2: area_min_m2 || null,
        area_max_m2: area_max_m2 || null,
        contact_name,
        contact_email,
        contact_phone,
        public_token: publicToken,
        latitude: null, // Geocoding disabled
        longitude: null, // Geocoding disabled
        details: formData, // Celý formulář jako JSON
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

    // Google Sheets Export (ne-blokující) - lazy import
    if (req && !early_submit) {
      try {
        const { exportToGoogleSheets } = await import("@/lib/googleSheets");
        exportToGoogleSheets(req, formData).catch((error) => {
          console.error("Google Sheets export failed:", error);
        });
      } catch (importError) {
        console.error("Failed to import Google Sheets module:", importError);
      }
    }

    // Najdi matching listings
    const { data: listings } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active");

    if (listings && listings.length > 0) {
      const matches = findTopMatchesForRequest(req, listings as Listing[]);

      // Ulož matches do DB
      if (matches.length > 0) {
        const matchRecords = matches.map((match) => ({
          listing_id: match.listing.id,
          request_id: req.id,
          score: match.score,
          reasons: match.reasons,
        }));

        await supabase.from("matches").insert(matchRecords);
      }
    }

    return NextResponse.json({
      success: true,
      requestId: req.id,
      publicToken,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

