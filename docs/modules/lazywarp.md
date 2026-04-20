# lazywarp — Cloudflare WARP TUI

## Purpose

Мінімалістичний TUI для управління Cloudflare WARP прямо з терміналу.

## Key responsibilities

- Показує статус з'єднання WARP
- Перемикає підключення on/off
- Змінює режими (warp, doh, warp+doh, proxy)
- Відображає статистику використання

## Alternate screen buffer

`index.ts` вмикає alternate screen buffer при запуску (`\x1b[?1049h`) і відновлює термінал при виході (`\x1b[?1049l`). Це дає поведінку як у lazygit — застосунок відкривається в окремому екрані, не забруднюючи scroll history.

Обробляються події: `exit`, `SIGINT`, `SIGTERM`.

## Public API / Exports

- `App` (з `App.tsx`) — кореневий React-компонент

## Dependencies

- `ink` — React для термінала
- `react`
- `typescript`

## Entry point

`src/index.ts` → компілюється в `dist/index.js`
