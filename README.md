# Navet

<div align="center">

<img src="public/logo.svg" alt="Navet Logo" width="120" height="120" />

<br />
<br />

![License](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)
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
- **4 Theme Modes** - Liquid Glass, Dark, Light, and High Contrast
- **8 Primary Colors** - Customizable accent colors
- **Responsive Grid** - 2 columns (mobile) → 4 (tablet) → 6 (desktop)
- **Adaptive Cards** - Extra-Small, Small, Medium, and Large card sizes

### 🏠 Smart Home Control
- **Multi-Entity Support** - Lights, HVAC, switches, covers, locks, sensors, media players, vacuums, and more
- **Unified Climate Controls** - Home Assistant climate entities now render through the HVAC card and settings flow across the dashboard
- **Home Assistant Media Controls** - Media player cards now use live Home Assistant playback, volume, mute, metadata, elapsed-time, and artwork data instead of mock-only state
- **Real-Time Updates** - Live state updates from your smart home system
- **Quick Actions** - Toggle, adjust, and control devices with intuitive controls
- **Room Organization** - Organized by rooms with dedicated room views
- **Configurable Card Interactions** - Choose whether card tap toggles devices or opens controls

### 🛠️ Functionality
- **Edit Mode** - Drag-and-drop card reordering and resizing
- **Custom Widgets** - Add Calendar, News, Photo Frame, and Quick Note widgets
- **Entity Visibility Control** - Start with all entities, a blank board, or import a saved config, then add/remove entities as needed
- **Search & Filter** - Real-time search filters dashboard view
- **All View Modes** - Switch the `All` room between custom, room, type, or flat grouping
- **Live Weather Entity Card** - Home Assistant weather entities now render as the dashboard weather card with forecast and solar data from Home Assistant
- **Calendar Entities** - Home Assistant calendar entities now render through the live calendar card with per-card source selection, week/month views, and event details
- **Home Assistant Notifications** - Navet notifications now show Home Assistant persistent notifications and update actions
- **Card-Level Room Editing** - Supported entity cards can reassign their room directly from the settings dialog
- **Notifications** - System notifications panel
- **Settings** - Comprehensive theme and customization options
- **User Management** - Login system with user profiles
- **Data Persistence** - Automatic localStorage persistence of all settings:
  - ✅ Theme mode and primary color
  - ✅ Current room selection
  - ✅ Custom widgets and layouts
  - ✅ User preferences
- **Installable PWA Shell** - Manifest, service worker, offline app shell, update prompt, and install assets for mobile/desktop install surfaces

### 🔐 Security
- **Local First** - Runs entirely on your device
- **No Tracking** - Zero analytics or data collection
- **Secure Connections** - Direct connection to your smart home instance

### ⚡ Performance
- **Lazy-Loaded UI** - Settings, add-card flows, widgets, and media dialogs load on demand
- **Deferred Room Rendering** - Offscreen room groups are deferred in the All view
- **Virtualized Entity Picker** - The Add Entity dialog window-renders large Home Assistant entity lists
- **Smart Re-renders** - Zustand-backed search state and stable device maps reduce dashboard churn
- **No-Animation Mode** - Optional global animation disable for slower devices
- **Local Config Backup** - Export and restore dashboard layout/preferences from a YAML file
- **Tree-shakeable** - Only imports what's actually used

### 🧱 Architecture
- **Feature-Owned Modules** - Dashboard, lighting, settings, sensors, weather, and other major areas expose feature-level entry points under `src/app/features/*`
- **Feature-Colocated State** - Dashboard and lighting hooks/stores live with their owning features instead of generic global folders
- **Shared UI Foundation** - Cross-feature pieces such as card sizing, empty states, interaction previews, and theme color helpers live under shared component modules
- **Shared Visual Primitives** - Cross-theme icon pills and interactive nav/action pills are centralized behind reusable shared primitives instead of feature-level inline theme branches
- **Shared Card State Styling** - Off/inactive card treatment for light, HVAC, switch, and media cards now resolves through one shared card-state surface token helper
- **Artwork-Led Media Layouts** - Small, medium, and medium-vertical media cards use artwork-driven layouts with a shared transport-control language
- **Single Climate Card Path** - The legacy `ClimateCard` implementation has been removed; climate entities now use `HVACCard` only
- **Consistent Persistence** - Storage keys plus dashboard/light preference persistence are standardized behind shared helpers and feature stores

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

### Installable PWA

- Navet now ships with a service worker, install manifest, offline shell, and update prompt
- The app can be installed from supported desktop and mobile browsers
- Offline mode currently preserves the app shell and clearly signals that live Home Assistant data still requires connectivity
- Installed iOS mode now respects safe-area insets so the header and mobile bottom navigation stay clear of the status area and rounded bottom corners

### Build Verification

```bash
pnpm typecheck
pnpm build
```

## 📖 Usage

### First Time Setup

1. **Provide Home Assistant credentials** via `.env`, Docker runtime config, or the in-app login screen
2. **Connect System** - Ensure your Home Assistant instance is accessible
3. **Customize Layout** - Enter Edit Mode to arrange rooms and cards
4. **Choose Theme** - Select your preferred color scheme and theme mode
5. **Optional for slower hardware** - Disable animations in Settings -> Performance

### Features Guide

#### Edit Mode
- Click **Customize**
- The top action row uses **Done Editing** plus **Add** and **View** dropdowns
- **Add widgets** from the **Add** dropdown
- Use **Add Entity** to bring entities onto the dashboard
- Use supported card settings dialogs to move an entity directly into a different room
- Use the card remove action to remove entities from the dashboard
- **Drag cards** to reorder them
- Use the top-right resize action to change card size (`extra-small`/small/medium/large, depending on card type)
- **Save changes** when done

