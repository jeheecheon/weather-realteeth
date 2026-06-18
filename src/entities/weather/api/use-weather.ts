import { A_MINUTE } from "@/shared/lib";
import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "./fetch-weather";

export function useWeather(lat: number, lon: number) {
  return useQuery({
    queryFn: () => fetchWeather({ lat, lon }),
    queryKey: ["weather", lat, lon],
    staleTime: 10 * A_MINUTE,
  });
}
