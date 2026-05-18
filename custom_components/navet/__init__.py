"""Home Assistant integration for the native Navet panel."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import panel_custom
from homeassistant.components.frontend import async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    FRONTEND_MODULE_URL,
    PANEL_COMPONENT_NAME,
    PANEL_FRONTEND_PATH,
    PANEL_ICON,
    PANEL_TITLE,
    STATIC_PATH,
)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Navet from a config entry."""
    frontend_dir = Path(__file__).parent / "frontend"
    domain_data = hass.data.setdefault(DOMAIN, {})

    if not domain_data.get("static_path_registered"):
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    STATIC_PATH,
                    str(frontend_dir),
                    cache_headers=True,
                )
            ]
        )
        domain_data["static_path_registered"] = True

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_FRONTEND_PATH,
        webcomponent_name=PANEL_COMPONENT_NAME,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=FRONTEND_MODULE_URL,
        config={"integration": DOMAIN},
    )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload Navet."""
    async_remove_panel(hass, PANEL_FRONTEND_PATH, warn_if_unknown=False)
    return True
