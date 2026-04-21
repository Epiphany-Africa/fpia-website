"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Props<T> = {
  items: T[];
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (item: T) => void;
  getItemKey: (item: T) => string;
  getItemLabel: (item: T) => string;
  renderItem: (item: T, active: boolean) => ReactNode;
  placeholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  minQueryLength?: number;
};

export default function FpiaAutocomplete<T>({
  items,
  value,
  onValueChange,
  onSelect,
  getItemKey,
  getItemLabel,
  renderItem,
  placeholder,
  emptyMessage = "No matches found.",
  loading = false,
  minQueryLength = 2,
}: Props<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const showEmpty = !loading && value.trim().length >= minQueryLength && items.length === 0;
  const showPanel = open && (loading || items.length > 0 || showEmpty);

  const normalizedItems = useMemo(() => items, [items]);
  const safeActiveIndex =
    normalizedItems.length === 0
      ? -1
      : activeIndex < 0
        ? 0
        : Math.min(activeIndex, normalizedItems.length - 1);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectItem(item: T) {
    onSelect(item);
    onValueChange(getItemLabel(item));
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!showPanel) {
        setOpen(true);
        return;
      }
      setActiveIndex((current) =>
        normalizedItems.length === 0 ? -1 : (current + 1) % normalizedItems.length
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!showPanel) {
        setOpen(true);
        setActiveIndex(0);
        return;
      }
      setActiveIndex((current) =>
        normalizedItems.length === 0
          ? -1
          : current <= 0
            ? normalizedItems.length - 1
            : current - 1
      );
      return;
    }

    if (event.key === "Enter" && showPanel && activeIndex >= 0 && normalizedItems[activeIndex]) {
      event.preventDefault();
      selectItem(normalizedItems[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="fpia-autocomplete">
      <input
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => {
          setOpen(true);
          if (normalizedItems.length > 0) {
            setActiveIndex(0);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="fpia-autocomplete-input"
      />

      {showPanel ? (
        <div className="fpia-autocomplete-panel">
          {loading ? (
            <div className="fpia-autocomplete-state">Searching suburbs...</div>
          ) : null}

          {!loading && showEmpty ? (
            <div className="fpia-autocomplete-state">{emptyMessage}</div>
          ) : null}

          {!loading && normalizedItems.length > 0 ? (
            <div className="fpia-autocomplete-list" role="listbox">
              {normalizedItems.map((item, index) => {
                const active = index === safeActiveIndex;

                return (
                  <button
                    key={getItemKey(item)}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className="fpia-autocomplete-item"
                    data-active={active}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectItem(item)}
                  >
                    {renderItem(item, active)}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      <style jsx>{`
        .fpia-autocomplete {
          position: relative;
        }

        .fpia-autocomplete-input {
          width: 100%;
          border: 1px solid rgba(201, 161, 77, 0.24);
          background: rgba(255, 255, 255, 0.04);
          color: var(--off-white);
          padding: 14px 16px;
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        .fpia-autocomplete-input::placeholder {
          color: rgba(160, 174, 192, 0.72);
        }

        .fpia-autocomplete-input:focus {
          border-color: rgba(201, 161, 77, 0.7);
          box-shadow: 0 0 0 3px rgba(201, 161, 77, 0.12);
        }

        .fpia-autocomplete-panel {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          z-index: 30;
          border: 1px solid rgba(201, 161, 77, 0.24);
          background: #102945;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .fpia-autocomplete-list {
          max-height: 280px;
          overflow-y: auto;
        }

        .fpia-autocomplete-item {
          width: 100%;
          border: 0;
          border-bottom: 1px solid rgba(201, 161, 77, 0.08);
          background: transparent;
          color: inherit;
          text-align: left;
          padding: 0;
          cursor: pointer;
        }

        .fpia-autocomplete-item[data-active="true"] {
          background: rgba(201, 161, 77, 0.08);
        }

        .fpia-autocomplete-state {
          padding: 14px 16px;
          color: rgba(160, 174, 192, 0.86);
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
