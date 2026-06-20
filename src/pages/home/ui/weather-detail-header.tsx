import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { PanelLeftIcon, StarIcon } from "lucide-react";
import { type PropsWithChildren } from "react";

type WeatherDetailHeaderProps = {
  className?: string;
  isFavorited: boolean;
  isFavoritePanelOpen: boolean;
  onFavoritePanelToggle: () => void;
  onFavoriteToggle: () => void;
};

export function WeatherDetailHeader({
  className,
  isFavorited,
  isFavoritePanelOpen,
  onFavoriteToggle,
  onFavoritePanelToggle,
}: WeatherDetailHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-md", className)}>
      <div className="flex items-center gap-xs">
        <ToggleButton
          selected={isFavoritePanelOpen}
          label="사이드바 토글"
          onToggle={onFavoritePanelToggle}
        >
          <PanelLeftIcon />
        </ToggleButton>
        <ToggleButton
          selected={isFavorited}
          label={isFavorited ? "즐겨찾기 삭제" : "즐겨찾기 추가"}
          onToggle={onFavoriteToggle}
        >
          <StarIcon className={cn(isFavorited && "fill-current")} />
        </ToggleButton>
      </div>
    </div>
  );
}

type ToggleButtonProps = PropsWithChildren<{
  className?: string;
  selected: boolean;
  label: string;
  onToggle: () => void;
}>;

function ToggleButton({ className, selected, label, children, onToggle }: ToggleButtonProps) {
  return (
    <Button
      className={cn(
        selected && "border-transparent bg-ink text-on-ink hover:bg-ink active:bg-ink/90",
        className,
      )}
      size="icon"
      variant="secondary"
      aria-label={label}
      aria-pressed={selected}
      onClick={onToggle}
    >
      {children}
    </Button>
  );
}
