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

### 2. LazyNmap (`lazynmap`)
Повноцінний TUI для nmap — зручний інтерфейс для сканування мереж прямо з термінала.

**Можливості:**
- 🔍 Вісім типів сканування: Quick, Full, Ping, OS, Service, UDP, Vuln, Custom
- 📊 Parsed view — структурований вивід хостів і портів
- 📄 Raw view — вивід nmap у сирому вигляді
- 🔄 Перемикання між режимами — `[v]`
- 📜 Скрол результатів стрілками — `[↑↓]`
- 💾 Експорт результатів у файл — `[e]`
- ⚠️ Підсвічування небезпечних портів (21, 23, 25, 80 тощо)
- ⌨️ Vim-style навігація: `[j/k]` — вибір типу сканування

**Гарячі клавіші:**

| Клавіша | Дія |
|---------|-----|
| `j` / `k` | Вибір типу сканування |
| `↑` / `↓` | Скрол результатів |
| `tab` | Фокус на поле target |
| `Enter` / `Space` | Запустити сканування |
| `x` | Зупинити сканування |
| `v` | Перемкнути parsed / raw |
| `e` | Експортувати результати |
| `q` | Вийти |

**Запуск:**
```bash
lazynmap
```

## 🚀 Швидкий старт

### Встановлення всіх утиліт

```bash
./init.sh
```

### Встановлення конкретної утиліти

```bash
./init.sh cloudflare-warp
./init.sh lazynmap
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
├── lazynmap/                  # LazyNmap TUI
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── nmap.ts
│   │   └── components/
│   ├── tests/
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

`init.sh` автоматично налаштовує npm prefix. Якщо команда не знайдена після першого запуску:
```bash
source ~/.bashrc
```

### Помилка: EACCES / permission denied при npm link

`init.sh` автоматично виправляє це, налаштовуючи `~/.npm-global` як prefix. Не потрібен `sudo`.

### lazywarp: не вдається підключитись / "Error toggling connection"

WARP потребує реєстрації перед першим підключенням. Перевір статус:
```bash
warp-cli status
```

Якщо бачиш `Registration Missing` — зареєструй клієнт:
```bash
warp-cli registration new
```

Після реєстрації WARP підключиться через lazywarp або вручну:
```bash
warp-cli connect
```

### lazywarp: вкладка Stats порожня

`warp-cli tunnel stats` повертає дані лише коли WARP підключений. Підключись і натисни `[i]`.

### lazynmap: "command not found" при sudo

`sudo` використовує окремий PATH і не бачить npm-linked бінарників. Використовуй:
```bash
sudo env PATH=$PATH lazynmap
```

### lazynmap: OS detection requires sudo

OS detection (`-O`) вимагає root. Запускай з:
```bash
sudo env PATH=$PATH lazynmap
```
Потім вибирай тип `OS` в меню.

### lazynmap: великий вивід (наприклад, `-sL 192.168.0.0/24`)

TUI підтримує скрол — використовуй `[↑↓]` для навігації. Авто-скрол слідує за виводом під час сканування і зупиняється коли прокручуєш вгору.

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
