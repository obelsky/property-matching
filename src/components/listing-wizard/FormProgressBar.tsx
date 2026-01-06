"use client";

import { STEP_TITLES } from "@/lib/formConstants";

interface FormProgressBarProps {
  currentStep: number; // 1-6
  totalSteps?: number;
}

export default function FormProgressBar({
  currentStep,
  totalSteps = 6,
}: FormProgressBarProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium text-zfp-text">
          Krok {currentStep} z {totalSteps}: {STEP_TITLES[currentStep - 1]}
        </h2>
        <span className="text-sm font-medium text-brand-gold">
          {progress}%
        </span>
      </div>

      <div className="w-full bg-zfp-card rounded-full h-3 overflow-hidden border border-zfp-border">
        <div
          className="bg-gradient-gold h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-zfp-text-subtle mt-2">
        Zabere cca 3 minuty, můžete přeskočit detaily
      </p>
    </div>
  );
}
