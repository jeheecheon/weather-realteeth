import { cn, type Nullable } from "@/shared/lib";
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

  const isSidebarOpen = isDesktop && isFavoritesPanelOpen;

  useDesktopBreakpoint({ onChange: setIsFavoritesPanelOpen });

  return (
    <div className={cn("h-dvh min-h-dvh bg-page py-lg md:py-xl", className)}>
      <div
        className={cn(
          "grid h-full gap-lg px-md transition-[grid-template-columns] duration-100 ease-in-out md:px-xl",
          isSidebarOpen ? "grid-cols-[18rem_1fr]" : "grid-cols-[0rem_1fr]",
        )}
      >
        <div className="min-w-0 overflow-hidden">
          <FavoriteSidebar
            className="h-full w-72"
            activeDistrict={activeDistrict}
            onActiveDistrictChange={handleActiveDistrictChange}
          />
        </div>
        <div className="mx-auto h-full w-full max-w-3xl min-w-0">
          {coordinates == null ? (
            <WeatherDetailSkeleton />
          ) : (
            <ErrorBoundary
              resetKeys={[coordinates.lat, coordinates.lon]}
              fallback={<WeatherDetailError />}
            >
              <Suspense fallback={<WeatherDetailSkeleton />}>
                <WeatherDetail
                  coordinates={coordinates}
                  district={activeDistrict}
                  onToggleFavorites={handleIsFavoritesPanelOpenChange(!isFavoritesPanelOpen)}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </div>

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
