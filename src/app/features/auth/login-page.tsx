import { useState } from 'react';
import { Eye, EyeOff, Home, Key, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { useTheme } from '../../contexts/theme-context';

export function LoginPage() {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!url.trim()) {
      setError('Please enter your smart home URL');
      return;
    }
    
    if (!token.trim()) {
      setError('Please enter your access token');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (e.g., http://homeassistant.local:8123)');
      return;
    }

    setIsLoading(true);
    
    // Simulate connection test (in production, you'd actually test the connection)
    setTimeout(() => {
      login(url, token);
      setIsLoading(false);
    }, 800);
  };

  // Theme colors
  const bgPrimary = theme === 'light' 
    ? 'bg-gray-50' 
    : theme === 'contrast' 
    ? 'bg-black' 
    : 'bg-[#0f0f0f]';
  
  const cardBg = theme === 'light'
    ? 'bg-white/80'
    : theme === 'contrast'
    ? 'bg-gray-950/95'
    : 'bg-gray-900/40';
  
  const border = theme === 'light'
    ? 'border-gray-200'
    : theme === 'contrast'
    ? 'border-white/30'
    : 'border-white/10';
  
  const inputBg = theme === 'light'
    ? 'bg-gray-100'
    : theme === 'contrast'
    ? 'bg-black/50'
    : 'bg-white/5';
  
  const inputFocus = theme === 'light'
    ? 'focus:bg-white focus:border-orange-500'
    : theme === 'contrast'
    ? 'focus:bg-black/70 focus:border-orange-500'
    : 'focus:bg-white/10 focus:border-orange-500/50';
  
  const textPrimary = theme === 'light'
    ? 'text-gray-900'
    : 'text-white';
  
  const textSecondary = theme === 'light'
    ? 'text-gray-600'
    : theme === 'contrast'
    ? 'text-gray-300'
    : 'text-gray-400';
  
  const textMuted = theme === 'light'
    ? 'text-gray-500'
    : theme === 'contrast'
    ? 'text-gray-400'
    : 'text-gray-500';

  return (
    <div className={`min-h-screen ${bgPrimary} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl ${cardBg} backdrop-blur-xl border ${border} shadow-lg mb-4`}>
            <Home className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
            Navet
          </h1>
          <p className={`text-sm ${textSecondary}`}>
            Connect to your smart home
          </p>
        </div>

        {/* Login Form */}
        <div className={`${cardBg} backdrop-blur-xl border ${border} rounded-3xl shadow-2xl p-8`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                Smart Home URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Home className={`w-5 h-5 ${textMuted}`} />
                </div>
                <input
                  id="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="http://homeassistant.local:8123"
                  className={`w-full pl-12 pr-4 py-3 ${inputBg} border ${border} rounded-xl ${textPrimary} placeholder-${textMuted} transition-all ${inputFocus} outline-none`}
                  disabled={isLoading}
                />
              </div>
              <p className={`mt-2 text-xs ${textMuted}`}>
                Your smart home server address
              </p>
            </div>

            {/* Token Input */}
            <div>
              <label htmlFor="token" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                Long-Lived Access Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className={`w-5 h-5 ${textMuted}`} />
                </div>
                <input
                  id="token"
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your access token"
                  className={`w-full pl-12 pr-12 py-3 ${inputBg} border ${border} rounded-xl ${textPrimary} placeholder-${textMuted} transition-all ${inputFocus} outline-none`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center ${textMuted} hover:${textSecondary} transition-colors`}
                  disabled={isLoading}
                >
                  {showToken ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className={`mt-2 text-xs ${textMuted}`}>
                Create one in Profile → Security → Long-Lived Access Tokens
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-medium rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : (
                'Connect'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className={`mt-6 pt-6 border-t ${border}`}>
            <p className={`text-xs ${textMuted} text-center leading-relaxed`}>
              Need help? Visit your smart home instance at{' '}
              <span className={`${textSecondary} font-medium`}>/profile/security</span>{' '}
              to create a long-lived access token.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className={`text-xs ${textMuted}`}>
            Your credentials are stored locally and never shared
          </p>
        </div>
      </div>
    </div>
  );
}
