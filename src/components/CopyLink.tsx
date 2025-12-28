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
    <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50 border border-purple-200 rounded-2xl shadow-xl p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{label}</h3>
          <p className="text-gray-600 leading-relaxed">
            Uložte si tento odkaz - můžete na něm sledovat stav poptávky a případně upřesnit údaje.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={(e) => e.currentTarget.select()}
          />
          <button
            onClick={handleCopy}
            className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md ${
              copied
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-brand-orange text-white hover:bg-brand-orange-hover hover:shadow-lg"
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Zkopírováno
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Kopírovat
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Důležité:</span> Tento odkaz je soukromý. Nesdílejte ho s nikým dalším.
        </p>
      </div>
    </div>
  );
}
