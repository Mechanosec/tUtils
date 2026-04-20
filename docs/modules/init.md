# init.sh — Build & Link Script

## Purpose

Builds all TUI projects in the monorepo and links them as global CLI commands.

## Key responsibilities

- Installs npm dependencies per project
- Compiles TypeScript via `npm run build`
- Makes `dist/index.js` executable
- Creates global npm symlinks so commands are available system-wide
- Auto-configures a user-writable npm prefix if `/usr/local` is not writable (no `sudo` needed)

## npm prefix handling

On first run, if the current npm prefix is not writable, `init.sh` automatically:

1. Sets npm prefix to `~/.npm-global`
2. Exports `~/.npm-global/bin` into `PATH` for the current session
3. Appends the `export PATH=...` line to `~/.bashrc` for future sessions

After the first run, execute `source ~/.bashrc` once to activate the PATH change.

## Usage

```bash
./init.sh                  # Build all projects
./init.sh cloudflare-warp  # Build a single project
./init.sh --list           # List available projects
./init.sh --help           # Show help
```

## Adding a new project

Edit the `PROJECTS` array in `init.sh`:

```bash
PROJECTS=(
    "cloudflare-warp:lazywarp:Cloudflare WARP Manager"
    "my-new-tui:mycommand:My Cool TUI"
)
```

Format: `"folder:command:description"`
