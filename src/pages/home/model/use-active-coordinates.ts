import type { Nullable } from "@/shared/lib";
import { useMemo } from "react";
import { useGeolocation } from "react-use";
import type { District } from "./district";
import type { Coordinates } from "./weather";

export function useActiveCoordinates(district: Nullable<District>): Nullable<Coordinates> {
  const geolocation = useGeolocation();

  return useMemo<Nullable<Coordinates>>(() => {
    if (district) {
      return { lat: district.lat, lon: district.lon };
    }
    if (geolocation.latitude != null && geolocation.longitude != null) {
      return { lat: geolocation.latitude, lon: geolocation.longitude };
    }
    return null;
  }, [district, geolocation.latitude, geolocation.longitude]);
}
