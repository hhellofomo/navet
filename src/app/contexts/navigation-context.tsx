import { createContext, type ReactNode, useContext } from 'react';
import { useNavigationStore } from '../stores/navigation-store';

export type Section = 'home' | 'security' | 'tasks' | 'locks' | 'lights' | 'media' | 'settings';

interface NavigationContextType {
	activeSection: Section;
	setActiveSection: (section: Section) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
	const activeSection = useNavigationStore((state) => state.activeSection);
	const setActiveSection = useNavigationStore((state) => state.setActiveSection);

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
