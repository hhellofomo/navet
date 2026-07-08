# React + Zustand Guide

Current state-management guidance for Navet.

## Summary

Navet uses **Zustand exclusively** for all shared client state. React Context is reserved only
for cross-cutting infrastructure concerns that have no reactive state of their own (i18n provider,
error boundary, loading orchestration). Auth and config are Zustand stores.

---

## State Layer Ownership

### Zustand stores (`src/app/stores/`)

All shared, reactive state lives here. Stores self-initialize — no provider wrappers needed.

| Store | Responsibility |
|---|---|
| `auth-store` | `isAuthenticated`, `config`, `login`, `logout` |
| `config-store` | HA connection config, `testConnection`, `saveConfig` |
| `home-assistant-store` | WebSocket connection state, entities, registries |
| `settings-store` | User preferences (persisted) |
| `theme-store` | Theme mode, accent color, wallpaper (persisted) |
| `navigation-store` | Active section, current room (persisted via Zustand persist) |
| `edit-mode-store` | Dashboard edit mode toggle |
| `search-store` | Search query and filtered device ids |

### React Context (`src/app/contexts/`)

Only used for providers that have no reactive state:

- `I18nProvider` — locale loading and translation function
- `LoadingProvider` — global loading overlay
- `ErrorProvider` — error boundary

`AuthProvider` and `ConfigProvider` still exist as identity pass-throughs to preserve import
compatibility. They contain no state — all logic is in the stores.

---

## Rules

### All shared state goes in Zustand

Do not introduce new React Context for state that drives rendering. If many components need to
read or write the same value, put it in a store.

### Expose stores through hook modules

Stores should be consumed via hook wrappers (`useAuth`, `useConfig`, `useHomeAssistant`, etc.)
rather than imported and called directly with `useXyzStore(selector)` outside of `src/app/hooks/`
and `src/app/stores/`.

### Prefer typed selectors

Use selectors from `src/app/stores/selectors.ts` to subscribe to the minimum slice of state
needed. Avoid subscribing to the full store object — this re-renders on every state change.

```ts
// Good — re-renders only when connected changes
const connected = useHomeAssistant(homeAssistantSelectors.connected);

// Good — one subscription for a group of related display settings
const { disableAnimations, effectsQuality, pageZoom } = useSettingsStore(
  settingsSelectors.displaySettings
);

// Avoid — re-renders on every store change
const store = useHomeAssistant();
```

### One source of truth

- Do not maintain the same domain in both a store and local component state
- Do not duplicate persistence logic — use `createJSONStorage(() => localStorage)` inside
  the store's `persist` middleware, not raw `window.localStorage` access
- Stores own their own localStorage keys; feature components do not call `storage.set` directly
  for store-owned domains

### Persistence pattern

Use Zustand `persist` middleware for any store that needs to survive a page reload:

```ts
export const useMyStore = create<MyState>()(
  persist(
    (set) => ({ ... }),
    {
      name: 'navet-my-key',
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        // Validate and normalize persisted values before rehydrating
        return { ...current, ...sanitized };
      },
    }
  )
);
```

Never use the manual `subscribe` + `localStorage.setItem` pattern.

---

## Service → Store event flow

`HomeAssistantService` emits typed events: `'entities' | 'config' | 'registries' | 'connection'`.

The store subscribes via `addListener(event => ...)` and updates **only the affected slice**:

```
service emits 'entities'  →  store sets { entities }
service emits 'config'    →  store sets { config }
service emits 'registries'→  store sets { areas, deviceRegistry, entityRegistry }
service emits 'connection'→  store sets { connected, connection, connecting }
```

Do not add a generic "re-sync everything" listener. Each event type should produce a
minimal, targeted `set()` call.

---

## Decision Guide

| Scenario | Use |
|---|---|
| State read by 2+ components | Zustand store |
| State persisted across page loads | Zustand store + `persist` middleware |
| Real-time data from WebSocket | Zustand store updated via typed service events |
| Feature-scoped ephemeral UI state | `useState` / `useReducer` inside the feature hook |
| Cross-cutting lifecycle / DI | React Context (no reactive state) |

---

## Anti-patterns to avoid

- Raw `window.localStorage` access outside of `src/app/utils/storage`
- Calling `storeInstance.setState(...)` directly from a component — use the store's own actions
- Registering a catch-all listener on the HA service that copies all fields on every event
- Maintaining the same flag in both a Zustand store and a React Context
- Multiple `useXyzStore(state => state.field)` calls in the same component when a combined
  selector already exists
