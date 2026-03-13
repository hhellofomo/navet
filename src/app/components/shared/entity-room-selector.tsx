import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useHomeAssistant, useTheme } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';

interface EntityRoomSelectorProps {
  entityId: string;
  label?: string;
  compact?: boolean;
  className?: string;
}

export function EntityRoomSelector({
  entityId,
  label = 'Room',
  compact = false,
  className = '',
}: EntityRoomSelectorProps) {
  const { theme } = useTheme();
  const { areas, entityRegistry } = useHomeAssistant();
  const surface = getThemeSurfaceTokens(theme);
  const [isSaving, setIsSaving] = useState(false);

  const sortedAreas = useMemo(
    () => [...areas].sort((left, right) => left.name.localeCompare(right.name)),
    [areas]
  );
  const selectedAreaId = useMemo(() => {
    return entityRegistry.find((entry) => entry.entity_id === entityId)?.area_id ?? '';
  }, [entityId, entityRegistry]);

  const baseSelectClassName = compact
    ? `h-9 rounded-xl px-3 pr-8 text-xs ${surface.textPrimary}`
    : `h-10 rounded-xl px-3 pr-8 text-sm ${surface.textPrimary}`;

  return (
    <div className={`min-w-0 ${className}`}>
      {!compact && (
        <div className={`mb-2 text-xs font-medium ${surface.textSecondary}`}>{label}</div>
      )}

      <div className="relative">
        <select
          aria-label={label}
          value={selectedAreaId}
          disabled={isSaving}
          onChange={async (event) => {
            const nextAreaId = event.target.value || null;
            const nextRoomName =
              sortedAreas.find((area) => area.area_id === nextAreaId)?.name ?? 'No room';
            setIsSaving(true);
            try {
              await homeAssistantService.updateEntityArea(entityId, nextAreaId);
              toast.success(`Card moved to ${nextRoomName}`);
            } catch {
              toast.error('Unable to update room');
            } finally {
              setIsSaving(false);
            }
          }}
          className={`w-full appearance-none border ${surface.border} ${surface.inputBg} ${baseSelectClassName} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <option value="">No room</option>
          {sortedAreas.map((area) => (
            <option key={area.area_id} value={area.area_id}>
              {area.name}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {isSaving ? (
            <Loader2 className={`h-3.5 w-3.5 animate-spin ${surface.textSecondary}`} />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className={`h-4 w-4 ${surface.textSecondary}`}
            >
              <path
                d="M5 7.5 10 12.5 15 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
