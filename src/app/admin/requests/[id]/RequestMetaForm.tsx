"use client";

import { useState } from "react";
import { updateRequestMeta } from "./actions";
import { RequestStatus, Agent } from "@/lib/types";

interface RequestMetaFormProps {
  requestId: string;
  currentStatus: RequestStatus;
  currentAgentId: string | null;
  agents: Agent[];
}

const statusLabels: Record<RequestStatus, string> = {
  new: "Nová",
  active: "Aktivní",
  paused: "Pozastavená",
  resolved: "Vyřešená",
  archived: "Archivovaná",
};

export default function RequestMetaForm({
  requestId,
  currentStatus,
  currentAgentId,
  agents,
}: RequestMetaFormProps) {
  const [status, setStatus] = useState<RequestStatus>(currentStatus);
  const [agentId, setAgentId] = useState<string>(currentAgentId || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await updateRequestMeta(
      requestId,
      status,
      agentId || null
    );

    if (result.success) {
      setMessage({ type: "success", text: "Uloženo!" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: result.error || "Chyba při ukládání" });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`px-4 py-3 rounded ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label htmlFor="status" className="label-field">
          Stav
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as RequestStatus)}
          className="input-field"
        >
          {(Object.keys(statusLabels) as RequestStatus[]).map((key) => (
            <option key={key} value={key}>
              {statusLabels[key]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="agent" className="label-field">
          Makléř
        </label>
        <select
          id="agent"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          className="input-field"
        >
          <option value="">— Bez makléře —</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Ukládám..." : "Uložit"}
      </button>
    </form>
  );
}
