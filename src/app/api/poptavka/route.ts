import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { findTopMatchesForRequest } from "@/lib/matching";
import { Listing } from "@/lib/types";
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
    const formData = await request.json();
    
    console.log("[API] Received poptavka data:", JSON.stringify(formData, null, 2));

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
    if (!contact_email) {
      return NextResponse.json(
        { error: "Email je povinný" },
        { status: 400 }
      );
    }

    if (!property_type) {
      return NextResponse.json(
        { error: "Typ nemovitosti je povinný" },
        { status: 400 }
      );
    }

    if (!preferred_location) {
      return NextResponse.json(
        { error: "Lokalita je povinná" },
        { status: 400 }
      );
    }

    // Vygeneruj public token
    const publicToken = generatePublicToken();

    // Layout_min: první kategorie (pro matching)
    const layout_min = category && category.length > 0 ? category[0] : null;

    // Připrav data pro insert
    const insertData = {
      request_kind: request_kind || 'koupě',
      type: property_type,
      layout_min,
      city: preferred_location,
      district: null,
      radius_km: radius_km || 20,
      budget_min: budget_min || null,
      budget_max: budget_max || null,
      area_min_m2: area_min_m2 || null,
      area_max_m2: area_max_m2 || null,
      contact_name: contact_name || null,
      contact_email,
      contact_phone: contact_phone || null,
      public_token: publicToken,
      latitude: null,
      longitude: null,
      details: formData, // Celý formulář jako JSON
    };

    console.log("[API] Insert data:", JSON.stringify(insertData, null, 2));

    // Vytvoř request
    const { data: req, error: reqError } = await supabase
      .from("requests")
      .insert(insertData)
      .select()
      .single();

    if (reqError) {
      console.error("[API] Supabase error:", reqError);
      return NextResponse.json(
        { 
          error: "Chyba při ukládání poptávky",
          details: reqError.message 
        },
        { status: 500 }
      );
    }

    if (!req) {
      console.error("[API] No request returned from insert");
      return NextResponse.json(
        { error: "Nepodařilo se vytvořit poptávku" },
        { status: 500 }
      );
    }

    console.log("[API] Request created:", req.id);

    // Google Sheets Export (ne-blokující)
    if (!early_submit) {
      try {
        const { exportToGoogleSheets } = await import("@/lib/googleSheets");
        exportToGoogleSheets(req, formData).catch((error) => {
          console.error("[API] Google Sheets export failed:", error);
        });
      } catch (importError) {
        console.error("[API] Failed to import Google Sheets module:", importError);
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

        const { error: matchError } = await supabase
          .from("matches")
          .insert(matchRecords);

        if (matchError) {
          console.error("[API] Match insert error:", matchError);
          // Necháme pokračovat - matches nejsou kritické
        } else {
          console.log("[API] Created", matches.length, "matches");
        }
      }
    }

    console.log("[API] Success! Request ID:", req.id);

    return NextResponse.json({
      success: true,
      requestId: req.id,
      publicToken,
    });
  } catch (error) {
    console.error("[API] Unhandled error:", error);
    return NextResponse.json(
      { 
        error: "Interní chyba serveru",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
