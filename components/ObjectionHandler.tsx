import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { objectionScenarios } from "@/data/knowledge/la-porte";

export function ObjectionHandler() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-primary" />
        <CardTitle>Заперечення</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {objectionScenarios.map((scenario) => (
          <article key={scenario.id} className="rounded-md border bg-white p-4">
            <h3 className="text-sm font-semibold">{scenario.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{scenario.problem}</p>
            <p className="mt-3 text-sm leading-6">{scenario.shortVersion}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
