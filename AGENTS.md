## Commit Rules

- Format: `type(scope): summary`
- Valid types include: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `build`, `ci`, `perf`, and `style`.
- Do not use generic or free-form commit messages.
- If a commit has already been created with a non-conventional message, amend it before finishing the task.

## Repo Best Practices

### Architecture and Ownership

- Prefer feature-owned modules over global catch-all folders.
- Shared cross-feature UI building blocks belong under `src/app/components/shared/`.
- Do not add new feature-specific hooks, stores, or utilities to generic global folders unless they are truly shared across multiple features.

### Feature Public APIs

- Prefer importing from a feature root `index.ts` when crossing feature boundaries.
- If a cross-feature import reaches into `components/`, `hooks/`, `stores/`, or `utils/`, first check whether it should be exported from the feature root instead.

### Import Conventions

- Use `@/app/...` imports for shared app modules and cross-feature imports.
- Keep short relative imports for files inside the same small feature/module subtree.
- Avoid deep relative imports to shared app modules when the alias is clearer.

### Component and File Structure

- Keep provider/bootstrap concerns near `src/app/App.tsx`; move feature orchestration into feature modules.
- Prefer splitting large feature files into entry components, controller hooks, presentational views, and local types/data/constants when useful.
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

### Theming Rules

- Do not let sections, cards, dialogs, or feature views invent their own light/dark/contrast/glass surface logic when shared theme tokens can express it.
- Prefer `src/app/components/shared/theme/theme-surface-tokens.ts` for shared surface decisions.
- When updating a section or card, first check whether the styling should consume shared surface tokens instead of adding new `theme === 'light' ? ... : ...` branches inline.
- Only keep local theme branches when the styling is truly feature-specific, for example domain accents or status colors that are not generic surfaces.
- If a recurring theme pattern appears in more than one place, move it into a shared token/helper instead of copying the branch logic again.

### Documentation

- When moving or renaming files that are referenced by docs, update the active docs in the same change.
- Prioritize keeping these current:
  - `README.md`
  - `docs/README.md`
  - `design-system/README.md`
  - `design-system/FEATURES.md`
- Treat `docs/archive/status/*` as historical snapshots; do not rewrite them unless the task is explicitly about historical docs.

### Branding and Logo Usage

- Follow `docs/branding/BRANDING.md` when using Navet brand assets.
- Use the existing logo files from `public/` as-is; do not restyle the logo itself.
- Do not add shadows, outlines, glows, recolors, or gradients directly to the logo.
- Prefer neutral backgrounds and adequate clear space around the mark.

### Verification

- After structural refactors, import cleanup, module moves, or shared-type changes, run `pnpm typecheck`.
- For small visual or copy-only tweaks, do not default to running `pnpm typecheck` after every change unless the edit touches shared logic, types, or wiring.
- Prefer preserving behavior during refactors; structural cleanup should not introduce feature changes unless explicitly requested.
