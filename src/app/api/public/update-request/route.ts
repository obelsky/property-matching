import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyRequestToken } from "@/lib/publicToken";

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
    const body = await request.json();
    const { id, token, price, area, location, note } = body;

    // Ověř token
    const isValid = await verifyRequestToken(id, token);
    if (!isValid) {
      return NextResponse.json(
        { error: "Neplatný token" },
        { status: 403 }
      );
    }

    // Sestavit public_note jako JSON
    const publicNote = {
      budget: price ? parseFloat(price) : null,
      area_min: area ? parseFloat(area) : null,
      location: location || null,
      note: note || null,
      updated_at: new Date().toISOString(),
    };

    // Ulož do public_note
    const { error } = await supabase
      .from("requests")
      .update({ 
        public_note: JSON.stringify(publicNote) 
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating request:", error);
      return NextResponse.json(
        { error: "Nepodařilo se uložit změny" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
