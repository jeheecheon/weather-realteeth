import { cn, type Nullable, type Optional } from "@/shared/lib";
import { Modal } from "@/shared/ui";
import { useEffect, useState } from "react";
import { type District } from "../model/district";
import { type Favorite, useFavorites } from "../model/use-favorites";
import { FavoriteEditForm } from "./favorite-edit-form";
import { FavoriteList } from "./favorite-list";
import { FavoriteSearchCombobox } from "./favorite-search-combobox";

type FavoriteSidebarProps = {
  className?: string;
  activeDistrict: Nullable<District>;
  isOpen: boolean;
  onActiveDistrictChange: (district: Nullable<District>) => void;
};

export function FavoriteSidebar({
  className,
  activeDistrict,
  isOpen,
  onActiveDistrictChange,
}: FavoriteSidebarProps) {
  const { favorites, removeFavorite, updateFavorite } = useFavorites();
  const [editingFavorite, setEditingFavorite] = useState<Optional<Favorite>>();

  useEffect(() => {
    if (!activeDistrict && favorites[0]) {
      onActiveDistrictChange(favorites[0]);
    }
  }, [activeDistrict, favorites, onActiveDistrictChange]);

  return (
    <aside
      className={cn(
        "h-full min-h-0 flex-col gap-md",
        className,
        isOpen ? "desktop:flex" : "desktop:hidden",
      )}
    >
      <FavoriteSearchCombobox onSelectDistrict={onActiveDistrictChange} />

      <FavoriteList
        activeDistrict={activeDistrict}
        favorites={favorites}
        onEditFavorite={setEditingFavorite}
        onSelectFavorite={onActiveDistrictChange}
      />

      <Modal isOpen={editingFavorite != null} title="즐겨찾기 편집" onClose={handleEditDialogClose}>
        {editingFavorite && (
          <FavoriteEditForm
            favorite={editingFavorite}
            onCancel={handleEditDialogClose}
            onRemoveFavorite={handleRemoveEditedFavorite}
            onUpdateFavorite={handleUpdateEditedFavorite}
          />
        )}
      </Modal>
    </aside>
  );

  function handleEditDialogClose() {
    setEditingFavorite(undefined);
  }

  function handleRemoveEditedFavorite(favorite: Favorite) {
    removeFavorite(favorite);

    if (favorite.name === activeDistrict?.name) {
      onActiveDistrictChange(favorites.find((item) => item.name !== favorite.name) ?? null);
    }
  }

  function handleUpdateEditedFavorite(favorite: Favorite) {
    updateFavorite(favorite);

    if (favorite.name === activeDistrict?.name) {
      onActiveDistrictChange(favorite);
    }
  }
}