#### Search
- Type in the **search bar** to filter devices
- View filters to show only matching entities
- Clear with the **X button**

#### Themes
- Access **Settings** from the user menu
- Choose from **4 modes**: Liquid Glass, Dark, Light, Contrast
- Select from **8 colors**: Blue, Purple, Green, Orange, Pink, Red, Teal, Yellow
- Shared theme-sensitive pieces such as entity icon pills and nav/action pills now resolve through reusable shared primitives rather than per-feature inline styling
- Inactive/off card shells and text treatment now also resolve through a shared card-state primitive instead of per-card opacity tweaks

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
- In **All**, use the **View** dropdown to switch between **Custom**, **Room**, **Type**, and **No Grouping**
- Device counts shown for each room
- The selected dashboard section and room both persist across refresh

#### Calendar Cards
- Home Assistant `calendar.*` entities can be added directly to the dashboard
- Each calendar card can choose which calendars it aggregates
- Calendar cards support **This Week** and **This Month** views
- Clicking an event opens a details dialog with time, notes, location, and an **Open Map** action when location is available

#### Notifications
- Home Assistant persistent notifications appear in Navet notifications
- Home Assistant update entities can surface `Update`, install progress, and `Restart` actions directly in Navet

#### Dashboard Content
- On first launch, choose whether to start with all discovered entities or a blank dashboard
- You can also import a previously exported dashboard config directly from onboarding
- After onboarding, use **Add Entity** and **Remove Entity** to curate the board
- This is useful for excluding helper, diagnostic, or duplicate Home Assistant entities without switching between dashboard modes
- The empty dashboard state now exposes **Add Entity** directly so blank dashboards do not dead-end
- Restarting onboarding from Settings sends you back to the Home dashboard and reopens the onboarding dialog

#### Dashboard Config
- In **Settings -> Dashboard Config**, export your local dashboard setup to a YAML file
- Navet imports that YAML file later from Settings or directly from first-run onboarding
- Import that file later on the same machine or another device to restore:
  - theme and wallpaper
  - room order and card order
  - card sizes
  - custom widgets
  - removed entity state and onboarding state
  - light preset settings
- Home Assistant connection URL and token are intentionally not included

#### Custom Widgets
- Click **Add Card** in edit mode to add custom widgets
- Choose from **4 widget types**:
  - **📅 Calendar** - View upcoming events and appointments
  - **📰 News Feed** - Latest headlines and updates
  - **🖼️ Photo Frame** - Beautiful photo carousel with navigation
  - **📝 Quick Note** - Editable sticky notes for reminders
- Available in **3 sizes**: Small, Medium, Large
- Dashboard cards also support an **Extra-Small** `1 × 0.5` size for denser layouts
- Widgets persist across browser sessions
- Full drag-and-drop and delete support
- See [WIDGETS.md](docs/WIDGETS.md) for detailed documentation

#### Navigation Sections
- **Home** for the main dashboard
- **Security**, **Tasks**, **Locks**, **Lights**, and **Media** as dedicated sections
- **Mock** as a temporary flat staging area for mock entities that are not yet integrated into room-based dashboard flow
- **Settings** for appearance, dashboard, config export/import, and onboarding reset
- On mobile, the bottom navigation hides on downward scroll and reappears when you return near the top of the page

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

Navet source code is licensed under the **GNU Affero General Public License v3.0** (`AGPL-3.0-only`).

### What that means
- You can use, modify, and redistribute the code under AGPL-3.0.
- If you run a modified version for users over a network, you must make the corresponding source code available under the same license.

### Branding is separate
- The **Navet** name, logo, and brand assets are **not** licensed under AGPL.
- The separate brand policy is about avoiding confusing or misleading use of the Navet identity, not restricting the AGPL code rights.

See:
- [LICENSE.md](LICENSE.md)
- [docs/TERMS_OF_USE.md](docs/TERMS_OF_USE.md)
- [docs/branding/TRADEMARK_POLICY.md](docs/branding/TRADEMARK_POLICY.md)

## 🤝 Contributing

Contributions are welcome. This project is open source under AGPL-3.0, with a separate Navet trademark and brand policy.

### Documentation

Complete documentation is available in the [`/docs`](docs/) folder:

- **[Widget System](docs/WIDGETS.md)** - Custom widget documentation
- **[Terms of Use](docs/TERMS_OF_USE.md)** - License and brand usage summary
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
- Run `pnpm setup:hooks` once so pre-commit checks enforce Biome, a clean TypeScript check with baseline sync, and docs updates for user-facing changes

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea? [Open an issue](https://github.com/awesomestvi/navet/issues)!

## 📸 Screenshots

> Add screenshots here once deployed

## 🗺️ Roadmap

- [x] Custom widgets (Calendar, News, Photo Frame, Notes)
- [x] Data persistence with localStorage
- [x] Configuration UI with setup wizard
- [x] Loading states and error handling
- [x] Delete custom widgets
- [x] Onboarding-based entity visibility and add/remove entity flow
- [x] Export/import dashboard configuration
- [ ] Widget settings (customize content)
- [ ] Automations management
- [ ] History and analytics
- [ ] Multi-language support
- [ ] Voice control integration
- [ ] Scene management
- [ ] Real calendar integration (Google Calendar, etc.)
- [ ] Real news API integration
- [x] Home Assistant weather entity and forecast integration
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
