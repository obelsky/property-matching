import Link from "next/link";

export default function DekujemeNabidkaPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="bg-zfp-bg-light min-h-screen py-12">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success icon */}
          <div className="text-6xl mb-4">✅</div>

          {/* Heading */}
          <h1 className="text-3xl font-heading font-bold text-zfp-text mb-4">
            Děkujeme za nabídku!
          </h1>

          <p className="text-gray-600 mb-8">
            Vaše nabídka byla úspěšně odeslána. Brzy vás budeme kontaktovat s vhodnými zájemci.
          </p>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-blue-900 mb-3">📧 Co se stane dál?</h2>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Zaslali jsme vám potvrzovací email</li>
              <li>✓ Email obsahuje soukromý odkaz pro správu nabídky</li>
              <li>✓ Automaticky párujeme vaši nabídku s poptávkami</li>
              <li>✓ Pokud najdeme shodu, ozveme se vám</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">
              Zpět na hlavní stránku
            </Link>
            <Link
              href="/nabidka/form"
              className="px-6 py-3 border-2 border-brand-orange text-brand-orange rounded-lg hover:bg-orange-50 font-semibold transition-colors"
            >
              Přidat další nabídku
            </Link>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 mt-8">
            Máte problém? Kontaktujte nás na{" "}
            <a href="mailto:info@zfpgroup.cz" className="text-brand-orange hover:underline">
              info@zfpgroup.cz
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
