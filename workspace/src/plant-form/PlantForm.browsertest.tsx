import { QueryClientProvider } from "@tanstack/react-query";
import { delay, http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { afterEach, beforeAll, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { createQueryClient } from "../create-query-client.tsx";
import PlantForm from "./PlantForm.tsx";

// 🔎 Erzählen: hier steht kein Handler. Was das Backend antwortet, entscheidet
//    jeder Test für sich mit worker.use.
const worker = setupWorker();

beforeAll(async () => await worker.start());
afterEach(() => worker.resetHandlers());

function renderForm() {
  // 🔎 Erzählen: das Formular kennt den Router nicht, ihm reicht der
  //    QueryClientProvider. Die Startseite brauchte beides.
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <PlantForm />
    </QueryClientProvider>,
  );
}

it("sends the form and reports the new plant", async () => {
  worker.use(
    http.post("http://localhost:7200/api/plants", async () => {
      await delay(125);

      return HttpResponse.json({ id: "99" }, { status: 201 });
    }),
  );

  const screen = await renderForm();

  // 🔎 Erzählen: getByLabelText findet die Felder, weil label und input seit
  //    dem Formular-Block über htmlFor und id verbunden sind.
  await screen.getByLabelText("Name der Pflanze").fill("Basilikum");
  await screen.getByLabelText("Standort").fill("Küche");

  const submitButton = screen.getByRole("button", {
    name: /Pflanze hinzufügen/,
  });

  await submitButton.click();

  await expect.element(submitButton).toBeDisabled();

  await expect
    .element(screen.getByText(/Pflanze angelegt/))
    .toBeInTheDocument();
});

it("shows the message of a rejected plant on the name field", async () => {
  worker.use(
    http.post("http://localhost:7200/api/plants", () =>
      // 🔎 Fallstrick: das Backend antwortet mit einem Array von Meldungen und
      //    nicht mit einer einzelnen.
      HttpResponse.json([{ error: "Bitte nicht schreien" }], { status: 400 }),
    ),
  );

  const screen = await renderForm();

  await screen.getByLabelText("Name der Pflanze").fill("BASILIKUM");
  await screen.getByLabelText("Standort").fill("Küche");
  await screen.getByRole("button", { name: /Pflanze hinzufügen/ }).click();

  await expect
    .element(screen.getByText("Bitte nicht schreien"))
    .toBeInTheDocument();
});
