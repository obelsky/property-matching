"use client";

import { useState, useEffect } from "react";
import { RequestFormData } from "@/lib/formTypes";
import { CheckIcon } from "@/components/Icons";
import Link from "next/link";

interface Step6Props {
  data: Partial<RequestFormData>;
  onUpdate: (updates: Partial<RequestFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

interface CalculatorData {
  propertyPrice: number;
  downPaymentPercent: number;
  loanAmount: number;
  years: number;
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  ltv: number;
  isReverseMortgage: boolean;
  hasChanges: boolean;
  timestamp: string;
}

export default function Step6({
  data,
  onUpdate,
  onSubmit,
  onBack,
  isSubmitting,
}: Step6Props) {
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);
  const [includeCalculator, setIncludeCalculator] = useState(false);

  // Načíst data z localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mortgageCalculatorData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.hasChanges) {
          setCalculatorData(parsed);
        }
      } catch (err) {
        console.error('Failed to parse calculator data:', err);
      }
    }
  }, []);

  // Aktualizovat formData když se změní checkbox
  useEffect(() => {
    if (includeCalculator && calculatorData) {
      onUpdate({
        calculator_data: calculatorData
      });
    } else {
      onUpdate({
        calculator_data: undefined
      });
    }
  }, [includeCalculator, calculatorData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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

      {/* HYPOTEČNÍ KALKULAČKA SEKCE */}
      {calculatorData ? (
        <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-300 rounded-xl p-6">
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={includeCalculator}
              onChange={(e) => setIncludeCalculator(e.target.checked)}
              className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold text-gray-900">
                  Zahrnout data z hypoteční kalkulačky
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Pomůže nám lépe porozumět vašim finančním možnostem
              </p>
            </div>
          </label>

          {includeCalculator && (
            <div className="bg-white rounded-lg border border-purple-200 p-4 mt-4 space-y-2">
              <h4 className="font-semibold text-sm text-gray-900 mb-3">📊 Vaše nastavení kalkulačky:</h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Cena nemovitosti:</span>
                  <p className="font-semibold text-gray-900">{formatCurrency(calculatorData.propertyPrice)} Kč</p>
                </div>
                
                <div>
                  <span className="text-gray-600">Vlastní zdroje:</span>
                  <p className="font-semibold text-purple-700">{calculatorData.downPaymentPercent}%</p>
                </div>
                
                <div>
                  <span className="text-gray-600">Výše hypotéky:</span>
                  <p className="font-semibold text-gray-900">{formatCurrency(calculatorData.loanAmount)} Kč</p>
                </div>
                
                <div>
                  <span className="text-gray-600">LTV:</span>
                  <p className="font-semibold text-gray-900">{calculatorData.ltv.toFixed(0)}%</p>
                </div>
                
                <div>
                  <span className="text-gray-600">Doba splácení:</span>
                  <p className="font-semibold text-gray-900">{calculatorData.years} let</p>
                </div>
                
                <div>
                  <span className="text-gray-600">Úroková sazba:</span>
                  <p className="font-semibold text-gray-900">{calculatorData.interestRate.toFixed(2)}%</p>
                </div>
                
                <div className="col-span-2">
                  <span className="text-gray-600">Měsíční splátka:</span>
                  <p className="font-semibold text-purple-700 text-lg">{formatCurrency(calculatorData.monthlyPayment)} Kč</p>
                </div>
              </div>

              {calculatorData.isReverseMortgage && (
                <div className="bg-purple-100 rounded px-3 py-2 mt-3">
                  <p className="text-xs text-purple-800">
                    ✓ Zpětná hypotéka zahrnuta
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-1">
                Vyzkoušeli jste naši hypoteční kalkulačku?
              </p>
              <p className="text-sm text-blue-800 mb-3">
                Nastavte si osobní preference v kalkulačce a pomozte nám lépe porozumět vašim finančním možnostem.
              </p>
              <Link
                href="/hypotecni-kalkulacka"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Přejít na hypoteční kalkulačku
              </Link>
            </div>
          </div>
        </div>
      )}

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
