import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useError } from '@/app/contexts/error-context';
import { useTheme } from '@/app/hooks';

interface ErrorDisplayProps {
  onRetry?: () => void;
  showClose?: boolean;
}

export const ErrorDisplay = memo(function ErrorDisplay({
  onRetry,
  showClose = true,
}: ErrorDisplayProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const { error, clearError } = useError();

  if (!error) return null;

  const bgColor = surface.appBg;
  const cardBg = theme === 'light' ? 'bg-white' : surface.panel;
  const textColor = surface.textPrimary;
  const mutedColor = surface.textSecondary;
  const borderColor = surface.border;

  return (
    <div className={`fixed inset-0 ${bgColor} flex items-center justify-center z-50 p-4`}>
      <div
        className={`${cardBg} rounded-2xl border ${borderColor} max-w-md w-full overflow-hidden`}
      >
        <div className="p-6 space-y-4">
          {/* Icon and Close Button */}
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            {showClose && (
              <button
                type="button"
                onClick={clearError}
                className={`w-8 h-8 rounded-lg ${surface.hoverBg} flex items-center justify-center transition-colors`}
              >
                <X className={`w-4 h-4 ${mutedColor}`} />
              </button>
            )}
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${textColor}`}>Connection Error</h3>
            <p className={`text-sm ${textColor}`}>{error.message}</p>
            {error.details && (
              <p
                className={`text-xs ${mutedColor} font-mono bg-red-500/5 p-3 rounded-lg border border-red-500/10`}
              >
                {error.details}
              </p>
            )}
          </div>

          {/* Action Button */}
          {onRetry && (
            <button
              type="button"
              onClick={() => {
                clearError();
                onRetry();
              }}
              className="w-full px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          )}

          {/* Help Text */}
          <div className={`text-xs ${mutedColor} space-y-1`}>
            <p className="font-medium">Common issues:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Smart home system is not running or unreachable</li>
              <li>Incorrect URL or access token</li>
              <li>Network connectivity issues</li>
              <li>CORS or firewall blocking the connection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
