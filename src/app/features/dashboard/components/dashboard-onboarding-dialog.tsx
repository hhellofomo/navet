import { Layers3, Sparkles } from 'lucide-react';
import { useTheme } from '@/app/hooks';
import { getThemeColorValue } from '@/app/utils/theme-colors';

interface DashboardOnboardingDialogProps {
  open: boolean;
  onChooseAll: () => void;
  onChooseBlank: () => void;
}

export function DashboardOnboardingDialog({
  open,
  onChooseAll,
  onChooseBlank,
}: DashboardOnboardingDialogProps) {
  const { theme, primaryColor } = useTheme();

  if (!open) return null;

  const accentColor = getThemeColorValue(primaryColor);
  const bgColor =
    theme === 'light' ? 'bg-white/95 border-gray-200/80' : 'bg-gray-950/95 border-white/10';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const cardBg =
    theme === 'light' ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white/5 hover:bg-white/10';
  const borderColor = theme === 'light' ? 'border-gray-200/80' : 'border-white/10';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className={`w-full max-w-2xl rounded-[32px] border ${bgColor} p-6 shadow-2xl md:p-8`}>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${mutedColor}`}>
          Welcome
        </p>
        <h2 className={`mt-3 text-3xl font-semibold tracking-tight ${textColor}`}>
          How should Navet start your dashboard?
        </h2>
        <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${mutedColor}`}>
          Pick a starting point once. After that, the dashboard just uses hide and show for
          entities.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={onChooseAll}
            className={`rounded-[28px] border ${borderColor} ${cardBg} p-6 text-left transition-colors`}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${accentColor}22` }}
            >
              <Sparkles className="h-5 w-5" style={{ color: accentColor }} />
            </div>
            <h3 className={`mt-5 text-lg font-semibold ${textColor}`}>Start with all entities</h3>
            <p className={`mt-2 text-sm leading-relaxed ${mutedColor}`}>
              Show everything Home Assistant exposes, then hide what you do not want.
            </p>
          </button>

          <button
            type="button"
            onClick={onChooseBlank}
            className={`rounded-[28px] border ${borderColor} ${cardBg} p-6 text-left transition-colors`}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${accentColor}22` }}
            >
              <Layers3 className="h-5 w-5" style={{ color: accentColor }} />
            </div>
            <h3 className={`mt-5 text-lg font-semibold ${textColor}`}>
              Start with a blank dashboard
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${mutedColor}`}>
              Start with an empty dashboard, then add back only the entities you want from Add
              Entity.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
