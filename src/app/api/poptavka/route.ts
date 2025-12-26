import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { findTopMatchesForRequest } from "@/lib/matching";
import { Listing } from "@/lib/types";
import { generatePublicToken } from "@/lib/publicToken";
import { geocodeAddress } from "@/lib/geocoding";
import { exportToGoogleSheets } from "@/lib/googleSheets";

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
    const geoLocation = null;

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
        latitude: geoLocation?.latitude || null,
        longitude: geoLocation?.longitude || null,
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

    // Google Sheets Export (ne-blokující)
    if (req && !early_submit) {
      exportToGoogleSheets(req, formData).catch((error) => {
        console.error("Google Sheets export failed:", error);
        // Neblokuj user experience
      });
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
