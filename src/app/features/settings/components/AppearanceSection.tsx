import { Image as ImageIcon, Palette, X } from 'lucide-react';
import type { PrimaryColorOption, ThemeOption } from '../../../constants/theme-options';
import type { PrimaryColor, ThemeType } from '../../../hooks';
import { readFileAsDataUrl, validateImageFile } from '../../../utils/image-upload';

interface AppearanceSectionProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
  wallpaper: string | null;
  setWallpaper: (wallpaper: string | null) => void;
  themeOptions: ThemeOption[];
  colorOptions: PrimaryColorOption[];
  getColorValue: (color: PrimaryColor) => string;
}

export function AppearanceSection({
  theme,
  setTheme,
  primaryColor,
  setPrimaryColor,
  wallpaper,
  setWallpaper,
  themeOptions,
  colorOptions,
  getColorValue,
}: AppearanceSectionProps) {
  const cardBg =
    theme === 'light' ? 'bg-white' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const subtleColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5';

  const handleWallpaperUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setWallpaper(await readFileAsDataUrl(file));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to read image file');
    }
  };

  const handleRemoveWallpaper = () => {
    setWallpaper(null);
  };

  return (
    <section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
          >
            <Palette className={`w-4 h-4 ${mutedColor}`} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${textColor}`}>Appearance</h3>
            <p className={`text-xs ${subtleColor}`}>Customize colors and theme</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Theme Mode */}
        <div>
          <label htmlFor="theme-mode" className={`text-xs font-medium ${textColor} block mb-2`}>
            Theme Mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {themeOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`
                  p-3 rounded-xl border transition-all text-left
                  ${theme === option.value ? 'border-2' : `${borderColor} ${hoverBg}`}
                `}
                style={
                  theme === option.value
                    ? {
                        backgroundColor: `${getColorValue(primaryColor)}1a`,
                        borderColor: getColorValue(primaryColor),
                      }
                    : {}
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span
                      className={`font-medium text-xs block mb-0.5 ${theme === option.value ? '' : textColor}`}
                      style={theme === option.value ? { color: getColorValue(primaryColor) } : {}}
                    >
                      {option.label}
                    </span>
                    <p className={`text-[10px] ${mutedColor} leading-tight`}>
                      {option.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                    {theme === option.value && (
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: getColorValue(primaryColor) }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <label htmlFor="primary-color" className={`text-xs font-medium ${textColor} block mb-2`}>
            Primary Color
          </label>
          <p className={`text-xs ${subtleColor} mb-3`}>
            Choose a color that will be used for active states throughout your dashboard
          </p>
          <div className="flex items-center gap-2.5">
            {colorOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setPrimaryColor(option.value)}
                className={`w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0 ${
                  primaryColor === option.value
                    ? `ring-2 ${theme === 'light' ? 'ring-black/30' : 'ring-white/40'} ring-offset-2 ${theme === 'light' ? 'ring-offset-white' : 'ring-offset-gray-900'}`
                    : 'hover:scale-110'
                }`}
                style={{
                  backgroundColor: option.color,
                }}
                title={option.label}
              />
            ))}
          </div>
        </div>

        {/* Background Wallpaper */}
        <div>
          <label htmlFor="wallpaper" className={`text-xs font-medium ${textColor} block mb-2`}>
            Background Wallpaper
          </label>
          <p className={`text-xs ${subtleColor} mb-3`}>
            Upload an image that will blend with your theme color for a harmonized look
          </p>

          {wallpaper ? (
            <div className="relative">
              <div
                className="w-full h-32 rounded-xl border overflow-hidden relative"
                style={{ borderColor: `${getColorValue(primaryColor)}40` }}
              >
                <img
                  src={wallpaper}
                  alt="Wallpaper preview"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-br"
                  style={{
                    background: `linear-gradient(135deg, ${getColorValue(primaryColor)}60, ${getColorValue(primaryColor)}20)`,
                    mixBlendMode: theme === 'light' ? 'multiply' : 'screen',
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveWallpaper}
                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                  theme === 'light' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                } hover:scale-110 transition-all shadow-lg`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label
              className={`w-full h-32 rounded-xl border-2 border-dashed ${borderColor} flex flex-col items-center justify-center cursor-pointer transition-all ${hoverBg}`}
            >
              <ImageIcon className={`w-8 h-8 ${mutedColor} mb-2`} />
              <span className={`text-xs ${textColor} mb-1`}>Click to upload</span>
              <span className={`text-[10px] ${subtleColor}`}>PNG, JPG up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleWallpaperUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </section>
  );
}
