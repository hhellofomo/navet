import { createContext, type ReactNode, useContext } from 'react';
import { useNavigationStore } from '../stores/navigation-store';
import { navigationSelectors } from '../stores/selectors';

export type Section = 'home' | 'security' | 'tasks' | 'locks' | 'lights' | 'media' | 'settings';

interface NavigationContextType {
	activeSection: Section;
	setActiveSection: (section: Section) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
	const currentRoom = useNavigationStore(navigationSelectors.currentRoom);
	const setCurrentRoom = useNavigationStore(navigationSelectors.setCurrentRoom);

	// Map the store's currentRoom to the Section type
	const activeSection = (currentRoom as Section) || 'home';
	const setActiveSection = (section: Section) => setCurrentRoom(section);

	return (
		<NavigationContext.Provider value={{ activeSection, setActiveSection }}>
			{children}
		</NavigationContext.Provider>
	);
}

export function useNavigation() {
	const context = useContext(NavigationContext);
	if (context === undefined) {
		throw new Error('useNavigation must be used within a NavigationProvider');
	}
	return context;
}
