"use client";

import { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";

const PROPERTY_STATES = [
  "Novostavba",
  "Po rekonstrukci",
  "Dobrý stav",
  "Před rekonstrukcí",
  "Ve výstavbě",
  "Nezáleží",
];

const CONSTRUCTION_TYPES = [
  "Cihlová",
  "Panelová",
  "Skeletová",
  "Dřevostavba",
  "Ostatní",
  "Nezáleží",
];

const COMFORT_FEATURES = [
  "Balkon/Lodžie",
  "Terasa",
  "Sklep",
  "Parkování",
  "Výtah",
  "Zahrada",
  "Nezáleží",
];

interface Step4Props {
  data: any;
  onUpdate: (updates: any) => void;
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

    if (state === "Nezáleží") {
      if (current.includes("Nezáleží")) {
        onUpdate({ preferred_state: [] });
      } else {
        onUpdate({ preferred_state: ["Nezáleží"] });
      }
      return;
    }

    if (current.includes("Nezáleží")) {
      onUpdate({ preferred_state: [state] });
    } else if (current.includes(state)) {
      onUpdate({ preferred_state: current.filter((s: string) => s !== state) });
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
      onUpdate({ preferred_construction: current.filter((c: string) => c !== construction) });
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
      onUpdate({ preferred_comfort: current.filter((c: string) => c !== comfort) });
    } else {
      onUpdate({ preferred_comfort: [...current, comfort] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validace fotek
    if (!data.photos || data.photos.length === 0) {
      const confirmed = confirm(
        "Nenahrali jste žádnou fotografii. Fotky výrazně zvyšují zájem. Pokračovat bez fotek?"
      );
      if (!confirmed) return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* FOTKY - NOVÉ! */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Fotografie nemovitosti <span className="text-brand-orange">*doporučeno</span>
        </h3>
        <PhotoUpload
          photos={data.photos || []}
          onPhotosChange={(photos) => onUpdate({ photos })}
          maxPhotos={10}
          minPhotos={1}
        />
      </div>

      {/* Stav */}
      <div>
        <h3 className="label-field">Stav nemovitosti (volitelné)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {PROPERTY_STATES.map((state) => (
            <label
              key={state}
              className={`
                flex items-center p-3 border rounded-lg cursor-pointer transition-colors text-sm
                ${
                  data.preferred_state?.includes(state)
                    ? "border-brand-orange bg-orange-50"
                    : "border-gray-300 hover:border-gray-400"
                }
              `}
            >
              <input
                type="checkbox"
                checked={data.preferred_state?.includes(state)}
                onChange={() => handleToggleState(state)}
                className="sr-only"
              />
              <span>{state}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggle pro další detaily */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="text-brand-orange hover:text-brand-orange-hover text-sm font-medium"
      >
        {showDetails ? "▼ Skrýt detaily" : "▶ Zobrazit další detaily (konstrukce, vybavení)"}
      </button>

      {showDetails && (
        <>
          {/* Konstrukce */}
          {(data.property_type === "byt" || data.property_type === "dum") && (
            <div>
              <h3 className="label-field">Typ konstrukce (volitelné)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {CONSTRUCTION_TYPES.map((construction) => (
                  <label
                    key={construction}
                    className={`
                      flex items-center p-3 border rounded-lg cursor-pointer transition-colors text-sm
                      ${
                        data.preferred_construction?.includes(construction)
                          ? "border-brand-orange bg-orange-50"
                          : "border-gray-300 hover:border-gray-400"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={data.preferred_construction?.includes(construction)}
                      onChange={() => handleToggleConstruction(construction)}
                      className="sr-only"
                    />
                    <span>{construction}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Vybavení */}
          <div>
            <h3 className="label-field">Vybavení (volitelné)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {COMFORT_FEATURES.map((comfort) => (
                <label
                  key={comfort}
                  className={`
                    flex items-center p-3 border rounded-lg cursor-pointer transition-colors text-sm
                    ${
                      data.preferred_comfort?.includes(comfort)
                        ? "border-brand-orange bg-orange-50"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={data.preferred_comfort?.includes(comfort)}
                    onChange={() => handleToggleComfort(comfort)}
                    className="sr-only"
                  />
                  <span>{comfort}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Zpět
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onEarlySubmit}
            className="px-4 py-2 text-sm text-brand-orange hover:text-brand-orange-hover"
          >
            ⚡ Odeslat hned
          </button>
          <button type="submit" className="btn-primary">
            Pokračovat →
          </button>
        </div>
      </div>
    </form>
  );
}
