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

    // Upload fotek do Supabase Storage
    const photoUrls: string[] = [];
    
    if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
      for (let i = 0; i < data.photos.length; i++) {
        const base64Photo = data.photos[i];
        
        if (!base64Photo || typeof base64Photo !== 'string') continue;
        
        try {
          // Extract base64 data (remove data:image/jpeg;base64, prefix)
          const matches = base64Photo.match(/^data:image\/(\w+);base64,(.+)$/);
          if (!matches) {
            console.error("Invalid base64 format for photo", i);
            continue;
          }
          
          const imageType = matches[1]; // jpeg, png, webp
          const base64Data = matches[2];
          
          // Convert base64 to buffer
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Generate unique filename
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const filename = `${timestamp}-${randomStr}.${imageType}`;
          const filepath = `listings/${filename}`;
          
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
            console.error(`Photo upload error for photo ${i}:`, uploadError);
            continue; // Skip this photo but continue with others
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase
            .storage
            .from('photos')
            .getPublicUrl(filepath);
          
          photoUrls.push(publicUrl);
          console.log(`Photo ${i} uploaded successfully:`, publicUrl);
          
        } catch (error) {
          console.error(`Error processing photo ${i}:`, error);
          // Continue with other photos
        }
      }
      
      console.log(`Successfully uploaded ${photoUrls.length} out of ${data.photos.length} photos`);
    }

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
