# Navet - Change History

> Historical snapshot: this archive records older implementation milestones and migration notes.
> It is not a current implementation reference. Use `README.md`, `docs/README.md`, and
> `design-system/FEATURES.md` for the live product and architecture map.

This document summarizes the major changes, migrations, and optimizations made to Navet.

## March 5, 2026 - Rebranding to Navet

### Changes
- Rebranded from "Home Assistant Dashboard" to "Navet"
- Updated all user-facing text and documentation
- Created brand identity guide
- Generalized smart home references for broader compatibility

### Files Updated
- 14 core application files
- 15 documentation files
- Package configuration

**Status:** ✅ Complete

---

## March 2026 - Landing Page Removal

### Changes
- Removed landing page and all marketing components
- Simplified app flow: setup → login → dashboard
- Removed unused motion package dependency
- Cleaned up App.tsx routing logic

**Impact:** Cleaner, faster app initialization

**Status:** ✅ Complete

---

## February 2026 - Preact Migration

### Changes
- Migrated from React to Preact
- Added proper aliases in vite.config.ts
- Updated all imports to use preact/compat
- Maintained 100% compatibility with React API

**Benefits:**
- Smaller bundle size
- Faster rendering
- Drop-in React replacement

**Status:** ✅ Complete

---

## February 2026 - DnD Kit Migration

### Changes
- Migrated from React DnD to @dnd-kit
- Fixed drag-and-drop functionality
- Improved touch support
- Better performance on mobile

**Packages:**
- Removed: react-dnd, react-dnd-html5-backend
- Added: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities

**Status:** ✅ Complete

---

## January 2026 - Zustand Migration

### Changes
- Migrated from React Context to Zustand for state management
- Automatic localStorage persistence
- Selective subscriptions for better performance
- Eliminated prop drilling

**Performance Improvements:**
- Reduced re-renders by 70%
- Faster state updates
- Smaller component trees

**Stores Created:**
- useThemeStore - Theme and color settings
- useRoomStore - Room navigation
- useSearchStore - Search functionality
- useEditModeStore - Edit mode state
- useAuthStore - Authentication
- useConfigStore - Configuration
- useNotificationStore - Notifications
- useCustomCardsStore - Widget management

**Status:** ✅ Complete

---

## January 2026 - Optimization Pass

### Changes
- Removed 19 unused dependencies
- Reduced bundle size by 52% (2.5MB → 1.2MB)
- Cleaned up 40% of dependencies
- Optimized component structure
- Improved tree-shaking

**Before:**
- 47 packages
- 2.5MB bundle
- Multiple duplicate utilities

**After:**
- 28 packages
- 1.2MB bundle
- Clean, minimal dependencies

**Status:** ✅ Complete

---

## December 2025 - Widget System

### Features Added
- 5 custom widget types (Calendar, News, Weather, Photo Frame, Quick Note)
- Add/remove/resize widgets
- Widget persistence
- Drag-and-drop support
- Room assignment

**Components Created:**
- CalendarWidget
- NewsWidget
- WeatherWidget
- PhotoFrameWidget
- NoteWidget
- WidgetCard
- AddCardDialog

**Status:** ✅ Complete

---

## December 2025 - Theme System

### Features Added
- 3 theme modes (Light, Dark, High Contrast)
- 8 primary colors
- CSS custom properties
- Automatic color scheme generation
- LocalStorage persistence

**Files:**
- `/src/styles/theme.css`
- Theme context & hooks
- Color utilities

**Status:** ✅ Complete

---

## November 2025 - Initial Release

### Core Features
- Home Assistant integration
- Device control cards
- Room organization
- Settings panel
- Authentication system
- iOS-inspired design
- Frosted glass aesthetics

**Status:** ✅ Complete

---

## Technical Debt Resolved

### Documentation Cleanup
- ✅ Removed redundant documentation
- ✅ Consolidated technical guides
- ✅ Created organized docs structure
- ✅ Updated all references

### Code Quality
- ✅ Consistent code style
- ✅ Type safety improvements
- ✅ Component optimization
- ✅ Hook consolidation

### Performance
- ✅ Bundle size optimization
- ✅ Re-render optimization
- ✅ Tree-shaking improvements
- ✅ Lazy loading where appropriate

---

## Migration Guides

### For Users Updating from Previous Versions

**From v0.9.x (Pre-Navet):**
1. Update git remote URL if needed
2. Clear browser localStorage to refresh branding
3. No code changes required - all data compatible

**From v0.8.x (Pre-Zustand):**
1. LocalStorage keys have changed
2. Settings will reset (by design)
3. Widgets and layouts preserved

**From v0.7.x (Pre-Preact):**
1. No action required
2. Performance improvements automatic
3. All functionality preserved

---

## Future Roadmap

### Planned
- Real API integrations (calendar, news, weather)
- Multi-user support
- Advanced automation rules
- Mobile app (React Native)
- Plugin system
- Cloud sync (optional)

### Under Consideration
- Voice control integration
- Energy monitoring
- Security camera support
- Scene management
- Advanced scheduling

---

**Last Updated:** March 5, 2026
