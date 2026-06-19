import { cn, type Nullable } from "@/shared/lib";
import { Skeleton } from "@/shared/ui";
import { useMemo } from "react";
import { useWeather } from "../api/use-weather";
import { resolveWeatherCondition } from "../lib/weather-code";
import type { District } from "../model/district";
import { useCurrentDistrict } from "../model/use-current-district";
import { MAX_FAVORITES, useFavorites } from "../model/use-favorites";
import type { Coordinates } from "../model/weather";
import { WeatherBackground } from "./weather-background";
import { WeatherDetailHeader } from "./weather-detail-header";
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
      <WeatherBackground
        className="fixed inset-0 z-0 overflow-hidden"
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
          {[
            { label: "최고", value: weather.data.today.max, muted: false },
            { label: "최저", value: weather.data.today.min, muted: true },
          ].map(({ label, value, muted }) => (
            <span key={label} className="inline-flex items-baseline gap-2xs">
              <span className="text-title-sm text-meta">{label}</span>
              <span className={cn("text-temp-sm", muted ? "text-meta" : "text-ink")}>
                {Math.round(value)}°
              </span>
            </span>
          ))}
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
    <main className={cn("flex flex-1 items-center justify-center py-section", className)}>
      <div className="flex flex-col items-center gap-xs rounded-lg border border-hairline-soft bg-surface-soft p-2xl text-center">
        <h1 className="text-display-md text-ink">날씨 정보를 가져오지 못했습니다.</h1>
        <p className="text-body-md text-meta">잠시 후 다시 시도해 주세요.</p>
      </div>
    </main>
  );
}
