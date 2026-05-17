import type { Connection, HassConfig, HassEntities, HassUser } from 'home-assistant-js-websocket';

import HAConnectionService, {
  type HAConnectionEventMap,
  type HAConnectionEventType,
  type HomeAssistantConfiguration,
} from './ha-connection.service';
import HAEntityService from './ha-entity-service';
import HARegistryService from './ha-registry.service';

export type { HAConnectionEventMap, HAConnectionEventType, HomeAssistantConfiguration };

export interface HomeAssistantAreaRegistryEntry {
  area_id: string;
  name: string;
}

export interface HomeAssistantDeviceRegistryEntry {
  id: string;
  area_id?: string | null;
  name?: string | null;
  name_by_user?: string | null;
}

export interface HomeAssistantEntityRegistryEntry {
  entity_id: string;
  area_id?: string | null;
  device_id?: string | null;
  name?: string | null;
  original_name?: string | null;
  entity_category?: 'config' | 'diagnostic' | null;
}

export interface HomeAssistantMediaSourceItem {
  title: string;
  media_class: string;
  media_content_id: string;
  media_content_type?: string;
  children?: HomeAssistantMediaSourceItem[];
  can_expand?: boolean;
  can_play?: boolean;
  thumbnail?: string | null;
}

export interface HomeAssistantResolvedMediaSource {
  url: string;
  mime_type?: string;
}

export interface HomeAssistantAutomationConfig {
  config: Record<string, unknown>;
}

export interface HomeAssistantCameraCapabilities {
  frontend_stream_types?: string[];
}

export interface HAServiceEventMap {
  entities: HassEntities;
  config: HassConfig;
  registries: {
    areas: HomeAssistantAreaRegistryEntry[];
    devices: HomeAssistantDeviceRegistryEntry[];
    entities: HomeAssistantEntityRegistryEntry[];
  };
  connection: { connected: boolean; connection: Connection | null; reconnecting: boolean };
  error: { message: string };
}

export type HAServiceEventType = keyof HAServiceEventMap;

/**
 * HomeAssistantService facade - orchestrates connection, registry, and entity services.
 * Maintains backward compatibility with existing code while improving separation of concerns.
 */
class HomeAssistantService {
  private connectionService: HAConnectionService;
  private registryService: HARegistryService;
  private entityService: HAEntityService;

  constructor() {
    this.connectionService = new HAConnectionService();
    this.registryService = new HARegistryService(() => this.connectionService.getConnection());
    this.entityService = new HAEntityService(() => this.connectionService.getConnection());
  }

  /**
   * Authenticate and establish connection to Home Assistant
   */
  async authenticate(configuration: HomeAssistantConfiguration): Promise<void> {
    await this.connectionService.authenticate(configuration);
    await this.registryService.loadRegistries();
  }

  /**
   * Subscribe to a specific typed HA service event.
   * Returns an unsubscribe function.
   */
  addListener<K extends HAServiceEventType>(
    event: K,
    callback: (data: HAServiceEventMap[K]) => void
  ): () => void {
    // Forward to connection service for connection-related events
    if (event === 'connection' || event === 'config' || event === 'entities' || event === 'error') {
      return this.connectionService.addListener(event, callback);
    }

    // For registry events, we need to wrap the listener
    if (event === 'registries') {
      const registriesCallback = callback as (data: HAServiceEventMap['registries']) => void;
      return this.connectionService.addListener('connection', () => {
        // Trigger registry load on connection
        void this.registryService.loadRegistries().then(() => {
          registriesCallback({
            areas: this.registryService.getAreas(),
            devices: this.registryService.getDeviceRegistry(),
            entities: this.registryService.getEntityRegistry(),
          });
        });
      });
    }

    return () => {};
  }

  /**
   * Get current connection status
   */
  isConnected(): boolean {
    return this.connectionService.isConnected();
  }

  /**
   * Get Home Assistant configuration
   */
  getConfig(): HassConfig | null {
    return this.connectionService.getConfig();
  }

  /**
   * Get Home Assistant entities
   */
  getEntities(): HassEntities | null {
    return this.connectionService.getEntities();
  }

  /**
   * Get Home Assistant user
   */
  getUser(): HassUser | null {
    return this.connectionService.getUser();
  }

  /**
   * Get connection object
   */
  getConnection(): Connection | null {
    return this.connectionService.getConnection();
  }

  /**
   * Get Home Assistant areas
   */
  getAreas(): HomeAssistantAreaRegistryEntry[] {
    return this.registryService.getAreas();
  }

  /**
   * Get device registry
   */
  getDeviceRegistry(): HomeAssistantDeviceRegistryEntry[] {
    return this.registryService.getDeviceRegistry();
  }

  /**
   * Get entity registry
   */
  getEntityRegistry(): HomeAssistantEntityRegistryEntry[] {
    return this.registryService.getEntityRegistry();
  }

  /**
   * Update entity area assignment
   */
  async updateEntityArea(entityId: string, areaId: string | null): Promise<void> {
    await this.registryService.updateEntityArea(entityId, areaId);
  }

  /**
   * Call an arbitrary Home Assistant service over the active websocket connection.
   */
  async callService(
    domain: string,
    service: string,
    serviceData: Record<string, unknown> = {},
    target?: {
      entity_id?: string | string[];
      area_id?: string | string[];
      device_id?: string | string[];
    }
  ): Promise<void> {
    await this.connectionService.callService(domain, service, serviceData, target);
  }

