import { Headphones } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const complaintTypes = [
  "Затримка виробництва",
  "Пошкодження",
  "Помилка в комплектації",
  "Незадоволення монтажем",
  "Перенесення монтажу",
  "Агресивний клієнт"
];

export function ComplaintAssistant() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Headphones className="h-4 w-4 text-primary" />
        <CardTitle>Рекламації</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {complaintTypes.map((type) => (
          <div key={type} className="rounded-md border bg-white p-3 text-sm">
            <p className="font-medium">{type}</p>
            <p className="mt-1 text-muted-foreground">Спокійно, без зайвого визнання провини, з конкретним наступним кроком.</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
