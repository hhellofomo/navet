import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = memo(function LoadingSpinner({
  message = 'Loading...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const { theme, primaryColor } = useTheme();

  const bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]';
  const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';

  const containerClasses = fullScreen
    ? `fixed inset-0 ${bgColor} flex items-center justify-center z-50`
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: getThemeColorValue(primaryColor) }}
        />
        <p className={`text-sm ${mutedColor}`}>{message}</p>
      </div>
    </div>
  );
});
