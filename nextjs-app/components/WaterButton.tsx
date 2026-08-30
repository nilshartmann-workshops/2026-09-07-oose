"use client";

import { useTransition } from "react";

import { markAsWatered } from "@/lib/actions";

type WaterButtonProps = {
  id: string;
};

// 🔎 Erzählen: auch dieser Knopf ist eine Client-Komponente, aber aus einem
//    anderen Grund als der Favoriten-Knopf. Er braucht keinen Zustand,
//    sondern das Warten.
export default function WaterButton({ id }: WaterButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type={"button"}
      disabled={isPending}
      onClick={() => startTransition(() => markAsWatered(id))}
    >
      💧 Jetzt gegossen
    </button>
  );
}
