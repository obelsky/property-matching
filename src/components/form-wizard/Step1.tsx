"use client";

import { RequestFormData } from "@/lib/formTypes";
import { REQUEST_KIND_OPTIONS, PROPERTY_TYPE_OPTIONS } from "@/lib/formConstants";

interface Step1Props {
  data: Partial<RequestFormData>;
  onUpdate: (updates: Partial<RequestFormData>) => void;
  onNext: () => void;
}

export default function Step1({ data, onUpdate, onNext }: Step1Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validace
    if (!data.request_kind || !data.property_type || !data.preferred_location) {
      alert("Prosím vyplňte všechna povinná pole");
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Typ poptávky */}
      <div>
        <label className="label-field">Hledáte na *</label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {REQUEST_KIND_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`
                flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors
                ${
                  data.request_kind === option.value
                    ? "border-brand-orange bg-orange-50"
                    : "border-gray-300 hover:border-gray-400"
                }
              `}
            >
              <input
                type="radio"
                name="request_kind"
                value={option.value}
                checked={data.request_kind === option.value}
                onChange={(e) => onUpdate({ request_kind: e.target.value as any })}
                className="sr-only"
              />
              <span className="font-semibold">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Typ nemovitosti */}
      <div>
        <label className="label-field">Typ nemovitosti *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {PROPERTY_TYPE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`
                flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors
                ${
                  data.property_type === option.value
                    ? "border-brand-orange bg-orange-50"
                    : "border-gray-300 hover:border-gray-400"
                }
              `}
            >
              <input
                type="radio"
                name="property_type"
                value={option.value}
                checked={data.property_type === option.value}
                onChange={(e) => onUpdate({ property_type: e.target.value as any })}
                className="sr-only"
              />
              <span className="text-3xl mb-2">{option.icon}</span>
              <span className="font-semibold text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lokalita */}
      <div>
        <label htmlFor="location" className="label-field">
          Preferovaná lokalita *
        </label>
        <input
          type="text"
          id="location"
          value={data.preferred_location || ""}
          onChange={(e) => onUpdate({ preferred_location: e.target.value })}
          placeholder="Např. Praha, Brno - Černá Pole, Ostrava..."
          className="input-field"
          required
        />
      </div>

      {/* Okruh */}
      <div>
        <label htmlFor="radius" className="label-field">
          Okruh hledání: ±{data.radius_km || 20} km
        </label>
        <input
          type="range"
          id="radius"
          min="0"
          max="200"
          step="5"
          value={data.radius_km || 20}
          onChange={(e) => onUpdate({ radius_km: parseInt(e.target.value) })}
          className="w-full accent-brand-orange"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 km</span>
          <span>200 km</span>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Pokračovat →
        </button>
      </div>
    </form>
  );
}
