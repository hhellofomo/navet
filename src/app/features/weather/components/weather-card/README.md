# Weather Card Documentation

## Overview

The weather card is a single adaptive component that renders different information densities based on `CardSize`.

## Current Structure

```text
weather-card/
├── index.tsx        # Main weather card implementation
├── weather-icon.tsx # Shared condition icon mapping
└── README.md        # This file
```

## Card Sizes

### Extra-Small / Small

- Uses the compact layout path
- Shows location, icon, current temperature, condition, and high/low summary
- Hides timestamp, detail metrics, and forecast rows

### Medium

- Shows current temperature plus detail metrics
- Shows date/time and sun information
- Hides the multi-day forecast

### Large

- Shows the full medium layout
- Adds the forecast row

## Props

```ts
interface WeatherCardProps {
  id: string;
  location: string;
  temperature: number;
  condition: WeatherCondition | string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  sunrise: string;
  sunset: string;
  daylight: string;
  rainForecast: string;
  forecast: ForecastDay[];
  highTemp: number;
  lowTemp: number;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}
```

## Design Notes

- Uses the shared `CardWrapper`
- Uses the same edit-mode size selector pattern as other dashboard cards
- Treats `extra-small` as part of the compact rendering path
- Keeps the weather icon in the header trailing slot for this feature’s layout

## Maintenance Notes

- Update this README when card size behavior changes
- If the component is split into subcomponents again, update the structure section to match the real folder contents
