"use client";

import { useState } from "react";
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
      alert("Vyplňte prosím všechny povinné údaje");
      return;
    }

    onSubmit();
  };

  // Zkontrolovat zda financování obsahuje hypotéku
  const needsMortgage = 
    data.financing_methods?.includes("hypoteka") || 
    data.financing_methods?.includes("kombinace");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success message */}
      <div className="bg-success/10 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900">Poslední krok!</h3>
            <p className="text-sm text-green-700 mt-1">
              Vyplňte kontaktní údaje a my vás budeme informovat o vhodných nabídkách.
            </p>
          </div>
        </div>
      </div>

      {/* Jméno */}
      <div>
        <label htmlFor="contact_name" className="label-field">
          Jméno a příjmení *
        </label>
        <input
          type="text"
          id="contact_name"
          value={data.contact_name || ""}
          onChange={(e) => onUpdate({ contact_name: e.target.value })}
          placeholder="Ondřej Bělský"
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
          placeholder="Obelsky@gmail.com"
          className="input-field"
          required
        />
        <p className="text-sm text-zfp-text-muted mt-1">
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

      {/* HYPOTEČNÍ KALKULAČKA VÝZVA - pouze když potřebuje hypotéku */}
      {needsMortgage && (
        <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-300 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-zfp-text text-lg mb-2">
                💡 Potřebujete hypotéku?
              </h3>
              <p className="text-sm text-zfp-text mb-4">
                Vyzkoušejte naši hypoteční kalkulačku a zjistěte, jakou výši hypotéky
                můžete získat a jaká bude vaše měsíční splátka.
              </p>
              <Link
                href="/hypotecni-kalkulacka"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Spočítat hypotéku
              </Link>
              <p className="text-xs text-zfp-text-muted mt-3">
                Kalkulačka se otevře v nové záložce. Můžete se k ní vrátit kdykoli.
              </p>
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
          rows={4}
          className="input-field"
        />
      </div>

      {/* GDPR */}
      <div className="bg-zfp-card border border-zfp-border rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-1 w-5 h-5 text-brand-orange rounded"
          />
          <span className="text-sm text-zfp-text">
            Souhlasím se{" "}
            <span className="text-brand-orange font-medium">zpracováním osobních údajů</span>{" "}
            za účelem kontaktování hypotečním specialistou ZFP Reality. Jsem oprávněn kdykoli svůj souhlas odvolat.
            Více informací v{" "}
            <Link
              href="/zasady-ochrany-osobnich-udaju"
              className="text-brand-orange hover:underline"
            >
              zásadách ochrany osobních údajů
            </Link>
            .
          </span>
        </label>
      </div>

      {/* Navigační tlačítka */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Zpět
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? "Odesílám..." : "Odeslat poptávku"}
        </button>
      </div>
    </form>
  );
}
