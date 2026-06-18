import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from "lucide-react";
import type { Weather } from "../model/weather";

export type WeatherCondition = {
  Icon: LucideIcon;
  label: string;
};

export function resolveWeatherCondition(weather: Weather): WeatherCondition {
  const { isDay, weatherCode } = weather.current;

  if (weatherCode === 0) {
    return { Icon: isDay ? Sun : Moon, label: "맑음" };
  }

  if ([1, 2].includes(weatherCode)) {
    return { Icon: isDay ? CloudSun : CloudMoon, label: "부분 흐림" };
  }

  if (weatherCode === 3) {
    return { Icon: Cloud, label: "흐림" };
  }

  if ([45, 48].includes(weatherCode)) {
    return { Icon: CloudFog, label: "안개" };
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return { Icon: CloudDrizzle, label: "이슬비" };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return { Icon: CloudRain, label: "비" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return { Icon: CloudSnow, label: "눈" };
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return { Icon: CloudLightning, label: "뇌우" };
  }

  return { Icon: Cloud, label: "날씨 정보 없음" };
}
