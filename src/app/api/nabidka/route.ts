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
    
    console.log("[API] Received nabidka data:", JSON.stringify(data, null, 2));

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
    if (!contact_email) {
      return NextResponse.json(
        { error: "Email je povinný" },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: "Typ nemovitosti je povinný" },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        { error: "Lokalita je povinná" },
        { status: 400 }
      );
    }

    // Upload fotek do Supabase Storage
    const photoUrls: string[] = [];
    
    if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
      console.log("[API] Uploading", data.photos.length, "photos");
      
      for (let i = 0; i < data.photos.length; i++) {
        const base64Photo = data.photos[i];
        
        if (!base64Photo || typeof base64Photo !== 'string') {
          console.log("[API] Skipping invalid photo", i);
          continue;
        }
        
        try {
          // Extract base64 data
          const matches = base64Photo.match(/^data:image\/(\w+);base64,(.+)$/);
          if (!matches) {
            console.error("[API] Invalid base64 format for photo", i);
            continue;
          }
          
          const imageType = matches[1];
          const base64Data = matches[2];
          
          // Convert base64 to buffer
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Generate unique filename
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const filename = `${timestamp}-${randomStr}.${imageType}`;
          const filepath = `listings/${filename}`;
          
          console.log("[API] Uploading photo", i, "as", filepath);
          
          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('photos')
            .upload(filepath, buffer, {
              contentType: `image/${imageType}`,
              cacheControl: '3600',
              upsert: false
            });
          
          if (uploadError) {
            console.error("[API] Photo upload error:", uploadError);
            continue;
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase
            .storage
            .from('photos')
            .getPublicUrl(filepath);
          
          photoUrls.push(publicUrl);
          console.log("[API] Photo", i, "uploaded:", publicUrl);
          
        } catch (error) {
          console.error("[API] Error processing photo", i, ":", error);
        }
      }
      
      console.log("[API] Successfully uploaded", photoUrls.length, "photos");
    }

    // Vygeneruj public token
    const publicToken = generatePublicToken();

    // Připrav data pro insert
    const insertData = {
      type,
      layout: layout || null,
      city,
      district: null,
      price: priceStr ? parseFloat(priceStr.toString()) : null,
      area_m2: areaStr ? parseFloat(areaStr.toString()) : null,
      contact_name: contact_name || null,
      contact_email,
      contact_phone: contact_phone || null,
      photos: photoUrls,
      public_token: publicToken,
      latitude: null,
      longitude: null,
      details: data,
    };

    console.log("[API] Insert data:", JSON.stringify(insertData, null, 2));

    // Vytvoř listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .insert(insertData)
      .select()
      .single();

    if (listingError) {
      console.error("[API] Supabase error:", listingError);
      return NextResponse.json(
        { 
          error: "Chyba při ukládání nabídky",
          details: listingError.message 
        },
        { status: 500 }
      );
    }

    if (!listing) {
      console.error("[API] No listing returned from insert");
      return NextResponse.json(
        { error: "Nepodařilo se vytvořit nabídku" },
        { status: 500 }
      );
    }

    console.log("[API] Listing created:", listing.id);

    // Najdi matching requests
    const { data: requests, error: requestsError } = await supabase
      .from("requests")
      .select("*");

    if (requestsError) {
      console.error("[API] Requests error:", requestsError);
      // Pokračuj i bez matches
      return NextResponse.json({ 
        success: true,
        listingId: listing.id,
        publicToken 
      });
    }

    // Spočítej top matches
    const matches = findTopMatchesForListing(listing, requests || [], 10);

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
        console.error("[API] Match insert error:", matchesError);
      } else {
        console.log("[API] Created", matches.length, "matches");
      }
    }

    console.log("[API] Success! Listing ID:", listing.id);

    return NextResponse.json({ 
      success: true,
      listingId: listing.id,
      publicToken 
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
