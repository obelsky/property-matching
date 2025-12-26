"use client";

import { RequestFormData } from "@/lib/formTypes";

interface Step3Props {
  data: Partial<RequestFormData>;
  onUpdate: (updates: Partial<RequestFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onEarlySubmit: () => void;
}

export default function Step3({
  data,
  onUpdate,
  onNext,
  onBack,
  onEarlySubmit,
}: Step3Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validace - alespoň jedno pole doporučeno
    if (
      !data.budget_min &&
      !data.budget_max &&
      !data.area_min_m2 &&
      !data.area_max_m2
    ) {
      const confirmed = confirm(
        "Nevyplnili jste žádné parametry. Doporučujeme alespoň orientační cenu. Pokračovat?"
      );
      if (!confirmed) return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Čím přesnější budete, tím lepší shody najdeme.
          Rozmezí ceny a plochy nám pomůže najít nejvhodnější nabídky.
        </p>
      </div>

      {/* Cena */}
      <div>
        <label className="label-field">Rozpočet (orientační)</label>
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <div>
            <label htmlFor="budget_min" className="text-xs text-gray-600 mb-1 block">
              Cena od (Kč)
            </label>
            <input
              type="number"
              id="budget_min"
              value={data.budget_min || ""}
              onChange={(e) =>
                onUpdate({
                  budget_min: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="Např. 3 000 000"
              className="input-field"
              min="0"
              step="100000"
            />
          </div>

          <div>
            <label htmlFor="budget_max" className="text-xs text-gray-600 mb-1 block">
              Cena do (Kč) <span className="text-brand-orange">*doporučeno</span>
            </label>
            <input
              type="number"
              id="budget_max"
              value={data.budget_max || ""}
              onChange={(e) =>
                onUpdate({
                  budget_max: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="Např. 5 000 000"
              className="input-field"
              min="0"
              step="100000"
            />
          </div>
        </div>
      </div>

      {/* Plocha */}
      <div>
        <label className="label-field">
          Plocha (m²) {data.property_type === "pozemek" ? "parcely" : ""}
        </label>
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <div>
            <label htmlFor="area_min" className="text-xs text-gray-600 mb-1 block">
              Plocha od (m²)
            </label>
            <input
              type="number"
              id="area_min"
              value={data.area_min_m2 || ""}
              onChange={(e) =>
                onUpdate({
                  area_min_m2: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="Např. 50"
              className="input-field"
              min="0"
              step="5"
            />
          </div>

          <div>
            <label htmlFor="area_max" className="text-xs text-gray-600 mb-1 block">
              Plocha do (m²)
            </label>
            <input
              type="number"
              id="area_max"
              value={data.area_max_m2 || ""}
              onChange={(e) =>
                onUpdate({
                  area_max_m2: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="Např. 100"
              className="input-field"
              min="0"
              step="5"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
