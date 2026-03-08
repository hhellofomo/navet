import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Lock } from 'lucide-react';
import type { ThemeType } from '../../../contexts/theme-context';
import { ImageWithFallback } from '../../shared/components/ImageWithFallback';

interface SetupWizardViewProps {
  url: string;
  token: string;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  theme: ThemeType;
  primaryColor: string;
  getColorValue: (color: string) => string;
  setUrl: (url: string) => void;
  setToken: (token: string) => void;
  handleTestConnection: () => Promise<void>;
  handleSave: () => Promise<void>;
  handleUseDemoCredentials: () => void;
}

export function SetupWizardView({
  url,
  token,
  isLoading,
  error,
  success,
  theme,
  primaryColor,
  getColorValue,
  setUrl,
  setToken,
  handleTestConnection,
  handleSave,
  handleUseDemoCredentials,
}: SetupWizardViewProps) {
  // Theme colors
  const bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]';
  const cardBg =
    theme === 'light' ? 'bg-white' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';
  const inputBg = theme === 'light' ? 'bg-gray-50' : 'bg-white/5';
  const inputBorder = theme === 'light' ? 'border-gray-300' : 'border-white/10';
  const inputFocus =
    theme === 'light'
      ? 'focus:border-gray-900 focus:ring-gray-900'
      : 'focus:border-white/20 focus:ring-white/20';

  return (
    <div className={`min-h-screen ${bgColor} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center">
            <ImageWithFallback src="/logo.svg" alt="Navet Logo" className="w-12 h-12" />
          </div>
          <h1 className={`text-2xl font-bold ${textColor}`}>Welcome to Navet</h1>
          <p className={`text-sm ${mutedColor}`}>
            Connect to your smart home system to get started
          </p>
        </div>

        {/* Setup Card */}
        <div className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
          <div className="p-6 space-y-4">
            {/* URL Input */}
            <div>
              <label
                htmlFor="smart-home-url"
                className={`text-sm font-medium ${textColor} block mb-2`}
              >
                Smart Home URL
              </label>
              <input
                id="smart-home-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setSuccess(false);
                  setError(null);
                }}
                placeholder="http://homeassistant.local:8123"
                className={`w-full px-4 py-3 rounded-xl border ${inputBorder} ${inputBg} ${textColor} text-sm ${inputFocus} focus:outline-none focus:ring-1 transition-colors`}
              />
              <p className={`text-xs ${mutedColor} mt-1.5`}>
                The full URL to your smart home instance
              </p>
            </div>

            {/* Token Input */}
            <div>
              <label
                htmlFor="access-token"
                className={`text-sm font-medium ${textColor} block mb-2`}
              >
                Long-Lived Access Token
              </label>
              <input
                id="access-token"
                type="password"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setSuccess(false);
                  setError(null);
                }}
                placeholder="Enter your access token"
                className={`w-full px-4 py-3 rounded-xl border ${inputBorder} ${inputBg} ${textColor} text-sm ${inputFocus} focus:outline-none focus:ring-1 transition-colors`}
              />
              <p className={`text-xs ${mutedColor} mt-1.5`}>
                Generate one in your smart home system under Profile → Security
              </p>
            </div>

            {/* Help Link */}
            <a
              href="https://www.home-assistant.io/docs/authentication/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-xs ${mutedColor} hover:${textColor} transition-colors`}
            >
              <Lock className="w-3 h-3" />
              <span>How to create an access token</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-500">
                  Connection successful! Click "Connect" to continue.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isLoading || !url || !token}
                  className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} ${textColor} text-sm font-medium transition-all ${
                    isLoading || !url || !token
                      ? 'opacity-50 cursor-not-allowed'
                      : `hover:bg-white/5`
                  } flex items-center justify-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading || !url || !token}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 text-white`}
                  style={{
                    backgroundColor:
                      isLoading || !url || !token ? '#6b7280' : getColorValue(primaryColor),
                    opacity: isLoading || !url || !token ? 0.5 : 1,
                    cursor: isLoading || !url || !token ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save & Continue'
                  )}
                </button>
              </div>

              <p className={`text-xs ${mutedColor} text-center`}>
                Test may fail in development due to CORS. You can skip and save directly.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={handleUseDemoCredentials}
            className={`text-xs ${mutedColor} hover:${textColor} transition-colors underline`}
          >
            Use demo credentials for development
          </button>
          <p className={`text-xs ${mutedColor}`}>
            Your credentials are stored locally and never shared
          </p>
        </div>
      </div>
    </div>
  );
}
