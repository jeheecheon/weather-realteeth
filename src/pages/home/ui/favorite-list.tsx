import { cn, type Nullable } from "@/shared/lib";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { Favorite } from "../model/use-favorites";
import { MAX_FAVORITES } from "../model/use-favorites";
import { FavoriteCard, FavoriteCardError, FavoriteCardSkeleton } from "./favorite-card";

type FavoriteListProps = {
  className?: string;
  activeFavorite: Nullable<Favorite>;
  favorites: Favorite[];
  onEditFavorite: (favorite: Favorite) => void;
  onSelectFavorite: (favorite: Favorite) => void;
};

export function FavoriteList({
  className,
  activeFavorite,
  favorites,
  onEditFavorite,
  onSelectFavorite,
}: FavoriteListProps) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-md", className)}>
      <span className="text-num-mono text-meta">
        {favorites.length}/{MAX_FAVORITES}
      </span>

      <div className="flex min-h-0 flex-1 flex-col gap-sm overflow-auto pr-xs">
        {favorites.length > 0 ? (
          favorites.map((favorite) => {
            const isSelected = favorite.name === activeFavorite?.name;

            return (
              <ErrorBoundary
                key={favorite.name}
                resetKeys={[favorite.lat, favorite.lon]}
                fallback={
                  <FavoriteCardError
                    favorite={favorite}
                    isSelected={isSelected}
                    onEdit={() => onEditFavorite(favorite)}
                    onSelect={() => onSelectFavorite(favorite)}
                  />
                }
              >
                <Suspense fallback={<FavoriteCardSkeleton />}>
                  <FavoriteCard
                    favorite={favorite}
                    isSelected={isSelected}
                    onEdit={() => onEditFavorite(favorite)}
                    onSelect={() => onSelectFavorite(favorite)}
                  />
                </Suspense>
              </ErrorBoundary>
            );
          })
        ) : (
          <div className="rounded-lg border border-hairline-soft bg-surface-soft p-lg text-center">
            <p className="text-body-sm text-meta">즐겨찾기한 장소가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
