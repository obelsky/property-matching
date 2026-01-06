import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function LeadsPage() {
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading leads:", error);
  }

  const statusLabels: Record<string, string> = {
    new: "Nový",
    contacted: "Kontaktován",
    qualified: "Kvalifikovaný",
    converted: "Konvertovaný",
    rejected: "Odmítnutý",
  };

  const statusColors: Record<string, string> = {
    new: "badge-info",
    contacted: "badge-warning",
    qualified: "badge-success",
    converted: "badge-gold",
    rejected: "badge-error",
  };

  const sourceLabels: Record<string, string> = {
    "hypotecni-kalkulacka": "Hypoteční kalkulačka",
    "kontakt-formular": "Kontaktní formulář",
    "unknown": "Neznámý",
  };

  return (
    <div className="bg-zfp-darker min-h-screen py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading text-zfp-text">
            Admin Dashboard
          </h1>
          <p className="text-zfp-text-muted mt-1">
            Přehled nabídek a poptávek
          </p>
        </div>

        {/* Navigation Tabs */}
        <AdminNav />

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm text-zfp-text-muted">Celkem leadů</span>
            </div>
            <p className="text-3xl font-bold text-brand-gold">
              {leads?.length || 0}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-zfp-text-muted">Nové</span>
            </div>
            <p className="text-3xl font-bold text-warning">
              {leads?.filter((l) => l.status === "new").length || 0}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-zfp-text-muted">Kvalifikované</span>
            </div>
            <p className="text-3xl font-bold text-success">
              {leads?.filter((l) => l.status === "qualified").length || 0}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-zfp-text-muted">Konvertované</span>
            </div>
            <p className="text-3xl font-bold text-brand-gold">
              {leads?.filter((l) => l.status === "converted").length || 0}
            </p>
          </div>
        </div>

        {/* Tabulka leadů */}
        <div className="card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zfp-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zfp-text-muted uppercase tracking-wider">
                    Jméno
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zfp-text-muted uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zfp-text-muted uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zfp-text-muted uppercase tracking-wider">
                    Zdroj
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zfp-text-muted uppercase tracking-wider">
                    Stav
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zfp-text-muted uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zfp-text-muted uppercase tracking-wider">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zfp-border">
                {leads && leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-zfp-card transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium text-zfp-text">
                              {lead.name}
                            </div>
                            {lead.message && (
                              <div className="text-xs text-zfp-text-subtle mt-1 max-w-xs truncate">
                                {lead.message}
                              </div>
                            )}
                          </div>
                          {lead.calculator_data && (
                            <span className="badge badge-gold" title="Lead obsahuje data z kalkulačky">
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              Kalkulačka
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-brand-gold hover:text-brand-orange transition-colors"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-brand-gold hover:text-brand-orange transition-colors"
                          >
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="text-zfp-text-subtle">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-info">
                          {sourceLabels[lead.source] || lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${statusColors[lead.status] || "badge-gold"}`}>
                          {statusLabels[lead.status] || lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zfp-text-muted">
                        {new Date(lead.created_at).toLocaleDateString("cs-CZ", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-brand-gold hover:text-brand-orange font-medium transition-colors"
                        >
                          Detail →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zfp-text-muted">
                      Zatím žádné leady
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
