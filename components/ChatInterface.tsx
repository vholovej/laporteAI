"use client";

import { Clock, Copy, DoorOpen, Plus, Send, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ModeSelector } from "@/components/ModeSelector";
import { ToneSelector } from "@/components/ToneSelector";
import { ResponseCard } from "@/components/ResponseCard";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import { ObjectionHandler } from "@/components/ObjectionHandler";
import { MeasurementChecklist } from "@/components/MeasurementChecklist";
import { DesignerAssistant } from "@/components/DesignerAssistant";
import { ComplaintAssistant } from "@/components/ComplaintAssistant";
import { ScriptGenerator } from "@/components/ScriptGenerator";
import type { AssistantMode, AssistantResponse, ResponseTone, SavedResponse } from "@/lib/types";

const quickPrompts = [
  "Клієнт питає, чому приховані двері дорожчі за звичайні",
  "Клієнт хоче двері висотою 2700 мм",
  "Клієнт каже, що у конкурентів дешевше",
  "Поясни різницю між HPL, шпоном і фарбуванням",
  "Підготуй повідомлення дизайнеру про партнерські умови",
  "Що уточнити перед заміром?",
  "Напиши коротку відповідь у Viber"
];

const tabs = [
  { id: "knowledge", label: "База" },
  { id: "objections", label: "Заперечення" },
  { id: "measurement", label: "Замір" },
  { id: "designer", label: "Дизайнер" },
  { id: "complaints", label: "Рекламації" },
  { id: "scripts", label: "Скрипти" }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ChatInterface() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<AssistantMode>("client_reply");
  const [tone, setTone] = useState<ResponseTone>("premium");
  const [activeTab, setActiveTab] = useState<TabId>("knowledge");
  const [response, setResponse] = useState<AssistantResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SavedResponse[]>([]);
  const [favorites, setFavorites] = useState<SavedResponse[]>([]);

  useEffect(() => {
    setHistory(readStorage("la-porte-history"));
    setFavorites(readStorage("la-porte-favorites"));
  }, []);

  const canGenerate = useMemo(() => prompt.trim().length > 2 && !isLoading, [prompt, isLoading]);

  async function generate(nextPrompt = prompt) {
    if (!nextPrompt.trim()) return;
    setIsLoading(true);

    const result = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: nextPrompt, mode, tone })
    });
    const data = (await result.json()) as AssistantResponse;
    setResponse(data);

    const item: SavedResponse = {
      ...data,
      id: crypto.randomUUID(),
      prompt: nextPrompt,
      mode,
      tone,
      createdAt: new Date().toISOString()
    };
    const nextHistory = [item, ...history].slice(0, 12);
    setHistory(nextHistory);
    writeStorage("la-porte-history", nextHistory);
    setIsLoading(false);
  }

  function handleQuickPrompt(value: string) {
    setPrompt(value);
    generate(value);
  }

  function saveResponse() {
    if (!response) return;

    const item: SavedResponse = {
      ...response,
      id: crypto.randomUUID(),
      prompt,
      mode,
      tone,
      createdAt: new Date().toISOString(),
      favorite: true
    };
    const nextFavorites = [item, ...favorites].slice(0, 20);
    setFavorites(nextFavorites);
    writeStorage("la-porte-favorites", nextFavorites);
  }

  return (
    <main className="min-h-screen">
      <header className="border-b bg-white/78 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <DoorOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-normal">La Porte AI Assistant</h1>
              <p className="text-sm text-muted-foreground">Внутрішній інструмент менеджера салону дверей</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Ужгород · Преміум двері · Комунікація без тиску</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div className="rounded-lg border bg-white p-5 shadow-soft">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold" htmlFor="client-context">
                  Ситуація або питання клієнта
                </label>
                <Textarea
                  id="client-context"
                  className="mt-2"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Наприклад: клієнт питає, чому приховані двері дорожчі за звичайні..."
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Режим</p>
                <ModeSelector value={mode} onChange={setMode} />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Тон відповіді</p>
                <ToneSelector value={tone} onChange={setTone} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button type="button" variant="ghost" onClick={() => setPrompt("")}>
                  <Plus className="h-4 w-4" />
                  Нова ситуація
                </Button>
                <Button type="button" disabled={!canGenerate} onClick={() => generate()}>
                  <Send className="h-4 w-4" />
                  Згенерувати відповідь
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-soft">
            <p className="mb-3 text-sm font-semibold">Швидкі запити</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="focus-ring rounded-md border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted"
                  onClick={() => handleQuickPrompt(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <ResponseCard response={response} isLoading={isLoading} onSave={saveResponse} onRegenerate={() => generate()} />

          <section className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-lg border bg-white p-5 shadow-soft">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold">Останні запити</h2>
              </div>
              <div className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Історія з&apos;явиться після першої генерації.</p>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="focus-ring block w-full rounded-md border p-3 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        setPrompt(item.prompt);
                        setResponse(item);
                      }}
                    >
                      <span className="line-clamp-2">{item.prompt}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-white p-5 shadow-soft">
              <div className="mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold">Збережені відповіді</h2>
              </div>
              <div className="space-y-3">
                {favorites.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Збережені відповіді будуть доступні тут.</p>
                ) : (
                  favorites.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="focus-ring block w-full rounded-md border p-3 text-left text-sm hover:bg-muted"
                      onClick={() => navigator.clipboard.writeText(item.answer)}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Copy className="h-3.5 w-3.5" />
                        {item.prompt}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border bg-white p-2 shadow-soft">
            <div className="grid grid-cols-3 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`focus-ring rounded-md px-2 py-2 text-xs font-medium ${
                    activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "knowledge" && <KnowledgeBase />}
          {activeTab === "objections" && <ObjectionHandler />}
          {activeTab === "measurement" && <MeasurementChecklist />}
          {activeTab === "designer" && <DesignerAssistant />}
          {activeTab === "complaints" && <ComplaintAssistant />}
          {activeTab === "scripts" && <ScriptGenerator />}
        </aside>
      </div>
    </main>
  );
}

function readStorage(key: string): SavedResponse[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as SavedResponse[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(key: string, value: SavedResponse[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
