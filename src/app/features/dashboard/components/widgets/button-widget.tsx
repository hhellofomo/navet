import * as Dialog from '@radix-ui/react-dialog';
import { Settings2, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useI18n, useTheme } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import { getDashboardWidgetSurfaceTokens } from './widget-surface-tokens';

export interface ButtonWidgetData {
  label?: string;
  service?: string;
  entityId?: string;
}

interface ButtonWidgetProps {
  data?: ButtonWidgetData;
  onUpdate?: (data: ButtonWidgetData) => void;
  isEditMode?: boolean;
}

function ButtonSettingsDialog({
  isOpen,
  onOpenChange,
  data,
  onSave,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: ButtonWidgetData;
  onSave: (data: ButtonWidgetData) => void;
}) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const surface = getDashboardWidgetSurfaceTokens(theme);
  const [label, setLabel] = useState(data.label ?? '');
  const [service, setService] = useState(data.service ?? '');
  const [entityId, setEntityId] = useState(data.entityId ?? '');

  const handleSave = () => {
    onSave({
      label: label.trim() || undefined,
      service: service.trim() || undefined,
      entityId: entityId.trim() || undefined,
    });
    onOpenChange(false);
  };

  const inputClass = `w-full rounded-xl border px-3 py-2 text-sm outline-none ${surface.borderClassName} bg-transparent ${surface.textPrimary} placeholder:opacity-40`;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className={`fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl p-5 shadow-2xl ${surface.panelClassName}`}
        >
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className={`text-base font-semibold ${surface.textPrimary}`}>
              {t('widgets.button.configure')}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              {t('widgets.button.configure')}
            </Dialog.Description>
            <Dialog.Close className={`rounded-full p-1 ${surface.textMuted} hover:opacity-70`}>
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t('widgets.button.labelPlaceholder')}
              className={inputClass}
            />
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder={t('widgets.button.servicePlaceholder')}
              className={inputClass}
            />
            <input
              type="text"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              placeholder={t('widgets.button.entityPlaceholder')}
              className={inputClass}
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-4 w-full rounded-xl py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: getThemeColorValue('blue') }}
          >
            {t('widgets.button.configure')}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ButtonWidget({ data = {}, onUpdate, isEditMode = false }: ButtonWidgetProps) {
  const { theme, primaryColor } = useTheme();
  const { t } = useI18n();
  const surface = getDashboardWidgetSurfaceTokens(theme);
  const [isSettingsOpen, setIsSettingsOpen] = useState(!data.service);
  const [isPressed, setIsPressed] = useState(false);
  const accentHex = getThemeColorValue(primaryColor);

  const handleTap = async () => {
    if (isEditMode || !data.service) return;
    const parts = data.service.split('.');
    if (parts.length < 2) return;
    const [domain, ...rest] = parts;
    const service = rest.join('.');
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 400);
    try {
      await homeAssistantService.callService(
        domain,
        service,
        {},
        data.entityId ? { entity_id: data.entityId } : undefined
      );
    } catch {
      toast.error(`Failed to call ${data.service}`);
    }
  };

  const isConfigured = Boolean(data.service);

  return (
    <div
      className={`${surface.panelClassName} relative flex h-full flex-col items-center justify-center`}
    >
      {(isEditMode || !isConfigured) && onUpdate && (
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className={`absolute right-3 top-3 rounded-lg p-1.5 transition-opacity hover:opacity-70 ${surface.textMuted}`}
          aria-label={t('widgets.button.configure')}
        >
          <Settings2 className="h-4 w-4" />
        </button>
      )}

      <button
        type="button"
        onClick={handleTap}
        disabled={isEditMode || !isConfigured}
        className="flex flex-col items-center gap-3 transition-transform disabled:cursor-default"
        style={{ transform: isPressed ? 'scale(0.93)' : 'scale(1)' }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
          style={{
            backgroundColor: isConfigured ? `${accentHex}22` : surface.subtleFill,
            color: isConfigured ? accentHex : undefined,
          }}
        >
          <Zap className={`h-7 w-7 ${!isConfigured ? surface.textMuted : ''}`} />
        </div>
        <span
          className={`text-sm font-medium ${isConfigured ? surface.textPrimary : surface.textMuted}`}
        >
          {data.label || (isConfigured ? data.service : t('widgets.button.unconfigured'))}
        </span>
      </button>

      {onUpdate && (
        <ButtonSettingsDialog
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          data={data}
          onSave={onUpdate}
        />
      )}
    </div>
  );
}
