import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-zfp-bg-light">
      {/* Hero sekce */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-zfp-text mb-6">
            Najděte svou ideální nemovitost
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Spojujeme prodávající a kupující. Rychle, efektivně, transparentně.
          </p>

          {/* CTA tlačítka */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Nabídka */}
            <Link
              href="/nabidka"
              className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-brand-orange rounded-full flex items-center justify-center group-hover:bg-brand-orange-hover transition-colors">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-heading font-semibold text-zfp-text mb-3">
                Chci nabídnout nemovitost
              </h2>
              <p className="text-gray-600 mb-4">
                Prodej nebo pronájem bytu, domu, pozemku
              </p>
              <div className="inline-flex items-center text-brand-orange font-semibold group-hover:text-brand-orange-hover">
                Vyplnit formulář
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Poptávka */}
            <Link
              href="/poptavka"
              className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-brand-orange rounded-full flex items-center justify-center group-hover:bg-brand-orange-hover transition-colors">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-heading font-semibold text-zfp-text mb-3">
                Chci koupit / poptávám
              </h2>
              <p className="text-gray-600 mb-4">
                Hledám byt, dům nebo pozemek ke koupi či pronájmu
              </p>
              <div className="inline-flex items-center text-brand-orange font-semibold group-hover:text-brand-orange-hover">
                Vyplnit formulář
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Jak to funguje */}
      <section className="bg-white py-16">
        <div className="container">
          <h2 className="text-3xl font-heading font-bold text-center text-zfp-text mb-12">
            Jak to funguje?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-brand-orange text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Vyplňte formulář
              </h3>
              <p className="text-gray-600 text-sm">
                Zadejte parametry své nemovitosti nebo požadavky na hledanou
                nemovitost
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-brand-orange text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Najdeme shody
              </h3>
              <p className="text-gray-600 text-sm">
                Náš systém okamžitě najde nejvhodnější protějšky na druhé straně
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-brand-orange text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Spojíme vás
              </h3>
              <p className="text-gray-600 text-sm">
                Zobrazíme vám nejlepší match a pomůžeme vám s dalším krokem
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
