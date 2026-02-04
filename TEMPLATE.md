# Шаблон для створення нового TUI

## Швидкий старт

### 1. Створіть папку

```bash
mkdir my-awesome-tui
cd my-awesome-tui
```

### 2. Створіть package.json

```json
{
  "name": "my-awesome-tui",
  "version": "1.0.0",
  "description": "My awesome TUI application",
  "main": "dist/index.js",
  "type": "module",
  "bin": {
    "myapp": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc && node dist/index.js",
    "start": "node dist/index.js"
  },
  "keywords": ["tui", "cli"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "ink": "^4.4.1",
    "react": "^18.2.0",
    "ink-spinner": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "typescript": "^5.3.3"
  }
}
```

### 3. Створіть tsconfig.json

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
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "nodenext",
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Створіть src/index.ts

```typescript
#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

render(React.createElement(App));
```

### 5. Створіть src/App.tsx

```typescript
import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';

export const App: React.FC = () => {
  const { exit } = useApp();

  useInput((input, key) => {
    if (input === 'q') {
      exit();
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2}>
        <Text bold color="cyan">
          🚀 My Awesome TUI
        </Text>
      </Box>
      
      <Box marginTop={1} paddingX={2}>
        <Text>Press [q] to quit</Text>
      </Box>
    </Box>
  );
};
```

### 6. Створіть .gitignore

```
node_modules/
dist/
*.log
.DS_Store
.env
```

### 7. Додайте до init.sh

Відредагуйте `../init.sh` і додайте в масив `PROJECTS`:

```bash
PROJECTS=(
    "cloudflare-warp:lazywarp:Cloudflare WARP Manager"
    "my-awesome-tui:myapp:My Awesome TUI Application"
)
```

### 8. Зберіть і встановіть

```bash
cd ..
./init.sh my-awesome-tui
```

### 9. Запустіть!

```bash
myapp
```

## Корисні компоненти Ink

### Box - Контейнер з flexbox

```tsx
<Box flexDirection="column" padding={1} borderStyle="single" borderColor="cyan">
  <Text>Content</Text>
</Box>
```

### Text - Текст з кольорами

```tsx
<Text color="green" bold>Success!</Text>
<Text color="red" dimColor>Error</Text>
<Text backgroundColor="blue">Highlighted</Text>
```

### useInput - Обробка клавіш

```tsx
useInput((input, key) => {
  if (input === 'q') exit();
  if (key.return) doSomething();
  if (key.upArrow) moveUp();
});
```

### Spinner - Анімація завантаження

```tsx
import Spinner from 'ink-spinner';

<Text>
  <Spinner type="dots" /> Loading...
</Text>
```

## Стилі Border

- `single` - ┌─┐
- `double` - ╔═╗
- `round` - ╭─╮
- `bold` - ┏━┓
- `classic` - +--+

## Кольори

Доступні кольори:
- black, red, green, yellow, blue, magenta, cyan, white
- gray, grey
- blackBright, redBright, greenBright, yellowBright, blueBright, magentaBright, cyanBright, whiteBright

## Приклад з useState

```tsx
const [count, setCount] = useState(0);

useInput((input) => {
  if (input === '+') setCount(count + 1);
  if (input === '-') setCount(count - 1);
});

<Text>Count: {count}</Text>
```

## Приклад з useEffect

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    // Щось робимо кожну секунду
  }, 1000);
  
  return () => clearInterval(timer);
}, []);
```

Успіхів у створенні TUI! 🚀
