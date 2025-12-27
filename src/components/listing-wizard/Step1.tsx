"use client";

interface Step1Props {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
}

const REQUEST_KIND_OPTIONS = [
  { value: 'buy', label: 'Prodat' },
  { value: 'rent', label: 'Pronajmout' },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: 'byt', label: 'Byt', icon: '🏢' },
  { value: 'dum', label: 'Dům', icon: '🏡' },
  { value: 'pozemek', label: 'Pozemek', icon: '🌳' },
  { value: 'komercni', label: 'Komerční', icon: '🏪' },
  { value: 'ostatni', label: 'Ostatní', icon: '🅿️' },
];

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
      {/* Typ nabídky */}
      <div>
        <label className="label-field">Co nabízíte? *</label>
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
                onChange={(e) => onUpdate({ request_kind: e.target.value })}
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
                onChange={(e) => onUpdate({ property_type: e.target.value })}
                className="sr-only"
              />
              <span className="text-3xl mb-2">{option.icon}</span>
              <span className="font-semibold text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Adresa */}
      <div>
        <label htmlFor="location" className="label-field">
          Adresa nemovitosti *
        </label>
        <input
          type="text"
          id="location"
          value={data.preferred_location || ""}
          onChange={(e) => onUpdate({ preferred_location: e.target.value })}
          placeholder="Např. Hlavní 123, Praha 1 nebo jen Praha, Brno..."
          className="input-field"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Můžete zadat přesnou adresu nebo jen město/část
        </p>
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
