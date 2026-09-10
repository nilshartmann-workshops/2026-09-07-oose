"use client";

import { selectIsFavorite, useFavoritesStore } from "@/lib/useFavoritesStore";

type FavoriteButtonProps = {
  id: string;
};

export default function FavoriteButton({ id }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore(selectIsFavorite(id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <button onClick={() => toggleFavorite(id)}>
      {isFavorite ? "💚 Favorit" : "🤍 Favorit"}
    </button>
  );
}
