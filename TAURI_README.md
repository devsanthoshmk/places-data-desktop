# GlobexData - Tauri Desktop App

A Vue 3 + Tauri desktop application for managing places data.

## 🚀 Features

- **Cross-platform Desktop App**: Built with Tauri for Windows, macOS, and Linux
- **Modern Vue 3 Frontend**: Reactive UI with composition API
- **Bootstrap Integration**: Beautiful, responsive design
- **Excel Export**: Built-in data export to Excel functionality
- **Phone Number Validation**: International phone number parsing and validation

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **pnpm** (v8 or higher)
- **Rust** (latest stable version)

### Installing Prerequisites

#### Install pnpm
```bash
npm install -g pnpm
```

#### Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

#### Linux-specific Dependencies
On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

On Fedora:
```bash
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

On Arch:
```bash
sudo pacman -Syu
sudo pacman -S --needed \
  webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  gtk3 \
  libappindicator-gtk3 \
  librsvg \
  libvips
```

## 🎯 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run in Development Mode
```bash
pnpm tauri:dev
```

This will:
- Start the Vite dev server
- Launch the Tauri development window
- Enable hot-reload for both frontend and backend

### 3. Build for Production
```bash
pnpm tauri:build
```

The built application will be in `src-tauri/target/release/bundle/`

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Run Vite dev server only (web version) |
| `pnpm build` | Build the web version |
| `pnpm preview` | Preview the built web version |
| `pnpm tauri` | Run Tauri CLI commands |
| `pnpm tauri:dev` | Run Tauri app in development mode |
| `pnpm tauri:build` | Build the Tauri app for production |

## 🏗️ Project Structure

```
places-data/
├── src/                    # Vue 3 source code
│   ├── components/        # Vue components
│   ├── assets/           # Static assets (CSS, fonts, images)
│   ├── utils/            # Utility functions
│   ├── App.vue           # Root component
│   └── main.js           # Application entry point
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/              # Rust source code
│   ├── icons/            # Application icons
│   ├── Cargo.toml        # Rust dependencies
│   └── tauri.conf.json   # Tauri configuration
├── public/                # Public static files
├── test/                  # Test files
├── docs/                  # Documentation
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
└── package.json          # Node dependencies

```

## ⚙️ Configuration

### Tauri Configuration
The main Tauri configuration is in `src-tauri/tauri.conf.json`:
- Window size and behavior
- App identifier and version
- Build settings
- Security settings

### Vite Configuration
The Vite configuration in `vite.config.js` includes:
- Tauri-specific settings
- Vue plugin configuration
- Build optimizations
- Dev server settings

## 🔧 Development

### Hot Reload
Both the frontend (Vue) and backend (Rust) support hot reload in development mode:
- Vue changes: Instant reload via Vite HMR
- Rust changes: Automatic recompilation and app restart

### Debugging
- Frontend: Use browser DevTools (accessible in the Tauri window)
- Backend: Rust logs are printed to the terminal

### Environment Variables
Create a `.env` file in the project root for environment variables:
```env
VITE_API_URL=your_api_url
TAURI_DEBUG=true
```

## 📱 Building for Different Platforms

### Windows
```bash
pnpm tauri:build -- --target x86_64-pc-windows-msvc
```

### macOS
```bash
pnpm tauri:build -- --target x86_64-apple-darwin
# For M1/M2 Macs:
pnpm tauri:build -- --target aarch64-apple-darwin
```

### Linux
```bash
pnpm tauri:build -- --target x86_64-unknown-linux-gnu
```

## 🎨 Customization

### Application Icon
Replace the icons in `src-tauri/icons/` with your own:
- `icon.png` - Source icon (1024x1024)
- Other sizes are auto-generated during build

### Window Settings
Modify window properties in `src-tauri/tauri.conf.json`:
```json
{
  "app": {
    "windows": [{
      "title": "Your App Title",
      "width": 1200,
      "height": 800,
      "minWidth": 800,
      "minHeight": 600
    }]
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: `rustc` not found
```bash
# Solution: Add Rust to PATH
source $HOME/.cargo/env
```

**Issue**: Missing Linux dependencies
```bash
# Solution: Install required system packages (see Prerequisites section)
```

**Issue**: Port 5173 already in use
```bash
# Solution: Kill the process using the port
lsof -ti:5173 | xargs kill -9
```

**Issue**: Build fails on Windows
```bash
# Solution: Ensure you have Visual Studio Build Tools installed
# Download from: https://visualstudio.microsoft.com/downloads/
```

## 📚 Resources

- [Tauri Documentation](https://tauri.app/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Rust Documentation](https://www.rust-lang.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Tauri Team for the amazing framework
- Vue Team for Vue 3
- All contributors and users
