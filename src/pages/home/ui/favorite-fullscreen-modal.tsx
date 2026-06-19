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
  activeDistrict: Nullable<District>;
  isOpen: boolean;
  onActiveDistrictChange: (district: Nullable<District>) => void;
  onClose: () => void;
};

export function FavoriteFullscreenModal({
  className,
  activeDistrict,
  isOpen,
  onActiveDistrictChange,
  onClose,
}: FavoriteFullscreenModalProps) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editingFavorite, setEditingFavorite] = useState<Optional<Favorite>>();
  const { favorites, removeFavorite, updateFavorite } = useFavorites();
  const isDesktop = useDesktopBreakpoint();

  return (
    <FullscreenModal className={className} isOpen={isOpen} title="즐겨찾기" onClose={onClose}>
      {isDesktop ? (
        <FavoriteSearchCombobox onSelectDistrict={onActiveDistrictChange} />
      ) : (
        <FavoriteSearchPanelTrigger onSelectDistrict={onActiveDistrictChange} />
      )}

      <FavoriteList
        activeDistrict={activeDistrict}
        favorites={favorites}
        onEditFavorite={handleEditFavorite}
        onSelectFavorite={onActiveDistrictChange}
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

  function handleEditFavorite(favorite: Favorite) {
    setIsEditOpen(true);
    setEditingFavorite(favorite);
  }

  function handleEditSheetClose() {
    setIsEditOpen(false);
  }

  function handleRemoveFavorite(favorite: Favorite) {
    removeFavorite(favorite);

    if (activeDistrict?.name === favorite.name) {
      const next = favorites.find((item) => item.name !== favorite.name) ?? null;
      onActiveDistrictChange(next);
    }
  }

  function handleUpdateFavorite(favorite: Favorite) {
    updateFavorite(favorite);

    if (activeDistrict?.name === favorite.name) {
      onActiveDistrictChange(favorite);
    }
  }
}
