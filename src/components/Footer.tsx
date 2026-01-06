import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zfp-dark border-t border-zfp-border mt-auto">
      <div className="container mx-auto px-4 md:px-8 py-16">
        {/* Hlavní obsah */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo a popis */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <Image
                src="/zfp-reality-logo.png"
                alt="ZFP Reality Logo"
                width={180}
                height={54}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-zfp-text-muted text-sm mb-6 leading-relaxed max-w-md">
              Profesionální realitní a finanční služby s důrazem na individuální přístup 
              a maximální spokojenost klientů.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-zfp-text text-sm">Součást ZFP GROUP</p>
                <p className="text-xs text-zfp-text-subtle">Skupina finančních a realitních služeb</p>
              </div>
            </div>
          </div>

          {/* Služby */}
          <div>
            <h3 className="font-heading text-brand-gold text-lg mb-6">Služby</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/poptavka" className="text-zfp-text-muted hover:text-brand-gold transition-colors duration-300 text-sm">
                  Hledám nemovitost
                </Link>
              </li>
              <li>
                <Link href="/nabidka" className="text-zfp-text-muted hover:text-brand-gold transition-colors duration-300 text-sm">
                  Nabízím nemovitost
                </Link>
              </li>
              <li>
                <Link href="/hypotecni-kalkulacka" className="text-zfp-text-muted hover:text-brand-gold transition-colors duration-300 text-sm">
                  Hypoteční kalkulačka
                </Link>
              </li>
              <li>
                <a 
                  href="https://zfp-vendor.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zfp-text-muted hover:text-brand-gold transition-colors duration-300 text-sm inline-flex items-center gap-1"
                >
                  Vendor portál
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-heading text-brand-gold text-lg mb-6">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-zfp-text-muted">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@zfp-reality.cz" className="hover:text-brand-gold transition-colors duration-300">
                  info@zfp-reality.cz
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-zfp-text-muted">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+420123456789" className="hover:text-brand-gold transition-colors duration-300">
                  +420 123 456 789
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-zfp-text-muted">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Praha, Česká republika</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Dolní lišta */}
        <div className="border-t border-zfp-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zfp-text-subtle">
              © 2025 ZFP Reality. Všechna práva vyhrazena.
            </p>
            <div className="flex gap-6 text-sm text-zfp-text-subtle">
              <Link href="/gdpr" className="hover:text-brand-gold transition-colors duration-300">
                GDPR
              </Link>
              <Link href="/zasady-zpracovani-osobnich-udaju" className="hover:text-brand-gold transition-colors duration-300">
                Ochrana údajů
              </Link>
              <Link href="/obchodni-podminky" className="hover:text-brand-gold transition-colors duration-300">
                Obchodní podmínky
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
