"use client";

import type { ResponseTone } from "@/lib/types";
import { cn } from "@/lib/utils";

const tones: Array<{ value: ResponseTone; label: string }> = [
  { value: "short", label: "Коротко" },
  { value: "detailed", label: "Детально" },
  { value: "premium", label: "Преміально" },
  { value: "friendly", label: "Дружньо" },
  { value: "messenger", label: "Viber / Telegram" },
  { value: "instagram", label: "Instagram" },
  { value: "designer", label: "Для дизайнера" },
  { value: "difficult", label: "Складний клієнт" },
  { value: "very_short", label: "Дуже коротко" }
];

export function ToneSelector({
  value,
  onChange
}: {
  value: ResponseTone;
  onChange: (value: ResponseTone) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tones.map((tone) => (
        <button
          key={tone.value}
          type="button"
          className={cn(
            "focus-ring rounded-md border px-3 py-2 text-xs font-medium transition-colors",
            value === tone.value
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-white text-muted-foreground hover:bg-muted"
          )}
          onClick={() => onChange(tone.value)}
        >
          {tone.label}
        </button>
      ))}
    </div>
  );
}
