"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NabidkaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Přidej fotky do FormData
    photos.forEach((photo, index) => {
      formData.append(`photo_${index}`, photo);
    });

    try {
      const response = await fetch("/api/nabidka", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Něco se pokazilo");
      }

      // Přesměruj na děkovací stránku s ID
      router.push(`/dekujeme/nabidka/${data.listingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba při odesílání");
      setIsSubmitting(false);
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).slice(0, 5);
      setPhotos(newPhotos);
    }
  }

  return (
    <div className="bg-zfp-bg-light py-12">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
            Nabídnout nemovitost
          </h1>
          <p className="text-gray-600 mb-8">
            Vyplňte údaje o vaší nemovitosti a my najdeme vhodné zájemce
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

            {/* Dispozice */}
            <div>
              <label className="label-field">Dispozice</label>
              <input
                type="text"
                name="layout"
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

            {/* PSČ */}
            <div>
              <label className="label-field">PSČ</label>
              <input
                type="text"
                name="zipcode"
                placeholder="např. 602 00"
                className="input-field"
              />
            </div>

            {/* Cena a plocha */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Cena (Kč)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="např. 5000000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Plocha (m²)</label>
                <input
                  type="number"
                  name="area_m2"
                  placeholder="např. 75"
                  className="input-field"
                />
              </div>
            </div>

            {/* Fotky */}
            <div>
              <label className="label-field">Fotografie (max. 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="input-field"
              />
              {photos.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Vybrané fotky: {photos.length}
                </p>
              )}
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
                {isSubmitting ? "Odesílám..." : "Odeslat nabídku"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
