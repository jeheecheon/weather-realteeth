import { cn, type Nullable } from "@/shared/lib";
import { Container } from "@/shared/ui";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDesktopBreakpoint } from "../lib/use-desktop-breakpoint";
import type { District } from "../model/district";
import { useActiveCoordinates } from "../model/use-active-coordinates";
import { FavoriteFullscreenModal } from "./favorite-fullscreen-modal";
import { FavoriteSidebar } from "./favorite-sidebar";
import { WeatherDetail, WeatherDetailError, WeatherDetailSkeleton } from "./weather-detail";

type HomePageProps = {
  className?: string;
};

export function HomePage({ className }: HomePageProps) {
  const [isFavoritesPanelOpen, setIsFavoritesPanelOpen] = useState(true);
  const [activeDistrict, setActiveDistrict] = useState<Nullable<District>>(null);
  const isDesktop = useDesktopBreakpoint();
  const coordinates = useActiveCoordinates(activeDistrict);

  useDesktopBreakpoint({ onChange: setIsFavoritesPanelOpen });

  return (
    <div className={cn("min-h-dvh bg-page py-lg md:py-xl", className)}>
      <Container className="flex gap-lg">
        <FavoriteSidebar
          className={cn("w-72 shrink-0", !isDesktop && "hidden")}
          activeDistrict={activeDistrict}
          isOpen={isFavoritesPanelOpen}
          onActiveDistrictChange={handleActiveDistrictChange}
        />
        {coordinates == null ? (
          <WeatherDetailSkeleton className="min-w-0 flex-1" />
        ) : (
          <ErrorBoundary
            resetKeys={[coordinates.lat, coordinates.lon]}
            fallback={<WeatherDetailError className="min-w-0 flex-1" />}
          >
            <Suspense fallback={<WeatherDetailSkeleton className="min-w-0 flex-1" />}>
              <WeatherDetail
                className="min-w-0 flex-1"
                coordinates={coordinates}
                district={activeDistrict}
                onToggleFavorites={handleIsFavoritesPanelOpenChange(!isFavoritesPanelOpen)}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </Container>

      {!isDesktop && (
        <FavoriteFullscreenModal
          activeDistrict={activeDistrict}
          isOpen={isFavoritesPanelOpen}
          onActiveDistrictChange={handleActiveDistrictChange}
          onClose={handleIsFavoritesPanelOpenChange(false)}
        />
      )}
    </div>
  );

  function handleActiveDistrictChange(district: Nullable<District>) {
    setActiveDistrict(district);
    if (isDesktop) {
      return;
    }
    setIsFavoritesPanelOpen(false);
  }

  function handleIsFavoritesPanelOpenChange(isOpen: boolean) {
    return () => setIsFavoritesPanelOpen(isOpen);
  }
}
