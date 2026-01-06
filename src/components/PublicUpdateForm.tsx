"use client";

import { useState, FormEvent } from "react";

interface PublicUpdateFormProps {
  type: "listing" | "request";
  id: string;
  token: string;
  currentData: {
    price?: number | null;
    budget?: number | null;
    area?: number | null;
    location?: string;
  };
}

export default function PublicUpdateForm({
  type,
  id,
  token,
  currentData,
}: PublicUpdateFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    price: currentData.price?.toString() || currentData.budget?.toString() || "",
    area: currentData.area?.toString() || "",
    location: currentData.location || "",
    note: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/public/update-${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          token,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Nepodařilo se uložit změny");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isListing = type === "listing";

  return (
    <div className="bg-zfp-card rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-heading font-bold text-zfp-text mb-4">
        Chcete upřesnit údaje?
      </h2>

      {!isOpen ? (
        <div>
          <p className="text-zfp-text-muted mb-4">
            Můžete doplnit nebo upřesnit informace o vaší{" "}
            {isListing ? "nabídce" : "poptávce"}.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="btn-primary"
          >
            📝 Chci upřesnit údaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="bg-success/10 border border-green-200 text-green-700 px-4 py-3 rounded">
              ✓ Údaje byly úspěšně uloženy! Makléř je zkontroluje.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="price" className="label-field">
              {isListing ? "Cena (Kč)" : "Max. rozpočet (Kč)"}
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="input-field"
              placeholder={isListing ? "12000000" : "8000000"}
            />
          </div>

          <div>
            <label htmlFor="area" className="label-field">
              {isListing ? "Plocha (m²)" : "Min. plocha (m²)"}
            </label>
            <input
              type="number"
              id="area"
              value={formData.area}
              onChange={(e) =>
                setFormData({ ...formData, area: e.target.value })
              }
              className="input-field"
              placeholder="100"
            />
          </div>

          <div>
            <label htmlFor="location" className="label-field">
              Upřesnění lokality
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="input-field"
              placeholder="Např. Vinohrady, blízko metra..."
            />
          </div>

          <div>
            <label htmlFor="note" className="label-field">
              Poznámka (volitelně)
            </label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="input-field"
              rows={3}
              placeholder="Další informace nebo upřesnění..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Ukládám..." : "💾 Uložit změny"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 border border-zfp-border rounded-lg hover:bg-zfp-card transition-colors"
            >
              Zrušit
            </button>
          </div>

          <p className="text-sm text-zfp-text-muted">
            💡 Vaše změny budou zkontrolovány makléřem před uložením.
          </p>
        </form>
      )}
    </div>
  );
}
