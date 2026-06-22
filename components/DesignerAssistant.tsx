import { Handshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const designerTemplates = [
  "Перше знайомство",
  "Умови партнерства",
  "Нагадування про об'єкт",
  "Подяка за рекомендацію",
  "Пояснення по прихованих дверях",
  "Запрошення в салон",
  "Презентація новинок"
];

export function DesignerAssistant() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Handshake className="h-4 w-4 text-primary" />
        <CardTitle>Для дизайнерів</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {designerTemplates.map((template) => (
          <span key={template} className="rounded-md border bg-white px-3 py-2 text-sm text-muted-foreground">
            {template}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}
