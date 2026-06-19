import { cn } from "@/shared/lib";

type WeatherBackgroundProps = {
  className?: string;
  isDay: boolean;
  weatherCode: number;
};

export function WeatherBackground({ className, isDay, weatherCode }: WeatherBackgroundProps) {
  return (
    <div className={cn("pointer-events-none bg-page", className)} aria-hidden="true">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[68dvh] bg-linear-to-b to-transparent transition-colors duration-700",
          resolveWeatherBackgroundClassName(weatherCode, isDay),
        )}
      />
      <div className="absolute inset-0 bg-linear-to-b from-canvas/10 via-page/25 to-page" />
      <div className="absolute inset-x-0 top-0 h-[15dvh] bg-linear-to-b from-canvas/55 to-canvas/0" />
    </div>
  );
}

function resolveWeatherBackgroundClassName(weatherCode: number, isDay: boolean): string {
  if (!isDay) {
    return "from-backdrop-night/70 via-backdrop-night/30";
  }

  if (weatherCode === 0) {
    return "from-backdrop-clear/90 via-backdrop-clear/35";
  }

  if ([1, 2, 3].includes(weatherCode)) {
    return "from-backdrop-cloudy/90 via-backdrop-cloudy/35";
  }

  if ([45, 48].includes(weatherCode)) {
    return "from-backdrop-fog/95 via-backdrop-fog/40";
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return "from-backdrop-rain/85 via-backdrop-rain/35";
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return "from-backdrop-snow/95 via-backdrop-snow/45";
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return "from-backdrop-thunder/80 via-backdrop-thunder/35";
  }

  return "from-backdrop-cloudy/80 via-backdrop-cloudy/30";
}
