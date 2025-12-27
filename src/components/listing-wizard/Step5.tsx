"use client";

interface Step5Props {
  data: any;
  onUpdate: (updates: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function Step5({
  data,
  onUpdate,
  onSubmit,
  onBack,
  isSubmitting,
}: Step5Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validace
    if (!data.contact_name || !data.contact_email || !data.contact_phone) {
      alert("Prosím vyplňte všechny kontaktní údaje");
      return;
    }

    if (!data.gdpr) {
      alert("Musíte souhlasit se zpracováním osobních údajů");
      return;
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          🔒 <strong>Soukromí:</strong> Vaše kontaktní údaje budou sdíleny pouze se zájemci, které budeme párovat s vaší nabídkou.
        </p>
      </div>

      {/* Jméno */}
      <div>
        <label htmlFor="name" className="label-field">
          Jméno a příjmení *
        </label>
        <input
          type="text"
          id="name"
          value={data.contact_name || ""}
          onChange={(e) => onUpdate({ contact_name: e.target.value })}
          placeholder="Jan Novák"
          className="input-field"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="label-field">
          E-mail *
        </label>
        <input
          type="email"
          id="email"
          value={data.contact_email || ""}
          onChange={(e) => onUpdate({ contact_email: e.target.value })}
          placeholder="jan.novak@example.com"
          className="input-field"
          required
        />
      </div>

      {/* Telefon */}
      <div>
        <label htmlFor="phone" className="label-field">
          Telefon *
        </label>
        <input
          type="tel"
          id="phone"
          value={data.contact_phone || ""}
          onChange={(e) => onUpdate({ contact_phone: e.target.value })}
          placeholder="+420 777 123 456"
          className="input-field"
          required
        />
      </div>

      {/* Poznámka */}
      <div>
        <label htmlFor="note" className="label-field">
          Poznámka (volitelné)
        </label>
        <textarea
          id="note"
          value={data.note || ""}
          onChange={(e) => onUpdate({ note: e.target.value })}
          placeholder="Něco, co byste chtěli potenciálním kupcům/nájemcům sdělit..."
          className="input-field"
          rows={4}
        />
      </div>

      {/* GDPR */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.gdpr || false}
            onChange={(e) => onUpdate({ gdpr: e.target.checked })}
            className="mt-1 w-4 h-4 text-brand-orange focus:ring-brand-orange"
            required
          />
          <span className="text-sm text-gray-700">
            Souhlasím se zpracováním osobních údajů za účelem zprostředkování prodeje/pronájmu nemovitosti. *
          </span>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
          disabled={isSubmitting}
        >
          ← Zpět
        </button>

        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Odesílám..." : "Odeslat nabídku 🚀"}
        </button>
      </div>
    </form>
  );
}
