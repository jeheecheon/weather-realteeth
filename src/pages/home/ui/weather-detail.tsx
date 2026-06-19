import { cn, type Nullable } from "@/shared/lib";
import { Button, Skeleton } from "@/shared/ui";
import { PanelLeftIcon, StarIcon } from "lucide-react";
import { useMemo } from "react";
import { useWeather } from "../api/use-weather";
import { resolveWeatherCondition } from "../lib/weather-code";
import type { District } from "../model/district";
import { useCurrentDistrict } from "../model/use-current-district";
import { MAX_FAVORITES, useFavorites } from "../model/use-favorites";
import type { Coordinates } from "../model/weather";
import { HourlyForecastTile, WeatherMetricTiles, WeeklyForecastTile } from "./weather-tiles";

type WeatherDetailProps = {
  className?: string;
  coordinates: Coordinates;
  activeDistrict: Nullable<District>;
  onFavoritePanelToggle: () => void;
};

const HOURLY_FORECAST_LIMIT = 24;

export function WeatherDetail({
  className,
  coordinates,
  activeDistrict,
  onFavoritePanelToggle,
}: WeatherDetailProps) {
  const weather = useWeather(coordinates);
  const { favorites, toggleFavorite } = useFavorites();
  const hourlyForecast = useMemo(
    () => weather.data.hourly.slice(0, HOURLY_FORECAST_LIMIT),
    [weather.data],
  );
  const currentDistrict = useCurrentDistrict(coordinates);

  const district = activeDistrict ?? currentDistrict;
  const condition = resolveWeatherCondition(
    weather.data.current.weatherCode,
    weather.data.current.isDay,
  );
  const favorite = favorites.find((item) => item.name === district.name);
  const isFavorite = favorite != null;
  const placeName = favorite?.alias ?? district.name;

  return (
    <main className={cn("flex flex-col gap-xl pb-xl", className)}>
      <WeatherBackdrop
        isDay={weather.data.current.isDay}
        weatherCode={weather.data.current.weatherCode}
      />

      <WeatherDetailHeader
        className="relative z-10"
        isFavorite={isFavorite}
        isFavoriteToggleDisabled={!isFavorite && favorites.length >= MAX_FAVORITES}
        onFavoritePanelToggle={onFavoritePanelToggle}
        onFavoriteToggle={handleFavoriteToggle}
      />

      <section className="relative z-10 flex flex-col items-center gap-xs text-center">
        <h1 className="text-display-xl text-ink">{placeName}</h1>
        <p className="text-temp-hero text-ink">{Math.round(weather.data.current.temperature)}°</p>
        <div className="flex items-center gap-xs">
          <condition.Icon className="size-6 text-ink" />
          <span className="text-title-md text-body">{condition.label}</span>
        </div>
        <div className="flex gap-md">
          <TemperatureLabel label="최고" value={weather.data.today.max} />
          <TemperatureLabel label="최저" value={weather.data.today.min} muted />
        </div>
      </section>

      <div className="relative z-10 grid grid-cols-2 gap-md md:grid-cols-3">
        <HourlyForecastTile className="col-span-2 md:col-span-3" hourly={hourlyForecast} />
        <WeeklyForecastTile
          className="col-span-2 md:col-span-1 md:row-span-4"
          daily={weather.data.daily}
        />
        <WeatherMetricTiles current={weather.data.current} today={weather.data.today} />
      </div>
    </main>
  );

  function handleFavoriteToggle() {
    toggleFavorite({ ...district, alias: null });
  }
}

type WeatherBackdropProps = {
  className?: string;
  isDay: boolean;
  weatherCode: number;
};

function WeatherBackdrop({ className, isDay, weatherCode }: WeatherBackdropProps) {
  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden bg-page", className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[68dvh] bg-gradient-to-b to-transparent transition-colors duration-700",
          resolveWeatherBackdropClassName(weatherCode, isDay),
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/10 via-page/25 to-page" />
      <div className="absolute inset-x-0 top-0 h-[15dvh] bg-gradient-to-b from-canvas/55 to-canvas/0" />
    </div>
  );
}

function resolveWeatherBackdropClassName(weatherCode: number, isDay: boolean): string {
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

type WeatherDetailHeaderProps = {
  className?: string;
  isFavorite: boolean;
  isFavoriteToggleDisabled: boolean;
  onFavoritePanelToggle: () => void;
  onFavoriteToggle: () => void;
};

function WeatherDetailHeader({
  className,
  isFavorite,
  isFavoriteToggleDisabled,
  onFavoritePanelToggle,
  onFavoriteToggle,
}: WeatherDetailHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-md", className)}>
      <div className="flex items-center gap-xs">
        <Button
          size="icon"
          variant="secondary"
          aria-label="사이드바 토글"
          onClick={onFavoritePanelToggle}
        >
          <PanelLeftIcon />
        </Button>
        <Button
          size="icon"
          variant={isFavorite ? "default" : "secondary"}
          disabled={isFavoriteToggleDisabled}
          aria-label={isFavorite ? "즐겨찾기 삭제" : "즐겨찾기 추가"}
          onClick={onFavoriteToggle}
        >
          <StarIcon className={cn(isFavorite && "fill-current")} />
        </Button>
      </div>
    </div>
  );
}

type WeatherDetailSkeletonProps = {
  className?: string;
};

export function WeatherDetailSkeleton({ className }: WeatherDetailSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-xl pb-xl", className)}>
      <div className="flex items-center justify-between gap-md">
        <Skeleton className="size-10 rounded-md" />
        <Skeleton className="h-5 w-28 rounded-md" />
      </div>

      <div className="flex flex-col items-center gap-xs">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-10 w-44 rounded-md" />
        <Skeleton className="h-16 w-32 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-6 w-40 rounded-md" />
      </div>

      <div className="grid grid-cols-2 gap-md md:grid-cols-3">
        <Skeleton className="col-span-2 h-32 rounded-lg md:col-span-3" />
        <Skeleton className="col-span-2 h-80 rounded-lg md:col-span-1 md:row-span-4" />
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

type WeatherDetailErrorProps = {
  className?: string;
};

export function WeatherDetailError({ className }: WeatherDetailErrorProps) {
  return (
    <main className={cn("flex min-h-[480px] flex-col gap-lg", className)}>
      <WeatherMessage
        title="날씨 정보를 가져오지 못했습니다."
        description="잠시 후 다시 시도해 주세요."
      />
    </main>
  );
}

type WeatherMessageProps = {
  className?: string;
  description: string;
  title: string;
};

function WeatherMessage({ className, description, title }: WeatherMessageProps) {
  return (
    <div
      className={cn(
        "flex min-h-80 flex-1 flex-col items-center justify-center gap-xs text-center",
        className,
      )}
    >
      <h1 className="text-display-md text-ink">{title}</h1>
      <p className="max-w-md text-body-sm text-meta">{description}</p>
    </div>
  );
}

type TemperatureLabelProps = {
  className?: string;
  label: string;
  muted?: boolean;
  value: number;
};

function TemperatureLabel({ className, label, muted = false, value }: TemperatureLabelProps) {
  return (
    <span className={cn("inline-flex items-baseline gap-2xs", className)}>
      <span className="text-title-sm text-meta">{label}</span>
      <span className={cn("text-temp-sm", muted ? "text-meta" : "text-ink")}>
        {Math.round(value)}°
      </span>
    </span>
  );
}
