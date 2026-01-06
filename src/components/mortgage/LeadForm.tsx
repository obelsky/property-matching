"use client";

import { useState, useEffect } from "react";
import { PhoneCallIcon } from "./MortgageIcons";

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

  // Načíst data z localStorage a sledovat změny
  useEffect(() => {
    const loadCalculatorData = () => {
      const stored = localStorage.getItem('mortgageCalculatorData');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.hasChanges) {
            setCalculatorData(parsed);
          } else {
            setCalculatorData(null);
          }
        } catch (err) {
          console.error('Failed to parse calculator data:', err);
          setCalculatorData(null);
        }
      } else {
        setCalculatorData(null);
      }
    };

    loadCalculatorData();

    const handleStorageChange = () => {
      loadCalculatorData();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadCalculatorData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
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
      <div className="card-dark p-8 text-center">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-heading text-zfp-text mb-2">
          Děkujeme za váš zájem!
        </h3>
        <p className="text-zfp-text-muted">
          Náš hypoteční specialista vás kontaktuje během 24 hodin.
        </p>
      </div>
    );
  }

  return (
    <div className="card-dark p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-success rounded-xl flex items-center justify-center shadow-lg">
          <PhoneCallIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-heading text-zfp-text">
            Připravíme pro vás nezávaznou nabídku
          </h2>
          <p className="text-sm text-zfp-text-muted">
            Náš hypoteční specialista vám zavolá a během jednoho hovoru získáte 
            jasnější představu, jak můžete financovat své nové bydlení.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-error/10 border border-error/30 rounded-lg p-4">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* Jméno */}
        <div>
          <label htmlFor="name" className="label-field">
            Jméno a příjmení *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jan Novák"
            className="input-field"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="label-field">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jan.novak@email.cz"
            className="input-field"
          />
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="phone" className="label-field">
            Telefon *
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+420 777 123 456"
            className="input-field"
          />
        </div>

        {/* DYNAMICKÁ SEKCE - Info box NEBO Gold checkbox */}
        {!calculatorData ? (
          // INFO BOX - když uživatel NEpoužil kalkulačku
          <div className="card p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-info flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-zfp-text mb-1">
                  Vyzkoušeli jste naši hypoteční kalkulačku?
                </p>
                <p className="text-sm text-zfp-text-muted mb-3">
                  Nastavte si osobní preference v kalkulačce výše a pomozte nám lépe porozumět vašim finančním možnostem.
                </p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-gold hover:text-brand-orange transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Přejít na kalkulačku nahoře
                </a>
              </div>
            </div>
          </div>
        ) : (
          // GOLD CHECKBOX - když uživatel POUŽIL kalkulačku
          <div className="card-accent p-6">
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={includeCalculator}
                onChange={(e) => setIncludeCalculator(e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-zfp-text">
                    Zahrnout data z hypoteční kalkulačky
                  </span>
                </div>
                <p className="text-xs text-zfp-text-muted">
                  Pomůže nám lépe porozumět vašim finančním možnostem
                </p>
              </div>
            </label>

            {includeCalculator && (
              <div className="bg-zfp-darker rounded-lg border border-zfp-border p-4 mt-4 space-y-2">
                <h4 className="font-medium text-sm text-brand-gold mb-3">Vaše nastavení kalkulačky:</h4>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-zfp-text-muted">Cena nemovitosti:</span>
                    <p className="font-medium text-zfp-text">{formatCurrency(calculatorData.propertyPrice)} Kč</p>
                  </div>
                  
                  <div>
                    <span className="text-zfp-text-muted">Vlastní zdroje:</span>
                    <p className="font-medium text-brand-gold">{calculatorData.downPaymentPercent}%</p>
                  </div>
                  
                  <div>
                    <span className="text-zfp-text-muted">Výše hypotéky:</span>
                    <p className="font-medium text-zfp-text">{formatCurrency(calculatorData.loanAmount)} Kč</p>
                  </div>
                  
                  <div>
                    <span className="text-zfp-text-muted">LTV:</span>
                    <p className="font-medium text-zfp-text">{calculatorData.ltv.toFixed(0)}%</p>
                  </div>
                  
                  <div>
                    <span className="text-zfp-text-muted">Doba splácení:</span>
                    <p className="font-medium text-zfp-text">{calculatorData.years} let</p>
                  </div>
                  
                  <div>
                    <span className="text-zfp-text-muted">Úroková sazba:</span>
                    <p className="font-medium text-zfp-text">{calculatorData.interestRate.toFixed(2)}%</p>
                  </div>
                  
                  <div className="col-span-2">
                    <span className="text-zfp-text-muted">Měsíční splátka:</span>
                    <p className="font-medium text-brand-gold text-lg">{formatCurrency(calculatorData.monthlyPayment)} Kč</p>
                  </div>
                </div>

                {calculatorData.isReverseMortgage && (
                  <div className="badge badge-gold mt-3">
                    ✓ Zpětná hypotéka zahrnuta
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Zpráva */}
        <div>
          <label htmlFor="message" className="label-field">
            Vaše zpráva (volitelné)
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Například: Hledám hypotéku na byt v Praze..."
            rows={4}
            className="input-field"
          />
        </div>

        {/* GDPR */}
        <div className="card p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.gdpr}
              onChange={(e) => setFormData({ ...formData, gdpr: e.target.checked })}
              className="mt-1"
            />
            <span className="text-sm text-zfp-text-muted">
              Souhlasím se{" "}
              <span className="text-brand-gold font-medium">zpracováním osobních údajů</span>{" "}
              za účelem kontaktování hypotečním specialistou ZFP Reality. 
              Tento souhlas mohu kdykoli odvolat.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Odesílám..." : "Chci nezávaznou nabídku"}
        </button>

        <p className="text-xs text-zfp-text-subtle text-center">
          Odesláním formuláře beru na vědomí{" "}
          <a href="/zasady-ochrany-osobnich-udaju" className="text-brand-gold hover:text-brand-orange">
            Zásady zpracování osobních údajů
          </a>
        </p>
      </form>
    </div>
  );
}
