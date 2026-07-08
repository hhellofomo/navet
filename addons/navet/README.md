# Navet Home Assistant Add-on

This add-on serves the Navet frontend through Home Assistant Ingress.

For a private repository, the simplest development flow is to copy this `addons/navet/` folder into your Home Assistant local add-ons directory and rebuild it there.

## Configuration

- `hass_url`: Optional Home Assistant URL to prefill at runtime
- `token`: Optional long-lived access token to prefill at runtime

If these values are not provided, Navet falls back to manual setup in the UI.
