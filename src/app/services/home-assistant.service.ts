import type {
	Auth,
	AuthData,
	Connection,
	HassConfig,
	HassEntities,
} from 'home-assistant-js-websocket';
import {
	createConnection,
	createLongLivedTokenAuth,
	ERR_CANNOT_CONNECT,
	ERR_CONNECTION_LOST,
	ERR_HASS_HOST_REQUIRED,
	ERR_INVALID_AUTH,
	ERR_INVALID_HTTPS_TO_HTTP,
	getAuth,
	subscribeConfig,
	subscribeEntities,
} from 'home-assistant-js-websocket';

export interface HomeAssistantConfiguration {
	hassUrl?: string;
	token?: string;
}

class HomeAssistantService {
	private connection: Connection | null = null;
	private config: HassConfig | null = null;
	private entities: HassEntities | null = null;
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
				console.debug('Connected to Home Assistant');
				this.connected = true;
				this.notifyListeners();
			});

			this.connection.addEventListener('disconnected', () => {
				console.debug('Disconnected from Home Assistant');
				this.connected = false;
				this.notifyListeners();
			});

			this.connection.addEventListener('reconnect-error', () => {
				console.error('Reconnection error');
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

	/**
	 * Handle connection errors
	 */
	private handleError(error: unknown): never {
		switch (error) {
			case ERR_INVALID_AUTH:
				console.error('Invalid authentication');
				break;
			case ERR_CANNOT_CONNECT:
				console.error('Cannot connect to Home Assistant');
				break;
			case ERR_CONNECTION_LOST:
				console.error('Connection lost');
				break;
			case ERR_HASS_HOST_REQUIRED:
				console.error('Home Assistant host is required');
				break;
			case ERR_INVALID_HTTPS_TO_HTTP:
				console.error('Invalid HTTPS to HTTP connection');
				break;
			default:
				console.error('Unknown error:', error);
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

	/**
	 * Get connection object
	 */
	getConnection(): Connection | null {
		return this.connection;
	}

	/**
	 * Close the connection
	 */
	disconnect(): void {
		if (this.connection) {
			this.connection.close();
			this.connection = null;
			this.connected = false;
			this.notifyListeners();
		}
	}
}

export const homeAssistantService = new HomeAssistantService();
