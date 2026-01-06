"use client";

import {
  BYT_DISPOSITIONS,
  BYT_FLOOR_PREFERENCES,
  DUM_TYPES,
  POZEMEK_TYPES,
  KOMERCNI_TYPES,
  OSTATNI_TYPES,
} from "@/lib/formConstants";
import { useState } from "react";

interface Step2Props {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
  onEarlySubmit: () => void;
}

export default function Step2({
  data,
  onUpdate,
  onNext,
  onBack,
  onEarlySubmit,
}: Step2Props) {
  const [showFloorPreference, setShowFloorPreference] = useState(false);

  const handleToggleCategory = (category: string) => {
    const current = data.category || [];
    if (current.includes(category)) {
      onUpdate({ category: current.filter((c: string) => c !== category) });
    } else {
      onUpdate({ category: [...current, category] });
    }
  };

  const handleToggleFloor = (floor: string) => {
    const current = data.floor_preference || [];

    // "Nezáleží" logic
    if (floor === "Nezáleží") {
      if (current.includes("Nezáleží")) {
        onUpdate({ floor_preference: [] });
      } else {
        onUpdate({ floor_preference: ["Nezáleží"] });
      }
      return;
    }

    // Normal checkbox
    if (current.includes("Nezáleží")) {
      // Odškrtni Nezáleží
      onUpdate({ floor_preference: [floor] });
    } else if (current.includes(floor)) {
      onUpdate({ floor_preference: current.filter((f: string) => f !== floor) });
    } else {
      onUpdate({ floor_preference: [...current, floor] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.category || data.category.length === 0) {
      alert("Vyberte alespoň jednu kategorii");
      return;
    }

    onNext();
  };

  // Získej options podle typu nemovitosti
  let categoryOptions: readonly string[] = [];
  let categoryLabel = "";

  switch (data.property_type) {
    case "byt":
      categoryOptions = BYT_DISPOSITIONS;
      categoryLabel = "Dispozice *";
      break;
    case "dum":
      categoryOptions = DUM_TYPES;
      categoryLabel = "Typ domu *";
      break;
    case "pozemek":
      categoryOptions = POZEMEK_TYPES;
      categoryLabel = "Typ pozemku *";
      break;
    case "komercni":
      categoryOptions = KOMERCNI_TYPES;
      categoryLabel = "Typ nemovitosti *";
      break;
    case "ostatni":
      categoryOptions = OSTATNI_TYPES;
      categoryLabel = "Typ *";
      break;
  }

  const nezalezi = data.floor_preference?.includes("Nezáleží") || false;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Kategorie podle typu */}
      <div>
        <label className="label-field">{categoryLabel}</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {categoryOptions.map((option) => (
            <label
              key={option}
              className={`
                flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors
                ${
                  data.category?.includes(option)
                    ? "border-brand-orange bg-brand-orange/10"
                    : "border-zfp-border hover:border-zfp-border-hover"
                }
              `}
            >
              <input
                type="checkbox"
                checked={data.category?.includes(option) || false}
                onChange={() => handleToggleCategory(option)}
                className="sr-only"
              />
              <span className="text-sm font-semibold">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Umístění v domě - jen pro byty */}
      {data.property_type === "byt" && (
        <div>
          <button
            type="button"
            onClick={() => setShowFloorPreference(!showFloorPreference)}
            className="flex items-center gap-2 text-zfp-text hover:text-brand-orange transition-colors"
          >
            <span className="text-lg">{showFloorPreference ? "▼" : "▶"}</span>
            <span className="font-semibold">
              Upřesnit umístění v domě (volitelné)
            </span>
          </button>

          {showFloorPreference && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {BYT_FLOOR_PREFERENCES.map((option) => {
                const isChecked = data.floor_preference?.includes(option) || false;

                return (
                  <label
                    key={option}
                    className={`
                      flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors
                      ${
                        isChecked
                          ? "border-brand-orange bg-brand-orange/10"
                          : "border-zfp-border hover:border-zfp-border-hover"
                      }
                      ${nezalezi && option !== "Nezáleží" ? "opacity-50" : ""}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleFloor(option)}
                      disabled={nezalezi && option !== "Nezáleží"}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{option}</span>
                  </label>
                );
              })}
            </div>
          )}
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
