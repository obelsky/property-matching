import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-zfp-darker">
      {/* Hero sekce */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-zfp-text mb-6">
              Najděte svou <span className="gradient-text">ideální nemovitost</span>
            </h1>
            <p className="text-xl text-zfp-text-muted mb-12 max-w-2xl mx-auto">
              Spojujeme prodávající a kupující. Rychle, efektivně, transparentně.
            </p>

            {/* CTA karty */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Nabídka */}
              <Link
                href="/nabidka"
                className="group card hover-lift p-8 text-left"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-gold rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-heading text-zfp-text mb-3">
                  Chci nabídnout nemovitost
                </h2>
                <p className="text-zfp-text-muted mb-4">
                  Prodej nebo pronájem bytu, domu, pozemku
                </p>
                <div className="inline-flex items-center text-brand-gold font-medium group-hover:text-brand-orange transition-colors duration-300">
                  Vyplnit formulář
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>

              {/* Poptávka */}
              <Link
                href="/poptavka"
                className="group card hover-lift p-8 text-left"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-gold rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-heading text-zfp-text mb-3">
                  Chci koupit / poptávám
                </h2>
                <p className="text-zfp-text-muted mb-4">
                  Hledám byt, dům nebo pozemek ke koupi či pronájmu
                </p>
                <div className="inline-flex items-center text-brand-gold font-medium group-hover:text-brand-orange transition-colors duration-300">
                  Vyplnit formulář
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Jak to funguje */}
      <section className="section-dark py-20">
        <div className="container">
          <h2 className="text-3xl font-heading text-center text-zfp-text mb-4">
            Jak to funguje?
          </h2>
          <p className="text-center text-zfp-text-muted mb-12 max-w-xl mx-auto">
            Jednoduchý proces, který vás provede od zadání až k úspěšnému obchodu
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-gradient-gold text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg">
                1
              </div>
              <h3 className="font-heading text-zfp-text text-lg mb-3">
                Vyplňte formulář
              </h3>
              <p className="text-zfp-text-muted text-sm">
                Zadejte parametry své nemovitosti nebo požadavky na hledanou
                nemovitost
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-gradient-gold text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg">
                2
              </div>
              <h3 className="font-heading text-zfp-text text-lg mb-3">
                Najdeme shody
              </h3>
              <p className="text-zfp-text-muted text-sm">
                Náš systém okamžitě najde nejvhodnější protějšky na druhé straně
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-gradient-gold text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg">
                3
              </div>
              <h3 className="font-heading text-zfp-text text-lg mb-3">
                Spojíme vás
              </h3>
              <p className="text-zfp-text-muted text-sm">
                Zobrazíme vám nejlepší match a pomůžeme vám s dalším krokem
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA sekce */}
      <section className="section">
        <div className="container">
          <div className="card-dark p-12 text-center max-w-3xl mx-auto gradient-border">
            <h2 className="text-3xl font-heading text-zfp-text mb-4">
              Potřebujete hypotéku?
            </h2>
            <p className="text-zfp-text-muted mb-8">
              Vyzkoušejte naši hypoteční kalkulačku a zjistěte, kolik můžete získat
            </p>
            <Link href="/hypotecni-kalkulacka" className="btn-primary">
              Spočítat hypotéku
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
