"use client";

import { useState } from "react";
import { RequestFormData } from "@/lib/formTypes";
import {
  PROPERTY_STATES,
  CONSTRUCTION_TYPES,
  COMFORT_FEATURES,
} from "@/lib/formConstants";

interface Step4Props {
  data: Partial<RequestFormData>;
  onUpdate: (updates: Partial<RequestFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onEarlySubmit: () => void;
}

export default function Step4({
  data,
  onUpdate,
  onNext,
  onBack,
  onEarlySubmit,
}: Step4Props) {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleState = (state: string) => {
    const current = data.preferred_state || [];

    // "Nezáleží" logic
    if (state === "Nezáleží") {
      if (current.includes("Nezáleží")) {
        onUpdate({ preferred_state: [] });
      } else {
        onUpdate({ preferred_state: ["Nezáleží"] });
      }
      return;
    }

    // Normal checkbox
    if (current.includes("Nezáleží")) {
      onUpdate({ preferred_state: [state] });
    } else if (current.includes(state)) {
      onUpdate({ preferred_state: current.filter((s) => s !== state) });
    } else {
      onUpdate({ preferred_state: [...current, state] });
    }
  };

  const handleToggleConstruction = (construction: string) => {
    const current = data.preferred_construction || [];

    if (construction === "Nezáleží") {
      if (current.includes("Nezáleží")) {
        onUpdate({ preferred_construction: [] });
      } else {
        onUpdate({ preferred_construction: ["Nezáleží"] });
      }
      return;
    }

    if (current.includes("Nezáleží")) {
      onUpdate({ preferred_construction: [construction] });
    } else if (current.includes(construction)) {
      onUpdate({ preferred_construction: current.filter((c) => c !== construction) });
    } else {
      onUpdate({ preferred_construction: [...current, construction] });
    }
  };

  const handleToggleComfort = (comfort: string) => {
    const current = data.preferred_comfort || [];

    if (comfort === "Nezáleží") {
      if (current.includes("Nezáleží")) {
        onUpdate({ preferred_comfort: [] });
      } else {
        onUpdate({ preferred_comfort: ["Nezáleží"] });
      }
      return;
    }

    if (current.includes("Nezáleží")) {
      onUpdate({ preferred_comfort: [comfort] });
    } else if (current.includes(comfort)) {
      onUpdate({ preferred_comfort: current.filter((c) => c !== comfort) });
    } else {
      onUpdate({ preferred_comfort: [...current, comfort] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const stateNezalezi = data.preferred_state?.includes("Nezáleží") || false;
  const constructionNezalezi = data.preferred_construction?.includes("Nezáleží") || false;
  const comfortNezalezi = data.preferred_comfort?.includes("Nezáleží") || false;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-zfp-text-muted">
        Všechny sekce jsou volitelné. Upřesněte jen pokud máte konkrétní preference.
      </p>

      {/* Rozbalit/Sbalit */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 text-brand-orange hover:underline font-semibold"
      >
        <span className="text-lg">{showDetails ? "▼" : "▶"}</span>
        <span>Upřesnit stav a vybavení (volitelné)</span>
      </button>

      {showDetails && (
        <div className="space-y-8 pl-6 border-l-2 border-zfp-border">
          {/* Stav nemovitosti */}
          <div>
            <label className="label-field">Stav nemovitosti</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {PROPERTY_STATES.map((state) => {
                const isChecked = data.preferred_state?.includes(state) || false;

                return (
                  <label
                    key={state}
                    className={`
                      flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors
                      ${
                        isChecked
                          ? "border-brand-orange bg-brand-orange/10"
                          : "border-zfp-border hover:border-zfp-border-hover"
                      }
                      ${stateNezalezi && state !== "Nezáleží" ? "opacity-50" : ""}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleState(state)}
                      disabled={stateNezalezi && state !== "Nezáleží"}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{state}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Konstrukce - jen pro byt/dům */}
          {(data.property_type === "byt" || data.property_type === "dum") && (
            <div>
              <label className="label-field">Konstrukce</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {CONSTRUCTION_TYPES.map((construction) => {
                  const isChecked =
                    data.preferred_construction?.includes(construction) || false;

                  return (
                    <label
                      key={construction}
                      className={`
                        flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors
                        ${
                          isChecked
                            ? "border-brand-orange bg-brand-orange/10"
                            : "border-zfp-border hover:border-zfp-border-hover"
                        }
                        ${
                          constructionNezalezi && construction !== "Nezáleží"
                            ? "opacity-50"
                            : ""
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleConstruction(construction)}
                        disabled={constructionNezalezi && construction !== "Nezáleží"}
                        className="sr-only"
                      />
                      <span className="text-sm font-semibold">{construction}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vybavení/Komfort */}
          <div>
            <label className="label-field">Vybavení a komfort</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {COMFORT_FEATURES.map((comfort) => {
                const isChecked = data.preferred_comfort?.includes(comfort) || false;

                return (
                  <label
                    key={comfort}
                    className={`
                      flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors
                      ${
                        isChecked
                          ? "border-brand-orange bg-brand-orange/10"
                          : "border-zfp-border hover:border-zfp-border-hover"
                      }
                      ${comfortNezalezi && comfort !== "Nezáleží" ? "opacity-50" : ""}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleComfort(comfort)}
                      disabled={comfortNezalezi && comfort !== "Nezáleží"}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{comfort}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-zfp-border rounded-lg hover:bg-zfp-card transition-colors"
        >
          ← Zpět
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onEarlySubmit}
            className="text-brand-orange hover:underline text-sm"
          >
            Už stačí, ozvěte se mi →
          </button>
          <button type="submit" className="btn-primary">
            Pokračovat →
          </button>
        </div>
      </div>
    </form>
  );
}
