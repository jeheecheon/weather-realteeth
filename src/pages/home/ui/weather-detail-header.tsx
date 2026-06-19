import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { PanelLeftIcon, StarIcon } from "lucide-react";

type WeatherDetailHeaderProps = {
  className?: string;
  isFavorite: boolean;
  isFavoriteToggleDisabled: boolean;
  onFavoritePanelToggle: () => void;
  onFavoriteToggle: () => void;
};

export function WeatherDetailHeader({
  className,
  isFavorite,
  isFavoriteToggleDisabled,
  onFavoritePanelToggle,
  onFavoriteToggle,
}: WeatherDetailHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-md", className)}>
      <div className="flex items-center gap-xs">
        <Button
          size="icon"
          variant="secondary"
          aria-label="사이드바 토글"
          onClick={onFavoritePanelToggle}
        >
          <PanelLeftIcon />
        </Button>
        <Button
          size="icon"
          variant={isFavorite ? "default" : "secondary"}
          disabled={isFavoriteToggleDisabled}
          aria-label={isFavorite ? "즐겨찾기 삭제" : "즐겨찾기 추가"}
          onClick={onFavoriteToggle}
        >
          <StarIcon className={cn(isFavorite && "fill-current")} />
        </Button>
      </div>
    </div>
  );
}
