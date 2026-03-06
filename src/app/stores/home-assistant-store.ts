import type { Connection, HassConfig, HassEntities } from 'home-assistant-js-websocket';
import { createStore } from 'zustand/vanilla';
import {
	type HomeAssistantConfiguration,
	homeAssistantService,
} from '../services/home-assistant.service';

interface HomeAssistantState {
	connected: boolean;
	config: HassConfig | null;
	entities: HassEntities | null;
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
