# Widget System Documentation

This document explains how the custom widget system works in Navet.

Calendar is no longer a custom dashboard widget. Calendar functionality now comes from live Home Assistant `calendar.*` entity cards.

## 📋 Table of Contents

- [Overview](#overview)
- [Available Widgets](#available-widgets)
- [Adding Widgets](#adding-widgets)
- [Managing Widgets](#managing-widgets)
- [Creating Custom Widgets](#creating-custom-widgets)
- [Widget Storage](#widget-storage)
- [API Reference](#api-reference)

## 🎯 Overview

The widget system allows users to add customizable cards to their dashboard beyond the standard device cards. Widgets are stored locally in the browser's localStorage and persist across sessions.

### Key Features

- **3 Built-in Widget Types** - RSS Feed, Photo Frame, Quick Note
- **3 Size Options** - Small, Medium, Large (adapts to grid)
- **Room Assignment** - Widgets can be assigned to specific rooms or "All"
- **Persistent Storage** - Saves to localStorage automatically
- **Edit Mode Integration** - Full drag-and-drop and delete support
- **Responsive Design** - Adapts to all screen sizes

## 📱 Available Widgets

### 1. RSS Feed Widget

Shows live articles from your selected RSS providers.

**Features:**
- Article titles and sources
- Timestamps
- External link support
- Per-card provider selection
- Custom RSS provider URLs
- Home Assistant Feedreader provider support
- Per-card provider deletion and source management

**Best Sizes:** Medium, Large

**Use Cases:**
- RSS aggregation
- Stay informed
- Quick headlines

---

### 2. Photo Frame Widget

Beautiful photo carousel with navigation.

**Features:**
- Multiple photos
- Next/previous navigation
- Dot indicators
- Smooth transitions

**Best Sizes:** Medium, Large

**Use Cases:**
- Family photos
- Vacation memories
- Art display

---

### 3. Quick Note Widget

Editable sticky note for quick reminders.

**Features:**
- Click-to-edit interface
- Text persistence
- Save/cancel buttons
- Markdown-style formatting

**Best Sizes:** Small, Medium

**Use Cases:**
- Todo lists
- Quick reminders
- Shopping lists
- Notes and ideas

## ➕ Adding Widgets

### Step 1: Enter Edit Mode

Click **Customize** in the dashboard action row.

### Step 2: Open Add Card Dialog

Click the **Add Card** button that appears in edit mode.

### Step 3: Choose Widget Type

Select from 3 available widget types:
- RSS Feed
- Photo Frame
- Quick Note

### Step 4: Select Size

Choose the card size:
- **Small** - 1 column x 1 row
- **Medium** - 2 columns x 1 row
- **Large** - 2 columns x 2 rows

### Step 5: Add Widget

Click **Add Widget** to add it to your current room.

## 🛠️ Managing Widgets

### Resizing Widgets

1. Enter **Edit Mode**
2. Use the top-right resize action on the widget card
3. Exit edit mode to save

### Moving Widgets

1. Enter **Edit Mode**
2. Drag widgets to reorder them
3. Drop in desired position
4. Exit edit mode to save

### Deleting Widgets

1. Enter **Edit Mode**
2. Click the **X** button on the widget
3. Confirm deletion
4. Widget is permanently removed

### Editing Widget Content

**Quick Note Widget:**
1. Click the **Edit** button on the note
2. Type your content
3. Click **Save** to persist changes

**Other Widgets:**
RSS and photo remain custom dashboard widgets. Weather and calendar are now provided by Home Assistant entity cards rather than custom widgets.

## 🔧 Creating Custom Widgets

### Widget Component Structure

```tsx
import { Icon } from 'lucide-react';
import { useTheme } from '@/app/hooks';

interface MyWidgetProps {
  size?: 'small' | 'medium' | 'large';
}

export function MyWidget({ size = 'medium' }: MyWidgetProps) {
  const { theme, primaryColor } = useTheme();
  
  // Theme-aware colors
  const bgColor = theme === 'light' 
    ? 'bg-white/70' 
    : theme === 'contrast' 
    ? 'bg-black/50' 
    : 'bg-white/10';
    
  const textPrimary = theme === 'light' 
    ? 'text-gray-900' 
    : 'text-white';
    
  const textSecondary = theme === 'light' 
    ? 'text-gray-600' 
    : theme === 'contrast' 
    ? 'text-gray-300' 
    : 'text-gray-400';
    
  const border = theme === 'light' 
    ? 'border-gray-200/50' 
    : 'border-white/10';

  return (
    <div className={`${bgColor} backdrop-blur-xl rounded-2xl p-4 border ${border} h-full flex flex-col`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: `${primaryColor}20`, 
            color: primaryColor 
          }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${textPrimary}`}>
            Widget Title
          </h3>
          <p className={`text-xs ${textSecondary}`}>
            Subtitle
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Your widget content here */}
      </div>
    </div>
  );
}
```

### Adding to Widget System

1. **Create widget component** in `/src/app/components/widgets/`
2. **Export** from `/src/app/components/widgets/index.ts`
3. **Add to AddCardDialog** templates array
4. **Add to WidgetCard** switch statement
5. **Update types** in `add-card-dialog.tsx`

### Design Guidelines

- Use frosted glass background (`backdrop-blur-xl`)
- Include rounded corners (`rounded-2xl`)
- Add theme-aware colors
- Support all three theme modes
- Keep `extra-small` as an optional dense layout path only when the widget genuinely benefits from it
- Respect size constraints
- Include proper spacing (4px grid system)
- Add loading states if needed
- Handle empty states gracefully

## 💾 Widget Storage

### Storage Structure

Widgets are stored in localStorage under the key `ha-dashboard-custom-cards`:

```json
[
  {
    "id": "custom-1234567890-abc123",
    "type": "rss",
    "size": "medium",
    "room": "Living Room",
    "data": {},
    "createdAt": 1234567890000
  }
]
```

RSS provider definitions and per-card RSS source selections are also stored locally so each RSS card can keep its own provider mix.

### Storage API

The `useCustomCards` hook provides methods for managing widgets:

```typescript
const {
  customCards,      // Array of all custom cards
  addCard,          // Add a new card
  removeCard,       // Remove a card by ID
  updateCard,       // Update card properties
  getCardsForRoom,  // Get cards for specific room
} = useCustomCards();
```

### Data Persistence

- Automatically saves to localStorage on any change
- Loads from localStorage on app initialization
- Survives browser refreshes and closures
- Clears on localStorage.clear() or manual deletion

## 📚 API Reference

### `useCustomCards()`

Custom hook for managing widget cards.

**Returns:**
```typescript
{
  customCards: CustomCard[];
  addCard: (type: CardType, size: Size, room: string, data?: Record<string, unknown>) => CustomCard;
  removeCard: (cardId: string) => void;
  updateCard: (cardId: string, updates: Partial<CustomCard>) => void;
  getCardsForRoom: (room: string) => CustomCard[];
}
```

### Types

```typescript
type CardType = 'rss' | 'photo' | 'note';
type Size = 'small' | 'medium' | 'large';

interface CustomCard {
  id: string;
  type: CardType;
  size: Size;
  room: string;
  data?: Record<string, unknown>;
  createdAt: number;
}
```

### Component Props

**WidgetCard**
```typescript
interface WidgetCardProps {
  card: CustomCard;
  onDelete?: (cardId: string) => void;
  onUpdate?: (cardId: string, data: Record<string, unknown>) => void;
}
```

**RSSFeedCard**
```typescript
interface RSSFeedCardProps {
  cardId: string;
  size?: 'small' | 'medium' | 'large';
}
```

**PhotoFrameWidget**
```typescript
interface PhotoFrameWidgetProps {
  size?: 'small' | 'medium' | 'large';
}
```

**NoteWidget**
```typescript
interface NoteWidgetProps {
  size?: 'small' | 'medium' | 'large';
  initialNote?: string;
  onNoteChange?: (note: string) => void;
}
```

## 🔮 Future Enhancements

### Planned Features

- [ ] Widget settings dialog for customization
- [ ] Import/export widget configurations
- [ ] Widget templates and presets
- [x] RSS provider integration
- [ ] Custom widget builder UI
- [ ] Widget sharing between users
- [ ] Advanced note features (markdown, checklist)
- [ ] Photo frame with user uploads
- [x] Multiple RSS providers per card

### Community Contributions

We welcome contributions for:
- New widget types
- Widget customization options
- API integrations
- Design improvements
- Bug fixes and optimizations

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 🆘 Troubleshooting

### Widgets not saving
- Check browser localStorage is enabled
- Verify localStorage quota not exceeded
- Try clearing browser cache

### Widgets not displaying
- Check browser console for errors
- Verify widget type is supported
- Ensure component is properly imported

### Themes not applying
- Check theme context is properly wrapped
- Verify CSS variables are loaded
- Clear browser cache and reload

### Performance issues
- Limit number of widgets per room
- Use smaller sizes when possible
- Check for memory leaks in custom widgets

---

For more information, see the [README](../README.md) or open an issue on GitHub.
