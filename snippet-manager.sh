#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Snippet repository path
SNIPPET_DIR="$HOME/Github/react-snippet-manager"

# Function to list languages
list_languages() {
    echo -e "${YELLOW}Available languages:${NC}"
    select lang in $(ls -d $SNIPPET_DIR/*/ | xargs -n 1 basename) "Exit"; do
        if [[ $lang == "Exit" ]]; then
            echo -e "${RED}Exiting...${NC}"
            exit 0
        elif [[ -d "$SNIPPET_DIR/$lang" ]]; then
            list_categories "$lang"
        else
            echo -e "${RED}Invalid choice! Try again.${NC}"
        fi
    done
}

# Function to list categories
list_categories() {
    local lang="$1"
    echo -e "${BLUE}Available categories in $lang:${NC}"
    select category in $(ls -d $SNIPPET_DIR/$lang/*/ | xargs -n 1 basename) "Back"; do
        if [[ $category == "Back" ]]; then
            list_languages
        elif [[ -d "$SNIPPET_DIR/$lang/$category" ]]; then
            list_snippets "$lang" "$category"
        else
            echo -e "${RED}Invalid choice! Try again.${NC}"
        fi
    done
}

# Function to list snippets
list_snippets() {
    local lang="$1"
    local category="$2"
    echo -e "${CYAN}Available snippets in $category:${NC}"
    select snippet in $(ls "$SNIPPET_DIR/$lang/$category") "Back"; do
        if [[ $snippet == "Back" ]]; then
            list_categories "$lang"
        elif [[ -f "$SNIPPET_DIR/$lang/$category/$snippet" ]]; then
            cp "$SNIPPET_DIR/$lang/$category/$snippet" "$PWD"
            echo -e "${GREEN}Copied $snippet to $PWD${NC}"
        else
            echo -e "${RED}Invalid choice! Try again.${NC}"
        fi
    done
}

# Start directly from languages
list_languages
