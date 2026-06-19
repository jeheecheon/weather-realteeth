import { ensure, type Nullable } from "@/shared/lib";
import { useMemo } from "react";
import { useStorageState } from "synced-storage/react";
import { districts, type District } from "./district";

export type Favorite = District & {
  alias: Nullable<string>;
};

export const MAX_FAVORITES = 6;

const FAVORITES_STORAGE_KEY = "favorites";

const defaultSeoulDistrict = ensure(
  districts.find((candidate) => candidate.name === "서울특별시"),
  "Default favorite district not found: 서울특별시",
);
const defaultBusanDistrict = ensure(
  districts.find((candidate) => candidate.name === "부산광역시"),
  "Default favorite district not found: 부산광역시",
);

const DEFAULT_FAVORITES: Favorite[] = [
  { ...defaultSeoulDistrict, alias: null },
  { ...defaultBusanDistrict, alias: null },
];

export function useFavorites() {
  const [favorites, setFavorites] = useStorageState<Favorite[]>(
    FAVORITES_STORAGE_KEY,
    DEFAULT_FAVORITES,
  );

  return useMemo(() => {
    const addFavorite = (favorite: Favorite) =>
      setFavorites((previous) => {
        if (
          previous.length >= MAX_FAVORITES ||
          previous.some((item) => item.name === favorite.name)
        ) {
          return previous;
        }

        return [...previous, favorite];
      });

    const updateFavorite = (nextFavorite: Favorite) =>
      setFavorites((previous) =>
        previous.map((favorite) => (favorite.name === nextFavorite.name ? nextFavorite : favorite)),
      );

    const removeFavorite = (targetFavorite: Favorite) =>
      setFavorites((previous) =>
        previous.filter((favorite) => favorite.name !== targetFavorite.name),
      );

    return { favorites, addFavorite, removeFavorite, updateFavorite };
  }, [favorites, setFavorites]);
}
