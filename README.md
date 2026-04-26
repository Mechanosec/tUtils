# tUtils

A collection of terminal UI utilities built with TypeScript + Ink.

## Utilities

| Command | Description | Docs |
|---------|-------------|------|
| `lazywarp` | Cloudflare WARP Manager | [cloudflare-warp/README.md](cloudflare-warp/README.md) |
| `lazynmap` | nmap Terminal UI | [lazynmap/README.md](lazynmap/README.md) |

## Installation

```bash
./init.sh              # all utilities
./init.sh lazynmap     # single utility
./init.sh --list       # list all projects
```

## Adding a new utility

1. Create a folder with a TypeScript + Ink project (use `cloudflare-warp/` as reference)
2. Add an entry to the `PROJECTS` array in `init.sh`:
   ```bash
   "my-tui:mycommand:My Description"
   ```
3. Build: `./init.sh my-tui`

## Requirements

- Node.js >= 18
- npm
