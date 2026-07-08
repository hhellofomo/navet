import { ExternalLink, FileText, Scale } from 'lucide-react';
import type { ThemeType } from '../../../contexts/theme-context';

interface LicenseSectionProps {
  theme: ThemeType;
  showLicense: boolean;
  setShowLicense: (show: boolean) => void;
}

export function LicenseSection({ theme, showLicense, setShowLicense }: LicenseSectionProps) {
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
            <Scale className={`w-4 h-4 ${mutedColor}`} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${textColor}`}>License</h3>
            <p className={`text-xs ${subtleColor}`}>CC BY-NC-SA 4.0</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div
          className={`p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}
        >
          <p className={`text-xs ${textColor} mb-2`}>
            This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike
            4.0 International License.
          </p>
          <p className={`text-xs ${subtleColor}`}>
            Free for personal, educational, and non-profit use. Commercial use requires a separate
            license.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLicense(!showLicense)}
          className={`w-full p-3 rounded-xl border ${borderColor} ${hoverBg} transition-all text-left flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <FileText className={`w-4 h-4 ${mutedColor}`} />
            <span className={`text-sm ${textColor}`}>View Full License</span>
          </div>
          <ExternalLink className={`w-3.5 h-3.5 ${mutedColor}`} />
        </button>

        {showLicense && (
          <div
            className={`p-4 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} max-h-64 overflow-y-auto`}
          >
            <div className={`text-xs ${textColor} space-y-3 leading-relaxed`}>
              <div>
                <p className="font-semibold mb-1">You are free to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong>Share</strong> — copy and redistribute the material
                  </li>
                  <li>
                    <strong>Adapt</strong> — remix, transform, and build upon the material
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">Under the following terms:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong>Attribution</strong> — You must give appropriate credit
                  </li>
                  <li>
                    <strong>NonCommercial</strong> — You may not use the material for commercial
                    purposes
                  </li>
                  <li>
                    <strong>ShareAlike</strong> — If you remix or build upon the material, you must
                    distribute your contributions under the same license
                  </li>
                </ul>
              </div>
              <div className="pt-2 border-t border-white/10">
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Read the full legal code →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
