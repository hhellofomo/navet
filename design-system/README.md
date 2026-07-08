# Navet - Design System

Complete design documentation for the iOS-inspired smart home dashboard.

## 📚 Documentation Structure

### [UI Guidelines](./UI-GUIDELINES.md)
Comprehensive design system covering:
- Color palette and semantic meanings
- Typography scale and hierarchy
- Spacing and layout system
- Icon sizing standards
- Glass morphism effects
- Interactive states and animations
- Card size system (extra-small/small/medium/large)
- Accessibility guidelines
- Component patterns
- Best practices

### [Layout Structure](./LAYOUT-STRUCTURE.md)
Complete layout architecture including:
- Application hierarchy
- Sidebar, header, and navigation layouts
- Responsive grid system
- Z-index management
- Scroll behavior
- Sticky positioning
- Room-based filtering
- Edit mode overlay
- Performance optimizations

### [Moodboard](./MOODBOARD.md)
Design inspiration and visual direction:
- Core design references (iOS widgets, Apple HomeKit)
- Color psychology
- Typography inspiration
- Material and texture guidelines
- Motion and animation principles
- Imagery treatment
- Interaction patterns
- Brand personality
- Design evolution roadmap

### [Features Documentation](./FEATURES.md) ✨ NEW
Complete feature implementation guide:
- Authentication system and login flow
- Theme customization (3 modes, 8 colors)
- Navigation and section management
- Settings page architecture
- Empty states for sections
- User management and profiles
- Responsive behavior patterns
- Technical implementation details

## 🎯 Quick Reference

### Core Design Principles
1. **iOS Widget Aesthetic** - Frosted glass, rounded corners, semantic colors
2. **Adaptive Layouts** - Content rearranges intelligently based on card size
3. **Room-Based Organization** - Filter devices by physical location
4. **Consistent Icon Sizing** - Extra-small: 7×7 container / 3.5×3.5 icon, Small: 8×8 / 4×4, Medium/Large: 10×10 / 5×5
5. **Smooth Transitions** - 500ms for state changes, 200ms for interactions
6. **Theme Customization** - Three theme modes (Dark, Light, High Contrast) with 8 primary color options
7. **Section-Based Navigation** - Organized into dedicated sections (Home, Security, Tasks, Locks, Lights, Media, Settings)

### Authentication System
- **Login Page** - Secure authentication with Home Assistant URL and long-lived access token
- **User Dropdown** - Header displays user info with avatar and quick logout access
- **Persistent Session** - Auth state persists across browser sessions

### Theme System
- **Theme Modes**: 
  - Dark (default) - Subtle gradients with muted colors
  - Light - Bright pastels with soft accents
  - High Contrast - Vibrant colors for better visibility
- **Primary Colors**: Orange (default), Blue, Green, Purple, Pink, Red, Yellow, Teal
- **Dynamic Theming** - All active states, buttons, and indicators adapt to selected primary color

### Navigation Structure
- **Sections**: Home (dashboard), Security, Tasks, Locks, Lights, Media, Settings
- **Desktop**: Fixed vertical sidebar on left (16px wide)
- **Mobile**: Bottom navigation bar with 5 key sections
- **Empty States**: Beautiful placeholder screens for sections without data

### Color System at a Glance
- **Background (Dark)**: `#0a0a0a` (Deep black)
- **Background (Light)**: `#f9fafb` (Gray-50)
- **Glass Cards**: `backdrop-blur-xl` + `bg-white/5-10` (dark) / `bg-white` (light)
- **Primary Color** (customizable): Orange (default), Blue, Green, Purple, Pink, Red, Yellow, or Teal
- **Lights**: Orange/Amber when active (or custom primary color)
- **Climate**: Blue (cooling) / Orange (heating) / Green (auto)
- **Media**: Pink accent
- **Locks**: Red (locked) / Green (unlocked)
- **Borders**: `border-{color}-700/20` (20% opacity) or `border-gray-200` (light theme)

