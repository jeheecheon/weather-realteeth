import { cn } from "@/shared/lib";
import { Skeleton } from "@/shared/ui";
import { PencilIcon } from "lucide-react";
import { useWeather } from "../api/use-weather";
import { resolveWeatherCondition } from "../lib/weather-code";
import type { Favorite } from "../model/use-favorites";

type FavoriteCardProps = {
  className?: string;
  favorite: Favorite;
  isSelected?: boolean;
  onEdit: () => void;
  onSelect: () => void;
};

export function FavoriteCard({
  className,
  favorite,
  isSelected = false,
  onEdit,
  onSelect,
}: FavoriteCardProps) {
  const weather = useWeather({ lat: favorite.lat, lon: favorite.lon });
  const condition = resolveWeatherCondition(weather.data);

  return (
    <div
      className={cn(
        "relative rounded-md border border-hairline bg-surface-soft transition-colors hover:bg-surface-strong",
        isSelected && "ring-2 ring-primary ring-inset",
        className,
      )}
    >
      <button
        className="flex w-full flex-col gap-sm rounded-md p-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        type="button"
        onClick={onSelect}
      >
        <span className="truncate pr-7 text-title-md text-ink">
          {favorite.alias ?? favorite.name}
        </span>
        <span className="flex items-end justify-between gap-sm">
          <span className="text-temp-lg text-ink">
            {Math.round(weather.data.current.temperature)}°
          </span>
          <span className="flex flex-col items-center gap-2xs">
            <condition.Icon className="size-7 text-ink" />
            <span className="text-caption text-meta">{condition.label}</span>
          </span>
        </span>
        <span className="flex gap-sm">
          <span>
            <span className="text-title-sm text-meta">최고 </span>
            <span className="text-temp-sm text-ink">{Math.round(weather.data.daily.max)}°</span>
          </span>
          <span>
            <span className="text-title-sm text-meta">최저 </span>
            <span className="text-temp-sm text-meta">{Math.round(weather.data.daily.min)}°</span>
          </span>
        </span>
      </button>

      <FavoriteCardEditButton favorite={favorite} onEdit={onEdit} />
    </div>
  );
}

type FavoriteCardErrorProps = {
  className?: string;
  favorite: Favorite;
  isSelected?: boolean;
  onEdit: () => void;
  onSelect: () => void;
};

export function FavoriteCardError({
  className,
  favorite,
  isSelected = false,
  onEdit,
  onSelect,
}: FavoriteCardErrorProps) {
  return (
    <div
      className={cn(
        "relative rounded-md border border-hairline bg-surface-soft transition-colors hover:bg-surface-strong",
        isSelected && "ring-2 ring-primary ring-inset",
        className,
      )}
    >
      <button
        className="flex w-full flex-col gap-sm rounded-md p-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        type="button"
        onClick={onSelect}
      >
        <span className="truncate pr-7 text-title-md text-ink">
          {favorite.alias ?? favorite.name}
        </span>
        <span className="text-body-sm text-meta">날씨 정보 없음</span>
      </button>

      <FavoriteCardEditButton favorite={favorite} onEdit={onEdit} />
    </div>
  );
}

type FavoriteCardSkeletonProps = {
  className?: string;
};

export function FavoriteCardSkeleton({ className }: FavoriteCardSkeletonProps) {
  return (
    <div className={cn("rounded-md border border-hairline bg-surface-soft p-md", className)}>
      <div className="flex flex-col gap-sm">
        <Skeleton className="h-6 w-28 rounded-md" />
        <div className="flex items-end justify-between gap-sm">
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="size-10 rounded-full" />
        </div>
        <Skeleton className="h-5 w-32 rounded-md" />
      </div>
    </div>
  );
}

type FavoriteCardEditButtonProps = {
  className?: string;
  favorite: Favorite;
  onEdit: () => void;
};

function FavoriteCardEditButton({ className, favorite, onEdit }: FavoriteCardEditButtonProps) {
  return (
    <button
      className={cn(
        "absolute top-sm right-sm inline-flex size-9 items-center justify-center rounded-full bg-surface-soft text-ink transition-colors outline-none hover:bg-surface-strong focus-visible:ring-2 focus-visible:ring-primary active:bg-surface-pressed",
        className,
      )}
      type="button"
      aria-label={`${favorite.alias ?? favorite.name} 편집`}
      onClick={onEdit}
    >
      <PencilIcon className="size-4.5" />
    </button>
  );
}
