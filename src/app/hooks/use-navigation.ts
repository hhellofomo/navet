import type { Section } from '../navigation/sections';
import { useNavigationStore } from '../stores/navigation-store';

interface NavigationState {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export function useNavigation(): NavigationState {
  const activeSection = useNavigationStore((state) => state.activeSection);
  const setActiveSection = useNavigationStore((state) => state.setActiveSection);

  return { activeSection, setActiveSection };
}
