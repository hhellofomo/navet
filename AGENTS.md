## Commit Rules

- All commit messages must follow Conventional Commits.
- Format: `type(scope): summary`
- Valid types include: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `build`, `ci`, `perf`, and `style`.
- Before creating a commit, verify the message matches Conventional Commits.
- Do not use generic or free-form commit messages.
- If a commit has already been created with a non-conventional message, amend it before finishing the task.

## Repo Best Practices

### Architecture and Ownership

- Prefer feature-owned modules over global catch-all folders.
- Dashboard-owned logic belongs under `src/app/features/dashboard/`.
- Lighting-owned logic belongs under `src/app/features/lighting/`.
- Climate-only utilities belong under `src/app/features/climate/`.
- Shared cross-feature UI building blocks belong under `src/app/components/shared/`.
- Do not add new feature-specific hooks, stores, or utilities to generic global folders unless they are truly shared across multiple features.

### Feature Public APIs

- Prefer importing from a feature root `index.ts` when crossing feature boundaries.
- Current feature public entry points exist for:
  - `src/app/features/calendar`
  - `src/app/features/climate`
  - `src/app/features/dashboard`
  - `src/app/features/lighting`
  - `src/app/features/media`
  - `src/app/features/notifications`
  - `src/app/features/person`
  - `src/app/features/power`
  - `src/app/features/rss`
  - `src/app/features/security`
  - `src/app/features/sensors`
  - `src/app/features/settings`
  - `src/app/features/vacuum`
  - `src/app/features/weather`
  - `src/app/features/wifi`
- If a cross-feature import reaches into `components/`, `hooks/`, `stores/`, or `utils/`, first check whether it should be exported from the feature root instead.

### Import Conventions

- Use `@/app/...` imports for shared app modules and cross-feature imports.
- Keep short relative imports for files inside the same small feature/module subtree.
- Avoid deep relative imports to shared app modules such as hooks, contexts, stores, and shared components when the alias is clearer.

### Component and File Structure

- Keep provider/bootstrap concerns near `src/app/App.tsx`; move feature orchestration into feature modules.
- Prefer splitting large feature files into:
  - entry component
  - controller hook
  - presentational view components
  - local types/data/constants files when useful
- For card-style features with internal structure, prefer folder modules with `index.tsx` entries, for example:
  - `light-card/`
  - `hvac-card/`
  - `media-card/`
  - `vacuum-card/`
  - `weather-card/`
- Preserve the current pattern instead of reintroducing flat monolith files when extending these features.

### Dashboard-Specific Rules

- Treat `src/app/features/dashboard/utils/card-renderer.tsx` as the dashboard card registry.
- Do not move card rendering registration logic back into generic `src/app/utils/`.
- Dashboard entity visibility, custom card state, card ordering, and room ordering should stay colocated with the dashboard feature.

### Documentation

- When moving or renaming files that are referenced by docs, update the active docs in the same change.
- Prioritize keeping these current:
  - `README.md`
  - `docs/README.md`
  - `design-system/README.md`
  - `design-system/FEATURES.md`
- Treat `docs/archive/status/*` as historical snapshots; do not rewrite them unless the task is explicitly about historical docs.

### Verification

- After structural refactors or import cleanup, run `npm run typecheck`.
- Prefer preserving behavior during refactors; structural cleanup should not introduce feature changes unless explicitly requested.
