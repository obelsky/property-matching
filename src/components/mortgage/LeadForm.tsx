"use client";

import { useState, useEffect } from "react";
import { PhoneCallIcon } from "./MortgageIcons";
import Link from "next/link";

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

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    gdpr: false,
  });
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);
  const [includeCalculator, setIncludeCalculator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        source: "hypotecni-kalkulacka",
        calculator_data: includeCalculator && calculatorData ? calculatorData : undefined,
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Chyba při odesílání");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Něco se pokazilo. Zkuste to prosím znovu.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-zfp-text mb-2">
          Děkujeme za váš zájem!
        </h3>
        <p className="text-gray-600">
          Náš hypoteční specialista vás kontaktuje během 24 hodin.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <PhoneCallIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold text-zfp-text">
            Připravíme pro vás nezávaznou nabídku
          </h2>
          <p className="text-sm text-gray-600">
            Náš hypoteční specialista vám zavolá a během jednoho hovoru získáte 
            jasnější představu, jak můžete financovat své nové bydlení.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Jméno */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Jméno a příjmení *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jan Novák"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jan.novak@email.cz"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
          />
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Telefon *
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+420 777 123 456"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
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
                  Nastavte si osobní preference v kalkulačce výše a pomozte nám lépe porozumět vašim finančním možnostem.
                </p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Přejít na kalkulačku nahoře
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Zpráva */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Vaše zpráva (volitelné)
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Například: Hledám hypotéku na byt v Praze..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
          />
        </div>

        {/* GDPR */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.gdpr}
              onChange={(e) => setFormData({ ...formData, gdpr: e.target.checked })}
              className="mt-1 w-5 h-5 text-brand-orange rounded"
            />
            <span className="text-sm text-gray-700">
              Souhlasím se{" "}
              <span className="text-brand-orange font-medium">zpracováním osobních údajů</span>{" "}
              za účelem kontaktování hypotečním specialistou ZFP Reality. 
              Tento souhlas mohu kdykoli odvolat.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Odesílám..." : "Chci nezávaznou nabídku"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Odesláním formuláře beru na vědomí{" "}
          <a href="/zasady-ochrany-osobnich-udaju" className="text-brand-orange hover:underline">
            Zásady zpracování osobních údajů
          </a>
        </p>
      </form>
    </div>
  );
}
