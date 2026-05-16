import 'leaflet/dist/leaflet.css';
import { MapPin, Settings2 } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { AttributionControl, Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { BaseCard, customCardDialogShellProps, DialogShell } from '@/app/components/primitives';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { CustomCardTintPicker, DialogHeader } from '@/app/components/shared/device-editor';
import { getCardShellSurfaceTokens } from '@/app/components/shared/theme/card-shell-surface-tokens';
import {
  getCustomCardTintSurface,
  normalizeCustomCardTint,
} from '@/app/components/shared/theme/custom-card-tint-surface';
import {
  getMapControlSurfaceTokens,
  getMapWidgetSurfaceTokens,
} from '@/app/components/shared/theme/map-widget-surface-tokens';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useHomeAssistant, useI18n, useTheme } from '@/app/hooks';
import { useAuth } from '@/app/stores/auth-store';
import { authSelectors } from '@/app/stores/selectors';
import { resolveHomeAssistantProxyUrl } from '@/app/utils/home-assistant-url';
import { BoundsFitter } from './map-bounds-fitter';
import { buildMarkerIcon } from './map-marker-icon';
import { mapMarkersEqual, selectMapMarkersFromHa } from './map-markers';
import { getTileUrl, TILE_ATTRIBUTION } from './map-tiles';
import type { MapMarker } from './map-types';
import { getDashboardWidgetSurfaceTokens } from './widget-surface-tokens';

export interface MapWidgetProps {
  size?: CardSize;
  tintColor?: string;
  markers?: MapMarker[];
  onTintColorChange?: (color: string) => void;
  isEditMode?: boolean;
}

interface MapSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tintColor?: string;
  onTintColorChange?: (color: string) => void;
}

function MapSettingsDialog({
  isOpen,
  onOpenChange,
  tintColor,
  onTintColorChange,
}: MapSettingsDialogProps) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const surface = getDashboardWidgetSurfaceTokens(theme, tintColor);
  const tintSurface = getCustomCardTintSurface(theme, tintColor);
  const dialogShell = customCardDialogShellProps(
    { panel: surface.panelClassName, border: surface.borderClassName },
    tintSurface,
    { maxWidth: 'sm' }
  );

  return (
    <DialogShell
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      overlayClassName={surface.dialogBackdrop}
      contentClassName={dialogShell.contentClassName}
      contentStyle={dialogShell.contentStyle}
      contentGlowStyle={dialogShell.contentGlowStyle}
      contentOverlayClassName={dialogShell.contentOverlayClassName}
    >
      <DialogHeader title={t('widgets.map.title')} isOn={theme !== 'light'} />
      {onTintColorChange ? (
        <CustomCardTintPicker
          value={tintColor}
          onChange={onTintColorChange}
          defaultColor="#3b82f6"
          className={surface.textMuted}
        />
      ) : null}
    </DialogShell>
  );
}

