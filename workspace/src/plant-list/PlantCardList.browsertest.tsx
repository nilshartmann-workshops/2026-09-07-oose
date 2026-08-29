import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { Plant } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";

// 🔎 Erzählen: die echte PlantCard braucht einen QueryClient, den Router und
//    den Favoriten-Store. Nichts davon gehört zum Thema dieses Tests.
vi.mock("./PlantCard.tsx", () => ({
  // 🔎 Fallstrick: der Schlüssel heißt default, denn PlantCard ist ein
  //    Default-Export. Eine Komponente ist eine Funktion, mehr braucht der
  //    Ersatz nicht.
  default({ name }: { name: string }) {
    return <article>{name}</article>;
  },
}));

const plants: Plant[] = [
  { id: "1", name: "Aloe Vera", location: "Küche", wateringInterval: 7 },
  { id: "2", name: "Orchidee", location: "Wohnzimmer", wateringInterval: 14 },
];

it("renders one card per plant", async () => {
  const screen = await render(<PlantCardList plants={plants} />);

  expect(screen.getByRole("article").all()).toHaveLength(plants.length);
});

it("passes the plant name down to PlantCard", async () => {
  const screen = await render(<PlantCardList plants={plants} />);

  await expect.element(screen.getByText("Aloe Vera")).toBeInTheDocument();
  await expect.element(screen.getByText("Orchidee")).toBeInTheDocument();
});
