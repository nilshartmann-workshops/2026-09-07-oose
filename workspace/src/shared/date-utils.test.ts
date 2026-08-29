import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { getDaysUntilWatering } from "./date-utils.ts";

beforeEach(() => {
  // 🔎 Erzählen: die Funktion rechnet gegen new Date(). Ohne einen festen
  //    Stichtag hinge das Ergebnis davon ab, wann der Test läuft.
  vi.useFakeTimers();
  // 🔎 Fallstrick: das Z am Ende. new Date(2026, 8, 7) wäre Mitternacht in der
  //    Zeitzone des Rechners, und die Zahlen unten stimmten nur in Berlin.
  vi.setSystemTime(new Date("2026-09-07T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

it("returns the remaining days while the plant still has time", () => {
  expect(getDaysUntilWatering("2026-09-05", 7)).toBe(4);
});

it("returns zero on the day the plant has to be watered", () => {
  expect(getDaysUntilWatering("2026-09-01", 7)).toBe(0);
});

it("returns a negative number once watering is overdue", () => {
  expect(getDaysUntilWatering("2026-08-30", 7)).toBe(-2);
});
