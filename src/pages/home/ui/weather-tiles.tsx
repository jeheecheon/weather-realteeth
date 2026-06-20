import {
  ArrowUpIcon,
  CalendarIcon,
  ClockIcon,
  DropletsIcon,
  EyeIcon,
  GaugeIcon,
  SunIcon,
  SunriseIcon,
  SunsetIcon,
  ThermometerIcon,
  UmbrellaIcon,
  WindIcon,
} from "lucide-react";
import { useScrollToStart } from "../lib/use-scroll-to-start";
import { resolveWeatherCondition } from "../lib/weather-code";
import type { CurrentWeather, DailyWeather, HourlyWeather, TodayWeather } from "../model/weather";
import { WeatherTile } from "./weather-tile";

type HourlyForecastTileProps = {
  className?: string;
  hourly: HourlyWeather[];
};

export function HourlyForecastTile({ className, hourly }: HourlyForecastTileProps) {
  const { containerRef, targetRef } = useScrollToStart(hourly);

  return (
    <WeatherTile className={className} icon={ClockIcon} label="시간별 예보">
      <div ref={containerRef} className="scrollbar-hidden overflow-x-auto pb-2xs">
        <div className="flex min-w-max gap-2xs">
          {hourly.map((hour) => {
            const condition = resolveWeatherCondition(hour.weatherCode);
            const now = new Date();
            const isCurrentTile = isSameHour(new Date(hour.time), now);

            return (
              <div
                key={hour.time}
                ref={isCurrentTile ? targetRef : undefined}
                className="flex w-16 shrink-0 flex-col items-center gap-xs rounded-md bg-surface-soft py-sm"
              >
                <span className="text-num-mono text-meta">{formatHour(hour.time)}</span>
                <condition.Icon className="size-5 text-ink" />
                <span className="flex h-4 items-center gap-px text-num-mono text-meta">
                  {hour.precipitationProbability > 0 && (
                    <>
                      <DropletsIcon className="size-3" />
                      {hour.precipitationProbability}%
                    </>
                  )}
                </span>
                <span className="text-temp-md text-ink">{Math.round(hour.temperature)}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </WeatherTile>
  );

  function formatHour(time: string): string {
    return `${new Date(time).getHours()}시`;
  }

  function isSameHour(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate() &&
      a.getHours() === b.getHours()
    );
  }
}

type WeeklyForecastTileProps = {
  className?: string;
  daily: DailyWeather[];
};

export function WeeklyForecastTile({ className, daily }: WeeklyForecastTileProps) {
  return (
    <WeatherTile className={className} icon={CalendarIcon} label="주간 예보">
      {daily.map((day, index) => {
        const condition = resolveWeatherCondition(day.weatherCode);

        return (
          <div
            key={day.date}
            className="flex flex-1 items-center gap-sm border-b border-hairline-soft py-2xs last:border-b-0"
          >
            <span className="w-8 text-title-sm text-ink">{formatWeekday(day.date, index)}</span>
            <condition.Icon className="size-5 text-meta" />
            <span className="ml-auto flex items-baseline gap-xs">
              <span className="text-temp-sm text-ink">{Math.round(day.max)}°</span>
              <span className="text-temp-sm text-meta">{Math.round(day.min)}°</span>
            </span>
          </div>
        );
      })}
    </WeatherTile>
  );

  function formatWeekday(date: string, index: number): string {
    if (index === 0) {
      return "오늘";
    }

    const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
    return WEEKDAY_LABELS[new Date(date).getDay()] ?? "";
  }
}

type WeatherMetricTilesProps = {
  current: CurrentWeather;
  today: TodayWeather;
};

export function WeatherMetricTiles({ current, today }: WeatherMetricTilesProps) {
  return (
    <>
      <WeatherTile
        contentClassName="justify-center gap-2xs"
        icon={ThermometerIcon}
        label="체감 온도"
      >
        <span className="text-temp-lg text-ink">{Math.round(current.apparentTemperature)}°</span>
      </WeatherTile>

      <WeatherTile contentClassName="justify-center gap-2xs" icon={DropletsIcon} label="습도">
        <span className="text-temp-lg text-ink">{Math.round(current.humidity)}%</span>
      </WeatherTile>

      <WeatherTile contentClassName="justify-center gap-2xs" icon={WindIcon} label="바람">
        <span className="flex items-baseline gap-2xs">
          <span className="text-temp-lg text-ink">{current.windSpeed.toFixed(1)}</span>
          <span className="text-num-mono text-meta">m/s</span>
        </span>
        <span className="flex items-center gap-2xs text-meta">
          <ArrowUpIcon
            className="size-3.5"
            style={{ transform: `rotate(${current.windDirection + 180}deg)` }}
          />
          <span className="text-caption">{resolveWindDirection(current.windDirection)}풍</span>
        </span>
      </WeatherTile>

      <WeatherTile contentClassName="justify-center gap-2xs" icon={GaugeIcon} label="돌풍">
        <span className="flex items-baseline gap-2xs">
          <span className="text-temp-lg text-ink">{current.windGusts.toFixed(1)}</span>
          <span className="text-num-mono text-meta">m/s</span>
        </span>
      </WeatherTile>

      <WeatherTile contentClassName="justify-center gap-2xs" icon={EyeIcon} label="가시거리">
        <span className="flex items-baseline gap-2xs">
          <span className="text-temp-lg text-ink">
            {(current.visibility / 1000).toFixed(current.visibility >= 10000 ? 0 : 1)}
          </span>
          <span className="text-num-mono text-meta">km</span>
        </span>
        <span className="text-caption text-meta">{resolveVisibilityLabel(current.visibility)}</span>
      </WeatherTile>

      <WeatherTile contentClassName="justify-center gap-2xs" icon={UmbrellaIcon} label="강수 확률">
        <span className="text-temp-lg text-ink">{today.precipitationProbabilityMax}%</span>
        <span className="text-caption text-meta">오늘 최대</span>
      </WeatherTile>

      <WeatherTile contentClassName="justify-center gap-2xs" icon={SunIcon} label="자외선 지수">
        <span className="text-temp-lg text-ink">{Math.round(today.uvIndexMax)}</span>
        <span className="text-caption text-meta">{resolveUvLabel(today.uvIndexMax)}</span>
      </WeatherTile>

      <WeatherTile contentClassName="justify-center gap-xs" icon={SunriseIcon} label="일출 · 일몰">
        <span className="flex items-center gap-2xs">
          <SunriseIcon className="size-4 text-meta" />
          <span className="text-temp-sm text-ink">{formatTime(today.sunrise)}</span>
        </span>
        <span className="flex items-center gap-2xs">
          <SunsetIcon className="size-4 text-meta" />
          <span className="text-temp-sm text-ink">{formatTime(today.sunset)}</span>
        </span>
      </WeatherTile>
    </>
  );

  function formatTime(time: string): string {
    const date = new Date(time);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  function resolveWindDirection(degrees: number): string {
    const WIND_DIRECTIONS = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"];
    return WIND_DIRECTIONS[Math.round(degrees / 45) % 8] ?? "";
  }

  function resolveVisibilityLabel(visibility: number): string {
    if (visibility >= 10000) {
      return "매우 좋음";
    }
    if (visibility >= 4000) {
      return "좋음";
    }
    if (visibility >= 1000) {
      return "보통";
    }
    return "나쁨";
  }

  function resolveUvLabel(uvIndex: number): string {
    if (uvIndex <= 2) {
      return "낮음";
    }
    if (uvIndex <= 5) {
      return "보통";
    }
    if (uvIndex <= 7) {
      return "높음";
    }
    if (uvIndex <= 10) {
      return "매우 높음";
    }
    return "위험";
  }
}
