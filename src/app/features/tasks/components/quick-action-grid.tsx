import { Clapperboard, Play, ScrollText } from 'lucide-react';
import { useState } from 'react';
import { Button, Panel, Tag } from '@/app/components/primitives';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useServiceActionHandler, useTheme } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import type { QuickActionRoutine } from '../types';

interface QuickActionGridProps {
  actions: QuickActionRoutine[];
  shouldReduceMotion: boolean;
}

interface QuickActionCardProps {
  action: QuickActionRoutine;
  shouldReduceMotion: boolean;
}

function QuickActionCard({ action, shouldReduceMotion }: QuickActionCardProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const runAction = useServiceActionHandler();
  const [isRunning, setIsRunning] = useState(false);
  const Icon = action.type === 'scene' ? Clapperboard : ScrollText;

  const handleRun = () => {
    setIsRunning(true);
    void runAction(
      () => homeAssistantService.callService(action.type, 'turn_on', {}, { entity_id: action.id }),
      t('tasks.quickActions.triggerFailed', { name: action.name })
    ).finally(() => {
      setIsRunning(false);
    });
  };

  return (
    <Panel
      as="article"
      muted
      padded={false}
      className={`grid min-h-[10rem] gap-4 p-4 ${
        shouldReduceMotion ? '' : 'transition-shadow duration-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`rounded-2xl border p-2.5 ${surface.border} ${surface.panel}`}>
          <Icon className={`h-4 w-4 ${surface.textSecondary}`} aria-hidden="true" />
        </div>
        <Tag tone="accent">{action.type}</Tag>
      </div>
      <div className="min-w-0">
        <h3 className={`truncate text-base font-semibold ${surface.textPrimary}`}>{action.name}</h3>
        <p className={`mt-2 text-sm ${surface.textSecondary}`}>{action.room}</p>
      </div>
      <Button
        variant="secondary"
        size="small"
        leading={<Play className="h-4 w-4" aria-hidden="true" />}
        loading={isRunning}
        onClick={handleRun}
        aria-label={t('tasks.quickActions.runRoutine', { name: action.name })}
        className="mt-auto"
      >
        {t('tasks.quickActions.run')}
      </Button>
    </Panel>
  );
}

export function QuickActionGrid({ actions, shouldReduceMotion }: QuickActionGridProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {actions.map((action) => (
        <QuickActionCard key={action.id} action={action} shouldReduceMotion={shouldReduceMotion} />
      ))}
    </div>
  );
}
