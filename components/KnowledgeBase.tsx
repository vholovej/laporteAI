import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { knowledgeSections } from "@/data/knowledge/la-porte";

export function KnowledgeBase() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" />
        <CardTitle>База знань</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {knowledgeSections.map((section) => (
          <section key={section.id} className="rounded-md border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <Badge>{section.keyPoints.length} тез</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.summary}</p>
          </section>
        ))}
      </CardContent>
    </Card>
  );
}
