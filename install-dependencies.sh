#!/bin/bash
# Tauri Linux Dependencies Installation Script
# This script installs required system dependencies for Tauri on Arch Linux

echo "Installing Tauri dependencies for Arch Linux..."

# Check if running on Arch-based system
if ! command -v pacman &> /dev/null; then
    echo "Error: This script is for Arch-based systems only."
    echo "Please refer to TAURI_README.md for installation instructions for your system."
    exit 1
fi

# Install dependencies
sudo pacman -S --needed \
  webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  gtk3 \
  libappindicator-gtk3 \
  librsvg

echo "✅ All dependencies installed successfully!"
echo "You can now run 'pnpm tauri:dev' to start the development server."
