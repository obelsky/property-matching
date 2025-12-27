"use client";

import { RequestFormData } from "@/lib/formTypes";
import { CheckIcon } from "@/components/Icons";

interface Step6Props {
  data: Partial<RequestFormData>;
  onUpdate: (updates: Partial<RequestFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function Step6({
  data,
  onUpdate,
  onSubmit,
  onBack,
  isSubmitting,
}: Step6Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validace
    if (!data.contact_name || !data.contact_email || !data.contact_phone) {
      alert("Prosím vyplňte všechny kontaktní údaje");
      return;
    }

    if (!data.gdpr) {
      alert("Prosím potvrďte souhlas se zpracováním osobních údajů");
      return;
    }

    // Validace emailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contact_email)) {
      alert("Prosím zadejte platnou emailovou adresu");
      return;
    }

    // Validace telefonu (Czech format)
    const phoneRegex = /^(\+420)?[0-9]{9}$/;
    const cleanPhone = data.contact_phone.replace(/\s/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      alert("Prosím zadejte platné telefonní číslo (9 číslic nebo +420...)");
      return;
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-green-900 flex items-start gap-2">
          <CheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-700" />
          <span><strong>Poslední krok!</strong> Vyplňte kontaktní údaje a my vás budeme
          informovat o vhodných nabídkách.</span>
        </p>
      </div>

      {/* Jméno a příjmení */}
      <div>
        <label htmlFor="contact_name" className="label-field">
          Jméno a příjmení *
        </label>
        <input
          type="text"
          id="contact_name"
          value={data.contact_name || ""}
          onChange={(e) => onUpdate({ contact_name: e.target.value })}
          placeholder="Jan Novák"
          className="input-field"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact_email" className="label-field">
          Email *
        </label>
        <input
          type="email"
          id="contact_email"
          value={data.contact_email || ""}
          onChange={(e) => onUpdate({ contact_email: e.target.value })}
          placeholder="jan.novak@email.cz"
          className="input-field"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Na tento email vám pošleme soukromý odkaz pro sledování poptávky
        </p>
      </div>

      {/* Telefon */}
      <div>
        <label htmlFor="contact_phone" className="label-field">
          Telefon *
        </label>
        <input
          type="tel"
          id="contact_phone"
          value={data.contact_phone || ""}
          onChange={(e) => onUpdate({ contact_phone: e.target.value })}
          placeholder="+420 777 123 456"
          className="input-field"
          required
        />
      </div>

      {/* Poznámka */}
      <div>
        <label htmlFor="note" className="label-field">
          Poznámka (volitelné)
        </label>
        <textarea
          id="note"
          value={data.note || ""}
          onChange={(e) => onUpdate({ note: e.target.value })}
          placeholder="Další požadavky nebo informace..."
          className="input-field"
          rows={4}
        />
      </div>

      {/* GDPR Souhlas */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.gdpr || false}
            onChange={(e) => onUpdate({ gdpr: e.target.checked })}
            className="mt-1 w-5 h-5 text-brand-orange rounded"
            required
          />
          <span className="text-sm text-gray-700">
            <strong className="text-gray-900">Souhlasím se zpracováním osobních údajů *</strong>
            <br />
            Beru na vědomí, že mé osobní údaje budou zpracovány pro účely vyhledání vhodné
            nemovitosti. Jsem oprávněn kdykoliv svůj souhlas odvolat. Více informací v{" "}
            <a
              href="/zasady-ochrany-osobnich-udaju"
              target="_blank"
              className="text-brand-orange hover:underline"
            >
              zásadách ochrany osobních údajů
            </a>
            .
          </span>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          ← Zpět
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Odesílám...
            </>
          ) : (
            <>
              Odeslat poptávku
              <CheckIcon className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
