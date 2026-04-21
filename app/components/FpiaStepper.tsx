"use client";

type FpiaStepperStep = {
  label: string;
  meta?: string;
};

type Props = {
  steps: FpiaStepperStep[];
  currentStep: number;
  onStepSelect?: (index: number) => void;
  canSelectStep?: (index: number) => boolean;
};

export default function FpiaStepper({
  steps,
  currentStep,
  onStepSelect,
  canSelectStep,
}: Props) {
  const currentLabel = steps[currentStep]?.label ?? `Step ${currentStep + 1}`;

  return (
    <nav aria-label="Form progress" className="fpia-stepper">
      <div className="fpia-stepper-summary">
        <div className="fpia-stepper-summary-copy">
          <span className="fpia-stepper-summary-kicker">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="fpia-stepper-summary-title">{currentLabel}</span>
        </div>
        <div className="fpia-stepper-summary-track" aria-hidden="true">
          <span
            className="fpia-stepper-summary-fill"
            style={{
              width: `${((currentStep + 1) / Math.max(steps.length, 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="fpia-stepper-items">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;
          const isSelectable = onStepSelect
            ? canSelectStep
              ? canSelectStep(index)
              : !isFuture
            : false;

          return (
            <div key={step.label} className="fpia-stepper-item">
              <button
                type="button"
                className="fpia-stepper-trigger"
                disabled={!isSelectable}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => {
                  if (isSelectable) {
                    onStepSelect?.(index);
                  }
                }}
              >
                <span
                  className="fpia-stepper-marker"
                  data-current={isCurrent}
                  data-complete={isComplete}
                >
                  {isComplete ? "✓" : index + 1}
                </span>
                <span className="fpia-stepper-copy">
                  <span
                    className="fpia-stepper-label"
                    data-current={isCurrent}
                    data-complete={isComplete}
                  >
                    {step.label}
                  </span>
                  {step.meta ? (
                    <span className="fpia-stepper-meta">{step.meta}</span>
                  ) : null}
                </span>
              </button>
              {index < steps.length - 1 ? (
                <div
                  className="fpia-stepper-divider"
                  data-complete={index < currentStep}
                  aria-hidden="true"
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .fpia-stepper {
          display: grid;
          gap: 18px;
        }

        .fpia-stepper-summary {
          display: grid;
          gap: 10px;
        }

        .fpia-stepper-summary-copy {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
        }

        .fpia-stepper-summary-kicker {
          color: var(--gold);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .fpia-stepper-summary-title {
          color: var(--off-white);
          font-size: 14px;
          font-weight: 700;
        }

        .fpia-stepper-summary-track {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: rgba(63, 94, 123, 0.82);
          overflow: hidden;
        }

        .fpia-stepper-summary-fill {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, rgba(201, 161, 77, 0.75), var(--gold));
        }

        .fpia-stepper-items {
          display: flex;
          gap: 10px;
          align-items: stretch;
          flex-wrap: wrap;
        }

        .fpia-stepper-item {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .fpia-stepper-trigger {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 0;
          padding: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          min-width: 0;
          cursor: pointer;
        }

        .fpia-stepper-trigger:disabled {
          cursor: default;
        }

        .fpia-stepper-marker {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 2px solid rgba(201, 161, 77, 0.35);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(201, 161, 77, 0.55);
          font-size: 11px;
          font-weight: 800;
          flex-shrink: 0;
          transition: all 150ms ease;
        }

        .fpia-stepper-marker[data-current="true"],
        .fpia-stepper-marker[data-complete="true"] {
          border-color: var(--gold);
          background: var(--gold);
          color: var(--navy);
        }

        .fpia-stepper-copy {
          display: grid;
          gap: 4px;
          min-width: 0;
        }

        .fpia-stepper-label {
          color: rgba(160, 174, 192, 0.62);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .fpia-stepper-label[data-current="true"] {
          color: var(--off-white);
        }

        .fpia-stepper-label[data-complete="true"] {
          color: var(--gold);
        }

        .fpia-stepper-meta {
          color: rgba(160, 174, 192, 0.7);
          font-size: 12px;
          line-height: 1.4;
        }

        .fpia-stepper-divider {
          width: 48px;
          height: 1px;
          background: rgba(63, 94, 123, 0.9);
          flex-shrink: 0;
          transition: background 150ms ease;
        }

        .fpia-stepper-divider[data-complete="true"] {
          background: var(--gold);
        }

        @media (max-width: 720px) {
          .fpia-stepper-items {
            flex-direction: column;
            gap: 14px;
          }

          .fpia-stepper-summary-copy {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }

          .fpia-stepper-item {
            width: 100%;
          }

          .fpia-stepper-divider {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
