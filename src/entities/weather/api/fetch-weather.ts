import { ensure } from "@/shared/lib";
import { z } from "zod";
import type { Coordinates, Weather } from "../model/weather";

const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const FORECAST_DAYS = 2;

const openMeteoWeatherSchema = z
  .object({
    current: z.object({
      is_day: z.union([z.literal(0), z.literal(1)]),
      temperature_2m: z.number(),
      weather_code: z.number().int(),
    }),
    daily: z.object({
      temperature_2m_max: z.array(z.number()),
      temperature_2m_min: z.array(z.number()),
      weather_code: z.array(z.number().int()),
    }),
    hourly: z.object({
      temperature_2m: z.array(z.number()),
      time: z.array(z.string()),
      weather_code: z.array(z.number().int()),
    }),
  })
  .transform(
    (weatherResponse): Weather => ({
      current: {
        isDay: weatherResponse.current.is_day === 1,
        temperature: weatherResponse.current.temperature_2m,
        weatherCode: weatherResponse.current.weather_code,
      },
      daily: {
        max: ensure(
          weatherResponse.daily.temperature_2m_max[0],
          "Daily max temperature is missing",
        ),
        min: ensure(
          weatherResponse.daily.temperature_2m_min[0],
          "Daily min temperature is missing",
        ),
      },
      hourly: weatherResponse.hourly.time.map((time, index) => ({
        temperature: ensure(
          weatherResponse.hourly.temperature_2m[index],
          "Hourly temperature is missing",
        ),
        time,
        weatherCode: ensure(
          weatherResponse.hourly.weather_code[index],
          "Hourly weather code is missing",
        ),
      })),
    }),
  );

export async function fetchWeather({ lat, lon }: Coordinates): Promise<Weather> {
  const searchParams = new URLSearchParams({
    current: "temperature_2m,weather_code,is_day",
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    forecast_days: String(FORECAST_DAYS),
    hourly: "temperature_2m,weather_code",
    latitude: String(lat),
    longitude: String(lon),
    timezone: "Asia/Seoul",
  });

  const response = await fetch(`${OPEN_METEO_FORECAST_URL}?${searchParams}`);

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();
  const parsed = openMeteoWeatherSchema.parse(data);
  return parsed;
}
