# GitHub + Vercel deployment

## 1. Завантажити на GitHub

Створіть новий репозиторій на GitHub, наприклад:

```text
la-porte-ai-assistant
```

У папці проєкту виконайте:

```bash
git init
git add .
git commit -m "Initial La Porte AI Assistant MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/la-porte-ai-assistant.git
git push -u origin main
```

## 2. Підключити Vercel

1. Відкрийте Vercel.
2. Натисніть Add New Project.
3. Оберіть репозиторій `la-porte-ai-assistant`.
4. Framework Preset має бути Next.js.
5. Build Command: `npm run build`.
6. Install Command: `npm install`.
7. Натисніть Deploy.

## 3. Environment Variables

Для поточного MVP змінні не потрібні. Mock AI працює локально.

Коли будете підключати реальний OpenAI API, додайте у Vercel:

```text
OPENAI_API_KEY=ваш_ключ
```

## 4. Локальна перевірка перед деплоєм

```bash
npm install
npm run lint
npm run build
npm run dev
```

Після `npm run dev` відкрийте:

```text
http://localhost:3000
```

## 5. Що вже підготовлено

- `.gitignore` для GitHub.
- `vercel.json` для Vercel.
- `.env.example` для майбутнього AI API.
- GitHub Actions workflow `.github/workflows/ci.yml`.
- ESLint config для Next.js.
- README з описом структури та запуску.
