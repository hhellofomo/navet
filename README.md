# Navet

<div align="center">

<img src="public/logo.svg" alt="Navet Logo" width="120" height="120" />

<br />
<br />

![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)

**A beautiful, iOS-inspired smart home dashboard with frosted glass aesthetics**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Widgets](docs/WIDGETS.md) • [License](#license) • [Contributing](CONTRIBUTING.md)

</div>

---

## 📱 Overview

Navet (Swedish for "the hub") is a modern, responsive smart home dashboard built with React and Tailwind CSS v4. Features a stunning frosted glass design inspired by iOS widgets, with comprehensive smart home control capabilities and an intuitive editing system.

## ✨ Features

### 🎨 Design
- **iOS-Inspired Interface** - Frosted glass cards with blur effects and smooth animations
- **3 Theme Modes** - Light, Dark, and High Contrast
- **8 Primary Colors** - Customizable accent colors
- **Responsive Grid** - 2 columns (mobile) → 4 (tablet) → 6 (desktop)
- **Adaptive Cards** - Extra-Small, Small, Medium, and Large card sizes

### 🏠 Smart Home Control
- **Multi-Entity Support** - Lights, HVAC, switches, covers, locks, sensors, media players, vacuums, and more
- **Real-Time Updates** - Live state updates from your smart home system
- **Quick Actions** - Toggle, adjust, and control devices with intuitive controls
- **Room Organization** - Organized by rooms with dedicated room views
- **Configurable Card Interactions** - Choose whether card tap toggles devices or opens controls

### 🛠️ Functionality
- **Edit Mode** - Drag-and-drop card reordering and resizing
- **Custom Widgets** - Add Calendar, News, Weather, Photo Frame, and Quick Note widgets
- **Manual Entity Mode** - Switch from auto-discovered cards to a curated entity list
- **Search & Filter** - Real-time search filters dashboard view
- **All View** - See all devices grouped by room
- **Notifications** - System notifications panel
- **Settings** - Comprehensive theme and customization options
- **User Management** - Login system with user profiles
- **Data Persistence** - Automatic localStorage persistence of all settings:
  - ✅ Theme mode and primary color
  - ✅ Current room selection
  - ✅ Search query
  - ✅ Custom widgets and layouts
  - ✅ User preferences

### 🔐 Security
- **Local First** - Runs entirely on your device
- **No Tracking** - Zero analytics or data collection
- **Secure Connections** - Direct connection to your smart home instance

### ⚡ Performance
- **Lazy-Loaded UI** - Settings, add-card flows, widgets, and media dialogs load on demand
- **Deferred Room Rendering** - Offscreen room groups are deferred in the All view
- **Smart Re-renders** - Zustand-backed search state and stable device maps reduce dashboard churn
- **No-Animation Mode** - Optional global animation disable for slower devices
- **Local Config Backup** - Export and restore dashboard layout/preferences from a JSON file
- **Tree-shakeable** - Only imports what's actually used

### 🧱 Architecture
- **Direct Hook APIs** - Theme, navigation, search, and Home Assistant access now use hook modules directly instead of passthrough provider wrappers
- **Shared Utilities** - Device room lookup, theme color resolution, wallpaper upload handling, notification styling, and vacuum status helpers are centralized to reduce fan-out edits
- **Consistent Persistence** - Storage keys and session/config persistence are standardized behind shared helpers

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- A running smart home system (Home Assistant or compatible)
- Smart home API token

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/awesomestvi/navet.git
   cd navet
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   pnpm setup:hooks
   ```

3. **Configure your smart home connection**

   Create a local env file from the example and set your Home Assistant connection details:
   ```bash
   cp .env.example .env
   ```

   Then set:
   ```env
   NAVET_HASS_URL=http://your-home-assistant:8123
   NAVET_HASS_TOKEN=your-long-lived-access-token
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**

   Navigate to `http://navet.homeassistant.local:5200`

## 📖 Usage

### First Time Setup

1. **Provide Home Assistant credentials** via `.env`, Docker runtime config, or the in-app login screen
2. **Connect System** - Ensure your Home Assistant instance is accessible
3. **Customize Layout** - Enter Edit Mode to arrange rooms and cards
4. **Choose Theme** - Select your preferred color scheme and theme mode
5. **Optional for slower hardware** - Disable animations in Settings -> Performance

### Features Guide

#### Edit Mode
- Click the **Edit** button in the header
- **Add widgets** with the Add Card button
- In **Manual** dashboard mode, use **Add Entity** to choose exactly which Home Assistant entities appear
- **Drag cards** to reorder them
- **Click cards** to resize (`extra-small`/small/medium/large, depending on card type)
- **Save changes** when done

#### Search
- Type in the **search bar** to filter devices
- View filters to show only matching entities
- Clear with the **X button**

#### Themes
- Access **Settings** from the user menu
- Choose from **3 modes**: Light, Dark, Contrast
- Select from **8 colors**: Blue, Purple, Green, Orange, Pink, Red, Teal, Yellow

#### Card Interaction Style
- In **Settings -> Dashboard**, choose how entity cards respond to taps
- **Tap toggles**: tapping the card toggles the device directly
- **Tap opens controls**: tapping the card opens the device controls instead
- The settings screen includes a live practice card preview so you can test the interaction before leaving Settings
- On **extra-small** light cards, the compact brightness slider always stays visible
- In **Tap toggles** mode, the settings button moves onto the slider row with compact spacing
- In **Tap opens controls** mode, that button is hidden and the slider expands to the full row width

#### Room Navigation
- Use **room tabs** to filter by room
- **All** view shows everything grouped by room
- Device counts shown for each room

#### Dashboard Content
- In **Settings -> Dashboard Content**, choose between:
  - **Auto**: show discovered entities automatically
  - **Manual**: only show entities you explicitly add
- Manual mode is useful for hiding helper, diagnostic, or duplicate Home Assistant entities

#### Dashboard Config
- In **Settings -> Dashboard Config**, export your local dashboard setup to a JSON file
- Import that file later on the same machine or another device to restore:
  - theme and wallpaper
  - room order and card order
  - card sizes
  - custom widgets
  - manual entity selection
  - light preset settings
- Home Assistant connection URL and token are intentionally not included

#### Custom Widgets
- Click **Add Card** in edit mode to add custom widgets
- Choose from **5 widget types**:
  - **📅 Calendar** - View upcoming events and appointments
  - **📰 News Feed** - Latest headlines and updates
  - **☁️ Weather** - Current conditions and 5-day forecast
  - **🖼️ Photo Frame** - Beautiful photo carousel with navigation
  - **📝 Quick Note** - Editable sticky notes for reminders
- Available in **3 sizes**: Small, Medium, Large
- Dashboard cards also support an **Extra-Small** `1 × 0.5` size for denser layouts
- Widgets persist across browser sessions
- Full drag-and-drop and delete support
- See [WIDGETS.md](docs/WIDGETS.md) for detailed documentation

## 🏗️ Tech Stack

- **React 18** - UI framework with full ecosystem support
- **TypeScript** - Type safety
- **Zustand** - State management with persistence
- **Tailwind CSS v4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **dnd-kit** - Drag and drop functionality
- **Lucide React** - Icon library
- **Vite** - Development server and build tooling

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

### ✅ You CAN:
- Use for personal, educational, or non-profit purposes
- Modify and create derivative works
- Share with others

### ❌ You CANNOT:
- Use commercially or in business environments
- Sell or offer as a paid service
- Use in products that generate revenue

**For commercial licensing inquiries, please contact the author.**

See [LICENSE](LICENSE) and [TERMS_OF_USE.md](docs/TERMS_OF_USE.md) for full details.

## 🤝 Contributing

Contributions are welcome! This is an open-source project under a non-commercial license.

### Documentation

Complete documentation is available in the [`/docs`](docs/) folder:

- **[Widget System](docs/WIDGETS.md)** - Custom widget documentation
- **[Terms of Use](docs/TERMS_OF_USE.md)** - Legal and licensing
- **[Attributions](docs/ATTRIBUTIONS.md)** - Credits and acknowledgments
- **[Change History](docs/archive/CHANGES.md)** - Project history and migrations

For technical documentation and developer guides, see [`/docs/README.md`](docs/README.md).

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'feat(scope): add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Use Conventional Commits for every commit message (`type(scope): summary`)
- Maintain the iOS-inspired design aesthetic
- Test on multiple screen sizes
- Update documentation as needed
- Ensure accessibility standards
- Run `pnpm setup:hooks` once so pre-commit checks enforce Biome, TypeScript baseline drift, and docs updates for user-facing changes

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea? [Open an issue](https://github.com/awesomestvi/navet/issues)!

## 📸 Screenshots

> Add screenshots here once deployed

## 🗺️ Roadmap

- [x] Custom widgets (Calendar, News, Weather, Photo Frame, Notes)
- [x] Data persistence with localStorage
- [x] Configuration UI with setup wizard
- [x] Loading states and error handling
- [x] Delete custom widgets
- [x] Manual dashboard entity selection
- [x] Export/import dashboard configuration
- [ ] Widget settings (customize content)
- [ ] Automations management
- [ ] History and analytics
- [ ] Multi-language support
- [ ] Voice control integration
- [ ] Scene management
- [ ] Real calendar integration (Google Calendar, etc.)
- [ ] Real news API integration
- [ ] Real weather API integration
- [ ] Energy dashboard

## 🙏 Acknowledgments

- Smart home community
- Tailwind CSS team
- Radix UI team
- All contributors

## 💬 Contact

**GitHub:** [@awesomestvi](https://github.com/awesomestvi/)

**Project Link:** [https://github.com/awesomestvi/navet](https://github.com/awesomestvi/navet)

---

<div align="center">

Made with ❤️ by [awesomestvi](https://github.com/awesomestvi/)

**If you find this project useful, please consider giving it a ⭐️**

</div>
