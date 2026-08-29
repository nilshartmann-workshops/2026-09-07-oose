import { delay, http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { afterEach, beforeAll, expect, it, vi } from "vitest";

import { renderApp } from "./render-app.tsx";
import { Plant } from "./types.ts";

const plants: Plant[] = [
  {
    id: "1",
    name: "Aloe Vera",
    location: "Schlafzimmer",
    wateringInterval: 12,
    lastWatered: "2026-09-01",
  },
  { id: "2", name: "Orchidee", location: "Wohnzimmer", wateringInterval: 20 },
];

const worker = setupWorker(
  http.get("http://localhost:7200/api/plants", async () => {
    // 🔎 Erzählen: ohne die Verzögerung ist die Antwort schon da, bevor das
    //    erste Rendern durch ist, und der Suspense-Fallback wäre nie zu sehen.
    await delay(125);

    return HttpResponse.json(plants);
  }),
);

beforeAll(async () => await worker.start());

afterEach(() => {
  worker.resetHandlers();
  vi.restoreAllMocks();
});

it("shows the suspense fallback and then the plants from the backend", async () => {
  // 🔎 Erzählen: renderApp liegt im Startpunkt. Es baut denselben Router wie
  //    create-router.tsx, nur mit einer Memory-History, denn im Test gibt es
  //    keine Adresszeile.
  const screen = await renderApp();

  await expect
    .element(screen.getByText("Pflanzen werden geladen ..."))
    .toBeInTheDocument();

  await expect.element(screen.getByText("Aloe Vera")).toBeInTheDocument();
  await expect.element(screen.getByText("Orchidee")).toBeInTheDocument();
});

it("shows the error boundary fallback when the backend fails", async () => {
  // 🔎 Erzählen: React schreibt jeden Fehler einer Error Boundary auf die
  //    Konsole, auch den behandelten. Ohne den Spy steht der Lauf voller roter
  //    Ausgaben, und niemand sieht mehr, ob der Test grün war.
  vi.spyOn(console, "error").mockImplementation(() => {});

  // 🔎 Zeigen: worker.use hängt einen Handler nur für diesen einen Test davor.
  //    resetHandlers im afterEach nimmt ihn wieder weg.
  worker.use(
    http.get(
      "http://localhost:7200/api/plants",
      () => new HttpResponse(null, { status: 500 }),
    ),
  );

  const screen = await renderApp();

  await expect
    .element(screen.getByText("Die Pflanzen konnten nicht geladen werden"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Erneut versuchen" }))
    .toBeInTheDocument();
});
