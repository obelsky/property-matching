/**
 * Google Sheets Export
 * Exportuje poptávku do Google Sheets přes Apps Script webhook
 */

export async function exportToGoogleSheets(request: any, formData: any) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("GOOGLE_SHEETS_WEBHOOK_URL not configured - skipping export");
    return;
  }

  try {
    // Připrav payload pro Google Sheets (plochý objekt)
    const payload = {
      // Timestamp
      created_at: request.created_at,

      // IDs
      request_id: request.id,

      // Základní info
      request_kind: request.request_kind === "buy" ? "Koupě" : "Podnájem",
      property_type: getPropertyTypeLabel(request.type),

      // Kategorie
      category: formData.category?.join(", ") || "",
      layout_min: request.layout_min || "",

      // Lokalita
      preferred_location: request.city,
      radius_km: request.radius_km,

      // Parametry
      area_min_m2: request.area_min_m2 || "",
      area_max_m2: request.area_max_m2 || "",
      budget_min: request.budget_min || "",
      budget_max: request.budget_max || "",

      // Detaily (jen pro byty)
      floor_preference: formData.floor_preference?.join(", ") || "",

      // Stav/Konstrukce/Vybavení
      preferred_state: formData.preferred_state?.join(", ") || "",
      preferred_construction: formData.preferred_construction?.join(", ") || "",
      preferred_comfort: formData.preferred_comfort?.join(", ") || "",

      // Financování/Horizont
      financing_methods: formData.financing_methods?.join(", ") || "",
      timeframe: getTimeframeLabel(formData.timeframe) || "",

      // Kontakt
      contact_name: request.contact_name,
      contact_email: request.contact_email,
      contact_phone: request.contact_phone,
      note: formData.note || "",

      // GDPR
      gdpr: formData.gdpr ? "Ano" : "Ne",

      // Klientský odkaz
      client_link: `${process.env.NEXT_PUBLIC_BASE_URL || "https://property-matching-omega.vercel.app"}/moje/poptavka/${request.id}?token=${request.public_token}`,

      // Meta
      early_submit: formData.early_submit ? "Ano" : "Ne",
    };

    // Pošli na webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log("✓ Google Sheets export successful:", request.id);
  } catch (error) {
    console.error("✗ Google Sheets export failed:", error);
    // Neblokuj user experience - jen loguj error
    throw error;
  }
}

// Helper funkce pro labely
function getPropertyTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
    komercni: "Komerční",
    ostatni: "Ostatní",
  };
  return labels[type] || type;
}

function getTimeframeLabel(timeframe?: string): string {
  const labels: { [key: string]: string } = {
    asap: "Co nejdříve",
    "3months": "Do 3 měsíců",
    "6months": "Do 6 měsíců",
    "1year": "Do 1 roku",
    flexible: "Nemám časový limit",
  };
  return timeframe ? labels[timeframe] || timeframe : "";
}
