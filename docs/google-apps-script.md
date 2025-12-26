# 📊 Google Apps Script - Setup Guide

## 🎯 Účel

Exportuje poptávky z formuláře do Google Sheets pro snadnou správu a analýzu.

---

## 📋 KROK 1: Otevřete Spreadsheet

**URL:**
```
https://docs.google.com/spreadsheets/d/1pDQlopDrevZly9wCsKBZV3P4Ek17OG3X9qEGosU3OWw/edit
```

**Sheet ID:** `1pDQlopDrevZly9wCsKBZV3P4Ek17OG3X9qEGosU3OWw`  
**gid:** `560227062`

---

## 📋 KROK 2: Vytvořte nebo Najděte Sheet

V spreadsheet najděte sheet s názvem **"Poptávky"** (nebo vytvořte nový).

**Poznámka:** V Apps Script kódu níže nastavte správný název sheetu.

---

## 📋 KROK 3: Otevřete Apps Script Editor

1. V menu: **Extensions → Apps Script**
2. Otevře se nová záložka s editorem

---

## 📋 KROK 4: Vložte Kód

Smažte veškerý existující kód a vložte tento:

```javascript
/**
 * Property Matching - Poptávky Export
 * Přijímá POST requesty z Next.js aplikace a přidává řádky do Google Sheets
 */

// ⚠️ ZMĚŇTE NA NÁZEV VAŠEHO SHEETU
const SHEET_NAME = "Poptávky";

function doPost(e) {
  try {
    // Získej sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }
    
    // Parse JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Vytvoř header pokud není
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Datum",
        "ID",
        "Typ poptávky",
        "Typ nemovitosti",
        "Kategorie",
        "Layout Min",
        "Lokalita",
        "Okruh (km)",
        "Plocha od (m²)",
        "Plocha do (m²)",
        "Cena od (Kč)",
        "Cena do (Kč)",
        "Umístění v domě",
        "Stav",
        "Konstrukce",
        "Vybavení",
        "Financování",
        "Časový horizont",
        "Jméno",
        "Email",
        "Telefon",
        "Poznámka",
        "GDPR",
        "Early Submit",
        "Klientský odkaz",
      ]);
      
      // Formátuj header
      const headerRange = sheet.getRange(1, 1, 1, 25);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#f3f3f3");
    }
    
    // Přidej data row
    sheet.appendRow([
      data.created_at,
      data.request_id,
      data.request_kind,
      data.property_type,
      data.category,
      data.layout_min,
      data.preferred_location,
      data.radius_km,
      data.area_min_m2,
      data.area_max_m2,
      data.budget_min,
      data.budget_max,
      data.floor_preference,
      data.preferred_state,
      data.preferred_construction,
      data.preferred_comfort,
      data.financing_methods,
      data.timeframe,
      data.contact_name,
      data.contact_email,
      data.contact_phone,
      data.note,
      data.gdpr,
      data.early_submit,
      data.client_link,
    ]);
    
    // Success response
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, request_id: data.request_id })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Error response
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test funkce (volitelné)
 * Spusťte toto pro otestování bez skutečného POST requestu
 */
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        created_at: new Date().toISOString(),
        request_id: "test-123",
        request_kind: "Koupě",
        property_type: "Byt",
        category: "3+kk, 2+kk",
        layout_min: "3+kk",
        preferred_location: "Praha",
        radius_km: 20,
        area_min_m2: 70,
        area_max_m2: 100,
        budget_min: 4000000,
        budget_max: 6000000,
        floor_preference: "",
        preferred_state: "Dobrý, Velmi dobrý",
        preferred_construction: "",
        preferred_comfort: "Balkon/Lodžie, Parkování",
        financing_methods: "Hypotéka",
        timeframe: "Do 6 měsíců",
        contact_name: "Jan Testovací",
        contact_email: "test@example.com",
        contact_phone: "+420 777 123 456",
        note: "Testovací poptávka",
        gdpr: "Ano",
        early_submit: "Ne",
        client_link: "https://example.com/moje/poptavka/test-123?token=xxx",
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

---

## 📋 KROK 5: Upravte SHEET_NAME

Na řádku 7 změňte název sheetu:

```javascript
const SHEET_NAME = "Poptávky";  // ← Změňte na váš název sheetu
```

---

## 📋 KROK 6: Uložte Script

1. Klikněte **File → Save** (nebo Ctrl+S)
2. Pojmenujte projekt: "Property Matching - Poptávky Export"

---

## 📋 KROK 7: Test (Volitelné)

1. V editoru zvolte funkci **`testDoPost`**
2. Klikněte **Run** (▶️)
3. Při prvním spuštění autorizujte script:
   - Review Permissions
   - Choose your account
   - Allow
4. Zkontrolujte že se přidal testovací řádek do sheetu

---

## 📋 KROK 8: Deploy as Web App

1. Klikněte **Deploy → New deployment**
2. Nastavení:
   - **Type:** Web app
   - **Description:** "Poptávky webhook v1"
   - **Execute as:** Me (your-email@gmail.com)
   - **Who has access:** Anyone
3. Klikněte **Deploy**
4. **Autorizace:**
   - Authorize access
   - Choose account
   - Advanced → Go to [project] (unsafe)
   - Allow
5. **Zkopírujte Web app URL**

Mělo by vypadat takto:
```
https://script.google.com/macros/s/AKfycbw.../exec
```

---

## 📋 KROK 9: Přidejte URL do Next.js

V projektu vytvořte/upravte `.env.local`:

```bash
# Google Sheets Webhook
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Base URL (pro klientské odkazy)
NEXT_PUBLIC_BASE_URL=https://property-matching-omega.vercel.app
```

**⚠️ DŮLEŽITÉ:**
- Změňte `YOUR_SCRIPT_ID` na skutečné ID z kroku 8
- Pro Vercel: Přidejte proměnné v **Settings → Environment Variables**

---

## 📋 KROK 10: Test End-to-End

1. Spusťte Next.js aplikaci
2. Vyplňte poptávkový formulář
3. Odešlete
4. Zkontrolujte Google Sheet → měl by se přidat nový řádek

---

## 🔧 TROUBLESHOOTING

### Error: "Sheet not found"

**Řešení:** Zkontrolujte `SHEET_NAME` - musí přesně odpovídat názvu sheetu (case-sensitive).

### Error: "Permission denied"

**Řešení:** 
1. Redeploy web app
2. Ujistěte se že "Execute as: Me" a "Who has access: Anyone"

### Request nefunguje

**Řešení:**
1. Zkontrolujte URL v `.env.local`
2. Zkontrolujte Vercel environment variables
3. Zkontrolujte Apps Script Executions log (View → Executions)

### Data chybí v sheetu

**Řešení:**
1. Zkontrolujte že sheet existuje a má správný název
2. Spusťte `testDoPost()` funkci v Apps Script editoru
3. Zkontrolujte Executions log pro errors

---

## 📊 STRUKTURA DAT V SHEETU

| Sloupec | Popis | Příklad |
|---------|-------|---------|
| Datum | created_at | 2024-12-26T10:30:00Z |
| ID | request_id | req_abc123 |
| Typ poptávky | buy/rent | Koupě |
| Typ nemovitosti | byt/dům... | Byt |
| Kategorie | Vybrané dispozice | 3+kk, 2+kk |
| Layout Min | První kategorie | 3+kk |
| Lokalita | preferred_location | Praha |
| Okruh (km) | radius_km | 20 |
| ... | ... | ... |
| Klientský odkaz | URL s tokenem | https://... |

---

## 🔒 BEZPEČNOST

- ✅ Apps Script běží pod vaším Google účtem
- ✅ Webhook URL je veřejná, ale nemá autentizaci (rate limiting doporučeno)
- ✅ Data nejsou mazatelná přes webhook (jen append)
- ⚠️ Doporučeno: Přidat IP whitelisting v production

---

## 📝 POZNÁMKY

- Apps Script má limit **20 000 requestů/den** (property quotas)
- Response time ~1-3s
- Data se přidávají na konec sheetu (append)
- Pro hromadné úpravy použijte Google Sheets UI

---

**✓ SETUP HOTOV!** Formulář nyní exportuje poptávky do Google Sheets. 🎉
