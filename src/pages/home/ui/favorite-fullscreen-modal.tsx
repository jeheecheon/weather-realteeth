import { type Nullable, type Optional } from "@/shared/lib";
import { BottomSheet, FullscreenModal } from "@/shared/ui";
import { useState } from "react";
import { useDesktopBreakpoint } from "../lib/use-desktop-breakpoint";
import { type District } from "../model/district";
import { type Favorite, useFavorites } from "../model/use-favorites";
import { FavoriteEditForm } from "./favorite-edit-form";
import { FavoriteList } from "./favorite-list";
import { FavoriteSearchCombobox } from "./favorite-search-combobox";
import { FavoriteSearchPanelTrigger } from "./favorite-search-panel-trigger";

type FavoriteFullscreenModalProps = {
  className?: string;
  activeFavorite: Nullable<Favorite>;
  isOpen: boolean;
  onActiveFavoriteChange: (favorite: Nullable<Favorite>) => void;
  onClose: () => void;
};

export function FavoriteFullscreenModal({
  className,
  activeFavorite,
  isOpen,
  onActiveFavoriteChange,
  onClose,
}: FavoriteFullscreenModalProps) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editingFavorite, setEditingFavorite] = useState<Optional<Favorite>>();
  const { favorites, removeFavorite, updateFavorite } = useFavorites();
  const isDesktop = useDesktopBreakpoint();

  return (
    <FullscreenModal className={className} isOpen={isOpen} title="즐겨찾기" onClose={onClose}>
      {isDesktop ? (
        <FavoriteSearchCombobox onSelectDistrict={handleSelectDistrict} />
      ) : (
        <FavoriteSearchPanelTrigger onSelectDistrict={handleSelectDistrict} />
      )}

      <FavoriteList
        activeFavorite={activeFavorite}
        favorites={favorites}
        onEditFavorite={handleEditFavorite}
        onSelectFavorite={onActiveFavoriteChange}
      />

      {editingFavorite && (
        <BottomSheet isOpen={isEditOpen} title="즐겨찾기 편집" onClose={handleEditSheetClose}>
          <FavoriteEditForm
            favorite={editingFavorite}
            onCancel={handleEditSheetClose}
            onRemoveFavorite={handleRemoveFavorite}
            onUpdateFavorite={handleUpdateFavorite}
          />
        </BottomSheet>
      )}
    </FullscreenModal>
  );

  function handleSelectDistrict(district: District) {
    onActiveFavoriteChange(
      favorites.find((favorite) => favorite.name === district.name) ?? { ...district, alias: null },
    );
  }

  function handleEditFavorite(favorite: Favorite) {
    setIsEditOpen(true);
    setEditingFavorite(favorite);
  }

  function handleEditSheetClose() {
    setIsEditOpen(false);
  }

  function handleRemoveFavorite(favorite: Favorite) {
    removeFavorite(favorite);

    if (activeFavorite?.name === favorite.name) {
      const next = favorites.find((item) => item.name !== favorite.name) ?? null;
      onActiveFavoriteChange(next);
    }
  }

  function handleUpdateFavorite(favorite: Favorite) {
    updateFavorite(favorite);

    if (activeFavorite?.name === favorite.name) {
      onActiveFavoriteChange(favorite);
    }
  }
}
