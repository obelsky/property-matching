import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validace
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: "Jméno a email jsou povinné" },
        { status: 400 }
      );
    }

    // Vytvoř lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message || null,
        source: data.source || "unknown",
        status: "new",
      })
      .select()
      .single();

    if (leadError || !lead) {
      console.error("Lead error:", leadError);
      return NextResponse.json(
        { error: "Chyba při ukládání kontaktu" },
        { status: 500 }
      );
    }

    return NextResponse.json({ leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
