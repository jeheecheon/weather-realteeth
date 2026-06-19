import { A_SECOND, type Nullable } from "@/shared/lib";
import { useEffect, useState } from "react";

const GEOLOCATION_TIMEOUT = 3 * A_SECOND;

export type GeolocationState = {
  latitude: Nullable<number>;
  longitude: Nullable<number>;
  error: Nullable<GeolocationPositionError>;
};

const INITIAL_STATE: GeolocationState = {
  latitude: null,
  longitude: null,
  error: null,
};

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>(INITIAL_STATE);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    function requestPosition() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (signal.aborted) {
            return;
          }
          setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          if (signal.aborted) {
            return;
          }
          setState((prev) => ({ ...prev, error }));
        },
        { timeout: GEOLOCATION_TIMEOUT },
      );
    }

    requestPosition();

    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((status) => {
        status.addEventListener(
          "change",
          () => {
            if (status.state === "granted") {
              setState(INITIAL_STATE);
              requestPosition();
            }
          },
          { signal },
        );
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  return state;
}
