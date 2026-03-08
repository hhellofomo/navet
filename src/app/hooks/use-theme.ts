/**
 * Theme hook and derived palette utilities backed by the theme store.
 */
import { useMemo } from 'react';
import type { PrimaryColor, ThemeMode as ThemeType } from '../stores/theme-store';
import { useThemeStore } from '../stores/theme-store';

export type { PrimaryColor, ThemeType };

interface ThemeColors {
  light: {
    gradient: string;
    border: string;
    iconBg: string;
    glow: string;
  };
  hvac: {
    heating: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
    cooling: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
    off: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
  };
  media: {
    gradient: string;
    border: string;
  };
  switch: {
    on: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
    off: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
  };
  cover: {
    open: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
    closed: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
  };
  lock: {
    locked: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
    unlocked: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
  };
  person: {
    home: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
    away: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
  };
  sensor: {
    gradient: string;
    border: string;
    iconBg: string;
    accent: string;
    glow: string;
  };
  vacuum: {
    cleaning: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
    returning: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
    docked: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
    paused: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
    error: { gradient: string; border: string; iconBg: string; accent: string; glow: string };
  };
  rss: {
    gradient: string;
    border: string;
    glow: string;
  };
  calendar: {
    gradient: string;
    border: string;
    glow: string;
  };
}

interface ThemeValue {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
  wallpaper: string | null;
  setWallpaper: (wallpaper: string | null) => void;
}

const colorMap: Record<PrimaryColor, string> = {
  orange: 'orange',
  blue: 'blue',
  green: 'green',
  purple: 'purple',
  pink: 'pink',
  red: 'red',
  yellow: 'yellow',
  teal: 'teal',
};

