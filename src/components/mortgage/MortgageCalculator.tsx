"use client";

import { useState, useEffect } from "react";
import { CalculatorIcon } from "./MortgageIcons";

interface MortgageCalculatorProps {
  onContactRequest?: () => void;
}

export default function MortgageCalculator({ onContactRequest }: MortgageCalculatorProps) {
  // Základní parametry
  const [loanAmount, setLoanAmount] = useState(5000000); // Výše hypotéky
  const [years, setYears] = useState(30); // Doba splácení
  const [interestRate, setInterestRate] = useState(4.09); // Úroková sazba

  // Vypočtené hodnoty
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Výpočet měsíční splátky
  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, years, interestRate]);

  const calculateMortgage = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) {
      // Pokud je úrok 0%, jednoduché dělení
      const payment = loanAmount / numberOfPayments;
      setMonthlyPayment(payment);
      setTotalInterest(0);
      setTotalAmount(loanAmount);
    } else {
      // Anuita = P * [r(1+r)^n] / [(1+r)^n - 1]
      const payment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      const total = payment * numberOfPayments;
      const interest = total - loanAmount;

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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center">
          <CalculatorIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-zfp-text">
          Hypoteční kalkulačka
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Levá strana - Vstupy */}
        <div className="space-y-6">
          {/* Výše hypotéky */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Výše hypotéky
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
              <span className="text-2xl font-bold text-zfp-text">
                {formatCurrency(loanAmount)} Kč
              </span>
            </div>
            <input
              type="range"
              min="500000"
              max="15000000"
              step="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>500 tis.</span>
              <span>15 mil.</span>
            </div>
          </div>

          {/* Doba splácení */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doba splácení
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
              <span className="text-2xl font-bold text-zfp-text">
                {years} let
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
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
              onChange={(e) => setInterestRate(Number(e.target.value))}
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
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Měsíční splátka</p>
            <p className="text-4xl font-bold mb-4">
              {formatCurrency(monthlyPayment)} Kč
            </p>
            <button
              onClick={onContactRequest}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Chci nezávaznou nabídku
            </button>
          </div>

          {/* Další detaily */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Úrok</span>
              <span className="font-semibold text-zfp-text">
                {interestRate.toFixed(2)} %
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Celková úspora</span>
              <span className="font-semibold text-zfp-text">
                +{formatCurrency(totalInterest)} Kč
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Celková částka</span>
              <span className="font-semibold text-zfp-text">
                {formatCurrency(totalAmount)} Kč
              </span>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-800">
              💡 Toto je orientační výpočet. Skutečná výše splátky se může lišit 
              v závislosti na konkrétních podmínkách banky.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
