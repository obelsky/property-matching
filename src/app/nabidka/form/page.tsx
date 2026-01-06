"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormProgressBar from "@/components/listing-wizard/FormProgressBar";
import Step1 from "@/components/listing-wizard/Step1";
import Step2 from "@/components/listing-wizard/Step2";
import Step3 from "@/components/listing-wizard/Step3";
import Step4 from "@/components/listing-wizard/Step4";
import Step5 from "@/components/listing-wizard/Step5";

export default function NabidkaFormPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    request_kind: "buy", // prodej je výchozí
    category: [],
    gdpr: false,
    photos: [], // NEW - pole pro fotky
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < 5) { // 5 kroků místo 6
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
      "Odeslat nabídku teď s aktuálními údaji?\n\nMůžete doplnit detaily později přes soukromý odkaz, který vám zašleme."
    );
    if (!confirmed) return;

    await submitForm({ ...formData, early_submit: true });
  };

  const handleFinalSubmit = async () => {
    await submitForm(formData);
  };

  const submitForm = async (data: any) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/nabidka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submit failed");
      }

      const result = await response.json();
      router.push(`/dekujeme/nabidka/${result.listingId}`);
    } catch (error) {
      console.error("Submit error:", error);
      alert(
        "Chyba při odesílání nabídky. Zkuste to prosím znovu.\n\n" +
          (error instanceof Error ? error.message : "")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (updates: any) => {
    setFormData({ ...formData, ...updates });
  };

  return (
    <div className="bg-zfp-darker min-h-screen py-12">
      <div className="container max-w-3xl">
        <div className="card-dark p-8">
          <FormProgressBar currentStep={currentStep} totalSteps={5} />

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
