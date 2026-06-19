import { A_SECOND, type Nullable } from "@/shared/lib";
import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import type { District } from "./district";
import { useGeolocation } from "./use-geolocation";
import type { Coordinates } from "./weather";

const SEOUL_COORDINATES: Coordinates = { lat: 37.5665, lon: 126.978 };

export function useTargetCoordinates(district: Nullable<District>): Nullable<Coordinates> {
  const geolocation = useGeolocation();

  useEffect(() => {
    if (!geolocation.error) {
      return;
    }

    toast.error("현재 위치를 확인할 수 없어요.\n위치 권한을 허용한 뒤 다시 시도해 주세요.", {
      id: "geolocation-error",
      duration: 5 * A_SECOND,
    });
  }, [geolocation.error]);

  return useMemo<Nullable<Coordinates>>(() => {
    if (district) {
      return { lat: district.lat, lon: district.lon };
    }
    if (geolocation.latitude != null && geolocation.longitude != null) {
      return { lat: geolocation.latitude, lon: geolocation.longitude };
    }
    if (geolocation.error) {
      return SEOUL_COORDINATES;
    }
    return null;
  }, [district, geolocation.latitude, geolocation.longitude, geolocation.error]);
}
