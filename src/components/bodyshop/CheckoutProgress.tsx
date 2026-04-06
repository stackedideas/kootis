import { Check } from "lucide-react";

const STEPS = ["Address", "Shipping", "Payment"] as const;
type Step = 1 | 2 | 3;

interface CheckoutProgressProps {
  currentStep: Step;
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: "32px 200px" }}
    >
      {STEPS.map((label, i) => {
        const stepNum = (i + 1) as Step;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={label} className="flex items-center" style={{ flex: i < 2 ? 1 : "none" }}>
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold transition"
                style={{
                  fontSize: "13px",
                  background: isCompleted ? "#E8A0A0" : isActive ? "#E8A0A0" : "transparent",
                  color: isCompleted || isActive ? "#FFFFFF" : "#999999",
                  border: isCompleted || isActive ? "none" : "2px solid #E0D5D5",
                }}
              >
                {isCompleted ? <Check size={14} /> : stepNum}
              </div>
              <span
                className="font-sans"
                style={{
                  fontSize: "11px",
                  color: isActive ? "#333333" : "#999999",
                  fontWeight: isActive ? 600 : 400,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
            {i < 2 && (
              <div
                className="h-[2px] flex-1 mx-4"
                style={{
                  background: stepNum < currentStep ? "#E8A0A0" : "#E0D5D5",
                  marginBottom: "20px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
