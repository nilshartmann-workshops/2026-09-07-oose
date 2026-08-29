import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import IntervalSelector from "./IntervalSelector.tsx";

it("reports the typed number through onIntervalChange", async () => {
  const onIntervalChange = vi.fn();

  const screen = await render(
    <IntervalSelector interval={123} onIntervalChange={onIntervalChange} />,
  );

  await expect.element(screen.getByText(/Alle 123 Tage/)).toBeInTheDocument();

  await screen.getByRole("spinbutton").fill("456");

  expect(onIntervalChange).toHaveBeenCalledWith(456);
});

it("reports the value of a quick-select button through onIntervalChange", async () => {
  const onIntervalChange = vi.fn();

  const screen = await render(
    <IntervalSelector interval={1} onIntervalChange={onIntervalChange} />,
  );

  await screen.getByRole("button", { name: "Biweekly" }).click();

  expect(onIntervalChange).toHaveBeenCalledWith(14);
});
