"use client";

import { MessageSquare, Ruler, Handshake, ShieldAlert, Sparkles, ClipboardList, BadgeHelp, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AssistantMode } from "@/lib/types";

const modes: Array<{ value: AssistantMode; label: string; icon: typeof MessageSquare }> = [
  { value: "client_reply", label: "Відповідь клієнту", icon: MessageSquare },
  { value: "objection", label: "Заперечення", icon: ShieldAlert },
  { value: "product", label: "Продукт", icon: BadgeHelp },
  { value: "measurement", label: "Замір", icon: Ruler },
  { value: "designer", label: "Дизайнер", icon: Handshake },
  { value: "service", label: "Рекламація", icon: Headphones },
  { value: "aftercare", label: "Супровід", icon: ClipboardList },
  { value: "script", label: "Скрипт", icon: Sparkles }
];

export function ModeSelector({
  value,
  onChange
}: {
  value: AssistantMode;
  onChange: (value: AssistantMode) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <Button
            key={mode.value}
            type="button"
            variant={value === mode.value ? "default" : "outline"}
            className={cn("justify-start px-3", value === mode.value && "shadow-sm")}
            onClick={() => onChange(mode.value)}
            title={mode.label}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
