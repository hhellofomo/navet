/**
 * Home Assistant Context - Provides Home Assistant integration for the dashboard
 * Manages connection state, entities, and configuration
 */

import type { Connection, HassConfig, HassEntities } from 'home-assistant-js-websocket';
import { createContext, type ReactNode, useContext } from 'react';
import { useHomeAssistant } from '../hooks/use-home-assistant';
import type {
	HomeAssistantAreaRegistryEntry,
	HomeAssistantConfiguration,
	HomeAssistantDeviceRegistryEntry,
	HomeAssistantEntityRegistryEntry,
} from '../services/home-assistant.service';

interface HomeAssistantContextValue {
	// Connection state
	connected: boolean;
	connecting: boolean;
	error: string | null;

	// Home Assistant data
	config: HassConfig | null;
	entities: HassEntities | null;
	areas: HomeAssistantAreaRegistryEntry[];
	deviceRegistry: HomeAssistantDeviceRegistryEntry[];
	entityRegistry: HomeAssistantEntityRegistryEntry[];
	connection: Connection | null;

	// Actions
	connect: (config: HomeAssistantConfiguration) => Promise<(() => void) | undefined>;
	disconnect: () => void;
	clearError: () => void;
}

const defaultHomeAssistantValue: HomeAssistantContextValue = {
	connected: false,
	connecting: false,
	error: null,
	config: null,
	entities: null,
	areas: [],
	deviceRegistry: [],
	entityRegistry: [],
	connection: null,
	connect: async () => undefined,
	disconnect: () => {},
	clearError: () => {},
};

export const HomeAssistantContext =
	createContext<HomeAssistantContextValue>(defaultHomeAssistantValue);

interface HomeAssistantProviderProps {
	children: ReactNode;
}

export const HomeAssistantProvider = ({ children }: HomeAssistantProviderProps) => {
	const {
		connected,
		connecting,
		error,
		config,
		entities,
		areas,
		deviceRegistry,
		entityRegistry,
		connection,
		connect,
		disconnect,
		clearError,
	} = useHomeAssistant();

	const value: HomeAssistantContextValue = {
		connected,
		connecting,
		error,
		config,
		entities,
		areas,
		deviceRegistry,
		entityRegistry,
		connection,
		connect,
		disconnect,
		clearError,
	};

	return <HomeAssistantContext.Provider value={value}>{children}</HomeAssistantContext.Provider>;
};

export function useHomeAssistantContext() {
	return useContext(HomeAssistantContext);
}
