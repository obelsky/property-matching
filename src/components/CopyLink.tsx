"use client";

import { useState } from "react";

interface CopyLinkProps {
  url: string;
  label?: string;
}

export default function CopyLink({ url, label = "Váš soukromý odkaz" }: CopyLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">🔗</span>
        <div className="flex-1">
          <h3 className="font-bold text-blue-900 mb-1">{label}</h3>
          <p className="text-sm text-blue-800">
            Uložte si tento odkaz - můžete na něm sledovat stav a případně upřesnit údaje.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono"
          onClick={(e) => e.currentTarget.select()}
        />
        <button
          onClick={handleCopy}
          className={`px-6 py-2 rounded font-semibold transition-colors ${
            copied
              ? "bg-green-500 text-white"
              : "bg-brand-orange text-white hover:bg-brand-orange-hover"
          }`}
        >
          {copied ? "✓ Zkopírováno" : "📋 Kopírovat"}
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-3">
        💡 Tento odkaz je soukromý. Nesdílejte ho s nikým dalším.
      </p>
    </div>
  );
}
