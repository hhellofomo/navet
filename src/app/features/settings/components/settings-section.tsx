import { Info, LayoutGrid, Palette, Server } from 'lucide-react';
import { useSettingsSectionController } from '../hooks/use-settings-section-controller';
import { SettingsAppearanceSection } from './settings-appearance-section';
import { SettingsDashboardSection } from './settings-dashboard-section';
import { SettingsProjectSection } from './settings-project-section';
import { SettingsHero } from './settings-section-shell';
import { SettingsSystemSection } from './settings-system-section';

const NAV_ITEMS = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'system', label: 'System', icon: Server },
  { id: 'project', label: 'Project', icon: Info },
] as const;

export function SettingsSection() {
  const controller = useSettingsSectionController();

  return (
    <div className="h-full overflow-y-auto px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <SettingsHero navItems={[...NAV_ITEMS]} styles={controller.styles} />
        <SettingsAppearanceSection controller={controller} />
        <SettingsDashboardSection controller={controller} />
        <SettingsSystemSection controller={controller} />
        <SettingsProjectSection controller={controller} />
      </div>
    </div>
  );
}
