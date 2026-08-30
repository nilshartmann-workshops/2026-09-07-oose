"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

import { BACKEND_URL } from "./api";

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
