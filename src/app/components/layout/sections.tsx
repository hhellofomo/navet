import { Clipboard, FlaskConical, Lightbulb, Lock, Tv, Video } from 'lucide-react';
import { memo } from 'react';
import { type CardSize, getCardSpanClass } from '@/app/components/shared/card-size-selector';
import { DEVICES } from '@/app/data/mock-devices';
import { useDeviceMap, useTheme } from '@/app/hooks';
import type { DeviceWithType } from '@/app/types/device.types';
import { renderCard } from '@/app/utils/card-renderer';
import { EmptyState } from '../shared/empty-state';

export function SecuritySection() {
  return (
    <EmptyState
      icon={Video}
      title="No Security Cameras"
      description="You don't have any security cameras configured yet. Add cameras to monitor your home."
    />
  );
}

export function TasksSection() {
  return (
    <EmptyState
      icon={Clipboard}
      title="No Tasks"
      description="You don't have any tasks or automations configured yet. Create tasks to manage your home routines."
    />
  );
}

export function LocksSection() {
  return (
    <EmptyState
      icon={Lock}
      title="No Smart Locks"
      description="You don't have any smart locks configured yet. Add locks to manage access to your home."
    />
  );
}

export function LightsSection() {
  return (
    <EmptyState
      icon={Lightbulb}
      title="No Lights"
      description="You don't have any smart lights configured yet. Add lights to control your home lighting."
    />
  );
}

export function MediaSection() {
  return (
    <EmptyState
      icon={Tv}
      title="No Media Players"
      description="You don't have any media players configured yet. Add devices to control your entertainment."
    />
  );
}

const noopHandleSizeChange = () => {};

const MockEntityGrid = memo(function MockEntityGrid({ devices }: { devices: DeviceWithType[] }) {
  const { theme } = useTheme();
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-gray-300';

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2
          className={`text-lg md:text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
        >
          All Mock Entities
        </h2>
        <span className={`text-xs md:text-sm ${textSecondary}`}>
          {devices.length} {devices.length === 1 ? 'entity' : 'entities'}
        </span>
      </div>
      <div className="grid w-full justify-start grid-flow-row-dense grid-cols-[repeat(auto-fit,190px)] gap-4 auto-rows-[87px]">
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
  const { theme } = useTheme();
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subtleColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const borderColor =
    theme === 'light' ? 'border-gray-200/80 bg-white/92' : 'border-white/10 bg-gray-900/88';
  const mockDevices = Array.from(deviceMap.values());

  return (
    <div className="space-y-8">
      <section className={`rounded-[32px] border px-6 py-6 md:px-8 md:py-8 ${borderColor}`}>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15">
            <FlaskConical className="h-5 w-5 text-orange-500" />
          </div>
          <div className="min-w-0">
            <h1 className={`text-xl font-semibold tracking-tight md:text-2xl ${textColor}`}>
              Temporary Mock Entities
            </h1>
            <p className={`mt-2 max-w-3xl text-sm leading-relaxed ${subtleColor}`}>
              This section holds your local mock entities so you can keep previewing cards that are
              not fully integrated into the live Home Assistant dashboard yet.
            </p>
          </div>
        </div>
      </section>

      <MockEntityGrid devices={mockDevices} />
    </div>
  );
}
