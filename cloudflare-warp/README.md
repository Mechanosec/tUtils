# lazywarp

Minimal TUI for managing Cloudflare WARP.

## Requirements

- Node.js >= 18
- `warp-cli` installed on the system

## Usage

```bash
lazywarp
```

## Keybindings

| Key | Action |
|-----|--------|
| `Space` | Connect / disconnect |
| `r` | Refresh data |
| `m` | Main screen |
| `s` | Settings |
| `i` | Stats |
| `h` | Help |
| `1–4` | Change mode (in settings) |
| `q` | Quit |

## Connection modes

| # | Mode | Description |
|---|------|-------------|
| 1 | `warp` | Standard WARP mode |
| 2 | `doh` | DNS-over-HTTPS |
| 3 | `warp+doh` | Combined |
| 4 | `proxy` | Proxy mode |

## Troubleshooting

**"Registration Missing"** — register the client before connecting for the first time:
```bash
warp-cli registration new
```

**Stats tab is empty** — data is only available when WARP is connected. Connect first, then press `[i]`.
