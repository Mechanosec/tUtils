# lazynmap — Design Spec

**Date:** 2026-04-26  
**Binary:** `lazynmap`  
**Stack:** TypeScript + Ink + React (same as `lazywarp`)

---

## Overview

Terminal UI for nmap. Split-view layout: left config panel, right live results panel. Results show in parsed (structured) or raw (nmap stdout) mode, toggled with `[v]`. No persistent history — manual export to file with `[e]`.

---

## File Structure

```
t-nmap/
├── src/
│   ├── index.ts
│   ├── App.tsx
│   ├── nmap.ts
│   ├── types.ts
│   └── components/
│       ├── Header.tsx
│       ├── ConfigPanel.tsx
│       ├── ResultsPanel.tsx
│       └── StatusBar.tsx
├── package.json
└── tsconfig.json
```

---

## State (App.tsx)

```typescript
target: string           // IP / hostname / CIDR
scanType: ScanType       // quick | full | service | os | vuln | custom
customFlags: string      // for custom scan type
isScanning: boolean
viewMode: 'parsed' | 'raw'
hosts: Host[]            // parsed hosts with ports
rawLines: string[]       // raw stdout buffer
elapsed: number          // seconds since scan started
message: string          // transient status messages
```

---

## Scan Types

| Type | Flags | Notes |
|------|-------|-------|
| Quick | `-T4 -F` | top 100 ports |
| Full TCP | `-p- -T4` | all 65535 ports |
| Service Detection | `-sV -T4` | detect versions |
| OS Detection | `-O -T4` | requires root |
| Vuln Scan | `--script vuln -T4` | forces raw view |
| Custom | user input | manual flags |

---

## Components

**Header.tsx** — title bar with app name and scan status indicator.

**ConfigPanel.tsx** — left panel (width ~22 chars).
- `[↑↓]` to navigate scan types
- `[tab]` to focus target input field
- Shows `⚠ requires sudo` for OS Detection
- Shows `⚠ raw only` for Vuln Scan
- `[ ▶ RUN ]` button

**ResultsPanel.tsx** — right panel (flex: 1).
- `parsed` mode: tree of hosts with ports, dangerous ports highlighted (21/ftp, 23/telnet, etc.)
- `raw` mode: scrollable nmap stdout buffer
- Toggle indicator in header: `parsed | raw`

**StatusBar.tsx** — bottom bar.
- While scanning: elapsed time + hosts found count
- Idle: available keybindings hint

---

## NmapClient (nmap.ts)

Extends `EventEmitter`. Builds command from scan type + target, runs via `child_process.spawn()`.

**Events:**
- `line(raw: string)` — every stdout line (always emitted, feeds rawLines)
- `host(host: Host)` — when `Nmap scan report for X` parsed
- `port(ip: string, port: Port)` — when `22/tcp open ssh ...` parsed
- `done(summary: ScanSummary)` — on process close

**Line parsing (progressive):**
```
"Nmap scan report for 192.168.1.1"       → new host
"Host is up (0.002s latency)"            → host latency
"22/tcp  open  ssh  OpenSSH 8.9p1"       → port entry
"Nmap done: X hosts up"                  → summary
```

Parser is tolerant: unrecognized lines are emitted as `line` only, no crash.

---

## Pre-launch Validation

1. `nmap` not in PATH → show error message, block run
2. `scanType === 'os'` and `process.getuid() !== 0` → warn about sudo, allow proceed
3. `scanType === 'vuln'` → auto-set `viewMode = 'raw'`, show info message

---

## Process Lifecycle

- `[x]` during scan → `SIGTERM` to nmap process, wait for `close` event, reset scanning state
- App exit (`[q]`) → kill nmap process first if running, then `useApp().exit()`

---

## Export

- `[e]` saves `rawLines.join('\n')` to `./lazyscan-<ISO-timestamp>.txt` in cwd
- Shows message: `Saved to lazyscan-2026-04-26T12:34:56.txt`

---

## Keybindings

| Key | Action |
|-----|--------|
| `↑↓` | navigate scan types |
| `tab` | focus target input |
| `enter` | run scan |
| `x` | stop scan |
| `v` | toggle parsed ↔ raw |
| `e` | export to file |
| `q` | quit |

---

## Types (types.ts)

```typescript
type ScanType = 'quick' | 'full' | 'service' | 'os' | 'vuln' | 'custom';
type ViewMode = 'parsed' | 'raw';

interface Port {
  number: number;
  protocol: 'tcp' | 'udp';
  state: 'open' | 'filtered' | 'closed';
  service: string;
  version?: string;
}

interface Host {
  ip: string;
  hostname?: string;
  latency?: string;
  ports: Port[];
}

interface ScanSummary {
  hostsUp: number;
  hostsTotal: number;
  elapsed: string;
}
```

---

## Dangerous Ports (highlighted in red)

21 (ftp), 23 (telnet), 25 (smtp), 110 (pop3), 143 (imap), 512-514 (rsh/rexec/rlogin), 1433 (mssql), 3306 (mysql), 5900 (vnc)

---

## init.sh Integration

Add to `PROJECTS` array in `init.sh`:
```bash
"t-nmap:lazynmap:nmap Terminal UI"
```
