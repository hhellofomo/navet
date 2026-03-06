# Weather Widget Documentation

## Overview

The Weather Widget is a comprehensive, adaptive component that displays current weather conditions and a multi-day forecast. It follows Apple's widget design principles with intelligent layout adaptation based on card size.

## Features

### 1. Current Weather
- **Weather Icon** - Dynamic icon based on condition (sunny, cloudy, rainy, snowy, etc.)
- **Condition Text** - Descriptive weather condition
- **Current Temperature** - Large, prominent temperature display

### 2. Weather Details
- **Humidity** - Current humidity percentage with droplet icon
- **Wind Speed** - Wind speed in km/h with wind icon
- **Pressure** - Atmospheric pressure in hPa with gauge icon

### 3. Forecast Section
- **5-Day Forecast** - Full 5-day forecast in large card
- **3-Day Forecast** - Condensed 3-day forecast in medium card
- **Day Name** - Abbreviated day (Mon, Tue, Wed, etc.)
- **Condition Icon** - Weather icon for each day
- **High/Low Temperature** - Daily temperature range

## Card Sizes & Adaptive Layouts

### Small Card (1x1)
- Current weather with large temperature
- Weather icon in rounded square
- Condition text
- Compact layout optimized for glanceability

### Medium Card (2x1 or 2x2)
- Current weather display
- All weather details (humidity, wind, pressure)
- 3-day forecast
- Balanced information density

### Large Card (2x2 or larger)
- Full current weather display
- Complete weather details
- 5-day forecast with scrolling
- Spacious layout with visual dividers
- Maximum information at a glance

## Component Architecture

```
weather-card/
├── index.tsx              # Main weather card component
├── weather-icon.tsx       # Dynamic weather icon component
├── current-weather.tsx    # Current weather display
├── weather-details.tsx    # Weather details (humidity, wind, pressure)
├── weather-forecast.tsx   # 5-day forecast component
└── README.md             # This file
```

## Component Breakdown

### WeatherCard (Main Component)
The orchestrator component that arranges all sub-components based on card size.

**Props:**
```typescript
interface WeatherCardProps {
  id: string;
  location: string;
  temperature: number;
  condition: WeatherCondition | string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  forecast: ForecastDay[];
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}
```

### WeatherIcon
Renders the appropriate icon based on weather condition.

**Supported Conditions:**
- Clear/Sunny → Sun icon
- Cloudy/Overcast → Cloud icon
- Partly Cloudy → Cloud icon
- Rainy/Rain → CloudRain icon
- Snowy/Snow → CloudSnow icon
- Drizzle → CloudDrizzle icon
- Fog/Mist → CloudFog icon
- Thunderstorm/Storm → CloudLightning icon

### CurrentWeather
Displays current temperature, condition, and icon.

**Features:**
- Adaptive icon size (12-20px depending on card size)
- Rounded icon background with cyan accent
- Large temperature display (3xl-6xl)
- Condition text below temperature

### WeatherDetails
Shows humidity, wind speed, and pressure in a horizontal layout.

**Features:**
- Icon + value pairs
- Responsive spacing
- Truncation for small spaces
- Cyan accent icons

### WeatherForecast
Renders the multi-day forecast.

**Features:**
- Scrollable in large cards
- 3-day view for medium cards
- Hidden in small cards
- Hover effects on forecast items
- High/low temperature display

## Data Structure

### ForecastDay Interface
```typescript
interface ForecastDay {
  day: string;        // Abbreviated day name (Mon, Tue, Wed)
  condition: string;  // Weather condition
  high: number;       // High temperature
  low: number;        // Low temperature
}
```

### Weather Conditions Type
```typescript
type WeatherCondition = 
  | 'Clear' 
  | 'Cloudy' 
  | 'Rainy' 
  | 'Snowy' 
  | 'Drizzle' 
  | 'Fog' 
  | 'Thunderstorm' 
  | 'Partly Cloudy'
  | 'Sunny';
```

## Styling

### Color Scheme
- **Primary:** Cyan (cyan-400, cyan-500, cyan-700, cyan-900)
- **Background:** Gradient from cyan-900/40 to cyan-950/40
- **Border:** cyan-700/20
- **Accent:** cyan-500/5 overlay

### Design Principles
1. **Frosted Glass Effect** - Backdrop blur with semi-transparent backgrounds
2. **Gradient Overlays** - Subtle gradients for depth
3. **Rounded Corners** - 3xl border radius for cards, 2xl for icons
4. **Hover States** - Smooth transitions on interactive elements
5. **Typography Hierarchy** - Bold temperatures, lighter details

## Usage Example

```tsx
import { WeatherCard } from './components/weather-card';

<WeatherCard
  id="weather-1"
  location="Valencia, Spain"
  temperature={19}
  condition="Cloudy"
  humidity={65}
  windSpeed={12}
  pressure={1013}
  forecast={[
    { day: 'Mon', condition: 'Sunny', high: 22, low: 15 },
    { day: 'Tue', condition: 'Partly Cloudy', high: 21, low: 14 },
    { day: 'Wed', condition: 'Rainy', high: 18, low: 12 },
    { day: 'Thu', condition: 'Cloudy', high: 19, low: 13 },
    { day: 'Fri', condition: 'Sunny', high: 23, low: 16 },
  ]}
  size="large"
  onSizeChange={handleSizeChange}
  isEditMode={false}
/>
```

## Integration with Smart Home Systems

### Mock Data Location
`/src/app/data/mock-devices.ts`

```typescript
weather: [
  { 
    id: 'weather-1', 
    name: 'Weather', 
    location: 'Valencia, Spain', 
    temperature: 19, 
    condition: 'Cloudy', 
    humidity: 65, 
    windSpeed: 12,
    pressure: 1013,
    forecast: [
      { day: 'Mon', condition: 'Sunny', high: 22, low: 15 },
      // ... more forecast days
    ],
    size: 'large' 
  },
]
```

### API Integration (Future)
When connecting to a real weather API:

1. Update `useDevices` hook to fetch from API
2. Map API response to `WeatherDevice` type
3. Transform forecast data to match `ForecastDay[]` structure
4. Handle loading and error states

## Performance Optimizations

1. **React.memo** - All components are memoized
2. **Conditional Rendering** - Only render visible elements based on card size
3. **Scrollbar Hidden** - Uses CSS utility for clean scrolling in large cards
4. **Transition Throttling** - CSS transitions for smooth animations

## Accessibility

- Semantic HTML structure
- Icon + text for all data points
- Color contrast ratios meet WCAG AA
- Keyboard navigation support (via card interactions)

## Future Enhancements

- [ ] Hourly forecast view
- [ ] Weather alerts/warnings
- [ ] Sunrise/sunset times
- [ ] UV index
- [ ] Air quality index
- [ ] Precipitation probability
- [ ] Feels-like temperature
- [ ] Weather radar/map view
- [ ] Multiple location support
- [ ] Unit conversion (°C/°F, km/h - mph)

## Dependencies

- **lucide-react** - Icon library
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling

---

**Last Updated:** March 4, 2026  
**Version:** 1.0.0  
**Maintainer:** Navet Team
