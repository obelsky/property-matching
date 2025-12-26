import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    const { name, email, phone } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Jméno je povinné" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("agents")
      .insert([
        {
          name: name.trim(),
          email: email?.trim() || null,
          phone: phone?.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating agent:", error);
      return NextResponse.json(
        { error: "Nepodařilo se vytvořit makléře" },
        { status: 500 }
      );
    }

    return NextResponse.json({ agent: data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/agents:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
