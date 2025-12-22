"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function PoptavkaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/poptavka", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Něco se pokazilo");
      }

      router.push(`/dekujeme/poptavka/${data.requestId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba při odesílání");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-zfp-bg-light py-12">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
            Hledám nemovitost
          </h1>
          <p className="text-gray-600 mb-8">
            Vyplňte požadavky na nemovitost a my najdeme vhodné nabídky
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Typ nemovitosti */}
            <div>
              <label className="label-field">Typ nemovitosti *</label>
              <select name="type" required className="input-field">
                <option value="">Vyberte typ</option>
                <option value="byt">Byt</option>
                <option value="dum">Dům</option>
                <option value="pozemek">Pozemek</option>
              </select>
            </div>

            {/* Minimální dispozice */}
            <div>
              <label className="label-field">Minimální dispozice</label>
              <input
                type="text"
                name="layout_min"
                placeholder="např. 2+kk, 3+1"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nevyplňujte pro pozemky
              </p>
            </div>

            {/* Lokalita */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Město *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="např. Brno"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Městská část</label>
                <input
                  type="text"
                  name="district"
                  placeholder="např. Brno-střed"
                  className="input-field"
                />
              </div>
            </div>

            {/* Poloměr */}
            <div>
              <label className="label-field">Poloměr hledání (km)</label>
              <input
                type="number"
                name="radius_km"
                defaultValue="20"
                min="1"
                max="100"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ve výchozím nastavení 20 km
              </p>
            </div>

            {/* Budget a min. plocha */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Maximální rozpočet (Kč)</label>
                <input
                  type="number"
                  name="budget_max"
                  placeholder="např. 5000000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Minimální plocha (m²)</label>
                <input
                  type="number"
                  name="area_min_m2"
                  placeholder="např. 60"
                  className="input-field"
                />
              </div>
            </div>

            {/* Kontakt */}
            <div className="border-t pt-6">
              <h3 className="font-heading font-semibold text-lg mb-4">
                Kontaktní údaje
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label-field">E-mail *</label>
                  <input
                    type="email"
                    name="contact_email"
                    required
                    placeholder="vas@email.cz"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Telefon</label>
                  <input
                    type="tel"
                    name="contact_phone"
                    placeholder="+420 123 456 789"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
                disabled={isSubmitting}
              >
                Zpět
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Odesílám..." : "Odeslat poptávku"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
