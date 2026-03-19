# Navet Documentation

Complete documentation for the Navet smart home dashboard.

## 🚀 Quick Start

1. **[Main README](../README.md)** - Start here for project overview
2. **[Contributing](../CONTRIBUTING.md)** - How to contribute
3. **[Branding](branding/BRANDING.md)** - Brand identity and usage
4. **[Logo Showcase](LOGO_SHOWCASE.md)** - Visual brand assets
5. **[Versioning](VERSIONING.md)** - Beta release and version bump policy

## 📚 Documentation Structure

### User Documentation
- **[Widget System](WIDGETS.md)** - Complete guide to custom widgets, including the RSS feed widget
  - Adding widgets
  - Managing widgets
  - Creating custom widgets
  - Widget storage and API
- **[Main README](../README.md#installable-pwa)** - Installable PWA shell and build verification
- **[Main README](../README.md#-features)** - Current product features, including the unified HVAC-based climate card path, live calendar/weather cards, person/helper/script support, Home Assistant notifications/repairs, and card-level room reassignment
- **[Main README](../README.md#room-navigation)** - Dashboard room navigation, Home room grouping modes, and dashboard dropdown behavior
- **[Main README](../README.md#search)** - Dashboard search behavior, including Home Assistant entity-id and domain queries
- **[Main README](../README.md#themes)** - Theme modes, adaptive glass visual quality tiers, shared appearance primitives, custom accents, and the light card ambience setting
- **[Main README](../README.md#themes)** - Settings are organized into Appearance, Localization, Interaction, Dashboard, System, and Project sections
- **[Main README](../README.md#-features)** - Dashboard widget coverage now includes battery overview, button widgets, and expanded photo frame options, alongside refreshed lighting card controls
- **[Design System](../design-system/README.md#core-design-principles)** - Shared primitives, including icon pills, nav/action pills, and card off-state surface tokens
- **[Docker and Home Assistant Add-on](DOCKER_HOME_ASSISTANT_ADDON.md)** - Packaging and deployment guide
  - Standalone Docker image
  - Home Assistant add-on structure
  - Ingress setup
  - Runtime config and deployment flow
  - Current dashboard performance notes

### Legal & Terms
- **[License](../LICENSE.md)** - AGPL-3.0-only code license
- **[Terms of Use](TERMS_OF_USE.md)** - License and brand usage summary
- **[Trademark Policy](branding/TRADEMARK_POLICY.md)** - Navet name and logo usage rules
- **[Attributions](ATTRIBUTIONS.md)** - Credits and third-party licenses

### Design & Branding
- **[Branding Guide](branding/BRANDING.md)** - Brand identity and usage
- **[Branding Assets](branding/BRANDING_ASSETS.md)** - Quick reference for logo assets
- **[Logo Showcase](LOGO_SHOWCASE.md)** - All logo variations and usage
- **[Design System](../design-system/README.md)** - Complete design system
- **[UI Guidelines](../design-system/UI-GUIDELINES.md)** - UI best practices
- **[Layout Structure](../design-system/LAYOUT-STRUCTURE.md)** - Layout patterns
- **[Features](../design-system/FEATURES.md)** - Feature documentation
- **[Moodboard](../design-system/MOODBOARD.md)** - Design inspiration

### Roadmap
- **[Roadmap](ROADMAP.md)** - HA feature parity gaps and Navet-native ideas, with shipped items tracked

### Project History
- **[Change History](archive/CHANGES.md)** - Major changes and migrations
  - Rebranding to Navet
  - State management migrations
  - Drag-and-drop migration
  - Optimization history

### Release Process
- **[Versioning](VERSIONING.md)** - Beta release numbering and bump rules

## 🎯 Common Tasks

### I want to...

**Add a new widget:**
→ See [Widget System → Creating Custom Widgets](WIDGETS.md#creating-custom-widgets)

**Contribute to the project:**
→ See [Contributing Guide](../CONTRIBUTING.md)

**Bump a release version:**
→ See [Versioning](VERSIONING.md)

**Understand the design system:**
→ See [Design System](../design-system/README.md)

**Check the license:**
→ See [License](../LICENSE.md), [Terms of Use](TERMS_OF_USE.md), and [Trademark Policy](branding/TRADEMARK_POLICY.md)

**Learn about project history:**
→ See [Change History](archive/CHANGES.md)

**Use Navet branding:**
→ See [Branding Guide](branding/BRANDING.md)

**Run Navet in Docker or as a Home Assistant add-on:**
→ See [Docker and Home Assistant Add-on](DOCKER_HOME_ASSISTANT_ADDON.md)

**Understand the installable PWA shell and offline app behavior:**
→ See [Main README -> Installable PWA](../README.md#installable-pwa)

**Understand recent performance work:**
→ See [Docker and Home Assistant Add-on -> Current Performance Work](DOCKER_HOME_ASSISTANT_ADDON.md#current-performance-work)

**Manage dashboard backup and restore:**
→ See [Main README -> Dashboard Config](../README.md#dashboard-config)

**Understand card tap behavior and interaction styles:**
→ See [Main README -> Card Interaction Style](../README.md#card-interaction-style)

**Understand custom accent colors and shared color pickers:**
→ See [Main README -> Themes](../README.md#themes)

**Understand dashboard search with entity ids and domains:**
→ See [Main README -> Search](../README.md#search)

**Understand climate card behavior:**
→ See [Main README -> Features](../README.md#-features)

**Understand media card behavior and Home Assistant wiring:**
→ See [Main README -> Features](../README.md#-features)

**Understand calendar card behavior and source selection:**
→ See [Main README -> Calendar Cards](../README.md#calendar-cards)

**Understand Home Assistant-backed notifications and repairs:**
→ See [Main README -> Notifications](../README.md#notifications)

**Set up local commit checks:**
→ See [Contributing](../CONTRIBUTING.md)

## 📖 Documentation Organization

This documentation is organized into:

```
docs/
├── README.md (this file)      ← Documentation index
├── DOCKER_HOME_ASSISTANT_ADDON.md ← Deployment packaging guide
├── VERSIONING.md               ← Beta release/version policy
├── WIDGETS.md                 ← User-facing feature docs
├── TERMS_OF_USE.md            ← Legal information
├── ATTRIBUTIONS.md            ← Credits
├── branding/                  ← Brand identity docs
│   ├── BRANDING.md            ← Brand guide
│   └── BRANDING_ASSETS.md     ← Asset quick reference
├── archive/                   ← Historical records
│   ├── CHANGES.md             ← Complete changelog
│   └── status/                ← Historical status summaries
└── technical/                 ← Developer references
```

## 🔍 Finding Information

**By Topic:**
- **Features** → WIDGETS.md
- **PWA / installability** → README.md
- **Design** → design-system/
- **Branding** → branding/
- **Legal** → TERMS_OF_USE.md, LICENSE.md, branding/TRADEMARK_POLICY.md
- **History** → archive/CHANGES.md
- **Credits** → ATTRIBUTIONS.md

**By Audience:**
- **Users** → README.md, WIDGETS.md
- **Contributors** → CONTRIBUTING.md, design-system/
- **Developers** → design-system/, technical/, archive/CHANGES.md
- **Brand / Marketing** → branding/, LOGO_SHOWCASE.md, public/README.md
- **Legal** → TERMS_OF_USE.md, LICENSE.md

## 💡 Tips

- All documentation uses relative links
- Archive contains historical context
- Design system is comprehensive and detailed
- Widget system is fully documented with examples

---

**Last Updated:** March 19, 2026
**Documentation Status:** ✅ Complete and organized
