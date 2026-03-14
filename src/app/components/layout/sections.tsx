import { Clipboard, FlaskConical, Lightbulb, Lock, Tv, Video } from 'lucide-react';
import { memo } from 'react';
import { type CardSize, getCardSpanClass } from '@/app/components/shared/card-size-selector';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { DEVICES } from '@/app/data/mock-devices';
import { renderCard } from '@/app/features/dashboard';
import { useDeviceMap, useDevices, useI18n, useTheme } from '@/app/hooks';
import type { DeviceWithType } from '@/app/types/device.types';
import { EmptyState } from '../shared/empty-state';

export function SecuritySection() {
  const { t } = useI18n();
  return (
    <EmptyState
      icon={Video}
      title={t('sections.security.emptyTitle')}
      description={t('sections.security.emptyDescription')}
    />
  );
}

export function TasksSection() {
  const { t } = useI18n();
  return (
    <EmptyState
      icon={Clipboard}
      title={t('sections.tasks.emptyTitle')}
      description={t('sections.tasks.emptyDescription')}
    />
  );
}

export function LocksSection() {
  const { t } = useI18n();
  const devices = useDevices();
  const lockDevices = devices.locks;

  if (lockDevices.length === 0) {
    return (
      <EmptyState
        icon={Lock}
        title={t('sections.locks.emptyTitle')}
        description={t('sections.locks.emptyDescription')}
      />
    );
  }

  return (
    <EntityGrid
      devices={lockDevices.map((device) => ({ ...device, type: 'locks' as const }))}
      title={t('sections.locks.title')}
      singularLabel={t('sections.locks.singular')}
      pluralLabel={t('sections.locks.plural')}
    />
  );
}

export function LightsSection() {
  const { t } = useI18n();
  return (
    <EmptyState
      icon={Lightbulb}
      title={t('sections.lights.emptyTitle')}
      description={t('sections.lights.emptyDescription')}
    />
  );
}

export function MediaSection() {
  const { t } = useI18n();
  const devices = useDevices();
  const mediaDevices = devices.media;

  if (mediaDevices.length === 0) {
    return (
      <EmptyState
        icon={Tv}
        title={t('sections.media.emptyTitle')}
        description={t('sections.media.emptyDescription')}
      />
    );
  }

  return (
    <EntityGrid
      devices={mediaDevices.map((device) => ({ ...device, type: 'media' as const }))}
      title={t('sections.media.title')}
      singularLabel={t('sections.media.singular')}
      pluralLabel={t('sections.media.plural')}
    />
  );
}

const noopHandleSizeChange = () => {};

const EntityGrid = memo(function EntityGrid({
  devices,
  title,
  singularLabel,
  pluralLabel,
}: {
  devices: DeviceWithType[];
  title: string;
  singularLabel: string;
  pluralLabel: string;
}) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className={`text-lg font-semibold md:text-xl ${surface.textPrimary}`}>{title}</h2>
        <span className={`text-xs md:text-sm ${surface.textSecondary}`}>
          {devices.length} {devices.length === 1 ? singularLabel : pluralLabel}
        </span>
      </div>
      <div className="grid w-full auto-rows-[87px] grid-flow-row-dense grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 lg:gap-4 xl:grid-cols-6 2xl:grid-cols-8">
        {devices.map((device) => {
          const size = device.size as CardSize;

          return (
            <div key={device.id} className={getCardSpanClass(size)}>
              {renderCard({
                device,
                size,
                handleSizeChange: noopHandleSizeChange,
                isEditMode: false,
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
});

const MockEntityGrid = memo(function MockEntityGrid({ devices }: { devices: DeviceWithType[] }) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className={`text-lg md:text-xl font-semibold ${surface.textPrimary}`}>
          All Mock Entities
        </h2>
        <span className={`text-xs md:text-sm ${surface.textSecondary}`}>
          {devices.length}{' '}
          {devices.length === 1 ? t('sections.common.entity') : t('sections.common.entities')}
        </span>
      </div>
      <div className="grid w-full grid-flow-row-dense grid-cols-2 gap-2 auto-rows-[87px] md:grid-cols-4 md:gap-3 xl:grid-cols-6 lg:gap-4 2xl:grid-cols-8">
        {devices.map((device) => {
          const size = device.size as CardSize;

          return (
            <div key={device.id} className={getCardSpanClass(size)}>
              {renderCard({
                device,
                size,
                handleSizeChange: noopHandleSizeChange,
                isEditMode: false,
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
});

export function MockEntitiesSection() {
  const { deviceMap } = useDeviceMap(DEVICES);
  const { t } = useI18n();
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';
  const mockDevices = Array.from(deviceMap.values());

  return (
    <div className="space-y-8">
      <section
        className={`rounded-[32px] border px-6 py-6 md:px-8 md:py-8 ${surface.panel} ${surface.borderStrong} ${isGlass ? 'backdrop-blur-2xl' : ''}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15">
            <FlaskConical className="h-5 w-5 text-orange-500" />
          </div>
          <div className="min-w-0">
            <h1
              className={`text-xl font-semibold tracking-tight md:text-2xl ${surface.textPrimary}`}
            >
              {t('sections.mock.title')}
            </h1>
            <p className={`mt-2 max-w-3xl text-sm leading-relaxed ${surface.textSecondary}`}>
              {t('sections.mock.description')}
            </p>
          </div>
        </div>
      </section>

      <MockEntityGrid devices={mockDevices} />
    </div>
  );
}
