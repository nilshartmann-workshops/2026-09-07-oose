import dayjs from "dayjs";

import {produce} from "immer"

import { getDaysUntilWatering } from "../shared/date-utils.ts";
import { useState } from "react";
import { selectIsFavorite, useFavoriteStore } from "./useFavoritesStore.ts";

type PlantCardProps = {
  id: string;
  name: string;
  location: string;
  wateringInterval: number;
  lastWatered?: string;
};

type Person = {
  firstname: string;
  lastname: string;
}

type PersonMitAdresse = {
  firstname: string;
  lastname: string;
  address: {
    plz: string;
    city: string;

  }
}

import { useShallow} from "zustand/react/shallow"

export default function PlantCard({
  id,
  name,
  location,
  wateringInterval,
  lastWatered,
}: PlantCardProps) {

  console.log("PlantCard", id, new Date().toLocaleTimeString())


  // const x = useFavoriteStore(
  //   // Selektor-Funktion
  //   useShallow(
  //     store => store.favoriteIds.filter(fId => fId === "...")
  //   )
  // )

  // const {toggleFav, isFavorite } = useFavoriteStore(
  //   store => {
  //     return {
  //       toggleFav: store.toggleFavorite,
  //       isFavorite: store.favoriteIds.includes(id),
  //     };
  //   }
  // )
  const toggleFav = useFavoriteStore(
    // Selektor-Funktion
    store => store.toggleFavorite,

  )
  // const store = useFavoriteStore();

  const isFavorite = useFavoriteStore(
    // Selektor-Funktion
    selectIsFavorite(id)
  )


  // const [person, setPerson ] = useState<PersonMitAdresse>({firstname: "...", lastname: "..."});
  //
  // function onLastnameChange(newLastname: string) {
  //   person.lastname = newLastname; // VERBOTEN
  //   setPerson(person);
  //
  //   // Variant 2 OK
  //   // const newPerson = {
  //   //   firstname: person.firstname,
  //   //   lastname: newLastname
  //   // }
  //   // setPerson(newPerson);
  //
  //   // Variante 3 OK
  //   const newPerson2 = {
  //     ...person,
  //     //^... spread operator
  //     lastname: newLastname
  //   }
  //
  //   const newPerson3: PersonMitAdresse = {
  //     ...person,
  //     //^... spread operator
  //     address: {
  //       ...person.address,
  //       city: "Hamburg"
  //     }
  //   }
  //
  //   // "immer.js" (https://immerjs.github.io)
  //   const newPerson = produce(person, draft => {
  //     draft.lastname = "Müller";
  //     draft.address.city = "Hamburg";
  //   });
  //
  //
  // }



  const wateringInfo =
    wateringInterval === 1
      ? "Jeden Tag gießen!"
      : `Alle ${wateringInterval} Tage gießen`;

  const lastWateredMsg = lastWatered ? (
    <div>Zuletzt: {dayjs(lastWatered).locale("de").format("DD.MM.YYYY")}</div>
  ) : (
    <div>Noch nicht gegossen 🍂</div>
  );

  const daysUntilWatering = lastWatered
    ? getDaysUntilWatering(lastWatered, wateringInterval)
    : null;

  const wateringMsg = daysUntilWatering !== null && (
    <div>
      {daysUntilWatering > 0
        ? `Noch ${daysUntilWatering} Tage bis zum Gießen`
        : daysUntilWatering === 0
          ? "Heute gießen!"
          : `Überfällig seit ${Math.abs(daysUntilWatering)} Tag(en)`}
    </div>
  );

  return (
    <div className={"PlantCard"}>
      <header>
        <h2>{name}</h2>
        <div>📍{location}</div>
      </header>
      <section>
        <div>{wateringInfo}</div>
        {lastWateredMsg}
        {wateringMsg}
      </section>
      <button onClick={() => toggleFav(id)}>

        { isFavorite ? "Favorite entfernen" : "Favorit hinzufügen" }

      </button>
    </div>
  );
}
