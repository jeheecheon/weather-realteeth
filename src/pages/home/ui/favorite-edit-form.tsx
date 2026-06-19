import { cn } from "@/shared/lib";
import { Button, Input } from "@/shared/ui";
import { StarIcon, Trash2Icon } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import type { Favorite } from "../model/use-favorites";

type FavoriteEditFormProps = {
  className?: string;
  favorite: Favorite;
  onCancel: () => void;
  onRemoveFavorite: (favorite: Favorite) => void;
  onUpdateFavorite: (favorite: Favorite) => void;
};

export function FavoriteEditForm({
  className,
  favorite,
  onCancel,
  onRemoveFavorite,
  onUpdateFavorite,
}: FavoriteEditFormProps) {
  const [invalid, setInvalid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  return (
    <form className={cn("flex flex-col gap-md", className)} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2xs">
        <label className="text-title-sm text-ink" htmlFor="favorite-alias">
          별칭
        </label>
        <Input
          defaultValue={favorite.alias ?? ""}
          name="alias"
          placeholder={favorite.name}
          id="favorite-alias"
          aria-invalid={invalid}
          onChange={handleAliasChange}
        />
      </div>

      <div className="rounded-md bg-surface-soft p-sm text-body-sm text-meta">{favorite.name}</div>

      <div className="flex flex-col-reverse gap-xs sm:flex-row sm:justify-between">
        <Button type="button" variant="destructive" onClick={handleRemove}>
          <Trash2Icon />
          삭제
        </Button>
        <div className="flex flex-col-reverse gap-xs sm:flex-row">
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" disabled={!isTouched || invalid}>
            <StarIcon />
            저장
          </Button>
        </div>
      </div>
    </form>
  );

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (invalid) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const nextAlias = String(formData.get("alias") ?? "").trim();
    onUpdateFavorite({ ...favorite, alias: nextAlias });
    onCancel();
  }

  function handleAliasChange(event: SyntheticEvent<HTMLInputElement>) {
    setIsTouched(true);
    setInvalid(event.currentTarget.value.trim().length === 0);
  }

  function handleRemove() {
    onRemoveFavorite(favorite);
    onCancel();
  }
}
