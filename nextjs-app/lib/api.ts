import { z } from "zod";

import { PlantSchema } from "@/types";

export const BACKEND_URL = "http://localhost:7200";

export async function getPlants(orderBy: string = "id") {
  const response = await fetch(`${BACKEND_URL}/api/plants?orderBy=${orderBy}`);

  if (!response.ok) {
    throw new Error(
      `Pflanzen konnten nicht geladen werden (HTTP ${response.status})`,
    );
  }

  return z.array(PlantSchema).parse(await response.json());
}
