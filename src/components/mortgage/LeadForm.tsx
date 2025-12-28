"use client";

import { useState } from "react";
import { PhoneCallIcon } from "./MortgageIcons";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    gdpr: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "hypotecni-kalkulacka",
        }),
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Jméno */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jméno a příjmení *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            placeholder="Jan Novák"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            placeholder="jan.novak@email.cz"
          />
        </div>

        {/* Telefon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefon *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            placeholder="+420 123 456 789"
          />
        </div>

        {/* Zpráva */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vaše zpráva (volitelné)
          </label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            placeholder="Například: Hledám hypotéku na byt v Praze..."
          />
        </div>

        {/* GDPR */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="gdpr"
            required
            checked={formData.gdpr}
            onChange={(e) => setFormData({ ...formData, gdpr: e.target.checked })}
            className="mt-1"
          />
          <label htmlFor="gdpr" className="text-sm text-gray-600">
            Souhlasím se{" "}
            <a href="/gdpr" className="text-brand-orange hover:underline">
              zpracováním osobních údajů
            </a>{" "}
            za účelem kontaktování hypotečním specialistou ZFP Reality. 
            Tento souhlas mohu kdykoli odvolat.
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Odesílám..." : "Chci nezávaznou nabídku"}
        </button>

        <p className="text-xs text-center text-gray-500">
          Odesláním formuláře beru na vědomí{" "}
          <a href="/zasady-zpracovani-osobnich-udaju" className="text-brand-orange hover:underline">
            Zásady zpracování osobních údajů
          </a>
        </p>
      </form>
    </div>
  );
}
