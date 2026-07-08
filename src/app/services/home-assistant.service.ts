import type {
  Auth,
  Connection,
  HassConfig,
  HassEntities,
  HassUser,
} from 'home-assistant-js-websocket';
import {
  callService as callHassService,
  createConnection,
  createLongLivedTokenAuth,
  ERR_CANNOT_CONNECT,
  ERR_CONNECTION_LOST,
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_AUTH,
  ERR_INVALID_HTTPS_TO_HTTP,
  getAuth,
  getUser,
  subscribeConfig,
  subscribeEntities,
} from 'home-assistant-js-websocket';

export interface HomeAssistantConfiguration {
  hassUrl?: string;
  token?: string;
}

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
}

interface CallServiceTarget {
  entity_id?: string | string[];
  area_id?: string | string[];
  device_id?: string | string[];
}

class HomeAssistantService {
  private connection: Connection | null = null;
  private config: HassConfig | null = null;
  private entities: HassEntities | null = null;
  private user: HassUser | null = null;
  private areas: HomeAssistantAreaRegistryEntry[] = [];
  private deviceRegistry: HomeAssistantDeviceRegistryEntry[] = [];
  private entityRegistry: HomeAssistantEntityRegistryEntry[] = [];
  private connected: boolean = false;
  private listeners: Array<() => void> = [];

