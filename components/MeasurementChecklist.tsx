"use client";

import { Ruler } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { measurementChecklist } from "@/data/knowledge/la-porte";
import { cn } from "@/lib/utils";

export function MeasurementChecklist() {
  const [checked, setChecked] = useState<string[]>([]);

  function toggle(item: string) {
    setChecked((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-primary" />
          <CardTitle>Перед замовленням</CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">
          {checked.length}/{measurementChecklist.length}
        </span>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        {measurementChecklist.map((item) => (
          <label
            key={item}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-3 rounded-md border bg-white px-3 py-2 text-sm",
              checked.includes(item) && "border-primary bg-primary/5"
            )}
          >
            <input
              type="checkbox"
              className="h-4 w-4 accent-[hsl(var(--primary))]"
              checked={checked.includes(item)}
              onChange={() => toggle(item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
