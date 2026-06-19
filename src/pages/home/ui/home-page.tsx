import { cn, type Nullable } from "@/shared/lib";
import { Container } from "@/shared/ui";
import { useState } from "react";
import { useDesktopBreakpoint } from "../lib/use-desktop-breakpoint";
import type { Favorite } from "../model/use-favorites";
import { FavoriteFullscreenModal } from "./favorite-fullscreen-modal";
import { FavoriteSidebar } from "./favorite-sidebar";
import { WeatherDetail } from "./weather-detail";

type HomePageProps = {
  className?: string;
};

export function HomePage({ className }: HomePageProps) {
  const [isFavoritesPanelOpen, setIsFavoritesPanelOpen] = useState(true);
  const [activeFavorite, setActiveFavorite] = useState<Nullable<Favorite>>(null);
  const isDesktop = useDesktopBreakpoint();

  useDesktopBreakpoint({ onChange: setIsFavoritesPanelOpen });

  return (
    <div className={cn("min-h-dvh bg-page py-lg md:py-xl", className)}>
      <Container className="flex gap-lg">
        <FavoriteSidebar
          className={cn("w-72 shrink-0", !isDesktop && "hidden")}
          activeFavorite={activeFavorite}
          isOpen={isFavoritesPanelOpen}
          onActiveFavoriteChange={handleActiveFavoriteChange}
        />
        <WeatherDetail
          className="min-w-0 flex-1"
          favorite={activeFavorite}
          onToggleFavorites={handleIsFavoritesPanelOpenChange(!isFavoritesPanelOpen)}
        />
      </Container>

      {!isDesktop && (
        <FavoriteFullscreenModal
          activeFavorite={activeFavorite}
          isOpen={isFavoritesPanelOpen}
          onActiveFavoriteChange={handleActiveFavoriteChange}
          onClose={handleIsFavoritesPanelOpenChange(false)}
        />
      )}
    </div>
  );

  function handleActiveFavoriteChange(favorite: Nullable<Favorite>) {
    setActiveFavorite(favorite);
    if (isDesktop) {
      return;
    }
    setIsFavoritesPanelOpen(false);
  }

  function handleIsFavoritesPanelOpenChange(isOpen: boolean) {
    return () => setIsFavoritesPanelOpen(isOpen);
  }
}