  /**
   * Authenticate and establish connection to Home Assistant
   */
  async authenticate(configuration: HomeAssistantConfiguration): Promise<void> {
    if (!configuration?.hassUrl) {
      throw new Error('Home Assistant URL is required');
    }

    let auth: Auth | undefined;

    try {
      // Long-lived access token
      if (configuration?.token) {
        auth = createLongLivedTokenAuth(configuration.hassUrl, configuration.token);
      } else {
        // Default auth flow
        auth = await getAuth({ hassUrl: configuration.hassUrl });
        if (auth.expired) await auth.refreshAccessToken();
      }

      // Create connection
      this.connection = await createConnection({ auth });
      this.connected = true;
      this.user = await getUser(this.connection);

      await this.loadRegistries();

      // Subscribe to entities
      subscribeEntities(this.connection, (entities) => {
        this.entities = entities;
        this.notifyListeners();
      });

      // Subscribe to config
      subscribeConfig(this.connection, (config) => {
        this.config = config;
        this.notifyListeners();
      });

      // Connection events
      this.connection.addEventListener('ready', () => {
        this.connected = true;
        this.notifyListeners();
      });

      this.connection.addEventListener('disconnected', () => {
        this.connected = false;
        this.notifyListeners();
      });

      this.connection.addEventListener('reconnect-error', () => {
        this.connected = false;
        this.notifyListeners();
      });

      // Clear auth query string if present
      if (location.search.includes('auth_callback=1')) {
        history.replaceState(null, '', location.pathname);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private async loadRegistries(): Promise<void> {
    if (!this.connection) {
      return;
    }

    try {
      const [areas, devices, entities] = await Promise.all([
        this.connection.sendMessagePromise({
          type: 'config/area_registry/list',
        }) as Promise<HomeAssistantAreaRegistryEntry[]>,
        this.connection.sendMessagePromise({
          type: 'config/device_registry/list',
        }) as Promise<HomeAssistantDeviceRegistryEntry[]>,
        this.connection.sendMessagePromise({
          type: 'config/entity_registry/list',
        }) as Promise<HomeAssistantEntityRegistryEntry[]>,
      ]);

      this.areas = areas;
      this.deviceRegistry = devices;
      this.entityRegistry = entities;
      this.notifyListeners();
    } catch {
      this.areas = [];
      this.deviceRegistry = [];
      this.entityRegistry = [];
    }
  }

  /**
   * Handle connection errors
   */
  private handleError(error: unknown): never {
    switch (error) {
      case ERR_INVALID_AUTH:
        break;
      case ERR_CANNOT_CONNECT:
        break;
      case ERR_CONNECTION_LOST:
        break;
      case ERR_HASS_HOST_REQUIRED:
        break;
      case ERR_INVALID_HTTPS_TO_HTTP:
        break;
      default:
        break;
    }
    throw error;
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  /**
   * Add a listener for state changes
   */
  addListener(callback: () => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get current connection status
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get Home Assistant configuration
   */
  getConfig(): HassConfig | null {
    return this.config;
  }

  /**
   * Get Home Assistant entities
   */
  getEntities(): HassEntities | null {
    return this.entities;
  }

  getAreas(): HomeAssistantAreaRegistryEntry[] {
    return this.areas;
  }

  getUser(): HassUser | null {
    return this.user;
  }

  getDeviceRegistry(): HomeAssistantDeviceRegistryEntry[] {
    return this.deviceRegistry;
  }

  getEntityRegistry(): HomeAssistantEntityRegistryEntry[] {
    return this.entityRegistry;
  }

  /**
   * Get connection object
   */
  getConnection(): Connection | null {
    return this.connection;
  }

  /**
   * Call a Home Assistant service over the active websocket connection.
   */
  async callService(
    domain: string,
    service: string,
    serviceData: Record<string, unknown> = {},
    target?: CallServiceTarget
  ): Promise<void> {
    if (!this.connection) {
      throw new Error('Home Assistant is not connected');
    }

    const normalizedServiceData = { ...serviceData };

    // Keep entity_id in service data for broader compatibility with integrations and older setups.
    if (target?.entity_id && normalizedServiceData.entity_id === undefined) {
      normalizedServiceData.entity_id = target.entity_id;
    }
    if (target?.area_id && normalizedServiceData.area_id === undefined) {
      normalizedServiceData.area_id = target.area_id;
    }
    if (target?.device_id && normalizedServiceData.device_id === undefined) {
      normalizedServiceData.device_id = target.device_id;
    }

    await callHassService(this.connection, domain, service, normalizedServiceData, target);
  }

  async updateEntityArea(entityId: string, areaId: string | null): Promise<void> {
    if (!this.connection) {
      throw new Error('Home Assistant is not connected');
    }

    await this.connection.sendMessagePromise({
      type: 'config/entity_registry/update',
      entity_id: entityId,
      area_id: areaId,
    });

    await this.loadRegistries();
    this.notifyListeners();
  }

  /**
   * Update a light entity using Home Assistant light services.
   */
  async updateLight(
    entityId: string,
    options: {
      state?: 'on' | 'off';
      brightnessPct?: number;
      kelvin?: number;
      rgbColor?: [number, number, number];
    }
  ): Promise<void> {
    const { state = 'on', brightnessPct, kelvin, rgbColor } = options;

    if (state === 'off') {
      await this.callService('light', 'turn_off', {}, { entity_id: entityId });
      return;
    }

    const serviceData: Record<string, unknown> = {};
    if (typeof brightnessPct === 'number') {
      serviceData.brightness_pct = Math.max(1, Math.min(100, Math.round(brightnessPct)));
    }
    if (typeof kelvin === 'number') {
      serviceData.kelvin = Math.max(2000, Math.min(6500, Math.round(kelvin)));
    }
    if (rgbColor) {
      serviceData.rgb_color = rgbColor;
    }

    await this.callService('light', 'turn_on', serviceData, { entity_id: entityId });
  }

  /**
   * Update a switch entity using Home Assistant switch services.
   */
  async updateSwitch(entityId: string, state: 'on' | 'off'): Promise<void> {
    await this.callService(
      'switch',
      state === 'on' ? 'turn_on' : 'turn_off',
      {},
      { entity_id: entityId }
    );
  }

  async updateMediaPlayerPlayback(
    entityId: string,
    action: 'toggle' | 'play' | 'pause' | 'previous' | 'next'
  ): Promise<void> {
    const service =
      action === 'toggle'
        ? 'media_play_pause'
        : action === 'play'
          ? 'media_play'
          : action === 'pause'
            ? 'media_pause'
            : action === 'previous'
              ? 'media_previous_track'
              : 'media_next_track';

    await this.callService('media_player', service, {}, { entity_id: entityId });
  }

  async setMediaPlayerVolume(entityId: string, volumePct: number): Promise<void> {
    const volumeLevel = Math.max(0, Math.min(1, volumePct / 100));
    await this.callService(
      'media_player',
      'volume_set',
      { volume_level: volumeLevel },
      { entity_id: entityId }
    );
  }

  async setMediaPlayerMute(entityId: string, isMuted: boolean): Promise<void> {
    await this.callService(
      'media_player',
      'volume_mute',
      { is_volume_muted: isMuted },
      { entity_id: entityId }
    );
  }

  /**
   * Close the connection
   */
  disconnect(): void {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
      this.connected = false;
      this.user = null;
      this.areas = [];
      this.deviceRegistry = [];
      this.entityRegistry = [];
      this.notifyListeners();
    }
  }
}

export const homeAssistantService = new HomeAssistantService();
