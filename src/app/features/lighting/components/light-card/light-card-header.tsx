import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '@/app/contexts/theme-context';

interface LightCardHeaderProps {
  name: string;
  isOn: boolean;
  IconComponent: LucideIcon;
  size: 'small' | 'medium' | 'large';
}

export const LightCardHeader = memo(function LightCardHeader({
  name,
  isOn,
  IconComponent,
  size,
}: LightCardHeaderProps) {
  const { theme, primaryColor } = useTheme();
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const titleSize = size === 'small' ? 'text-xs' : 'text-sm';
  const badgeSize = size === 'small' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
  const marginBottom = size === 'small' ? 'mb-2' : 'mb-2';
  const colorMap = {
    orange: { bg: 'rgba(249, 115, 22, 0.24)', text: '#c2410c' },
    blue: { bg: 'rgba(59, 130, 246, 0.24)', text: '#1d4ed8' },
    green: { bg: 'rgba(34, 197, 94, 0.24)', text: '#15803d' },
    purple: { bg: 'rgba(168, 85, 247, 0.24)', text: '#7e22ce' },
    pink: { bg: 'rgba(236, 72, 153, 0.24)', text: '#be185d' },
    red: { bg: 'rgba(239, 68, 68, 0.24)', text: '#b91c1c' },
    yellow: { bg: 'rgba(234, 179, 8, 0.24)', text: '#a16207' },
    teal: { bg: 'rgba(20, 184, 166, 0.24)', text: '#0f766e' },
  } as const;
  const activeColor = colorMap[primaryColor];

  return (
    <div className={`flex items-start justify-between ${marginBottom}`}>
      <div className="min-w-0 flex-1">
        <h3 className={`font-semibold ${titleSize} ${textColor} truncate`}>{name}</h3>
        <p className="text-[10px] text-gray-400 truncate mt-0.5">Light</p>
      </div>
      <div
        className={`${badgeSize} rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
          !isOn && theme === 'light' ? 'bg-gray-300/70' : !isOn ? 'bg-white/10' : ''
        }`}
        style={
          isOn
            ? { backgroundColor: theme === 'light' ? `${activeColor.text}66` : activeColor.bg }
            : undefined
        }
      >
        <IconComponent
          aria-hidden="true"
          className={`${iconSize} transition-colors duration-500 ${
            !isOn && theme === 'light' ? 'text-gray-600' : !isOn ? 'text-gray-500' : ''
          }`}
          style={
            isOn ? { color: theme === 'light' ? activeColor.text : activeColor.text } : undefined
          }
        />
      </div>
    </div>
  );
});
