import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const scripts = [
  "Перший контакт",
  "Клієнт з Instagram",
  "Клієнт з рекомендації",
  "Холодний дизайнер",
  "Повторний дотик",
  "Після заміру",
  "Після КП",
  "Нагадування про оплату",
  "Запрошення в салон"
];

export function ScriptGenerator() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <CardTitle>Скрипти</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        {scripts.map((script) => (
          <div key={script} className="rounded-md border bg-white px-3 py-3 text-sm text-muted-foreground">
            {script}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
