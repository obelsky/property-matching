"use client";

import { useState, useEffect } from "react";
import { CalculatorIcon } from "./MortgageIcons";

interface MortgageCalculatorProps {
  onContactRequest?: () => void;
}

export default function MortgageCalculator({ onContactRequest }: MortgageCalculatorProps) {
  // Základní parametry
  const [propertyPrice, setPropertyPrice] = useState(6000000); // Cena nemovitosti
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // Vlastní zdroje v %
  const [years, setYears] = useState(30); // Doba splácení
  const [interestRate, setInterestRate] = useState(4.07); // Úroková sazba
  const [isReverseMortgage, setIsReverseMortgage] = useState(false); // Zpětná hypotéka

  // Vypočtené hodnoty
  const [loanAmount, setLoanAmount] = useState(0); // Výše hypotéky
  const [downPaymentAmount, setDownPaymentAmount] = useState(0); // Vlastní zdroje v Kč
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [ltv, setLtv] = useState(0); // Loan-to-Value ratio

  // Výpočet hypotéky při změně vstupů
  useEffect(() => {
    calculateMortgage();
  }, [propertyPrice, downPaymentPercent, years, interestRate]);

  const calculateMortgage = () => {
    // Výpočet vlastních zdrojů a výše hypotéky
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loan = propertyPrice - downPayment;
    const ltvRatio = (loan / propertyPrice) * 100;

    setDownPaymentAmount(downPayment);
    setLoanAmount(loan);
    setLtv(ltvRatio);

    // Výpočet měsíční splátky
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) {
      // Pokud je úrok 0%, jednoduché dělení
      const payment = loan / numberOfPayments;
      setMonthlyPayment(payment);
      setTotalInterest(0);
      setTotalAmount(loan);
    } else {
      // Anuita = P * [r(1+r)^n] / [(1+r)^n - 1]
      const payment =
        (loan * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      const total = payment * numberOfPayments;
      const interest = total - loan;

      setMonthlyPayment(payment);
      setTotalInterest(interest);
      setTotalAmount(total);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownPaymentChange = (value: number) => {
    // Pokud není zpětná hypotéka, minimálně 10%
    if (!isReverseMortgage && value < 10) {
      setDownPaymentPercent(10);
    } else {
      setDownPaymentPercent(value);
    }
  };

  const handleReverseMortgageToggle = () => {
    const newValue = !isReverseMortgage;
    setIsReverseMortgage(newValue);
    
    // Pokud vypneme zpětnou hypotéku a máme méně než 10%, nastavit na 10%
    if (!newValue && downPaymentPercent < 10) {
      setDownPaymentPercent(10);
    }
    // Pokud zapneme zpětnou hypotéku, můžeme nastavit na 0%
    if (newValue) {
      setDownPaymentPercent(0);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center">
          <CalculatorIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-zfp-text">
          Hypoteční kalkulačka
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Levá strana - Vstupy */}
        <div className="space-y-6">
          {/* Cena nemovitosti */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cena nemovitosti
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
              <span className="text-2xl font-bold text-zfp-text">
                {formatCurrency(propertyPrice)} Kč
              </span>
            </div>
            <input
              type="range"
              min="500000"
              max="20000000"
              step="100000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>500 tis.</span>
              <span>20 mil.</span>
            </div>
          </div>

          {/* Zpětná hypotéka checkbox */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isReverseMortgage}
                onChange={handleReverseMortgageToggle}
                className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <span className="font-semibold text-gray-900">Zpětná hypotéka</span>
                <p className="text-xs text-gray-600 mt-1">
                  Umožní vám půjčit si až 100% hodnoty nemovitosti (bez vlastních zdrojů)
                </p>
              </div>
            </label>
          </div>

          {/* Vlastní zdroje */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Vlastní zdroje
              </label>
              {!isReverseMortgage && downPaymentPercent < 10 && (
                <span className="text-xs text-red-600">Min. 10% vyžadováno</span>
              )}
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold text-purple-700">
                  {downPaymentPercent} %
                </span>
                <span className="text-sm text-gray-600">
                  {formatCurrency(downPaymentAmount)} Kč
                </span>
              </div>
            </div>
            <input
              type="range"
              min={isReverseMortgage ? "0" : "10"}
              max="50"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => handleDownPaymentChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{isReverseMortgage ? "0" : "10"} %</span>
              <span>50 %</span>
            </div>
          </div>

          {/* Výše hypotéky - READONLY */}
          <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-300 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Výše hypotéky
            </label>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold text-purple-700">
                {formatCurrency(loanAmount)} Kč
              </span>
              <span className="text-xs text-gray-600">
                LTV: {ltv.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Doba splácení */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doba splácení
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
              <span className="text-2xl font-bold text-zfp-text">{years} let</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 let</span>
              <span>40 let</span>
            </div>
          </div>

          {/* Úroková sazba */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Úroková sazba
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
              <span className="text-2xl font-bold text-zfp-text">
                {interestRate.toFixed(2)} %
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2 %</span>
              <span>8 %</span>
            </div>
          </div>
        </div>

        {/* Pravá strana - Výsledky */}
        <div className="space-y-4">
          {/* Měsíční splátka - hlavní výsledek */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Měsíční splátka</p>
            <p className="text-4xl font-bold mb-4">
              {formatCurrency(monthlyPayment)} Kč
            </p>
            <button
              onClick={onContactRequest}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
            >
              Chci nezávaznou nabídku
            </button>
          </div>

          {/* Přehled financování */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg mb-3">Přehled financování</h3>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Cena nemovitosti</span>
              <span className="font-semibold text-zfp-text">
                {formatCurrency(propertyPrice)} Kč
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Vlastní zdroje</span>
              <span className="font-semibold text-purple-700">
                {formatCurrency(downPaymentAmount)} Kč ({downPaymentPercent}%)
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Výše hypotéky</span>
              <span className="font-semibold text-zfp-text">
                {formatCurrency(loanAmount)} Kč
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Úrok</span>
              <span className="font-semibold text-zfp-text">
                {interestRate.toFixed(2)} %
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Celkový úrok</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(totalInterest)} Kč
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Celková částka</span>
              <span className="font-semibold text-zfp-text">
                {formatCurrency(totalAmount)} Kč
              </span>
            </div>
          </div>

          {/* LTV Varování */}
          {ltv > 90 && !isReverseMortgage && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Vysoké LTV ({ltv.toFixed(0)}%)</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Banky obvykle vyžadují LTV max 90%. Zvažte zvýšení vlastních zdrojů.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-purple-800">
                Toto je orientační výpočet. Skutečná výše splátky se může lišit 
                v závislosti na konkrétních podmínkách banky.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