const generateThemeColors = (themeType: ThemeType, primaryColor: PrimaryColor): ThemeColors => {
  const color = colorMap[primaryColor];

  if (themeType === 'dark') {
    return {
      light: {
        gradient: `from-${color}-900/90 to-${color}-950/95`,
        border: `border-${color}-700/30`,
        iconBg: `bg-${color}-500/20`,
        glow: `from-${color}-500/10`,
      },
      hvac: {
        heating: {
          gradient: 'from-orange-900/90 to-orange-950/95',
          border: 'border-orange-700/30',
          iconBg: 'bg-orange-500/20',
          accent: 'text-orange-400',
          glow: 'from-orange-500/10',
        },
        cooling: {
          gradient: 'from-cyan-900/90 to-cyan-950/95',
          border: 'border-cyan-700/30',
          iconBg: 'bg-cyan-500/20',
          accent: 'text-cyan-400',
          glow: 'from-cyan-500/10',
        },
        off: {
          gradient: 'from-gray-900/90 to-gray-950/95',
          border: 'border-gray-700/30',
          iconBg: 'bg-gray-500/20',
          accent: 'text-gray-300',
          glow: 'from-gray-500/10',
        },
      },
      media: {
        gradient: 'from-pink-500/10',
        border: 'border-pink-700/20',
      },
      switch: {
        on: {
          gradient: `from-${color}-900/90 to-${color}-950/95`,
          border: `border-${color}-700/30`,
          iconBg: `bg-${color}-500/20`,
          accent: `text-${color}-400`,
          glow: `from-${color}-500/10`,
        },
        off: {
          gradient: 'from-gray-900/90 to-gray-950/95',
          border: 'border-gray-700/30',
          iconBg: 'bg-gray-500/20',
          accent: 'text-gray-300',
          glow: 'from-gray-500/10',
        },
      },
      cover: {
        open: {
          gradient: `from-${color}-900/90 to-${color}-950/95`,
          border: `border-${color}-700/30`,
          iconBg: `bg-${color}-500/20`,
          accent: `text-${color}-400`,
          glow: `from-${color}-500/10`,
        },
        closed: {
          gradient: 'from-gray-900/90 to-gray-950/95',
          border: 'border-gray-700/30',
          iconBg: 'bg-gray-500/20',
          accent: 'text-gray-300',
          glow: 'from-gray-500/10',
        },
      },
      lock: {
        locked: {
          gradient: `from-${color}-900/90 to-${color}-950/95`,
          border: `border-${color}-700/30`,
          iconBg: `bg-${color}-500/20`,
          accent: `text-${color}-400`,
          glow: `from-${color}-500/10`,
        },
        unlocked: {
          gradient: 'from-red-900/90 to-red-950/95',
          border: 'border-red-700/30',
          iconBg: 'bg-red-500/20',
          accent: 'text-red-400',
          glow: 'from-red-500/10',
        },
      },
      person: {
        home: {
          gradient: `from-${color}-900/90 to-${color}-950/95`,
          border: `border-${color}-700/30`,
          iconBg: `bg-${color}-500/20`,
          accent: `text-${color}-400`,
          glow: `from-${color}-500/10`,
        },
        away: {
          gradient: 'from-gray-900/90 to-gray-950/95',
          border: 'border-gray-700/30',
          iconBg: 'bg-gray-500/20',
          accent: 'text-gray-300',
          glow: 'from-gray-500/10',
        },
      },
      sensor: {
        gradient: `from-${color}-900/90 to-${color}-950/95`,
        border: `border-${color}-700/30`,
        iconBg: `bg-${color}-500/20`,
        accent: `text-${color}-400`,
        glow: `from-${color}-500/10`,
      },
      vacuum: {
        cleaning: {
          gradient: `from-${color}-900/90 to-${color}-950/95`,
          border: `border-${color}-700/30`,
          iconBg: `bg-${color}-500/20`,
          accent: `text-${color}-400`,
          glow: `from-${color}-500/10`,
        },
        returning: {
          gradient: 'from-purple-900/90 to-purple-950/95',
          border: 'border-purple-700/30',
          iconBg: 'bg-purple-500/20',
          accent: 'text-purple-400',
          glow: 'from-purple-500/10',
        },
        docked: {
          gradient: `from-${color}-900/90 to-${color}-950/95`,
          border: `border-${color}-700/30`,
          iconBg: `bg-${color}-500/20`,
          accent: `text-${color}-400`,
          glow: `from-${color}-500/10`,
        },
        paused: {
          gradient: 'from-yellow-900/90 to-yellow-950/95',
          border: 'border-yellow-700/30',
          iconBg: 'bg-yellow-500/20',
          accent: 'text-yellow-400',
          glow: 'from-yellow-500/10',
        },
        error: {
          gradient: 'from-red-900/90 to-red-950/95',
          border: 'border-red-700/30',
          iconBg: 'bg-red-500/20',
          accent: 'text-red-400',
          glow: 'from-red-500/10',
        },
      },
      rss: {
        gradient: 'from-orange-900/90 via-red-950/95 to-red-950/95',
        border: 'border-orange-700/30',
        glow: 'from-orange-500/10',
      },
      calendar: {
        gradient: 'from-indigo-900/90 via-purple-950/95 to-purple-950/95',
        border: 'border-indigo-700/30',
        glow: 'from-indigo-500/10',
      },
    };
  }

  if (themeType === 'light') {
    return {
      light: {
        gradient: `from-${color}-100/90 to-${color}-200/80`,
        border: `border-${color}-300/60`,
        iconBg: `bg-${color}-400/40`,
        glow: `from-${color}-300/30`,
      },
      hvac: {
        heating: {
          gradient: 'from-orange-200/95 to-orange-100/90',
          border: 'border-orange-300/60',
          iconBg: 'bg-orange-400/50',
          accent: 'text-orange-600',
          glow: 'from-orange-300/30',
        },
        cooling: {
          gradient: 'from-cyan-200/95 to-cyan-100/90',
          border: 'border-cyan-300/60',
          iconBg: 'bg-cyan-400/50',
          accent: 'text-cyan-600',
          glow: 'from-cyan-300/30',
        },
        off: {
          gradient: 'from-gray-200/95 to-gray-100/90',
          border: 'border-gray-300/60',
          iconBg: 'bg-gray-400/50',
          accent: 'text-gray-600',
          glow: 'from-gray-300/30',
        },
      },
      media: {
        gradient: 'from-pink-200/80',
        border: 'border-pink-300/50',
      },
      switch: {
        on: {
          gradient: `from-${color}-200/95 to-${color}-100/90`,
          border: `border-${color}-300/60`,
          iconBg: `bg-${color}-400/50`,
          accent: `text-${color}-600`,
          glow: `from-${color}-300/30`,
        },
        off: {
          gradient: 'from-gray-200/95 to-gray-100/90',
          border: 'border-gray-300/60',
          iconBg: 'bg-gray-400/50',
          accent: 'text-gray-600',
          glow: 'from-gray-300/30',
        },
      },
      cover: {
        open: {
          gradient: `from-${color}-200/95 to-${color}-100/90`,
          border: `border-${color}-300/60`,
          iconBg: `bg-${color}-400/50`,
          accent: `text-${color}-600`,
          glow: `from-${color}-300/30`,
        },
        closed: {
          gradient: 'from-gray-200/95 to-gray-100/90',
          border: 'border-gray-300/60',
          iconBg: 'bg-gray-400/50',
          accent: 'text-gray-600',
          glow: 'from-gray-300/30',
        },
      },
      lock: {
        locked: {
          gradient: `from-${color}-200/95 to-${color}-100/90`,
          border: `border-${color}-300/60`,
          iconBg: `bg-${color}-400/50`,
          accent: `text-${color}-600`,
          glow: `from-${color}-300/30`,
        },
        unlocked: {
          gradient: 'from-red-200/95 to-red-100/90',
          border: 'border-red-300/60',
          iconBg: 'bg-red-400/50',
          accent: 'text-red-600',
          glow: 'from-red-300/30',
        },
      },
      person: {
        home: {
          gradient: `from-${color}-200/95 to-${color}-100/90`,
          border: `border-${color}-300/60`,
          iconBg: `bg-${color}-400/50`,
          accent: `text-${color}-600`,
          glow: `from-${color}-300/30`,
        },
        away: {
          gradient: 'from-gray-200/95 to-gray-100/90',
          border: 'border-gray-300/60',
          iconBg: 'bg-gray-400/50',
          accent: 'text-gray-600',
          glow: 'from-gray-300/30',
        },
      },
      sensor: {
        gradient: `from-${color}-200/95 to-${color}-100/90`,
        border: `border-${color}-300/60`,
        iconBg: `bg-${color}-400/50`,
        accent: `text-${color}-600`,
        glow: `from-${color}-300/30`,
      },
      vacuum: {
        cleaning: {
          gradient: `from-${color}-200/95 to-${color}-100/90`,
          border: `border-${color}-300/60`,
          iconBg: `bg-${color}-400/50`,
          accent: `text-${color}-600`,
          glow: `from-${color}-300/30`,
        },
        returning: {
          gradient: 'from-purple-200/95 to-purple-100/90',
          border: 'border-purple-300/60',
          iconBg: 'bg-purple-400/50',
          accent: 'text-purple-600',
          glow: 'from-purple-300/30',
        },
        docked: {
          gradient: `from-${color}-200/95 to-${color}-100/90`,
          border: `border-${color}-300/60`,
          iconBg: `bg-${color}-400/50`,
          accent: `text-${color}-600`,
          glow: `from-${color}-300/30`,
        },
        paused: {
          gradient: 'from-yellow-200/95 to-yellow-100/90',
          border: 'border-yellow-300/60',
          iconBg: 'bg-yellow-400/50',
          accent: 'text-yellow-600',
          glow: 'from-yellow-300/30',
        },
        error: {
          gradient: 'from-red-200/95 to-red-100/90',
          border: 'border-red-300/60',
          iconBg: 'bg-red-400/50',
          accent: 'text-red-600',
          glow: 'from-red-300/30',
        },
      },
      rss: {
        gradient: 'from-orange-200/95 via-red-100/90 to-red-100/85',
        border: 'border-orange-300/60',
        glow: 'from-orange-300/30',
      },
      calendar: {
        gradient: 'from-indigo-200/95 via-purple-100/90 to-purple-100/85',
        border: 'border-indigo-300/60',
        glow: 'from-indigo-300/30',
      },
    };
  }

  return {
    light: {
      gradient: `from-${color}-950 to-${color}-900`,
      border: `border-${color}-400/80`,
      iconBg: `bg-${color}-500/30`,
      glow: `from-${color}-400/20`,
    },
    hvac: {
      heating: {
        gradient: 'from-orange-950 to-orange-900',
        border: 'border-orange-400/80',
        iconBg: 'bg-orange-500/30',
        accent: 'text-orange-300',
        glow: 'from-orange-400/20',
      },
      cooling: {
        gradient: 'from-cyan-950 to-cyan-900',
        border: 'border-cyan-400/80',
        iconBg: 'bg-cyan-500/30',
        accent: 'text-cyan-300',
        glow: 'from-cyan-400/20',
      },
      off: {
        gradient: 'from-gray-950 to-gray-900',
        border: 'border-gray-400/80',
        iconBg: 'bg-gray-500/30',
        accent: 'text-gray-300',
        glow: 'from-gray-400/20',
      },
    },
    media: {
      gradient: 'from-pink-400/20',
      border: 'border-pink-400/40',
    },
    switch: {
      on: {
        gradient: `from-${color}-950 to-${color}-900`,
        border: `border-${color}-400/80`,
        iconBg: `bg-${color}-500/30`,
        accent: `text-${color}-300`,
        glow: `from-${color}-400/20`,
      },
      off: {
        gradient: 'from-gray-950 to-gray-900',
        border: 'border-gray-400/80',
        iconBg: 'bg-gray-500/30',
        accent: 'text-gray-300',
        glow: 'from-gray-400/20',
      },
    },
    cover: {
      open: {
        gradient: `from-${color}-950 to-${color}-900`,
        border: `border-${color}-400/80`,
        iconBg: `bg-${color}-500/30`,
        accent: `text-${color}-300`,
        glow: `from-${color}-400/20`,
      },
      closed: {
        gradient: 'from-gray-950 to-gray-900',
        border: 'border-gray-400/80',
        iconBg: 'bg-gray-500/30',
        accent: 'text-gray-300',
        glow: 'from-gray-400/20',
      },
    },
    lock: {
      locked: {
        gradient: `from-${color}-950 to-${color}-900`,
        border: `border-${color}-400/80`,
        iconBg: `bg-${color}-500/30`,
        accent: `text-${color}-300`,
        glow: `from-${color}-400/20`,
      },
      unlocked: {
        gradient: 'from-red-950 to-red-900',
        border: 'border-red-400/80',
        iconBg: 'bg-red-500/30',
        accent: 'text-red-300',
        glow: 'from-red-400/20',
      },
    },
    person: {
      home: {
        gradient: `from-${color}-950 to-${color}-900`,
        border: `border-${color}-400/80`,
        iconBg: `bg-${color}-500/30`,
        accent: `text-${color}-300`,
        glow: `from-${color}-400/20`,
      },
      away: {
        gradient: 'from-gray-950 to-gray-900',
        border: 'border-gray-400/80',
        iconBg: 'bg-gray-500/30',
        accent: 'text-gray-300',
        glow: 'from-gray-400/20',
      },
    },
    sensor: {
      gradient: `from-${color}-950 to-${color}-900`,
      border: `border-${color}-400/80`,
      iconBg: `bg-${color}-500/30`,
      accent: `text-${color}-300`,
      glow: `from-${color}-400/20`,
    },
    vacuum: {
      cleaning: {
        gradient: `from-${color}-950 to-${color}-900`,
        border: `border-${color}-400/80`,
        iconBg: `bg-${color}-500/30`,
        accent: `text-${color}-300`,
        glow: `from-${color}-400/20`,
      },
      returning: {
        gradient: 'from-purple-950 to-purple-900',
        border: 'border-purple-400/80',
        iconBg: 'bg-purple-500/30',
        accent: 'text-purple-300',
        glow: 'from-purple-400/20',
      },
      docked: {
        gradient: `from-${color}-950 to-${color}-900`,
        border: `border-${color}-400/80`,
        iconBg: `bg-${color}-500/30`,
        accent: `text-${color}-300`,
        glow: `from-${color}-400/20`,
      },
      paused: {
        gradient: 'from-yellow-950 to-yellow-900',
        border: 'border-yellow-400/80',
        iconBg: 'bg-yellow-500/30',
        accent: 'text-yellow-300',
        glow: 'from-yellow-400/20',
      },
      error: {
        gradient: 'from-red-950 to-red-900',
        border: 'border-red-400/80',
        iconBg: 'bg-red-500/30',
        accent: 'text-red-300',
        glow: 'from-red-400/20',
      },
    },
    rss: {
      gradient: 'from-orange-950 via-red-900 to-red-900',
      border: 'border-orange-400/80',
      glow: 'from-orange-400/20',
    },
    calendar: {
      gradient: 'from-indigo-950 via-purple-900 to-purple-900',
      border: 'border-indigo-400/80',
      glow: 'from-indigo-400/20',
    },
  };
};

export function useTheme(): ThemeValue {
  const theme = useThemeStore((state) => state.theme);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const wallpaper = useThemeStore((state) => state.wallpaper);
  const setTheme = useThemeStore((state) => state.setTheme);
  const setPrimaryColor = useThemeStore((state) => state.setPrimaryColor);
  const setWallpaper = useThemeStore((state) => state.setWallpaper);
  const colors = useMemo(() => generateThemeColors(theme, primaryColor), [theme, primaryColor]);

  return {
    theme,
    setTheme,
    colors,
    primaryColor,
    setPrimaryColor,
    wallpaper,
    setWallpaper,
  };
}