  /**
   * Create a new area
   */
  async createArea(name: string): Promise<HomeAssistantAreaRegistryEntry> {
    return await this.registryService.createArea(name);
  }

  /**
   * Delete an area
   */
  async deleteArea(areaId: string): Promise<void> {
    await this.registryService.deleteArea(areaId);
  }

  /**
   * Update a light entity
   */
  async updateLight(
    entityId: string,
    options: {
      state?: 'on' | 'off';
      brightnessPct?: number;
      kelvin?: number;
      rgbColor?: [number, number, number];
      hsColor?: [number, number];
      xyColor?: [number, number];
    }
  ): Promise<void> {
    await this.entityService.updateLight(entityId, options);
  }

  /**
   * Update a switch entity
   */
  async updateSwitch(entityId: string, state: 'on' | 'off'): Promise<void> {
    await this.entityService.updateSwitch(entityId, state);
  }

  /**
   * Update a lock entity
   */
  async updateLock(entityId: string, state: 'locked' | 'unlocked'): Promise<void> {
    await this.entityService.updateLock(entityId, state);
  }

  /**
   * Set climate temperature
   */
  async setClimateTemperature(entityId: string, temperature: number): Promise<void> {
    await this.entityService.setClimateTemperature(entityId, temperature);
  }

  /**
   * Set climate HVAC mode
   */
  async setClimateHvacMode(entityId: string, hvacMode: string): Promise<void> {
    await this.entityService.setClimateHvacMode(entityId, hvacMode);
  }

  /**
   * Update media player playback
   */
  async updateMediaPlayerPlayback(
    entityId: string,
    action: 'toggle' | 'play' | 'pause' | 'previous' | 'next'
  ): Promise<void> {
    await this.entityService.updateMediaPlayerPlayback(entityId, action);
  }

  /**
   * Set media player volume
   */
  async setMediaPlayerVolume(entityId: string, volumePct: number): Promise<void> {
    await this.entityService.setMediaPlayerVolume(entityId, volumePct);
  }

  /**
   * Set media player mute
   */
  async setMediaPlayerMute(entityId: string, isMuted: boolean): Promise<void> {
    await this.entityService.setMediaPlayerMute(entityId, isMuted);
  }

  /**
   * Update media player power
   */
  async updateMediaPlayerPower(entityId: string, state: 'on' | 'off'): Promise<void> {
    await this.entityService.updateMediaPlayerPower(entityId, state);
  }

  /**
   * Select media player source
   */
  async selectMediaPlayerSource(entityId: string, source: string): Promise<void> {
    await this.entityService.selectMediaPlayerSource(entityId, source);
  }

  /**
   * Send remote command
   */
  async sendRemoteCommand(entityId: string, command: string | string[]): Promise<void> {
    await this.entityService.sendRemoteCommand(entityId, command);
  }

  /**
   * Set media player shuffle
   */
  async setMediaPlayerShuffle(entityId: string, shuffle: boolean): Promise<void> {
    await this.entityService.setMediaPlayerShuffle(entityId, shuffle);
  }

  /**
   * Set media player repeat
   */
  async setMediaPlayerRepeat(entityId: string, repeat: 'off' | 'one' | 'all'): Promise<void> {
    await this.entityService.setMediaPlayerRepeat(entityId, repeat);
  }

  /**
   * Join media players
   */
  async joinMediaPlayers(entityId: string, memberEntityIds: string[]): Promise<void> {
    await this.entityService.joinMediaPlayers(entityId, memberEntityIds);
  }

  /**
   * Unjoin media player
   */
  async unjoinMediaPlayer(entityId: string): Promise<void> {
    await this.entityService.unjoinMediaPlayer(entityId);
  }

  /**
   * Update camera
   */
  async updateCamera(entityId: string, state: 'on' | 'off'): Promise<void> {
    await this.entityService.updateCamera(entityId, state);
  }

  async enableCameraMotionDetection(entityId: string): Promise<void> {
    await this.entityService.enableCameraMotionDetection(entityId);
  }

  async disableCameraMotionDetection(entityId: string): Promise<void> {
    await this.entityService.disableCameraMotionDetection(entityId);
  }

  async playCameraStream(entityId: string, mediaPlayerId: string): Promise<void> {
    await this.entityService.playCameraStream(entityId, mediaPlayerId);
  }

  async getCameraCapabilities(entityId: string): Promise<HomeAssistantCameraCapabilities> {
    return await this.entityService.getCameraCapabilities(entityId);
  }

  /**
   * Browse media source
   */
  async browseMediaSource(mediaContentId: string): Promise<HomeAssistantMediaSourceItem> {
    return await this.entityService.browseMediaSource(mediaContentId);
  }

  /**
   * Resolve media source
   */
  async resolveMediaSource(mediaContentId: string): Promise<HomeAssistantResolvedMediaSource> {
    return await this.entityService.resolveMediaSource(mediaContentId);
  }

  /**
   * Get automation config
   */
  async getAutomationConfig(entityId: string): Promise<HomeAssistantAutomationConfig> {
    return await this.entityService.getAutomationConfig(entityId);
  }

  /**
   * Disconnect from Home Assistant
   */
  disconnect(): void {
    this.connectionService.disconnect();
  }
}

export const homeAssistantService = new HomeAssistantService();
