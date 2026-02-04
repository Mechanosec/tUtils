# tUtils - Terminal UI Utilities Collection

Колекція мінімалістичних TUI (Text User Interface) утиліт написаних на TypeScript з використанням Ink.

## 📦 Доступні утиліти

### 1. LazyWarp (`lazywarp`)
Мінімалістичний TUI для управління Cloudflare WARP.

**Можливості:**
- 📊 Статус з'єднання
- 🔄 Перемикання підключення
- ⚙️ Зміна режимів (warp, doh, warp+doh, proxy)
- 📈 Статистика використання
- ⌨️ Зручні гарячі клавіші

## 🚀 Швидкий старт

### Встановлення всіх утиліт

```bash
./init.sh
```

### Встановлення конкретної утиліти

```bash
./init.sh cloudflare-warp
```

### Інші команди

```bash
./init.sh --list    # Показати всі доступні проекти
./init.sh --help    # Показати допомогу
```

## 🛠️ Додавання нових TUI

### 1. Створіть нову папку для проекту

```bash
mkdir my-new-tui
cd my-new-tui
```

### 2. Ініціалізуйте TypeScript + Ink проект

Використовуйте структуру як у `cloudflare-warp/`:
- `package.json` з правильним `bin` полем
- `tsconfig.json` з правильними налаштуваннями
- `src/` з вашим кодом

### 3. Додайте проект до `init.sh`

Відредагуйте масив `PROJECTS` у файлі `init.sh`:

```bash
PROJECTS=(
    "cloudflare-warp:lazywarp:Cloudflare WARP Manager"
    "my-new-tui:mycommand:My Cool TUI Description"
)
```

Формат: `"папка:команда:опис"`

### 4. Зберіть проект

```bash
./init.sh my-new-tui
```

## 📁 Структура проекту

```
tUtils/
├── init.sh                    # Білд-скрипт для всіх проектів
├── README.md                  # Ця документація
├── cloudflare-warp/           # LazyWarp TUI
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── warp.ts
│   │   └── components/
│   ├── package.json
│   └── tsconfig.json
└── [your-new-tui]/           # Ваша нова утиліта
    ├── src/
    ├── package.json
    └── tsconfig.json
```

## 🎨 Рекомендований стек

- **TypeScript** - Типізація
- **Ink** - React для термінала
- **ink-spinner** - Анімації завантаження
- **chalk** - Кольори в терміналі

## 📝 Вимоги

- Node.js >= 18
- npm або yarn
- TypeScript

## 🤝 Приклад package.json

```json
{
  "name": "my-tui",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "mycommand": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc && node dist/index.js",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "ink": "^4.4.1",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "typescript": "^5.3.3"
  }
}
```

## 📝 Приклад tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "lib": ["ES2022"],
    "jsx": "react",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "nodenext"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🔧 Troubleshooting

### Помилка: "Command not found"

Після білду виконайте:
```bash
npm link
```

### Помилки TypeScript

Перевірте що `moduleResolution: "nodenext"` та `module: "NodeNext"` в `tsconfig.json`.

### Оновлення після змін

```bash
./init.sh your-project-name
```

## 📄 Ліцензія

MIT

## ✨ Автор

Created with ❤️ for terminal lovers
