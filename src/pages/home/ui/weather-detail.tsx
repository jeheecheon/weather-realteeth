import { cn, type Nullable } from "@/shared/lib";
import { Button, Skeleton } from "@/shared/ui";
import { LocateFixedIcon, PanelLeftIcon } from "lucide-react";
import { useMemo } from "react";
import { useWeather } from "../api/use-weather";
import { resolveWeatherCondition } from "../lib/weather-code";
import type { District } from "../model/district";
import { useFavorites } from "../model/use-favorites";
import type { Coordinates, HourlyWeather } from "../model/weather";

type WeatherDetailProps = {
  className?: string;
  coordinates: Coordinates;
  district: Nullable<District>;
  onToggleFavorites: () => void;
};

const HOURLY_FORECAST_LIMIT = 12;

export function WeatherDetail({
  className,
  coordinates,
  district,
  onToggleFavorites,
}: WeatherDetailProps) {
  const weather = useWeather(coordinates);
  const { favorites } = useFavorites();
  const condition = resolveWeatherCondition(weather.data);
  const hourlyForecast = useMemo(
    () => weather.data.hourly.slice(0, HOURLY_FORECAST_LIMIT),
    [weather.data],
  );
  const favorite = district ? favorites.find((item) => item.name === district.name) : undefined;
  const placeName = favorite?.alias ?? district?.name ?? "현재 위치";

  return (
    <main className={cn("flex min-h-[720px] flex-col gap-lg", className)}>
      <WeatherDetailHeader district={district} onToggleFavorites={onToggleFavorites} />

      <section className="flex flex-1 flex-col gap-xl rounded-xl border border-hairline bg-canvas p-lg shadow-raised md:p-xl">
        <div className="flex flex-1 flex-col gap-xl">
          <div className="flex flex-col gap-lg md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-sm">
              <div>
                <p className="text-title-sm text-meta">
                  {district ? "선택한 장소" : "감지된 위치"}
                </p>
                <h1 className="mt-2xs text-display-xl text-ink">{placeName}</h1>
              </div>
              <div className="flex items-center gap-md">
                <condition.Icon className="size-10 text-ink" />
                <span className="text-title-md text-body">{condition.label}</span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-sm md:items-end">
              <p className="text-temp-hero text-ink">
                {Math.round(weather.data.current.temperature)}°
              </p>
              <div className="flex gap-md">
                <TemperatureLabel label="최고" value={weather.data.daily.max} />
                <TemperatureLabel label="최저" value={weather.data.daily.min} muted />
              </div>
            </div>
          </div>

          <HourlyForecast hourlyForecast={hourlyForecast} />
        </div>
      </section>
    </main>
  );
}

type WeatherDetailHeaderProps = {
  className?: string;
  district: Nullable<District>;
  onToggleFavorites: () => void;
};

function WeatherDetailHeader({ className, district, onToggleFavorites }: WeatherDetailHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-md", className)}>
      <Button
        className="hidden desktop:inline-flex"
        size="icon"
        variant="secondary"
        aria-label="사이드바 토글"
        onClick={onToggleFavorites}
      >
        <PanelLeftIcon />
      </Button>
      <Button
        className="desktop:hidden"
        size="icon"
        variant="secondary"
        aria-label="즐겨찾기 열기"
        onClick={onToggleFavorites}
      >
        <PanelLeftIcon />
      </Button>
      {!district && (
        <span className="inline-flex items-center gap-2xs text-caption text-meta">
          <LocateFixedIcon className="size-[16px]" />
          현재 위치 기준
        </span>
      )}
    </div>
  );
}

type WeatherDetailSkeletonProps = {
  className?: string;
};

export function WeatherDetailSkeleton({ className }: WeatherDetailSkeletonProps) {
  return (
    <div className={cn("flex min-h-[720px] flex-col gap-lg", className)}>
      <div className="flex items-center justify-between gap-md">
        <Skeleton className="size-10 rounded-md" />
        <Skeleton className="h-5 w-28 rounded-md" />
      </div>

      <div className="flex flex-1 flex-col gap-xl rounded-xl border border-hairline bg-canvas p-lg shadow-raised md:p-xl">
        <div className="flex flex-col gap-lg md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-sm">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-12 w-48 rounded-md" />
            <div className="flex items-center gap-md">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
          </div>

          <div className="flex flex-col items-start gap-sm md:items-end">
            <Skeleton className="h-20 w-32 rounded-md" />
            <Skeleton className="h-6 w-40 rounded-md" />
          </div>
        </div>

        <div className="flex flex-col gap-md">
          <Skeleton className="h-8 w-32 rounded-md" />
          <div className="flex gap-sm overflow-hidden rounded-lg border border-hairline bg-surface-soft p-sm">
            {Array.from({ length: HOURLY_FORECAST_LIMIT }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-20 shrink-0 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type WeatherDetailErrorProps = {
  className?: string;
};

export function WeatherDetailError({ className }: WeatherDetailErrorProps) {
  return (
    <main className={cn("flex min-h-[720px] flex-col gap-lg", className)}>
      <section className="flex flex-1 flex-col gap-xl rounded-xl border border-hairline bg-canvas p-lg shadow-raised md:p-xl">
        <WeatherMessage
          title="날씨 정보를 가져오지 못했습니다."
          description="잠시 후 다시 시도해 주세요."
        />
      </section>
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

type HourlyForecastProps = {
  className?: string;
  hourlyForecast: HourlyWeather[];
};

function HourlyForecast({ className, hourlyForecast }: HourlyForecastProps) {
  return (
    <section className={cn("flex flex-col gap-md", className)}>
      <h2 className="text-display-sm text-ink">시간별 예보</h2>
      <div className="overflow-x-auto rounded-lg border border-hairline bg-surface-soft p-sm">
        <div className="flex min-w-max gap-sm">
          {hourlyForecast.map((hour) => {
            const date = new Date(hour.time);

            return (
              <div
                key={hour.time}
                className="flex w-20 shrink-0 flex-col items-center gap-xs rounded-md bg-canvas p-sm"
              >
                <span className="text-num-mono text-meta">
                  {date.toLocaleTimeString("ko-KR", { hour: "2-digit" })}
                </span>
                <span className="text-temp-md text-ink">{Math.round(hour.temperature)}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
