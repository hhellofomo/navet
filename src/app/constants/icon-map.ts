import {
  Lightbulb, Lamp, LampDesk, LampFloor, LampCeiling, LampWallDown, LampWallUp,
  SunMedium, SunDim, Sunrise, Sunset, SunMoon,
  Moon, MoonStar, Star, StarHalf,
  Zap, ZapOff, Sparkle,
  Flame, Flashlight, 
  Circle, CircleDot, CircleDashed, Orbit
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const LIGHT_ICON_MAP: Record<string, LucideIcon> = {
  'Lightbulb': Lightbulb,
  'Lamp': Lamp,
  'LampDesk': LampDesk,
  'LampFloor': LampFloor,
  'LampCeiling': LampCeiling,
  'LampWallDown': LampWallDown,
  'LampWallUp': LampWallUp,
  'Flashlight': Flashlight,
  'Flame': Flame,
  'Sun': SunMedium,
  'SunDim': SunDim,
  'Sunrise': Sunrise,
  'Sunset': Sunset,
  'SunMoon': SunMoon,
  'Moon': Moon,
  'MoonStar': MoonStar,
  'Star': Star,
  'StarHalf': StarHalf,
  'Zap': Zap,
  'ZapOff': ZapOff,
  'Sparkle': Sparkle,
  'Circle': Circle,
  'CircleDot': CircleDot,
  'CircleDashed': CircleDashed,
  'Orbit': Orbit,
};

export const DEFAULT_LIGHT_ICON = 'Zap';
