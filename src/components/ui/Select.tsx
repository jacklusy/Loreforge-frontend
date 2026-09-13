"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * A styled single-select. Hand-rolled rather than a native <select> because the
 * native control can't be themed (the popup is drawn by the OS), and rather than
 * a dependency because the behaviour needed here is small and explicit:
 * click/Enter/Space to open, arrows to move, Enter to pick, Escape or an outside
 * click to dismiss, with roving aria-activedescendant for screen readers.
 */
export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
  icon,
  className,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((option) => option.value === value))
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function commit(index: number): void {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent): void {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commit(activeIndex);
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="inline-flex w-full items-center gap-2 rounded-lg border border-stroke bg-surface px-3 py-2 text-sm font-medium transition-colors hover:border-stroke-strong"
      >
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="flex-1 truncate text-left">{selected?.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-30 mt-1.5 min-w-full overflow-hidden rounded-lg border border-stroke bg-surface-raised py-1 shadow-xl shadow-black/10 dark:shadow-black/40"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => commit(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm whitespace-nowrap transition-colors ${
                    index === activeIndex ? "bg-surface-muted" : ""
                  } ${isSelected ? "font-semibold text-brand-700 dark:text-brand-300" : ""}`}
                >
                  <Check className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "" : "invisible"}`} />
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
