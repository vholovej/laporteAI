import {
  knowledgeSections,
  measurementChecklist,
  objectionScenarios
} from "@/data/knowledge/la-porte";
import type { AssistantRequest, AssistantResponse, KnowledgeSection } from "@/lib/types";

const modeLabels: Record<AssistantRequest["mode"], string> = {
  client_reply: "відповідь клієнту",
  objection: "робота із запереченням",
  product: "пояснення продукту",
  measurement: "підготовка до заміру",
  designer: "повідомлення дизайнеру",
  service: "сервіс / рекламація",
  aftercare: "післяпродажний супровід",
  script: "скрипт продажу"
};

const toneLabels: Record<AssistantRequest["tone"], string> = {
  short: "коротко",
  detailed: "детально",
  premium: "преміально",
  friendly: "дружньо",
  messenger: "для Viber / Telegram",
  instagram: "для Instagram",
  designer: "для дизайнера",
  difficult: "для складного клієнта",
  very_short: "дуже коротко"
};

export function generateAssistantResponse(request: AssistantRequest): AssistantResponse {
  const prompt = request.prompt.trim();
  const sections = pickKnowledge(prompt, request.mode);
  const objection = pickObjection(prompt);
  const answer = buildAnswer(request, sections, objection);

  return {
    answer,
    nextSteps: buildNextSteps(request, objection),
    clarify: buildClarify(request, sections),
    sources: sections.map((section) => section.title)
  };
}

function pickKnowledge(prompt: string, mode: AssistantRequest["mode"]): KnowledgeSection[] {
  const text = prompt.toLowerCase();
  const matched = knowledgeSections.filter((section) => {
    const haystack = `${section.title} ${section.summary} ${section.keyPoints.join(" ")}`.toLowerCase();
    return haystack
      .split(/\s+/)
      .filter((word) => word.length > 4)
      .some((word) => text.includes(word));
  });

  const modeDefaults: Record<AssistantRequest["mode"], string[]> = {
    client_reply: ["company", "hidden-doors"],
    objection: ["company", "hidden-doors"],
    product: ["hidden-doors", "finishes"],
    measurement: ["measurement", "hidden-doors"],
    designer: ["designer-partnership", "company"],
    service: ["complaints", "company"],
    aftercare: ["complaints", "measurement"],
    script: ["company", "designer-partnership"]
  };

  const defaults = knowledgeSections.filter((section) => modeDefaults[mode].includes(section.id));
  return uniqueSections([...matched, ...defaults]).slice(0, 3);
}

function pickObjection(prompt: string) {
  const text = prompt.toLowerCase();

  if (text.includes("дорог") || text.includes("ціна") || text.includes("скільки")) {
    return objectionScenarios.find((scenario) => scenario.id === "expensive");
  }

  if (text.includes("конкур") || text.includes("дешев")) {
    return objectionScenarios.find((scenario) => scenario.id === "competitors-cheaper");
  }

  if (text.includes("тільки ціну") || text.includes("прайс")) {
    return objectionScenarios.find((scenario) => scenario.id === "only-price");
  }

  if (text.includes("без замір") || text.includes("без замiр")) {
    return objectionScenarios.find((scenario) => scenario.id === "without-measurement");
  }

  return undefined;
}

