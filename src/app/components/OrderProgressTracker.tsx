import { Check } from "lucide-react";

interface OrderProgressTrackerProps {
  currentStep: number;
}

export function OrderProgressTracker({
  currentStep,
}: OrderProgressTrackerProps) {
  const steps = [
    { id: 1, label: "Empfangen" },
    { id: 2, label: "Datenprüfung" },
    { id: 3, label: "Produktion" },
    { id: 4, label: "Versand" },
  ];

  return (
    <div className="py-2">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}
          >
            <div className="flex flex-col items-center relative">
              {/* Step Circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.id <= currentStep
                    ? "bg-cyan-500 border-cyan-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-medium">{step.id}</span>
                )}
              </div>
              {/* Step Label */}
              <span
                className={`mt-1 text-[10px] font-medium ${
                  step.id <= currentStep ? "text-cyan-700" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-4">
                <div
                  className={`h-full transition-all ${
                    step.id < currentStep ? "bg-cyan-500" : "bg-gray-300"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
