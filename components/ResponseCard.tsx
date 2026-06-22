"use client";

import { Check, Clipboard, RefreshCw, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AssistantResponse } from "@/lib/types";

export function ResponseCard({
  response,
  isLoading,
  onSave,
  onRegenerate
}: {
  response?: AssistantResponse;
  isLoading?: boolean;
  onSave: () => void;
  onRegenerate: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copyAnswer() {
    if (!response?.answer) return;
    await navigator.clipboard.writeText(response.answer);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-5 shadow-soft">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-4 space-y-3">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="rounded-lg border bg-white p-6 text-sm text-muted-foreground shadow-soft">
        Вставте ситуацію клієнта, оберіть режим і тон. Готова відповідь з'явиться тут.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div className="flex flex-wrap gap-2">
          {response.sources.map((source) => (
            <Badge key={source}>{source}</Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="icon" onClick={copyAnswer} title="Копіювати">
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={onSave} title="Зберегти відповідь">
            <Save className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={onRegenerate} title="Створити нову версію">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-5 p-5">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-foreground">{response.answer}</pre>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Наступний крок</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {response.nextSteps.map((step) => (
                <li key={step}>- {step}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Що уточнити</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {response.clarify.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
