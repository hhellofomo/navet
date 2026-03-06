import { Info } from 'lucide-react';
import type { ThemeType } from '../../../contexts/theme-context';

interface AboutSectionProps {
  theme: ThemeType;
}

export function AboutSection({ theme }: AboutSectionProps) {
  const cardBg =
    theme === 'light' ? 'bg-white' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const subtleColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';

  return (
    <section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
          >
            <Info className={`w-4 h-4 ${mutedColor}`} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${textColor}`}>About</h3>
            <p className={`text-xs ${subtleColor}`}>Dashboard information</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${mutedColor}`}>Version</span>
          <span className={`text-sm font-medium ${textColor}`}>1.0.0</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${mutedColor}`}>Build</span>
          <span className={`text-sm font-medium ${textColor}`}>March 2026</span>
        </div>
      </div>
    </section>
  );
}
