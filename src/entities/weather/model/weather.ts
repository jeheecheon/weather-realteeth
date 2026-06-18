export type CurrentWeather = {
  isDay: boolean;
  temperature: number;
  weatherCode: number;
};

export type DailyTemperature = {
  max: number;
  min: number;
};

export type HourlyWeather = {
  temperature: number;
  time: string;
  weatherCode: number;
};

export type Weather = {
  current: CurrentWeather;
  daily: DailyTemperature;
  hourly: HourlyWeather[];
};

export type Coordinates = {
  lat: number;
  lon: number;
};
