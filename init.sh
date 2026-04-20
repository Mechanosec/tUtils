#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Projects configuration
# Format: "folder:command:description"
PROJECTS=(
    "cloudflare-warp:lazywarp:Cloudflare WARP Manager"
    # Add new projects here:
    # "my-new-tui:mycommand:My Cool TUI"
)

# Function to build a single project
build_project() {
    local project_dir=$1
    local command_name=$2
    local description=$3
    
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📦 $description${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Check if folder exists
    if [ ! -d "$project_dir" ]; then
        echo -e "${RED}✗ Folder $project_dir not found! Skipping...${NC}"
        return 1
    fi
    
    # Change to project directory
    cd "$project_dir" || return 1
    
    echo -e "\n${YELLOW}[1/4]${NC} Installing dependencies..."
    if npm install --silent; then
        echo -e "${GREEN}✓ Dependencies installed${NC}"
    else
        echo -e "${RED}✗ Failed to install dependencies${NC}"
        cd ..
        return 1
    fi
    
    echo -e "\n${YELLOW}[2/4]${NC} Compiling TypeScript..."
    if npm run build; then
        echo -e "${GREEN}✓ Build successful${NC}"
    else
        echo -e "${RED}✗ Build failed${NC}"
        cd ..
        return 1
    fi
    
    echo -e "\n${YELLOW}[3/4]${NC} Making file executable..."
    if [ -f "dist/index.js" ]; then
        chmod +x dist/index.js
        echo -e "${GREEN}✓ Permissions set${NC}"
    else
        echo -e "${YELLOW}⚠ dist/index.js not found, skipping...${NC}"
    fi
    
    echo -e "\n${YELLOW}[4/4]${NC} Creating global link..."
    if npm link; then
        echo -e "${GREEN}✓ Link created: ${BLUE}$command_name${NC}"
        cd ..
        return 0
    else
        echo -e "${RED}✗ Failed to create link${NC}"
        cd ..
        return 1
    fi
}

# Ensure npm prefix is user-writable (no sudo needed)
ensure_npm_prefix() {
    local npm_prefix
    npm_prefix=$(npm config get prefix 2>/dev/null)
    if [ ! -w "$npm_prefix" ]; then
        local user_prefix="$HOME/.npm-global"
        echo -e "${YELLOW}⚠ npm prefix '$npm_prefix' is not writable. Configuring user prefix: $user_prefix${NC}"
        mkdir -p "$user_prefix"
        npm config set prefix "$user_prefix"
        export PATH="$user_prefix/bin:$PATH"

        local export_line="export PATH=\"$user_prefix/bin:\$PATH\""
        local shell_name
        shell_name=$(basename "${SHELL:-sh}")
        local profile_file
        case "$shell_name" in
            zsh)  profile_file="$HOME/.zshrc" ;;
            bash) profile_file="$HOME/.bashrc" ;;
            *)    profile_file="$HOME/.profile" ;;
        esac
        if ! grep -qF "$export_line" "$profile_file" 2>/dev/null; then
            echo "" >> "$profile_file"
            echo "# npm global prefix" >> "$profile_file"
            echo "$export_line" >> "$profile_file"
            echo -e "${GREEN}✓ Added $user_prefix/bin to PATH in $profile_file${NC}"
            echo -e "${YELLOW}  Run: source $profile_file${NC}"
        fi
    fi
}

# Main function
main() {
    echo -e "${MAGENTA}"
    echo "╔════════════════════════════════════════╗"
    echo "║     tUtils - TUI Builder & Linker     ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"

    ensure_npm_prefix

    local success_count=0
    local fail_count=0
    local built_commands=()
    
    # If argument provided - build only one project
    if [ -n "$1" ]; then
        echo -e "${BLUE}Mode: Building single project ($1)${NC}\n"
        
        for project in "${PROJECTS[@]}"; do
            IFS=':' read -r dir cmd desc <<< "$project"
            if [ "$dir" == "$1" ] || [ "$cmd" == "$1" ]; then
                if build_project "$dir" "$cmd" "$desc"; then
                    built_commands+=("$cmd")
                    success_count=$((success_count + 1))
                else
                    fail_count=$((fail_count + 1))
                fi
                break
            fi
        done
    else
        # Build all projects
        echo -e "${BLUE}Mode: Building all projects${NC}\n"
        
        for project in "${PROJECTS[@]}"; do
            IFS=':' read -r dir cmd desc <<< "$project"
            if build_project "$dir" "$cmd" "$desc"; then
                built_commands+=("$cmd")
                success_count=$((success_count + 1))
            else
                fail_count=$((fail_count + 1))
            fi
        done
    fi
    
    # Summary
    echo -e "\n${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${MAGENTA}📊 Summary:${NC}"
    echo -e "${GREEN}   ✓ Successful: $success_count${NC}"
    if [ $fail_count -gt 0 ]; then
        echo -e "${RED}   ✗ Failed: $fail_count${NC}"
    fi
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if [ ${#built_commands[@]} -gt 0 ]; then
        echo -e "\n${GREEN}✓ Available commands:${NC}"
        for cmd in "${built_commands[@]}"; do
            echo -e "  ${BLUE}$ $cmd${NC}"
        done
        echo ""
    fi
    
    if [ $fail_count -eq 0 ] && [ $success_count -gt 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Help
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo -e "${CYAN}tUtils - Builder for TUI programs${NC}\n"
    echo "Usage:"
    echo "  ./init.sh              - Build all projects"
    echo "  ./init.sh <project>    - Build single project"
    echo "  ./init.sh --list       - Show all projects"
    echo "  ./init.sh --help       - Show this help"
    echo ""
    echo "Examples:"
    echo "  ./init.sh                    # Build everything"
    echo "  ./init.sh cloudflare-warp    # Build lazywarp"
    echo ""
    exit 0
fi

# List projects
if [ "$1" == "--list" ] || [ "$1" == "-l" ]; then
    echo -e "${CYAN}Available projects:${NC}\n"
    for project in "${PROJECTS[@]}"; do
        IFS=':' read -r dir cmd desc <<< "$project"
        echo -e "  ${BLUE}$cmd${NC} - $desc"
        echo -e "    ${YELLOW}Folder:${NC} $dir"
        echo ""
    done
    exit 0
fi

# Run
main "$1"
