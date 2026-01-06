import Link from "next/link";
import { LockIcon, UserIcon, TargetIcon, BoltIcon } from "@/components/Icons";

export default function PoptavkaLandingPage() {
  return (
    <div className="bg-zfp-darker min-h-screen">
      {/* Hero Section */}
      <div className="section">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading text-zfp-text mb-4">
            Najděte nemovitost se <span className="gradient-text">ZFP Reality</span>
          </h1>
          <p className="text-xl text-zfp-text-muted mb-8">
            Začněte pár otázkami. Detaily doplníte jen pokud chcete.
          </p>
          
          {/* 3 Steps */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="card hover-lift p-6">
              <div className="w-14 h-14 mx-auto bg-gradient-gold rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                1
              </div>
              <h3 className="font-heading text-zfp-text text-lg mb-2">
                Vyplníte
              </h3>
              <p className="text-zfp-text-muted text-sm">
                Jednoduché otázky o vaší vysněné nemovitosti
              </p>
            </div>

            <div className="card hover-lift p-6">
              <div className="w-14 h-14 mx-auto bg-gradient-gold rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                2
              </div>
              <h3 className="font-heading text-zfp-text text-lg mb-2">
                Najdeme shody
              </h3>
              <p className="text-zfp-text-muted text-sm">
                Náš systém propojí vaši poptávku s vhodnými nabídkami
              </p>
            </div>

            <div className="card hover-lift p-6">
              <div className="w-14 h-14 mx-auto bg-gradient-gold rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                3
              </div>
              <h3 className="font-heading text-zfp-text text-lg mb-2">
                Spojíme vás
              </h3>
              <p className="text-zfp-text-muted text-sm">
                Makléř vás kontaktuje s konkrétními možnostmi
              </p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="card-accent p-4 inline-flex items-center gap-3 mb-8">
            <svg
              className="w-6 h-6 text-brand-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-sm font-medium text-zfp-text">
              Data bezpečně zpracuje interní oddělení ZFP Reality, a.s.
            </p>
          </div>

          {/* CTA */}
          <div>
            <Link
              href="/poptavka/form"
              className="btn-primary inline-block text-lg !px-12 !py-4"
            >
              Začít poptávku →
            </Link>
            <p className="text-sm text-zfp-text-subtle mt-4">
              Zabere cca 3 minuty
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="section-dark py-20">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-heading text-center text-zfp-text mb-12">
            Proč hledat s námi?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card hover-lift p-6">
              <TargetIcon className="w-12 h-12 mb-4 text-brand-gold" />
              <h3 className="font-heading text-zfp-text mb-2">Přesné vyhledávání</h3>
              <p className="text-zfp-text-muted text-sm">
                Náš inteligentní systém najde nemovitosti podle vašich skutečných potřeb
              </p>
            </div>

            <div className="card hover-lift p-6">
              <BoltIcon className="w-12 h-12 mb-4 text-brand-gold" />
              <h3 className="font-heading text-zfp-text mb-2">Rychlá reakce</h3>
              <p className="text-zfp-text-muted text-sm">
                Makléř vás kontaktuje do 24 hodin s konkrétními nabídkami
              </p>
            </div>

            <div className="card hover-lift p-6">
              <LockIcon className="w-12 h-12 mb-4 text-brand-gold" />
              <h3 className="font-heading text-zfp-text mb-2">Soukromý přístup</h3>
              <p className="text-zfp-text-muted text-sm">
                Sledujte stav poptávky kdykoliv přes váš osobní odkaz
              </p>
            </div>

            <div className="card hover-lift p-6">
              <UserIcon className="w-12 h-12 mb-4 text-brand-gold" />
              <h3 className="font-heading text-zfp-text mb-2">Profesionální servis</h3>
              <p className="text-zfp-text-muted text-sm">
                Zkušení makléři ZFP Reality vás provedou celým procesem
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