function buildAnswer(
  request: AssistantRequest,
  sections: KnowledgeSection[],
  objection?: ReturnType<typeof pickObjection>
) {
  const isVeryShort = request.tone === "very_short";
  const isMessenger = request.tone === "messenger" || request.tone === "instagram";
  const opener = getOpener(request, objection);
  const proof = sections
    .flatMap((section) => section.keyPoints)
    .slice(0, isVeryShort ? 1 : 3)
    .map((point) => `- ${point}`)
    .join("\n");

  if (request.mode === "measurement") {
    return [
      "Перед заміром варто коротко зібрати вихідні дані, щоб замірник не їхав наосліп:",
      measurementChecklist.slice(0, isVeryShort ? 5 : 10).map((item) => `- ${item}`).join("\n"),
      "Потрібно уточнити технічні деталі перед фінальним прорахунком, щоб не обіцяти ціну без підтвердження на об'єкті."
    ].join("\n\n");
  }

  if (request.mode === "designer") {
    return [
      "Добрий день. Ми La Porte, салон дверей та інтер'єрних рішень преміум класу в Ужгороді.",
      "Будемо раді бути корисними у ваших проєктах: допоможемо з прихованими, класичними, розсувними та вхідними дверима, фурнітурою, монтажем і акуратною комплектацією під задум інтер'єру.",
      "Якщо вам зручно, можемо коротко обговорити формат співпраці або запросити вас у салон, щоб показати матеріали наживо."
    ].join(isMessenger ? "\n\n" : " ");
  }

  if (request.mode === "service") {
    return [
      "Дякуємо, що повідомили. Ми перевіримо ситуацію і повернемось із конкретним рішенням.",
      "Щоб швидше розібратися, будь ласка, надішліть фото, номер замовлення або адресу об'єкта, а також коротко опишіть, що саме сталося.",
      "Після перевірки запропонуємо наступний крок: консультацію, виїзд спеціаліста або узгодження часу для виправлення."
    ].join("\n\n");
  }

  if (request.mode === "script") {
    return [
      "Сценарій контакту:",
      "1. Привітатись і коротко назвати La Porte.",
      "2. Уточнити задачу клієнта: тип дверей, кількість, стиль, терміни.",
      "3. Пояснити цінність комплектації без тиску.",
      "4. Запропонувати наступний крок: замір, салон або попередній прорахунок.",
      "Follow-up через 2 дні: коротко нагадати про себе і запропонувати допомогу з вибором."
    ].join("\n");
  }

  if (objection) {
    return request.tone === "premium" || request.mode === "objection"
      ? objection.premiumVersion
      : objection.shortVersion;
  }

  return [
    opener,
    proof,
    getClosing(request)
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildNextSteps(request: AssistantRequest, objection?: ReturnType<typeof pickObjection>) {
  if (objection) {
    return [objection.nextStep, "Не називати точну ціну без параметрів або заміру.", "Запропонувати 2-3 варіанти комплектації."];
  }

  if (request.mode === "measurement") {
    return ["Заповнити чек-лист", "Попросити фото прорізів", "Узгодити дату і адресу заміру"];
  }

  if (request.mode === "designer") {
    return ["Запропонувати коротке знайомство", "Надіслати контакти для партнерства", "Запросити дизайнера в салон"];
  }

  return ["Уточнити параметри", "Підготувати попередню комплектацію", "Запропонувати замір або візит у салон"];
}

function buildClarify(request: AssistantRequest, sections: KnowledgeSection[]) {
  const sectionQuestions = sections.flatMap((section) => section.questions ?? []);
  const defaultQuestions = [
    "Скільки дверей потрібно?",
    "Який тип дверей розглядає клієнт?",
    "Чи є розміри прорізів і чистова підлога?",
    "Який бажаний дедлайн?"
  ];

  if (request.mode === "service") {
    return ["Номер замовлення або адреса об'єкта", "Фото ситуації", "Коли клієнту зручно отримати зворотний зв'язок"];
  }

  return uniqueStrings([...sectionQuestions, ...defaultQuestions]).slice(0, 5);
}

function getOpener(request: AssistantRequest, objection?: ReturnType<typeof pickObjection>) {
  if (objection) {
    return objection.correct;
  }

  const mode = modeLabels[request.mode];
  const tone = toneLabels[request.tone];

  if (request.tone === "very_short") {
    return `Готова ${mode}, тон: ${tone}.`;
  }

  return `Ось готова ${mode} у стилі La Porte. Тон: ${tone}.`;
}

function getClosing(request: AssistantRequest) {
  if (request.tone === "instagram" || request.tone === "messenger") {
    return "Можемо швидко зорієнтувати вас і запропонувати оптимальний варіант після уточнення параметрів.";
  }

  return "Щоб підготувати точну пропозицію, краще уточнити параметри і за потреби запланувати замір.";
}

function uniqueSections(sections: KnowledgeSection[]) {
  return Array.from(new Map(sections.map((section) => [section.id, section])).values());
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items));
}
