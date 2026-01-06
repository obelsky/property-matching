"use client";

import { LightbulbIcon, FlashIcon } from "@/components/Icons";

interface Step3Props {
  data: any;
  onUpdate: (updates: any) => void;
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

    // Validace - cena je doporučena
    if (!data.budget_max) {
      const confirmed = confirm(
        "Nevyplnili jste cenu. Doporučujeme uvést orientační cenu pro lepší matching. Pokračovat?"
      );
      if (!confirmed) return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-info/10 border border-info/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-info flex items-start gap-2">
          <LightbulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span><strong>Tip:</strong> Čím přesnější budete, tím lepší kupce/nájemce najdeme.
          Cena a plocha jsou klíčové pro párování s poptávkami.</span>
        </p>
      </div>

      {/* Cena */}
      <div>
        <label className="label-field">
          Cena <span className="text-brand-orange">*doporučeno</span>
        </label>
        <input
          type="number"
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
        <p className="text-xs text-zfp-text-muted mt-1">
          {data.request_kind === "buy" ? "Prodejní cena v Kč" : "Nájem za měsíc v Kč"}
        </p>
      </div>

      {/* Plocha */}
      <div>
        <label className="label-field">Plocha (m²)</label>
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <div>
            <label htmlFor="area_min" className="text-xs text-zfp-text-muted mb-1 block">
              Podlahová plocha
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
              placeholder="Např. 70"
              className="input-field"
              min="0"
              step="1"
            />
          </div>

          {data.property_type === "dum" && (
            <div>
              <label htmlFor="area_max" className="text-xs text-zfp-text-muted mb-1 block">
                Plocha pozemku (m²)
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
                placeholder="Např. 500"
                className="input-field"
                min="0"
                step="10"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="text-zfp-text-muted hover:text-zfp-text"
        >
          ← Zpět
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onEarlySubmit}
            className="px-4 py-2 text-sm text-brand-orange hover:text-brand-orange-hover inline-flex items-center gap-1"
          >
            <FlashIcon className="w-4 h-4" />
            Odeslat hned
          </button>
          <button type="submit" className="btn-primary">
            Pokračovat →
          </button>
        </div>
      </div>
    </form>
  );
}
