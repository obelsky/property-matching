"use client";

import { RequestFormData } from "@/lib/formTypes";
import { FINANCING_OPTIONS, TIMEFRAME_OPTIONS } from "@/lib/formConstants";

interface Step5Props {
  data: Partial<RequestFormData>;
  onUpdate: (updates: Partial<RequestFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onEarlySubmit: () => void;
}

export default function Step5({
  data,
  onUpdate,
  onNext,
  onBack,
  onEarlySubmit,
}: Step5Props) {
  const handleToggleFinancing = (method: string) => {
    const current = data.financing_methods || [];
    if (current.includes(method)) {
      onUpdate({ financing_methods: current.filter((m) => m !== method) });
    } else {
      onUpdate({ financing_methods: [...current, method] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-gray-600">
        Tyto informace jsou volitelné, ale pomohou nám lépe připravit nabídky.
      </p>

      {/* Financování */}
      <div>
        <label className="label-field">Jak plánujete financovat? (volitelné)</label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {FINANCING_OPTIONS.map((option) => {
            const isChecked = data.financing_methods?.includes(option) || false;

            return (
              <label
                key={option}
                className={`
                  flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors
                  ${
                    isChecked
                      ? "border-brand-orange bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleFinancing(option)}
                  className="sr-only"
                />
                <span className="font-semibold">{option}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Časový horizont */}
      <div>
        <label className="label-field">
          Kdy nejpozději potřebujete {data.request_kind === "buy" ? "koupit" : "pronajmout"}?
          (volitelné)
        </label>
        <div className="space-y-2 mt-2">
          {TIMEFRAME_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`
                flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors
                ${
                  data.timeframe === option.value
                    ? "border-brand-orange bg-orange-50"
                    : "border-gray-300 hover:border-gray-400"
                }
              `}
            >
              <input
                type="radio"
                name="timeframe"
                value={option.value}
                checked={data.timeframe === option.value}
                onChange={(e) => onUpdate({ timeframe: e.target.value })}
                className="w-4 h-4 text-brand-orange"
              />
              <span className="font-semibold">{option.label}</span>
            </label>
          ))}
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