export const MapWidget = memo(function MapWidget({
  size = 'large',
  tintColor,
  markers: staticMarkers,
  onTintColorChange,
  isEditMode = false,
}: MapWidgetProps) {
  const { theme, primaryColor } = useTheme();
  const { t } = useI18n();
  const authConfig = useAuth(authSelectors.config);
  const surface = getDashboardWidgetSurfaceTokens(theme, tintColor);
  const baseSurface = getThemeSurfaceTokens(theme);
  const cardShell = getCardShellSurfaceTokens(theme);
  const accentHex = normalizeCustomCardTint(tintColor) ?? getThemeColorValue(primaryColor);
  const tileUrl = getTileUrl(theme);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isSmallCard = size === 'small';
  const mapWidgetSurface = getMapWidgetSurfaceTokens(theme);
  const mapControlSurface = getMapControlSurfaceTokens(theme, baseSurface, cardShell);
  const settingsButtonClassName = mapControlSurface.settingsButtonClassName;
  const mapFrameStyle = useMemo(
    () => ({
      borderColor:
        typeof surface.panelStyle?.borderColor === 'string'
          ? surface.panelStyle.borderColor
          : undefined,
      boxShadow: surface.panelStyle?.boxShadow,
    }),
    [surface.panelStyle]
  );
  const mapInnerStyle = useMemo(() => surface.panelStyle, [surface.panelStyle]);

  const homeAssistantMarkers = useHomeAssistant(selectMapMarkersFromHa, mapMarkersEqual);
  const markers = staticMarkers ?? homeAssistantMarkers;
  const resolvedMarkers = useMemo(
    () =>
      markers.map((marker) => ({
        ...marker,
        entityPicture: marker.entityPicture
          ? (resolveHomeAssistantProxyUrl(marker.entityPicture, authConfig?.url) ?? undefined)
          : undefined,
      })),
    [authConfig?.url, markers]
  );

  const defaultCenter = useMemo<[number, number]>(() => [20, 0], []);

  useEffect(() => {
    if (!isEditMode) {
      setIsSettingsOpen(false);
    }
  }, [isEditMode]);

  return (
    <BaseCard
      size={size}
      fullBleed
      frameClassName={surface.outerFrameClassName}
      style={mapFrameStyle}
      disableDefaultSheen
      contentClassName="h-full"
    >
      <div
        className={`${surface.innerFrameClassName} z-2 overflow-hidden ${baseSurface.panel} ${cardShell.backdropClassName}`}
        style={mapInnerStyle}
      >
        {surface.glowStyle ? (
          <div className="pointer-events-none absolute inset-0" style={surface.glowStyle} />
        ) : null}
        {resolvedMarkers.length === 0 ? (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${baseSurface.panel} ${cardShell.backdropClassName}`}
          >
            <MapPin className={`h-8 w-8 ${mapControlSurface.emptyStateIconClassName}`} />
            <span className={`text-xs ${baseSurface.textMuted}`}>
              {t('widgets.map.noTrackers')}
            </span>
          </div>
        ) : (
          <MapContainer
            center={defaultCenter}
            zoom={4}
            zoomControl={false}
            attributionControl={false}
            className="dashboard-map-widget h-full w-full"
            scrollWheelZoom
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url={tileUrl} attribution={TILE_ATTRIBUTION} />
            {!isSmallCard ? <AttributionControl prefix={false} position="bottomleft" /> : null}
            <BoundsFitter markers={resolvedMarkers} />
            {resolvedMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.latitude, marker.longitude]}
                icon={buildMarkerIcon(marker, accentHex)}
              >
                <Popup>
                  <div style={{ minWidth: 120 }}>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{marker.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, textTransform: 'capitalize' }}>
                      {marker.state}
                    </div>
                    {typeof marker.gpsAccuracy === 'number' && (
                      <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>
                        ±{marker.gpsAccuracy} m
                      </div>
                    )}
                  </div>
                </Popup>
                {typeof marker.gpsAccuracy === 'number' && marker.gpsAccuracy > 0 && (
                  <Circle
                    center={[marker.latitude, marker.longitude]}
                    radius={marker.gpsAccuracy}
                    pathOptions={{
                      color: accentHex,
                      fillColor: accentHex,
                      fillOpacity: 0.08,
                      weight: 1,
                    }}
                  />
                )}
              </Marker>
            ))}
          </MapContainer>
        )}
        {resolvedMarkers.length > 0 && surface.overlayClassName ? (
          <div
            className={`pointer-events-none absolute inset-0 z-[350] ${surface.overlayClassName}`}
          />
        ) : null}
        {resolvedMarkers.length > 0 && baseSurface.lightOverlay ? (
          <div
            className={`pointer-events-none absolute inset-0 z-[351] ${baseSurface.lightOverlay}`}
          />
        ) : null}
        {resolvedMarkers.length > 0 && mapWidgetSurface.lightOverlayBg ? (
          <div
            className="pointer-events-none absolute inset-0 z-[352]"
            style={{ background: mapWidgetSurface.lightOverlayBg }}
          />
        ) : null}

        {isSmallCard ? (
          <div
            className={`pointer-events-auto absolute z-[450] border ${mapControlSurface.smallAttributionClassName} ${mapControlSurface.attributionClassName}`}
          >
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              className={baseSurface.textSecondary}
              aria-label="OpenStreetMap copyright"
              title="OpenStreetMap contributors"
            >
              OSM
            </a>{' '}
            <span className={`mx-1 ${baseSurface.textMuted}`}>|</span>
            <a
              href="https://carto.com/attributions"
              target="_blank"
              rel="noreferrer"
              className={baseSurface.textSecondary}
              aria-label="CARTO attributions"
              title="CARTO attributions"
            >
              CARTO
            </a>
          </div>
        ) : null}
      </div>

      {isEditMode && onTintColorChange ? (
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className={`absolute bottom-4 right-4 z-500 shrink-0 rounded-full border p-2 transition-opacity hover:opacity-90 ${settingsButtonClassName}`}
          aria-label={t('widgets.map.title')}
        >
          <Settings2 className="h-4 w-4" />
        </button>
      ) : null}

      <MapSettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        tintColor={tintColor}
        onTintColorChange={onTintColorChange}
      />

      <style>{`
        .dashboard-map-widget,
        .dashboard-map-widget.leaflet-container {
          border-radius: inherit;
          background: transparent;
        }

        .dashboard-map-widget .leaflet-tile-pane {
          opacity: ${mapWidgetSurface.tileOpacity};
          filter: ${mapWidgetSurface.tileFilter};
        }

        .dashboard-map-widget .leaflet-control-attribution {
          margin: 8px;
          border-radius: 12px 12px 12px 20px;
          padding: 3px 8px;
          font-size: 10px;
          line-height: 1.15;
          background: ${mapWidgetSurface.attributionBg};
          color: ${mapWidgetSurface.attributionText};
          border: 1px solid ${mapWidgetSurface.attributionBorder};
          backdrop-filter: ${theme === 'light' ? 'none' : 'blur(16px)'};
        }

        .dashboard-map-widget .leaflet-control-attribution a {
          color: inherit;
        }

        .dashboard-map-widget .leaflet-popup-content-wrapper,
        .dashboard-map-widget .leaflet-popup-tip {
          background: ${mapWidgetSurface.popupBg};
          color: ${mapWidgetSurface.popupText};
          border: 1px solid ${mapWidgetSurface.popupBorder};
          box-shadow: ${mapWidgetSurface.popupShadow};
          backdrop-filter: blur(16px);
        }
      `}</style>
    </BaseCard>
  );
});
