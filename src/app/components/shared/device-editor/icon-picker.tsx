import {
  Circle,
  CircleDashed,
  CircleDot,
  Flame,
  Flashlight,
  Lamp,
  LampCeiling,
  LampDesk,
  LampFloor,
  LampWallDown,
  LampWallUp,
  Lightbulb,
  Moon,
  MoonStar,
  Orbit,
  Search,
  Sparkle,
  Sparkles,
  Star,
  StarHalf,
  Sun,
  SunDim,
  SunMedium,
  SunMoon,
  Sunrise,
  Sunset,
  Zap,
  ZapOff,
} from 'lucide-react';
import { memo, useState } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';
import { getDeviceEditorSurfaceTokens } from './device-editor-surface-tokens';

interface IconPickerProps {
  selectedIcon: string;
  onIconChange: (iconName: string) => void;
  isLightOn: boolean;
}

// Comprehensive light-related icons from Lucide React
const lightIcons = [
  // Primary light bulbs
  { name: 'Lightbulb', component: Lightbulb, label: 'Light Bulb' },
  { name: 'Lamp', component: Lamp, label: 'Table Lamp' },

  // Lamps and fixtures
  { name: 'LampDesk', component: LampDesk, label: 'Desk Lamp' },
  { name: 'LampFloor', component: LampFloor, label: 'Floor Lamp' },
  { name: 'LampCeiling', component: LampCeiling, label: 'Ceiling Light' },
  { name: 'LampWallDown', component: LampWallDown, label: 'Wall Light Down' },
  { name: 'LampWallUp', component: LampWallUp, label: 'Wall Light Up' },
  { name: 'Flashlight', component: Flashlight, label: 'Flashlight' },

  // Fire and flames
  { name: 'Flame', component: Flame, label: 'Flame' },

  // Natural light - Sun
  { name: 'Sun', component: Sun, label: 'Sun' },
  { name: 'SunMedium', component: SunMedium, label: 'Sun Medium' },
  { name: 'SunDim', component: SunDim, label: 'Sun Dim' },
  { name: 'Sunrise', component: Sunrise, label: 'Sunrise' },
  { name: 'Sunset', component: Sunset, label: 'Sunset' },
  { name: 'SunMoon', component: SunMoon, label: 'Sun & Moon' },

  // Natural light - Moon & Stars
  { name: 'Moon', component: Moon, label: 'Moon' },
  { name: 'MoonStar', component: MoonStar, label: 'Moon & Star' },
  { name: 'Star', component: Star, label: 'Star' },
  { name: 'StarHalf', component: StarHalf, label: 'Half Star' },

  // Electric/Energy
  { name: 'Zap', component: Zap, label: 'Lightning' },
  { name: 'ZapOff', component: ZapOff, label: 'Lightning Off' },
  { name: 'Sparkles', component: Sparkles, label: 'Sparkles' },
  { name: 'Sparkle', component: Sparkle, label: 'Sparkle' },

  // Abstract/Shapes (for LED strips, ambient lights)
  { name: 'Circle', component: Circle, label: 'Circle' },
  { name: 'CircleDot', component: CircleDot, label: 'Circle Dot' },
  { name: 'CircleDashed', component: CircleDashed, label: 'Dashed Circle' },
  { name: 'Orbit', component: Orbit, label: 'Orbit' },
];

export const IconPicker = memo(function IconPicker({
  selectedIcon,
  onIconChange,
  isLightOn,
}: IconPickerProps) {
  const { primaryColor } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const activeColor = getThemeColorValue(primaryColor);
  const editorSurface = getDeviceEditorSurfaceTokens(isLightOn);

  // Filter icons based on search query
  const filteredIcons = searchQuery
    ? lightIcons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          icon.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : lightIcons;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-sm font-medium transition-colors duration-500 ${editorSurface.sectionLabelClassName}`}
        >
          Light Icon
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search
          className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-500 ${editorSurface.closeIconClassName}`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search icons..."
          className={`w-full rounded-xl border py-2 pl-10 pr-4 text-sm transition-all duration-500 focus:outline-none focus:ring-2 ${
            isLightOn
              ? 'border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:bg-white/10 focus:ring-transparent'
              : 'border-white/5 bg-white/[0.02] text-gray-500 placeholder:text-gray-700 focus:border-gray-500/30 focus:bg-white/5 focus:ring-gray-500/20'
          }`}
          style={
            isLightOn
              ? {
                  borderColor: searchQuery ? `${activeColor}4d` : undefined,
                  boxShadow: searchQuery ? `0 0 0 2px ${activeColor}26` : undefined,
                }
              : undefined
          }
        />
      </div>

      {/* Icon Grid */}
      <div className="grid grid-cols-6 gap-3">
        {filteredIcons.map((icon) => {
          const IconComponent = icon.component;
          return (
            <button
              type="button"
              key={icon.name}
              onClick={() => onIconChange(icon.name)}
              disabled={!isLightOn}
              className={`w-full aspect-square rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                selectedIcon === icon.name
                  ? isLightOn
                    ? 'scale-105'
                    : 'bg-gray-500/20 border-gray-500/50'
                  : isLightOn
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105'
                    : `bg-white/[0.02] border-white/5 ${editorSurface.disabledCircleClassName}`
              }`}
              style={
                selectedIcon === icon.name && isLightOn
                  ? {
                      backgroundColor: `${activeColor}30`,
                      borderColor: activeColor,
                      boxShadow: `0 10px 20px -12px ${activeColor}80`,
                    }
                  : undefined
              }
              title={icon.label}
            >
              <IconComponent
                className={`w-5 h-5 transition-colors duration-500 ${
                  selectedIcon === icon.name ? '' : editorSurface.closeIconClassName
                }`}
                style={selectedIcon === icon.name && isLightOn ? { color: '#ffffff' } : undefined}
              />
            </button>
          );
        })}
      </div>

      {/* No results message */}
      {searchQuery && filteredIcons.length === 0 && (
        <div
          className={`py-8 text-center transition-colors duration-500 ${editorSurface.sectionLabelClassName}`}
        >
          <p className="text-sm">No icons found</p>
          <p className="text-xs mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
});
