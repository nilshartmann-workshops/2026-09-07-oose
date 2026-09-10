"use client";

import { markAsWatered } from "@/lib/watering-api";

type WaterButtonProps = {
  id: string;
};

export default function WaterButton({ id }: WaterButtonProps) {
  return <button
    onClick={() => markAsWatered(id)}
    type={"button"}>Wässern!</button>;
}