### Card Sizes
- **Extra-Small (1×0.5)**: Dense status or single-control layouts, compact padding and minimal controls
  Light cards keep an unlabeled brightness slider visible here; tap behavior determines whether a compact settings action shares that row or the slider uses the full width.
- **Small (1×1)**: Minimal info, quick toggle, `p-4`, minimum `190px × 190px`
- **Medium (2×1)**: Primary controls + info, `p-5`, minimum `396px` wide and `190px` tall
- **Large (2×2)**: Full controls + advanced features, `p-6`, minimum `396px × 396px`

Dashboard cards use `repeat(auto-fit, minmax(190px, 1fr))`, so cards can grow wider when the container has more space.

### Responsive Breakpoints
- **Mobile**: `< 768px` - 2 column grid, hidden sidebar
- **Tablet**: `768px - 1023px` - 3-4 column grid, slide-in sidebar
- **Desktop**: `≥ 1024px` - 4-6 column grid, fixed sidebar

## 🛠 For Developers

### Implementation Checklist
When creating a new card component:

- [ ] Import icons from `lucide-react`
- [ ] Use `memo()` for performance
- [ ] Accept `size: CardSize` prop
- [ ] Implement all supported size layouts, including `extra-small` when the feature needs a dense mode
- [ ] Place the primary entity icon in the card header with consistent sizing
- [ ] Use `truncate` class for text overflow
- [ ] Add `flex-shrink-0` to icon containers
- [ ] Implement 500ms transitions for state changes
- [ ] Use semantic colors from the color system
- [ ] Test at all breakpoints
- [ ] Ensure 44px minimum touch targets
- [ ] Add edit mode size selector support

### Key Files
```
/src/app/components/          → Card components
/src/app/components/sections.tsx → Section components (Security, Tasks, etc.)
/src/app/components/settings-section.tsx → Settings page component
/src/app/components/empty-state.tsx → Empty state component for sections
/src/app/components/card-size-selector.tsx → Size selection logic
/src/app/contexts/auth-context.tsx → Authentication state management
/src/app/hooks/use-theme.ts      → Theme and color customization
/src/app/hooks/use-navigation.ts → Section navigation state
/src/app/features/auth/login-page.tsx → Login interface
/src/styles/theme.css         → Design tokens and variables
/src/styles/tailwind.css      → Tailwind configuration
```

## 🎨 For Designers

### Design Tools Integration
Use these values in your design tools (Figma, Sketch, etc.):

**Spacing Scale** (4px base): 4, 8, 12, 16, 20, 24, 32
**Border Radius**: 8px, 16px, 24px, full circle
**Grid Columns**: 2 (mobile), 3-4 (tablet), 4-6 (desktop)
**Grid Gap**: 16px (mobile), 24px (desktop)

### When to Use Each Card Size
- **Small**: Binary states (on/off, locked/unlocked), simple status displays
- **Medium**: Single adjustable parameter (brightness, temperature, volume)
- **Large**: Multiple parameters, complex controls, detailed status

## 🔄 Version History

- **v1.0** - Initial design system documentation
- **v1.1** - Standardized icon sizing across all cards
- **v1.2** - Added adaptive layout guidelines and best practices
- **v1.3** - Added authentication system, theme customization, and navigation system
- **v1.4** - Implemented settings section and empty states for all sections

## 📖 How to Use This Documentation

1. **New Team Members**: Start with [Moodboard](./MOODBOARD.md) for design vision
2. **Building Components**: Reference [UI Guidelines](./UI-GUIDELINES.md) for patterns
3. **Layout Questions**: Check [Layout Structure](./LAYOUT-STRUCTURE.md)
4. **Design Reviews**: Use all three docs as evaluation criteria

## 🤝 Contributing

When proposing design changes:
1. Ensure it aligns with iOS widget aesthetic
2. Maintain consistency with existing patterns
3. Document new patterns in appropriate section
4. Update version history
5. Test across all card sizes and breakpoints

## 📬 Feedback & Questions

This design system evolves based on real-world usage and feedback. Document learnings and improvements as you build.

---

**Design System Maintained By:** Development Team
**Last Updated:** March 5, 2026
**Status:** Living Document
