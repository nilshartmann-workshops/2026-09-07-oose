"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { Plant } from "@/types";

// 🔎 Fallstrick: mit einem gewöhnlichen import steckt die Liste im Chunk der
//    Seite, ob eingeblendet oder nicht. Erst der verzögerte Import bringt beim
//    ersten Klick eine zusätzliche Datei über die Leitung.
// 🔎 Erzählen: loading ist ein <Suspense>-Fallback. Dieselbe API wie beim
//    Laden der Daten, hier wartet sie auf Code.
const FavoritePlantList = dynamic(() => import("./FavoritePlantList"), {
  loading: () => <p>Favoriten werden geladen ...</p>,
});

type FavoritesPanelProps = {
  plants: Plant[];
};

export default function FavoritesPanel({ plants }: FavoritesPanelProps) {
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <div className={"flex flex-col items-start gap-y-4"}>
      <button
        type={"button"}
        className={"secondary"}
        onClick={() => setShowFavorites(!showFavorites)}
      >
        {showFavorites ? "Favoriten ausblenden" : "Favoriten einblenden"}
      </button>
      {showFavorites && <FavoritePlantList plants={plants} />}
    </div>
  );
}
