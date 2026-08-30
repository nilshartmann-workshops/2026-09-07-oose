import Link from "next/link";

import PlantForm from "@/components/PlantForm";

export default function NewPlantPage() {
  return (
    <>
      <div className={"mb-4 flex items-center justify-between"}>
        <h1 className={"text-2xl font-bold text-green-800"}>Neue Pflanze</h1>
        <Link href={"/"}>Zurück zur Liste</Link>
      </div>
      <PlantForm />
    </>
  );
}
