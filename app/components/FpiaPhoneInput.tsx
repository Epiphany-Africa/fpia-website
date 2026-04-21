"use client";

import { useId, useState, type InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hint?: string;
  tone?: "dark" | "light";
};

function sanitizePhone(value: string) {
  let nextValue = value.replace(/[^\d+\s()-]/g, "");

  if (nextValue.includes("+")) {
    nextValue = `+${nextValue.replace(/\+/g, "")}`;
  }

  return nextValue.slice(0, 24);
}

export default function FpiaPhoneInput({
  value,
  defaultValue,
  onValueChange,
  name,
  placeholder = "+27 82 000 0000",
  hint = "South African mobile or landline number.",
  tone = "dark",
  required,
  disabled,
  ...rest
}: Props) {
  const hintId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const controlled = typeof value === "string";
  const currentValue = controlled ? value : internalValue;

  return (
    <div className="fpia-phone-field">
      <div className="fpia-phone-shell" data-tone={tone} data-disabled={disabled}>
        <div className="fpia-phone-badge" aria-hidden="true">
          ZA
        </div>
        <input
          {...rest}
          name={name}
          value={currentValue}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          aria-describedby={hint ? hintId : undefined}
          className="fpia-phone-input"
          inputMode="tel"
          onChange={(event) => {
            const nextValue = sanitizePhone(event.target.value);

            if (!controlled) {
              setInternalValue(nextValue);
            }

            onValueChange?.(nextValue);
          }}
        />
      </div>
      {hint ? (
        <div id={hintId} className="fpia-phone-hint">
          {hint}
        </div>
      ) : null}

      <style jsx>{`
        .fpia-phone-field {
          display: grid;
          gap: 8px;
        }

        .fpia-phone-shell {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: stretch;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        .fpia-phone-shell[data-tone="dark"] {
          border: 1px solid rgba(201, 161, 77, 0.24);
          background: rgba(255, 255, 255, 0.04);
        }

        .fpia-phone-shell[data-tone="light"] {
          border: 1px solid #d1d5db;
          background: #fff;
        }

        .fpia-phone-shell[data-disabled="true"] {
          opacity: 0.68;
        }

        .fpia-phone-shell:focus-within {
          border-color: rgba(201, 161, 77, 0.7);
          box-shadow: 0 0 0 3px rgba(201, 161, 77, 0.12);
        }

        .fpia-phone-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border-right: 1px solid rgba(201, 161, 77, 0.16);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .fpia-phone-shell[data-tone="dark"] .fpia-phone-badge {
          color: var(--gold);
          border-right: 1px solid rgba(201, 161, 77, 0.16);
          background: rgba(201, 161, 77, 0.06);
        }

        .fpia-phone-shell[data-tone="light"] .fpia-phone-badge {
          color: var(--navy);
          border-right: 1px solid #e5e7eb;
          background: rgba(201, 161, 77, 0.14);
        }

        .fpia-phone-input {
          width: 100%;
          border: 0;
          outline: none;
          background: transparent;
          padding: 14px 16px;
        }

        .fpia-phone-shell[data-tone="dark"] .fpia-phone-input {
          color: var(--off-white);
        }

        .fpia-phone-shell[data-tone="light"] .fpia-phone-input {
          color: var(--navy);
        }

        .fpia-phone-input::placeholder {
          color: rgba(160, 174, 192, 0.72);
        }

        .fpia-phone-hint {
          font-size: 12px;
          line-height: 1.5;
        }

        .fpia-phone-shell[data-tone="dark"] + .fpia-phone-hint,
        .fpia-phone-field :global(.fpia-phone-hint[data-tone="dark"]) {
          color: rgba(160, 174, 192, 0.78);
        }

        .fpia-phone-field .fpia-phone-hint {
          color: ${tone === "light" ? "var(--slate)" : "rgba(160, 174, 192, 0.78)"};
        }
      `}</style>
    </div>
  );
}
