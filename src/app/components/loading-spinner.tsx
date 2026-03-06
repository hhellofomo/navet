import { Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message = 'Loading...', fullScreen = false }: LoadingSpinnerProps) {
  const { theme, primaryColor } = useTheme();

  const bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

  const getColorValue = (color: string): string => {
    const colors: Record<string, string> = {
      orange: '#f97316',
      blue: '#3b82f6',
      green: '#22c55e',
      purple: '#a855f7',
      pink: '#ec4899',
      red: '#ef4444',
      yellow: '#eab308',
      teal: '#14b8a6',
    };
    return colors[color] || colors.orange;
  };

  const containerClasses = fullScreen
    ? `fixed inset-0 ${bgColor} flex items-center justify-center z-50`
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 
          className="w-8 h-8 animate-spin" 
          style={{ color: getColorValue(primaryColor) }}
        />
        <p className={`text-sm ${mutedColor}`}>{message}</p>
      </div>
    </div>
  );
}
