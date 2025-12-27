import Link from "next/link";
import { LockIcon, UserIcon } from "@/components/Icons";

export default function PoptavkaLandingPage() {
  return (
    <div className="bg-zfp-bg-light min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-zfp-bg-light py-16">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-zfp-text mb-4">
            Najděte nemovitost se ZFP Reality
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Začněte pár otázkami. Detaily doplníte jen pokud chcete.
          </p>
          
          {/* 3 Steps */}
          <div className="grid md:grid-cols-3 gap-8 my-12">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-16 h-16 mx-auto bg-brand-orange rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">
                Vyplníte
              </h3>
              <p className="text-gray-600 text-sm">
                Jednoduché otázky o vaší vysněné nemovitosti
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-16 h-16 mx-auto bg-brand-orange rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">
                Najdeme shody
              </h3>
              <p className="text-gray-600 text-sm">
                Náš systém propojí vaši poptávku s vhodnými nabídkami
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-16 h-16 mx-auto bg-brand-orange rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">
                Spojíme vás
              </h3>
              <p className="text-gray-600 text-sm">
                Makléř vás kontaktuje s konkrétními možnostmi
              </p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-flex items-center gap-3 mb-8">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div className="text-left">
              <p className="text-sm font-semibold text-blue-900">
                Data bezpečně zpracuje interní oddělení ZFP Reality, a.s.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div>
            <Link
              href="/poptavka/form"
              className="inline-block bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-lg px-12 py-4 rounded-lg transition-colors shadow-lg"
            >
              Začít poptávku →
            </Link>
            <p className="text-sm text-gray-500 mt-3">
              ⏱️ Zabere cca 3 minuty
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container max-w-4xl py-16">
        <h2 className="text-2xl font-heading font-bold text-center mb-8">
          Proč hledat s námi?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold mb-2">Přesné vyhledávání</h3>
            <p className="text-gray-600 text-sm">
              Náš inteligentní systém najde nemovitosti podle vašich skutečných potřeb
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold mb-2">Rychlá reakce</h3>
            <p className="text-gray-600 text-sm">
              Makléř vás kontaktuje do 24 hodin s konkrétními nabídkami
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <LockIcon className="w-12 h-12 mx-auto mb-3 text-brand-orange" />
            <h3 className="font-bold mb-2">Soukromý přístup</h3>
            <p className="text-gray-600 text-sm">
              Sledujte stav poptávky kdykoliv přes váš osobní odkaz
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <UserIcon className="w-12 h-12 mx-auto mb-3 text-brand-orange" />
            <h3 className="font-bold mb-2">Profesionální servis</h3>
            <p className="text-gray-600 text-sm">
              Zkušení makléři ZFP Reality vás provedou celým procesem
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
