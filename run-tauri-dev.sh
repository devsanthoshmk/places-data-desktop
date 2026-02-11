#!/bin/bash
# Tauri Development Runner
# This script ensures Rust is in PATH and runs the Tauri dev server

# Add Rust to PATH
source $HOME/.cargo/env

# Check if Rust is available
if ! command -v rustc &> /dev/null; then
    echo "❌ Error: Rust is not installed or not found in PATH"
    echo "Please install Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

echo "✅ Rust $(rustc --version) found"
echo "🚀 Starting Tauri development server..."
echo ""

# Run Tauri dev
pnpm tauri:dev
