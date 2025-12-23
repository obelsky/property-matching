"use client";

import { useState } from "react";
import { updateListingMeta } from "./actions";
import { ListingStatus, Agent } from "@/lib/types";

interface ListingMetaFormProps {
  listingId: string;
  currentStatus: ListingStatus;
  currentAgentId: string | null;
  agents: Agent[];
}

const statusLabels: Record<ListingStatus, string> = {
  new: "Nová",
  verified: "Ověřená",
  active: "Aktivní",
  reserved: "Rezervovaná",
  closed: "Uzavřená",
  archived: "Archivovaná",
};

export default function ListingMetaForm({
  listingId,
  currentStatus,
  currentAgentId,
  agents,
}: ListingMetaFormProps) {
  const [status, setStatus] = useState<ListingStatus>(currentStatus);
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

    const result = await updateListingMeta(
      listingId,
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
          onChange={(e) => setStatus(e.target.value as ListingStatus)}
          className="input-field"
        >
          {(Object.keys(statusLabels) as ListingStatus[]).map((key) => (
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
