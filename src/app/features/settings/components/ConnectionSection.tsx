import { ExternalLink, Server, Settings2 } from 'lucide-react';
import type { ThemeType } from '../../../contexts/theme-context';

interface ConnectionSectionProps {
  theme: ThemeType;
  config: { url: string; token: string } | null;
  handleResetConnection: () => void;
}

export function ConnectionSection({
  theme,
  config,
  handleResetConnection,
}: ConnectionSectionProps) {
  const cardBg =
    theme === 'light' ? 'bg-white' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const subtleColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5';

  return (
    <section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
          >
            <Server className={`w-4 h-4 ${mutedColor}`} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${textColor}`}>Connection</h3>
            <p className={`text-xs ${subtleColor}`}>Smart home instance</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div
          className={`p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}
        >
          <p className={`text-xs ${subtleColor} mb-1.5`}>Connected to</p>
          <p className={`text-sm ${textColor} font-mono break-all`}>
            {config?.url || 'Not connected'}
          </p>
        </div>

        {/* Link to Smart Home */}
        {config?.url && (
          <a
            href={config.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} ${hoverBg} transition-all group`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-medium ${textColor}`}>Open Smart Home</p>
                  <ExternalLink
                    className={`w-3.5 h-3.5 ${mutedColor} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`}
                  />
                </div>
                <p className={`text-xs ${subtleColor}`}>
                  Configure devices, automations, and advanced settings
                </p>
              </div>
            </div>
          </a>
        )}

        {/* Reset Connection Button */}
        {config?.url && (
          <button
            type="button"
            onClick={handleResetConnection}
            className={`w-full p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} ${hoverBg} transition-all text-left flex items-center gap-3`}
          >
            <Settings2 className={`w-4 h-4 ${mutedColor}`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${textColor}`}>Reset Connection</p>
              <p className={`text-xs ${subtleColor}`}>Change smart home URL or token</p>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
