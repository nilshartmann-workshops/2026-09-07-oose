"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { NewPlant, NewPlantSchema } from "@/types";

import { BACKEND_URL } from "./api";

const ProblemsSchema = z.array(z.object({ error: z.string() }));

// 🔎 Erzählen: "use server" heißt nicht „läuft auf dem Server", denn das tut
//    hier ohnehin alles. Es macht aus jedem Export dieser Datei einen
//    Endpunkt, den der Browser unter einer erzeugten Id aufrufen kann.
export async function markAsWatered(id: string) {
  const response = await fetch(`${BACKEND_URL}/api/plants/${id}/lastWatered`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ lastWatered: dayjs().format("YYYY-MM-DD") }),
  });

  if (!response.ok) {
    throw new Error(`Gießen fehlgeschlagen (HTTP ${response.status})`);
  }

  // 🔎 Erzählen: steht hier an der Stelle von invalidateQueries. Next rendert
  //    die Seite neu und schickt das Ergebnis in derselben Antwort zurück.
  revalidatePath("/");
}

// 🔎 Erzählen: der Typ des Arguments ist ein Versprechen des Aufrufers und
//    keine Prüfung. Jeder kann diesen Endpunkt mit beliebigem Rumpf aufrufen,
//    deshalb prüft die Action noch einmal, was das Formular längst geprüft hat.
export async function createPlant(newPlant: NewPlant) {
  const parsed = NewPlantSchema.safeParse(newPlant);

  if (!parsed.success) {
    return { error: "Die Pflanze ist nicht vollständig ausgefüllt" };
  }

  const response = await fetch(`${BACKEND_URL}/api/plants`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!response.ok) {
    // 🔎 Fallstrick: im Rumpf steht ein Array von Meldungen und nicht eine
    //    einzelne.
    const problems = ProblemsSchema.parse(await response.json());
    return { error: problems.map((problem) => problem.error).join(" ") };
  }

  revalidatePath("/");
  redirect("/");
}
