"use server"

import { BACKEND_URL } from "@/lib/api";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export async function markAsWatered(id: string) {

  

  const response = await fetch(`${BACKEND_URL}/api/plants/${id}/lastWatered`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ lastWatered: dayjs().format("YYYY-MM-DD") }),
  });

  if (!response.ok) {
    throw new Error(`Gießen fehlgeschlagen (HTTP ${response.status})`);
  }

  revalidatePath("/");
}
