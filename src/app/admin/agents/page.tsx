import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import LogoutButton from "@/components/LogoutButton";
import AgentForm from "./AgentForm";
import { Agent } from "@/lib/types";

// Force dynamic rendering (depends on DB + auth)
export const dynamic = 'force-dynamic';

async function getAgents() {
  const { data: agents, error } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching agents:", error);
    return [];
  }

  return agents as Agent[];
}

export default async function AgentsPage() {
  // Kontrola autentizace
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const agents = await getAgents();

  return (
    <div className="bg-zfp-bg-light py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-zfp-text mb-2">
              Makléři
            </h1>
            <p className="text-gray-600">
              Správa makléřů pro přiřazení k nabídkám a poptávkám
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Navigace */}
        <AdminNav />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulář pro přidání */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-heading font-bold text-zfp-text mb-4">
                Přidat makléře
              </h2>
              <AgentForm />
            </div>
          </div>

          {/* Seznam makléřů */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-heading font-bold text-zfp-text mb-6">
                Seznam makléřů ({agents.length})
              </h2>

              {agents.length > 0 ? (
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-zfp-text mb-2">
                            {agent.name}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            {agent.email && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">✉</span>
                                <a
                                  href={`mailto:${agent.email}`}
                                  className="text-brand-orange hover:underline"
                                >
                                  {agent.email}
                                </a>
                              </div>
                            )}
                            {agent.phone && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">📞</span>
                                <a
                                  href={`tel:${agent.phone}`}
                                  className="text-brand-orange hover:underline"
                                >
                                  {agent.phone}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                              <span>📅</span>
                              Vytvořeno:{" "}
                              {new Date(agent.created_at).toLocaleDateString(
                                "cs-CZ"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">Zatím nejsou žádní makléři</p>
                  <p className="text-sm">
                    Použijte formulář vlevo pro přidání prvního makléře
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
