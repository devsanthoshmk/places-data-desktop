# Quick Start Guide - Tauri App

## ⚡ First Time Setup

1. **Ensure Rust is in your PATH**
   ```bash
   source $HOME/.cargo/env
   ```

2. **Install system dependencies** (if needed)
   ```bash
   ./install-dependencies.sh
   ```

3. **Install Node dependencies**
   ```bash
   pnpm install
   ```

## 🚀 Running the App

### Development Mode (Recommended for testing)
```bash
# Make sure Rust is in PATH first
source $HOME/.cargo/env

# Run the Tauri dev server
pnpm tauri:dev
```

This will:
- ✅ Compile the Rust backend
- ✅ Start the Vite dev server
- ✅ Launch the desktop application window
- ✅ Enable hot-reload for instant updates

### Production Build
```bash
# Make sure Rust is in PATH first
source $HOME/.cargo/env

# Build the production app
pnpm tauri:build
```

The built application will be in: `src-tauri/target/release/bundle/`

## 📝 Notes

- **First build** may take 5-10 minutes as it compiles all Rust dependencies
- **Subsequent builds** will be much faster (1-2 minutes)
- **Development mode** has instant hot-reload for Vue changes
- **Window dimensions**: 1200x800 (minimum: 800x600)

## 🐛 Troubleshooting

### If you get "rustc not found"
```bash
source $HOME/.cargo/env
```

### If you get "webkit2gtk not found"
```bash
./install-dependencies.sh
```

### If port 5173 is already in use
```bash
lsof -ti:5173 | xargs kill -9
```

## 📚 More Information

See `TAURI_README.md` for comprehensive documentation.
