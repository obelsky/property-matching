"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const listingId = params.id as string;
  const token = searchParams.get("token");

  const [listing, setListing] = useState<any>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadListing();
  }, [listingId, token]);

  const loadListing = async () => {
    if (!token) {
      setError("Chybí autorizační token");
      return;
    }

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .eq("public_token", token)
      .single();

    if (error || !data) {
      setError("Nabídka nenalezena");
      return;
    }

    setListing(data);
    setNote(data.public_note || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const { error } = await supabase
        .from("listings")
        .update({ public_note: note })
        .eq("id", listingId)
        .eq("public_token", token);

      if (error) throw error;

      // Redirect back to detail
      router.push(`/moje/nabidka/${listingId}?token=${token}`);
    } catch (err) {
      setError("Chyba při ukládání. Zkuste to znovu.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="bg-zfp-darker min-h-screen py-12">
        <div className="container max-w-2xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="bg-zfp-darker min-h-screen py-12">
        <div className="container max-w-2xl">
          <div className="bg-zfp-dark rounded-xl shadow-lg p-6 text-center">
            <p className="text-zfp-text-muted">Načítání...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zfp-darker min-h-screen py-12">
      <div className="container max-w-2xl">
        <div className="bg-zfp-dark rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
            Upřesnit údaje nabídky
          </h1>
          <p className="text-zfp-text-muted mb-6">
            {listing.type} {listing.layout && listing.layout} · {listing.city}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zfp-text mb-2">
                Co chcete upřesnit nebo doplnit?
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-zfp-border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                placeholder="Například: 
- Další informace o stavu nemovitosti
- Upřesnění ceny nebo podmínek
- Doplnění vybavení
- Změna kontaktních údajů
- Jakékoliv další poznámky"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Makléř uvidí vaše poznámky a kontaktuje vás s upřesněnými informacemi.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? "Ukládám..." : "Uložit změny"}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/moje/nabidka/${listingId}?token=${token}`)}
                className="px-6 py-3 border border-zfp-border rounded-lg hover:bg-zfp-card transition-colors"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
