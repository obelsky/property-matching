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

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    qualified: "bg-green-100 text-green-800",
    converted: "bg-purple-100 text-purple-800",
    rejected: "bg-gray-100 text-gray-800",
  };

  const sourceLabels: Record<string, string> = {
    "hypotecni-kalkulacka": "Hypoteční kalkulačka",
    "kontakt-formular": "Kontaktní formulář",
    "unknown": "Neznámý",
  };

  if (loading) {
    return (
      <div className="bg-zfp-bg-light min-h-screen py-8">
        <div className="container max-w-7xl">
          <AdminNav />
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">Načítání...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="bg-zfp-bg-light min-h-screen py-8">
        <div className="container max-w-7xl">
          <AdminNav />
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-red-600">Lead nenalezen</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zfp-bg-light min-h-screen py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-zfp-text">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Detail kontaktu
          </p>
        </div>

        {/* Navigation */}
        <AdminNav />

        {/* Lead Detail */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zfp-text">
                {lead.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[lead.status]}`}>
                  {statusLabels[lead.status]}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {sourceLabels[lead.source]}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push("/admin/leads")}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Zpět na přehled
            </button>
          </div>

          {/* Kontaktní informace */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Kontaktní údaje</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Email:</dt>
                  <dd className="font-semibold">
                    <a href={`mailto:${lead.email}`} className="text-brand-orange hover:underline">
                      {lead.email}
                    </a>
                  </dd>
                </div>
                {lead.phone && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Telefon:</dt>
                    <dd className="font-semibold">
                      <a href={`tel:${lead.phone}`} className="text-brand-orange hover:underline">
                        {lead.phone}
                      </a>
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Vytvořeno:</dt>
                  <dd className="font-semibold">
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
              <h3 className="font-semibold text-lg mb-3">Zpráva od klienta</h3>
              {lead.message ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{lead.message}</p>
                </div>
              ) : (
                <p className="text-gray-400 italic">Žádná zpráva</p>
              )}
            </div>
          </div>
        </div>

        {/* Hypoteční kalkulačka data */}
        {lead.calculator_data && (
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg border-2 border-purple-300 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">
                  📊 Data z hypoteční kalkulačky
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Klient nastavil osobní preference v kalkulačce
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Hlavní výsledek - Měsíční splátka */}
              <div className="md:col-span-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
                <p className="text-sm opacity-90 mb-1">Měsíční splátka</p>
                <p className="text-4xl font-bold">
                  {Number(lead.calculator_data.monthlyPayment).toLocaleString("cs-CZ", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })} Kč
                </p>
              </div>

              {/* Cena nemovitosti */}
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <p className="text-sm text-gray-600 mb-1">Cena nemovitosti</p>
                <p className="text-xl font-bold text-gray-900">
                  {Number(lead.calculator_data.propertyPrice).toLocaleString("cs-CZ")} Kč
                </p>
              </div>

              {/* Vlastní zdroje */}
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <p className="text-sm text-gray-600 mb-1">Vlastní zdroje</p>
                <p className="text-xl font-bold text-purple-700">
                  {lead.calculator_data.downPaymentPercent}%
                  <span className="text-sm text-gray-500 ml-2">
                    ({Number(lead.calculator_data.propertyPrice * lead.calculator_data.downPaymentPercent / 100).toLocaleString("cs-CZ")} Kč)
                  </span>
                </p>
              </div>

              {/* Výše hypotéky */}
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <p className="text-sm text-gray-600 mb-1">Výše hypotéky</p>
                <p className="text-xl font-bold text-gray-900">
                  {Number(lead.calculator_data.loanAmount).toLocaleString("cs-CZ")} Kč
                </p>
              </div>

              {/* LTV */}
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <p className="text-sm text-gray-600 mb-1">LTV ratio</p>
                <p className="text-xl font-bold text-gray-900">
                  {Number(lead.calculator_data.ltv).toFixed(0)}%
                </p>
              </div>

              {/* Doba splácení */}
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <p className="text-sm text-gray-600 mb-1">Doba splácení</p>
                <p className="text-xl font-bold text-gray-900">
                  {lead.calculator_data.years} let
                </p>
              </div>

              {/* Úroková sazba */}
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <p className="text-sm text-gray-600 mb-1">Úroková sazba</p>
                <p className="text-xl font-bold text-gray-900">
                  {Number(lead.calculator_data.interestRate).toFixed(2)}%
                </p>
              </div>

              {/* Celkový úrok */}
              <div className="md:col-span-2 bg-white rounded-lg border border-orange-200 p-4">
                <p className="text-sm text-gray-600 mb-1">Celkový úrok (náklad)</p>
                <p className="text-xl font-bold text-orange-600">
                  {Number(lead.calculator_data.totalInterest).toLocaleString("cs-CZ")} Kč
                </p>
              </div>

              {/* Zpětná hypotéka badge */}
              {lead.calculator_data.isReverseMortgage && (
                <div className="md:col-span-3 bg-purple-100 border border-purple-300 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold text-purple-900">
                      Zpětná hypotéka (0% vlastních zdrojů)
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="md:col-span-3 text-center pt-4 border-t border-purple-200">
                <p className="text-xs text-gray-500">
                  Kalkulačka použita: {new Date(lead.calculator_data.timestamp).toLocaleString("cs-CZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Změna stavu */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-zfp-text mb-4">
            Změnit stav
          </h3>
          
          <div className="grid md:grid-cols-5 gap-4 mb-6">
            {Object.entries(statusLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSelectedStatus(value)}
                className={`
                  px-4 py-3 rounded-lg font-medium transition-all
                  ${selectedStatus === value
                    ? statusColors[value] + " ring-2 ring-offset-2 ring-brand-orange"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poznámky
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              placeholder="Interní poznámky k tomuto leadu..."
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Ukládám..." : "Uložit změny"}
          </button>
        </div>
      </div>
    </div>
  );
}
