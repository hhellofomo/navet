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

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${surface.appBg}`}>
      <div
        className={`max-w-md w-full overflow-hidden rounded-2xl border ${surface.panel} ${surface.border}`}
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
                <X className={`w-4 h-4 ${surface.textSecondary}`} />
              </button>
            )}
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${surface.textPrimary}`}>Connection Error</h3>
            <p className={`text-sm ${surface.textPrimary}`}>{error.message}</p>
            {error.details && (
              <p
                className={`rounded-lg border border-red-500/10 bg-red-500/5 p-3 font-mono text-xs ${surface.textSecondary}`}
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
          <div className={`space-y-1 text-xs ${surface.textSecondary}`}>
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
