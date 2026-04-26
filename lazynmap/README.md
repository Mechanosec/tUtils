# lazynmap

Terminal UI for nmap — a convenient interface for network scanning.

## Requirements

- Node.js >= 18
- `nmap` installed on the system

## Usage

```bash
lazynmap
```

> OS detection requires root: `sudo env PATH=$PATH lazynmap`

## Keybindings

| Key | Action |
|-----|--------|
| `j` / `k` | Select scan type |
| `Tab` | Focus target input |
| `Enter` / `Space` | Start scan |
| `x` | Stop scan |
| `↑` / `↓` | Scroll results |
| `v` | Toggle parsed / raw view |
| `e` | Export results to file |
| `q` | Quit |

## Scan types

| Type | Flags | Description |
|------|-------|-------------|
| Quick | `-T4 -F` | Fast scan of common ports |
| Full | `-T4 -p-` | All 65535 ports |
| Ping | `-sn` | Host discovery only |
| OS | `-O` | OS detection (requires root) |
| Service | `-sV` | Service version detection |
| UDP | `-sU` | UDP ports (requires root) |
| Vuln | `--script vuln` | Vulnerability scan |
| Custom | — | Custom flags |

## Views

- **Parsed** — structured output: hosts → ports → versions. Dangerous ports highlighted in red.
- **Raw** — raw nmap output with scroll support.

## Troubleshooting

**"command not found" with sudo** — sudo uses a separate PATH:
```bash
sudo env PATH=$PATH lazynmap
```

**Large output (e.g. `-sL 192.168.0.0/24`)** — use `[↑↓]` to scroll. Auto-scroll follows live output and pauses when you scroll up.
