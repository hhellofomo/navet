# React + Zustand Guide

Current state-management guidance for Navet.

## Summary

Navet uses a mixed model on purpose:

- Zustand for shared client state that many features read and update frequently
- React context for app-shell concerns with lifecycle or boundary behavior
- Direct hook modules as the public API for most shared state access

## Current Pattern

### Use Zustand for shared UI state

Use Zustand-backed hooks for domains such as:

- theme and primary color
- navigation section state
- search query state
- edit mode
- dashboard card layout and ordering
- feature-specific persistent UI state such as light presets

These domains should expose direct hook APIs rather than provider wrappers.

### Use React context for shell domains

Keep React context for:

- authentication
- runtime config / bootstrap config
- loading orchestration
- error boundaries and error reporting

These areas involve side effects, startup flow, or service-like behavior where explicit providers are still useful.

## Rules

### Prefer hook modules over context-like import paths

Use:

- `@/app/hooks/use-theme`
- `@/app/hooks/use-navigation`
- `@/app/hooks/use-search`
- `@/app/hooks/use-home-assistant`

Avoid reintroducing passthrough provider wrappers for Zustand-backed state.

### Keep one source of truth

- Do not maintain the same domain in both context and Zustand
- Do not duplicate persistence logic across feature hooks if a shared helper already exists
- Prefer shared utilities for theme color lookup, device room resolution, and storage key definitions

### Persistence

- Use shared storage helpers and shared storage keys
- Prefer Zustand `persist` or a single storage helper path for any domain you add
- Avoid raw `localStorage` access in scattered feature files unless there is a clear one-off reason

## Decision Guide

Choose Zustand when:

- many components read/write the same state
- the state drives rendering across multiple features
- persistence or selector-based subscriptions are useful

Choose context when:

- the domain represents a service boundary
- startup/bootstrap flow matters
- the value is mostly imperative actions plus a small amount of state

## Notes

- Theme, navigation, search, and Home Assistant access already use direct hook APIs
- Auth and config intentionally remain context-backed
- If a new shared state domain is introduced, decide once whether it belongs in Zustand or context before wiring UI around it
