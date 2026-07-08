# Navet Home Assistant Panel

This custom integration registers Navet as a native Home Assistant sidebar panel.

Build the panel bundle from the repository root before packaging or installing:

```bash
pnpm build:ha-panel
```

The build writes static assets to `custom_components/navet/frontend/`. Home Assistant serves them
from `/api/navet/static/` and loads `navet-panel.js` as the panel module.
