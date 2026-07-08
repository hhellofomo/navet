import type { Connection, HassConfig, HassEntities, HassUser } from 'home-assistant-js-websocket';
import { createStore } from 'zustand/vanilla';
import {
	type HomeAssistantAreaRegistryEntry,
	type HomeAssistantConfiguration,
	type HomeAssistantDeviceRegistryEntry,
	type HomeAssistantEntityRegistryEntry,
	homeAssistantService,
} from '../services/home-assistant.service';

interface HomeAssistantState {
	connected: boolean;
	config: HassConfig | null;
	entities: HassEntities | null;
	user: HassUser | null;
	areas: HomeAssistantAreaRegistryEntry[];
	deviceRegistry: HomeAssistantDeviceRegistryEntry[];
	entityRegistry: HomeAssistantEntityRegistryEntry[];
	connection: Connection | null;
	error: string | null;
	connecting: boolean;
}

interface HomeAssistantActions {
	connect: (config: HomeAssistantConfiguration) => Promise<(() => void) | undefined>;
	disconnect: () => void;
	clearError: () => void;
}

export type HomeAssistantStore = HomeAssistantState & HomeAssistantActions;

const initialState: HomeAssistantState = {
	connected: false,
	config: null,
	entities: null,
	user: null,
	areas: [],
	deviceRegistry: [],
	entityRegistry: [],
	connection: null,
	error: null,
	connecting: false,
};

export const homeAssistantStore = createStore<HomeAssistantStore>()((set, _get) => ({
	...initialState,

	connect: async (config: HomeAssistantConfiguration) => {
		set({ connecting: true, error: null });

		try {
			// Add listener to update store when service state changes
			const unsubscribe = homeAssistantService.addListener(() => {
				set({
					connected: homeAssistantService.isConnected(),
					config: homeAssistantService.getConfig(),
					entities: homeAssistantService.getEntities(),
					user: homeAssistantService.getUser(),
					areas: homeAssistantService.getAreas(),
					deviceRegistry: homeAssistantService.getDeviceRegistry(),
					entityRegistry: homeAssistantService.getEntityRegistry(),
					connection: homeAssistantService.getConnection(),
					connecting: false,
				});
			});

			// Authenticate and connect
			await homeAssistantService.authenticate(config);

			// Initial state update
			set({
				connected: homeAssistantService.isConnected(),
				config: homeAssistantService.getConfig(),
				entities: homeAssistantService.getEntities(),
				user: homeAssistantService.getUser(),
				areas: homeAssistantService.getAreas(),
				deviceRegistry: homeAssistantService.getDeviceRegistry(),
				entityRegistry: homeAssistantService.getEntityRegistry(),
				connection: homeAssistantService.getConnection(),
				connecting: false,
			});

			// Return unsubscribe function
			return unsubscribe;
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Failed to connect',
				connecting: false,
				connected: false,
			});
			throw error;
		}
	},

	disconnect: () => {
		homeAssistantService.disconnect();
		set(initialState);
	},

	clearError: () => {
		set({ error: null });
	},
}));
