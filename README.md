# La Porte AI Assistant

MVP внутрішнього веб-додатку для менеджера салону дверей La Porte. Інтерфейс українською мовою, з локальною базою знань, mock AI-логікою, історією запитів у `localStorage`, збереженими відповідями, копіюванням і режимами для клієнтів, дизайнерів, замірів, заперечень, рекламацій та скриптів.

## Як запустити локально

```bash
npm install
npm run dev
```

Після запуску відкрийте:

```text
http://localhost:3000
```

## Деплой

Файли для GitHub і Vercel вже підготовлені:

- `.gitignore`
- `vercel.json`
- `.env.example`
- `.github/workflows/ci.yml`
- `eslint.config.mjs`

Покрокова інструкція є у `DEPLOYMENT.md`.

## Структура

```text
app/
  api/assistant/route.ts    Mock API route, яку можна замінити на OpenAI API
  page.tsx                  Головний інтерфейс
components/                 UI та бізнес-модулі
data/knowledge/la-porte.ts  Локальна база знань
lib/mockAssistant.ts        Базова логіка генерації відповідей
lib/types.ts                Типи режимів, тонів і відповідей
```

## Як підключити реальний AI пізніше

Зараз `/api/assistant` викликає `generateAssistantResponse()` з `lib/mockAssistant.ts`. Для реального AI достатньо залишити той самий контракт `AssistantRequest -> AssistantResponse`, а всередині route викликати OpenAI API, передавши:

- текст запиту менеджера;
- вибраний режим;
- вибраний тон;
- релевантні блоки з локальної бази знань;
- правила безпеки: не вигадувати характеристики, не обіцяти точну ціну без заміру, не гарантувати строки без підтвердження.
