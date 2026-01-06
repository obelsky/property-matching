"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/components/AdminNav";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadLead();
  }, [leadId]);

  const loadLead = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (error) {
      console.error("Error loading lead:", error);
    } else {
      setLead(data);
      setSelectedStatus(data.status);
      setNotes(data.notes || "");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("leads")
      .update({ 
        status: selectedStatus,
        notes: notes
      })
      .eq("id", leadId);

    if (error) {
      console.error("Error updating lead:", error);
      alert("Chyba při ukládání");
    } else {
      alert("Uloženo!");
      loadLead();
    }
    setSaving(false);
  };

  const statusLabels: Record<string, string> = {
    new: "Nový",
    contacted: "Kontaktován",
    qualified: "Kvalifikovaný",
    converted: "Konvertovaný",
    rejected: "Odmítnutý",
  };

  const sourceLabels: Record<string, string> = {
    "hypotecni-kalkulacka": "Hypoteční kalkulačka",
    "kontakt-formular": "Kontaktní formulář",
    "unknown": "Neznámý",
  };

  if (loading) {
    return (
      <div className="bg-zfp-darker min-h-screen py-8">
        <div className="container max-w-7xl">
          <AdminNav />
          <div className="card-dark p-8 text-center">
            <p className="text-zfp-text-muted">Načítání...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="bg-zfp-darker min-h-screen py-8">
        <div className="container max-w-7xl">
          <AdminNav />
          <div className="card-dark p-8 text-center">
            <p className="text-error">Lead nenalezen</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zfp-darker min-h-screen py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading text-zfp-text">
            Admin Dashboard
          </h1>
          <p className="text-zfp-text-muted mt-1">
            Detail kontaktu
          </p>
        </div>

        <AdminNav />

        {/* Back button */}
        <button
          onClick={() => router.push("/admin/leads")}
          className="mb-6 text-brand-gold hover:text-brand-orange transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zpět na seznam
        </button>

        {/* Základní info */}
        <div className="card-dark p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading text-zfp-text">
              {lead.name}
            </h2>
            <span className="badge badge-info">
              {sourceLabels[lead.source] || lead.source}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading text-brand-gold text-lg mb-4">Kontaktní údaje</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-zfp-text-muted">Email</dt>
                  <dd>
                    <a href={`mailto:${lead.email}`} className="text-brand-gold hover:text-brand-orange transition-colors">
                      {lead.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-zfp-text-muted">Telefon</dt>
                  <dd>
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className="text-brand-gold hover:text-brand-orange transition-colors">
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-zfp-text-subtle">—</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-zfp-text-muted">Datum vytvoření</dt>
                  <dd className="text-zfp-text">
                    {new Date(lead.created_at).toLocaleDateString("cs-CZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="font-heading text-brand-gold text-lg mb-4">Zpráva od klienta</h3>
              {lead.message ? (
                <div className="card p-4">
                  <p className="text-zfp-text-muted">{lead.message}</p>
                </div>
              ) : (
                <p className="text-zfp-text-subtle italic">Žádná zpráva</p>
              )}
            </div>
          </div>
        </div>

        {/* Hypoteční kalkulačka data */}
        {lead.calculator_data && (
          <div className="card-accent p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-heading text-zfp-text">
                  Data z hypoteční kalkulačky
                </h2>
                <p className="text-sm text-zfp-text-muted mt-1">
                  Klient nastavil osobní preference v kalkulačce
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Hlavní výsledek - Měsíční splátka */}
              <div className="lg:col-span-2 bg-gradient-gold rounded-xl p-6 text-white shadow-lg">
                <p className="text-sm opacity-90 mb-1">Měsíční splátka</p>
                <p className="text-4xl font-bold">
                  {Number(lead.calculator_data.monthlyPayment).toLocaleString("cs-CZ", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })} Kč
                </p>
              </div>

              {/* Cena nemovitosti */}
              <div className="card p-4">
                <p className="text-sm text-zfp-text-muted mb-1">Cena nemovitosti</p>
                <p className="text-xl font-bold text-zfp-text">
                  {Number(lead.calculator_data.propertyPrice).toLocaleString("cs-CZ")} Kč
                </p>
              </div>

              {/* Vlastní zdroje */}
              <div className="card p-4">
                <p className="text-sm text-zfp-text-muted mb-1">Vlastní zdroje</p>
                <p className="text-xl font-bold text-brand-gold">
                  {lead.calculator_data.downPaymentPercent}%
                  <span className="text-sm text-zfp-text-subtle ml-2">
                    ({Number(lead.calculator_data.propertyPrice * lead.calculator_data.downPaymentPercent / 100).toLocaleString("cs-CZ")} Kč)
                  </span>
                </p>
              </div>

              {/* Výše hypotéky */}
              <div className="card p-4">
                <p className="text-sm text-zfp-text-muted mb-1">Výše hypotéky</p>
                <p className="text-xl font-bold text-zfp-text">
                  {Number(lead.calculator_data.loanAmount).toLocaleString("cs-CZ")} Kč
                </p>
              </div>

              {/* LTV */}
              <div className="card p-4">
                <p className="text-sm text-zfp-text-muted mb-1">LTV ratio</p>
                <p className="text-xl font-bold text-zfp-text">
                  {Number(lead.calculator_data.ltv).toFixed(0)}%
                </p>
              </div>

              {/* Doba splácení */}
              <div className="card p-4">
                <p className="text-sm text-zfp-text-muted mb-1">Doba splácení</p>
                <p className="text-xl font-bold text-zfp-text">
                  {lead.calculator_data.years} let
                </p>
              </div>

              {/* Úroková sazba */}
              <div className="card p-4">
                <p className="text-sm text-zfp-text-muted mb-1">Úroková sazba</p>
                <p className="text-xl font-bold text-zfp-text">
                  {Number(lead.calculator_data.interestRate).toFixed(2)}%
                </p>
              </div>

              {/* Celkový úrok */}
              <div className="card p-4">
                <p className="text-sm text-zfp-text-muted mb-1">Celkový úrok</p>
                <p className="text-xl font-bold text-brand-orange">
                  {Number(lead.calculator_data.totalInterest).toLocaleString("cs-CZ")} Kč
                </p>
              </div>

              {/* Celková částka */}
              <div className="card p-4">
                <p className="text-sm text-zfp-text-muted mb-1">Celková částka</p>
                <p className="text-xl font-bold text-zfp-text">
                  {Number(lead.calculator_data.totalAmount || (lead.calculator_data.loanAmount + lead.calculator_data.totalInterest)).toLocaleString("cs-CZ")} Kč
                </p>
              </div>

              {/* Zpětná hypotéka */}
              {lead.calculator_data.isReverseMortgage && (
                <div className="lg:col-span-2">
                  <span className="badge badge-gold">
                    ✓ Zpětná hypotéka zahrnuta
                  </span>
                </div>
              )}
            </div>

            {/* Timestamp */}
            <p className="text-xs text-zfp-text-subtle mt-4">
              Kalkulace provedena: {new Date(lead.calculator_data.timestamp).toLocaleString("cs-CZ")}
            </p>
          </div>
        )}

        {/* Status a poznámky */}
        <div className="card-dark p-8">
          <h2 className="text-2xl font-heading text-zfp-text mb-6">
            Správa leadu
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="label-field">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Poznámky */}
            <div className="md:col-span-2">
              <label className="label-field">Poznámky</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Interní poznámky k leadu..."
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? "Ukládám..." : "Uložit změny"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
