"use client";

import { useRef } from "react";
import MortgageCalculator from "@/components/mortgage/MortgageCalculator";
import LeadForm from "@/components/mortgage/LeadForm";
import {
  CheckShieldIcon,
  ClockIcon,
  MoneyIcon,
  ChartIcon,
  DocumentTextIcon,
  BankIcon,
} from "@/components/mortgage/MortgageIcons";

export default function HypotecniKalkulackaPage() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-zfp-darker min-h-screen">
      {/* Hero s kalkulačkou */}
      <div className="section">
        <div className="container max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading text-zfp-text mb-4">
              Hypoteční <span className="gradient-text">kalkulačka</span>
            </h1>
            <p className="text-xl text-zfp-text-muted max-w-3xl mx-auto">
              Jednoduše si pomocí posuvníků simulujte potenciální úrokové sazby, 
              výši hypotéky, délku splatnosti a potenciální výši splátky.
            </p>
          </div>

          {/* Kalkulačka */}
          <MortgageCalculator onContactRequest={scrollToForm} />
        </div>
      </div>

      {/* Na jakou hypotéku dosáhnu */}
      <div className="section-dark py-20">
        <div className="container max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-zfp-text mb-4">
              Na jakou hypotéku dosáhnu?
            </h2>
            <p className="text-lg text-zfp-text-muted max-w-3xl mx-auto">
              Výše hypotéky závisí především na vašem příjmu a schopnosti splácet. 
              Banky standardně požadují, aby měsíční splátka nepřesáhla 40-45 % 
              vašeho čistého příjmu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card-accent p-6">
              <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center mb-4">
                <MoneyIcon className="w-6 h-6 text-brand-gold" />
              </div>
              <h3 className="text-xl font-heading text-zfp-text mb-2">
                Čistý příjem
              </h3>
              <p className="text-zfp-text-muted text-sm">
                Základem je váš pravidelný měsíční příjem po zdanění. 
                Započítávají se i pravidelné bonusy a příplatky.
              </p>
            </div>

            <div className="card-accent p-6">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mb-4">
                <ChartIcon className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-heading text-zfp-text mb-2">
                Dluhová služba
              </h3>
              <p className="text-zfp-text-muted text-sm">
                Banka posuzuje poměr vašich dluhů k příjmům. Ideálně by měsíční 
                splátky neměly přesáhnout 40 % příjmu.
              </p>
            </div>

            <div className="card-accent p-6">
              <div className="w-12 h-12 bg-brand-orange/20 rounded-lg flex items-center justify-center mb-4">
                <BankIcon className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="text-xl font-heading text-zfp-text mb-2">
                Vlastní zdroje
              </h3>
              <p className="text-zfp-text-muted text-sm">
                Pro získání hypotéky je obvykle nutné mít vlastní prostředky 
                ve výši alespoň 10-20 % z hodnoty nemovitosti.
              </p>
            </div>
          </div>

          {/* Příklad výpočtu */}
          <div className="card gradient-border p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-heading text-brand-gold mb-6">
              Příklad: Čistý příjem 60 000 Kč/měsíc
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zfp-border">
                <span className="text-zfp-text-muted">Maximální měsíční splátka (40 %)</span>
                <span className="font-bold text-zfp-text">24 000 Kč</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-zfp-border">
                <span className="text-zfp-text-muted">Orientační výše hypotéky</span>
                <span className="font-bold text-brand-gold">~5 800 000 Kč</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zfp-text-muted">Při úroku 4,99 % na 30 let</span>
                <span className="text-sm text-zfp-text-subtle">splátka 30 242 Kč</span>
              </div>
            </div>
            <p className="text-xs text-zfp-text-subtle mt-6">
              * Toto je pouze orientační výpočet. Skutečná výše hypotéky závisí 
              na mnoha faktorech včetně vaší bonity, závazků a podmínek banky.
            </p>
          </div>
        </div>
      </div>

      {/* Proč s námi */}
      <div className="section">
        <div className="container max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-zfp-text mb-4">
              Proč hypotéku s <span className="gradient-text">ZFP Reality</span>?
            </h2>
            <p className="text-lg text-zfp-text-muted max-w-3xl mx-auto">
              Profesionální přístup a osobní péče pro každého klienta
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card hover-lift p-6">
              <CheckShieldIcon className="w-12 h-12 text-brand-gold mb-4" />
              <h3 className="font-heading text-zfp-text text-lg mb-2">Získáte nabídky napříč bankami</h3>
              <p className="text-zfp-text-muted text-sm">
                Srovnáme nejen sazby, ale i všechny poplatky a podmínky. 
                Poradíme, která banka je pro vás nejvýhodnější.
              </p>
            </div>

            <div className="card hover-lift p-6">
              <ClockIcon className="w-12 h-12 text-brand-gold mb-4" />
              <h3 className="font-heading text-zfp-text text-lg mb-2">Rychlá reakce do 24 hodin</h3>
              <p className="text-zfp-text-muted text-sm">
                Náš hypoteční specialista vás kontaktuje během 24 hodin 
                s konkrétními nabídkami.
              </p>
            </div>

            <div className="card hover-lift p-6">
              <DocumentTextIcon className="w-12 h-12 text-brand-gold mb-4" />
              <h3 className="font-heading text-zfp-text text-lg mb-2">Zdarma a bez závazků</h3>
              <p className="text-zfp-text-muted text-sm">
                Snadný online proces z pohodlí domova. Ušetříme vám čas 
                i peníze díky výhodným podmínkám.
              </p>
            </div>

            <div className="card hover-lift p-6">
              <MoneyIcon className="w-12 h-12 text-brand-gold mb-4" />
              <h3 className="font-heading text-zfp-text text-lg mb-2">Profesionální poradenství</h3>
              <p className="text-zfp-text-muted text-sm">
                Zkušení hypoteční specialisté vás provedou celým procesem 
                a pomohou najít optimální řešení.
              </p>
            </div>

            <div className="card hover-lift p-6">
              <BankIcon className="w-12 h-12 text-brand-gold mb-4" />
              <h3 className="font-heading text-zfp-text text-lg mb-2">Evropská obchodní certifikace</h3>
              <p className="text-zfp-text-muted text-sm">
                Jsme profesionálové s evropskou obchodní certifikací EFPA 
                (titul EFA má pouze 2 % finančních poradců v Česku).
              </p>
            </div>

            <div className="card hover-lift p-6">
              <ChartIcon className="w-12 h-12 text-brand-gold mb-4" />
              <h3 className="font-heading text-zfp-text text-lg mb-2">Komplexní servis</h3>
              <p className="text-zfp-text-muted text-sm">
                Od výběru nemovitosti přes zajištění hypotéky až po pojištění 
                a kompletní právní servis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead formulář */}
      <div ref={formRef} className="section-dark py-20">
        <div className="container max-w-3xl">
          <LeadForm />
        </div>
      </div>

      {/* FAQ */}
      <div className="section">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-heading text-center text-zfp-text mb-12">
            Často kladené otázky
          </h2>

          <div className="space-y-4">
            <details className="card group">
              <summary className="font-heading text-zfp-text text-lg cursor-pointer p-6 hover:text-brand-gold transition-colors">
                Jak dlouho trvá schválení hypotéky?
              </summary>
              <p className="text-zfp-text-muted px-6 pb-6 -mt-2">
                Standardní doba schvalování hypotéky je 1-2 týdny. V některých 
                případech můžeme proces urychlit na několik dní.
              </p>
            </details>

            <details className="card group">
              <summary className="font-heading text-zfp-text text-lg cursor-pointer p-6 hover:text-brand-gold transition-colors">
                Kolik musím mít vlastních prostředků?
              </summary>
              <p className="text-zfp-text-muted px-6 pb-6 -mt-2">
                Banky obvykle požadují minimálně 10-20 % z hodnoty nemovitosti 
                jako vlastní zdroje. Čím víc vlastních prostředků máte, tím 
                lepší podmínky můžete získat.
              </p>
            </details>

            <details className="card group">
              <summary className="font-heading text-zfp-text text-lg cursor-pointer p-6 hover:text-brand-gold transition-colors">
                Mohu získat hypotéku jako OSVČ?
              </summary>
              <p className="text-zfp-text-muted px-6 pb-6 -mt-2">
                Ano! OSVČ mohou získat hypotéku, obvykle je však nutné doložit 
                příjmy za poslední 2-3 roky. Rádi vám poradíme, jak na to.
              </p>
            </details>

            <details className="card group">
              <summary className="font-heading text-zfp-text text-lg cursor-pointer p-6 hover:text-brand-gold transition-colors">
                Je možné refinancovat stávající hypotéku?
              </summary>
              <p className="text-zfp-text-muted px-6 pb-6 -mt-2">
                Určitě! Refinancování může ušetřit až desetitisíce korun ročně. 
                Pomůžeme vám najít nejvýhodnější nabídku a postaráme se o celý proces.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
