import { createFileRoute, Link } from "@tanstack/react-router";

import PlantForm from "../plant-form/PlantForm.tsx";

export const Route = createFileRoute("/neu")({
  component: NewPlantPage,
});

function NewPlantPage() {
  return (
    <div className={"AppContainer NewPlantPage"}>
      <header>
        <h1>Neue Pflanze</h1>
        <Link to={"/"}>Zurück zur Liste</Link>
      </header>
      <PlantForm />
    </div>
  );
}
