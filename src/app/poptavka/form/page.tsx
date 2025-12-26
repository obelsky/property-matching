"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormProgressBar from "@/components/form-wizard/FormProgressBar";
import Step1 from "@/components/form-wizard/Step1";
import Step2 from "@/components/form-wizard/Step2";
import Step3 from "@/components/form-wizard/Step3";
import Step4 from "@/components/form-wizard/Step4";
import Step5 from "@/components/form-wizard/Step5";
import Step6 from "@/components/form-wizard/Step6";
import { RequestFormData } from "@/lib/formTypes";

export default function PoptavkaFormPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RequestFormData>>({
    radius_km: 20,
    category: [],
    gdpr: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleEarlySubmit = async () => {
    const confirmed = confirm(
      "Odeslat poptávku teď s aktuálními údaji?\n\nMůžete doplnit detaily později přes soukromý odkaz, který vám zašleme."
    );
    if (!confirmed) return;

    await submitForm({ ...formData, early_submit: true });
  };

  const handleFinalSubmit = async () => {
    await submitForm(formData);
  };

  const submitForm = async (data: Partial<RequestFormData>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/poptavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submit failed");
      }

      const result = await response.json();
      router.push(`/dekujeme/poptavka/${result.requestId}`);
    } catch (error) {
      console.error("Submit error:", error);
      alert(
        "Chyba při odesílání poptávky. Zkuste to prosím znovu.\n\n" +
          (error instanceof Error ? error.message : "")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (updates: Partial<RequestFormData>) => {
    setFormData({ ...formData, ...updates });
  };

  return (
    <div className="bg-zfp-bg-light min-h-screen py-12">
      <div className="container max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <FormProgressBar currentStep={currentStep} totalSteps={6} />

          {currentStep === 1 && (
            <Step1 data={formData} onUpdate={updateFormData} onNext={handleNext} />
          )}

          {currentStep === 2 && (
            <Step2
              data={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
              onEarlySubmit={handleEarlySubmit}
            />
          )}

          {currentStep === 3 && (
            <Step3
              data={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
              onEarlySubmit={handleEarlySubmit}
            />
          )}

          {currentStep === 4 && (
            <Step4
              data={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
              onEarlySubmit={handleEarlySubmit}
            />
          )}

          {currentStep === 5 && (
            <Step5
              data={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
              onEarlySubmit={handleEarlySubmit}
            />
          )}

          {currentStep === 6 && (
            <Step6
              data={formData}
              onUpdate={updateFormData}
              onSubmit={handleFinalSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
