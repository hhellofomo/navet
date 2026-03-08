import { ExternalLink, Github, Heart } from 'lucide-react';
import type { ThemeType } from '../../../hooks';

interface CreditsSectionProps {
  theme: ThemeType;
}

export function CreditsSection({ theme }: CreditsSectionProps) {
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
            <Heart className={`w-4 h-4 ${mutedColor}`} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${textColor}`}>Credits</h3>
            <p className={`text-xs ${subtleColor}`}>Made with ❤️ by the community</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Creator */}
        <a
          href="https://github.com/awesomestvi/"
          target="_blank"
          rel="noopener noreferrer"
          className={`block p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} ${hoverBg} transition-all group`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-white/10'} flex items-center justify-center`}
            >
              <Github className={`w-5 h-5 ${textColor}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold ${textColor}`}>awesomestvi</p>
                <ExternalLink
                  className={`w-3 h-3 ${mutedColor} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`}
                />
              </div>
              <p className={`text-xs ${subtleColor}`}>Creator & Maintainer</p>
            </div>
          </div>
        </a>

        {/* Acknowledgments */}
        <div
          className={`p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}
        >
          <p className={`text-xs font-semibold ${textColor} mb-2`}>Built with:</p>
          <div className={`text-xs ${subtleColor} space-y-1`}>
            <p>• React & TypeScript</p>
            <p>• Tailwind CSS v4</p>
            <p>• Radix UI</p>
            <p>• Smart Home Community</p>
          </div>
        </div>

        {/* Support */}
        <div
          className={`p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}
        >
          <p className={`text-xs ${textColor} mb-1`}>
            If you find this project useful, consider giving it a ⭐️ on GitHub!
          </p>
          <p className={`text-xs ${subtleColor}`}>Contributions and feedback are always welcome.</p>
        </div>
      </div>
    </section>
  );
}
