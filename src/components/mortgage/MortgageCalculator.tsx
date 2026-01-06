"use client";

import { useState, useEffect } from "react";
import { CalculatorIcon } from "./MortgageIcons";

interface MortgageCalculatorProps {
  onContactRequest?: () => void;
}

// Defaults pro detekci změn
const DEFAULT_VALUES = {
  propertyPrice: 6000000,
  downPaymentPercent: 20,
  years: 30,
  interestRate: 4.07,
  isReverseMortgage: false
};

export default function MortgageCalculator({ onContactRequest }: MortgageCalculatorProps) {
  // State
  const [propertyPrice, setPropertyPrice] = useState(DEFAULT_VALUES.propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(DEFAULT_VALUES.downPaymentPercent);
  const [years, setYears] = useState(DEFAULT_VALUES.years);
  const [interestRate, setInterestRate] = useState(DEFAULT_VALUES.interestRate);
  const [isReverseMortgage, setIsReverseMortgage] = useState(DEFAULT_VALUES.isReverseMortgage);

  // Vypočtené hodnoty
  const [loanAmount, setLoanAmount] = useState(0);
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [ltv, setLtv] = useState(0);

  // Výpočet hypotéky při změně vstupů
  useEffect(() => {
    calculateMortgage();
  }, [propertyPrice, downPaymentPercent, years, interestRate]);

  // Detekce změn a ukládání do localStorage
  useEffect(() => {
    const hasChanges = 
      propertyPrice !== DEFAULT_VALUES.propertyPrice ||
      downPaymentPercent !== DEFAULT_VALUES.downPaymentPercent ||
      years !== DEFAULT_VALUES.years ||
      interestRate !== DEFAULT_VALUES.interestRate ||
      isReverseMortgage !== DEFAULT_VALUES.isReverseMortgage;

    if (hasChanges) {
      const calculatorData = {
        propertyPrice,
        downPaymentPercent,
        years,
        interestRate,
        isReverseMortgage,
        loanAmount,
        downPaymentAmount,
        monthlyPayment,
        totalInterest,
        totalAmount,
        ltv,
        hasChanges: true,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('mortgageCalculatorData', JSON.stringify(calculatorData));
    } else {
      localStorage.removeItem('mortgageCalculatorData');
    }
  }, [propertyPrice, downPaymentPercent, years, interestRate, isReverseMortgage, 
      loanAmount, downPaymentAmount, monthlyPayment, totalInterest, totalAmount, ltv]);

  const calculateMortgage = () => {
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loan = propertyPrice - downPayment;
    const ltvRatio = (loan / propertyPrice) * 100;

    setDownPaymentAmount(downPayment);
    setLoanAmount(loan);
    setLtv(ltvRatio);

    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) {
      const payment = loan / numberOfPayments;
      setMonthlyPayment(payment);
      setTotalInterest(0);
      setTotalAmount(loan);
    } else {
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

  const handlePropertyPriceChange = (value: number) => {
    setPropertyPrice(value);
  };

  const handleDownPaymentChange = (value: number) => {
    if (!isReverseMortgage && value < 10) {
      setDownPaymentPercent(10);
    } else {
      setDownPaymentPercent(value);
    }
  };

  const handleReverseMortgageToggle = () => {
    const newValue = !isReverseMortgage;
    setIsReverseMortgage(newValue);
    
    if (!newValue && downPaymentPercent < 10) {
      setDownPaymentPercent(10);
    }
    if (newValue) {
      setDownPaymentPercent(0);
    }
  };

  return (
    <div className="card-dark p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center shadow-lg">
          <CalculatorIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-heading text-zfp-text">
            Hypoteční kalkulačka
          </h2>
          <p className="text-zfp-text-muted text-sm">Spočítejte si orientační splátku</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Levá strana - Vstupy */}
        <div className="space-y-6">
          {/* Cena nemovitosti */}
          <div>
            <label className="label-field">
              Cena nemovitosti
            </label>
            <div className="card p-4 mb-3">
              <span className="text-2xl font-bold text-brand-gold">
                {formatCurrency(propertyPrice)} Kč
              </span>
            </div>
            <input
              type="range"
              min="500000"
              max="20000000"
              step="100000"
              value={propertyPrice}
              onChange={(e) => handlePropertyPriceChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-zfp-text-subtle mt-2">
              <span>500 tis.</span>
              <span>20 mil.</span>
            </div>
          </div>

          {/* Zpětná hypotéka checkbox */}
          <div className="card-accent p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isReverseMortgage}
                onChange={handleReverseMortgageToggle}
                className="mt-1"
              />
              <div className="flex-1">
                <span className="font-medium text-zfp-text">Zpětná hypotéka</span>
                <p className="text-xs text-zfp-text-muted mt-1">
                  Umožní vám půjčit si až 100% hodnoty nemovitosti (bez vlastních zdrojů)
                </p>
              </div>
            </label>
          </div>

          {/* Vlastní zdroje */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label-field mb-0">
                Vlastní zdroje
              </label>
              {!isReverseMortgage && downPaymentPercent < 10 && (
                <span className="text-xs text-error">Min. 10% vyžadováno</span>
              )}
            </div>
            <div className="card p-4 mb-3">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold text-brand-gold">
                  {downPaymentPercent} %
                </span>
                <span className="text-sm text-zfp-text-muted">
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
              className="w-full"
            />
            <div className="flex justify-between text-xs text-zfp-text-subtle mt-2">
              <span>{isReverseMortgage ? "0" : "10"} %</span>
              <span>50 %</span>
            </div>
          </div>

          {/* Výše hypotéky - READONLY */}
          <div className="gradient-border card p-4">
            <label className="label-field">
              Výše hypotéky
            </label>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold text-brand-gold">
                {formatCurrency(loanAmount)} Kč
              </span>
              <span className="badge badge-gold">
                LTV: {ltv.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Doba splácení */}
          <div>
            <label className="label-field">
              Doba splácení
            </label>
            <div className="card p-4 mb-3">
              <span className="text-2xl font-bold text-zfp-text">{years} let</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-zfp-text-subtle mt-2">
              <span>5 let</span>
              <span>40 let</span>
            </div>
          </div>

          {/* Úroková sazba */}
          <div>
            <label className="label-field">
              Úroková sazba
            </label>
            <div className="card p-4 mb-3">
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
              className="w-full"
            />
            <div className="flex justify-between text-xs text-zfp-text-subtle mt-2">
              <span>2 %</span>
              <span>8 %</span>
            </div>
          </div>
        </div>

        {/* Pravá strana - Výsledky */}
        <div className="space-y-4">
          {/* Měsíční splátka - hlavní výsledek */}
          <div className="bg-gradient-gold rounded-xl p-6 text-white shadow-lg shadow-brand-orange/20">
            <p className="text-sm opacity-90 mb-2">Měsíční splátka</p>
            <p className="text-4xl font-bold mb-4">
              {formatCurrency(monthlyPayment)} Kč
            </p>
            <button
              onClick={onContactRequest}
              className="w-full bg-zfp-darker hover:bg-zfp-dark text-zfp-text font-medium py-3 px-6 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm"
            >
              Chci nezávaznou nabídku
            </button>
          </div>

          {/* Přehled financování */}
          <div className="card p-6 space-y-4">
            <h3 className="font-heading text-brand-gold text-lg mb-4">Přehled financování</h3>
            
            <div className="flex justify-between items-center pb-3 border-b border-zfp-border">
              <span className="text-sm text-zfp-text-muted">Cena nemovitosti</span>
              <span className="font-medium text-zfp-text">
                {formatCurrency(propertyPrice)} Kč
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-zfp-border">
              <span className="text-sm text-zfp-text-muted">Vlastní zdroje</span>
              <span className="font-medium text-brand-gold">
                {formatCurrency(downPaymentAmount)} Kč ({downPaymentPercent}%)
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-zfp-border">
              <span className="text-sm text-zfp-text-muted">Výše hypotéky</span>
              <span className="font-medium text-zfp-text">
                {formatCurrency(loanAmount)} Kč
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-zfp-border">
              <span className="text-sm text-zfp-text-muted">Úrok</span>
              <span className="font-medium text-zfp-text">
                {interestRate.toFixed(2)} %
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-zfp-border">
              <span className="text-sm text-zfp-text-muted">Celkový úrok</span>
              <span className="font-medium text-brand-orange">
                {formatCurrency(totalInterest)} Kč
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-zfp-text-muted">Celková částka</span>
              <span className="font-medium text-zfp-text">
                {formatCurrency(totalAmount)} Kč
              </span>
            </div>
          </div>

          {/* LTV Varování */}
          {ltv > 90 && !isReverseMortgage && (
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-warning">Vysoké LTV ({ltv.toFixed(0)}%)</p>
                  <p className="text-xs text-zfp-text-muted mt-1">
                    Banky obvykle vyžadují LTV max 90%. Zvažte zvýšení vlastních zdrojů.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info box */}
          <div className="card p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-zfp-text-muted">
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
