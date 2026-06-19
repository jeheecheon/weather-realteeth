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
  activeFavorite: Nullable<Favorite>;
  isOpen: boolean;
  onActiveFavoriteChange: (favorite: Nullable<Favorite>) => void;
};

export function FavoriteSidebar({
  className,
  activeFavorite,
  isOpen,
  onActiveFavoriteChange,
}: FavoriteSidebarProps) {
  const { favorites, removeFavorite, updateFavorite } = useFavorites();
  const [editingFavorite, setEditingFavorite] = useState<Optional<Favorite>>();

  useEffect(() => {
    if (!activeFavorite && favorites[0]) {
      onActiveFavoriteChange(favorites[0]);
    }
  }, [activeFavorite, favorites, onActiveFavoriteChange]);

  return (
    <aside
      className={cn(
        "h-full min-h-0 flex-col gap-md",
        className,
        isOpen ? "desktop:flex" : "desktop:hidden",
      )}
    >
      <FavoriteSearchCombobox onSelectDistrict={handleSelectDistrict} />

      <FavoriteList
        activeFavorite={activeFavorite}
        favorites={favorites}
        onEditFavorite={setEditingFavorite}
        onSelectFavorite={onActiveFavoriteChange}
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

  function handleSelectDistrict(district: District) {
    onActiveFavoriteChange(
      favorites.find((favorite) => favorite.name === district.name) ?? { ...district, alias: null },
    );
  }

  function handleEditDialogClose() {
    setEditingFavorite(undefined);
  }

  function handleRemoveEditedFavorite(favorite: Favorite) {
    removeFavorite(favorite);

    if (favorite.name === activeFavorite?.name) {
      onActiveFavoriteChange(favorites.find((item) => item.name !== favorite.name) ?? null);
    }
  }

  function handleUpdateEditedFavorite(favorite: Favorite) {
    updateFavorite(favorite);

    if (favorite.name === activeFavorite?.name) {
      onActiveFavoriteChange(favorite);
    }
  }
}
