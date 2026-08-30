import Link from "next/link";

const orderOptions = [
  { orderBy: "id", label: "Standard" },
  { orderBy: "name", label: "Name" },
  { orderBy: "location", label: "Standort" },
  { orderBy: "lastWatered", label: "Zuletzt gegossen" },
] as const;

type PlantOrderBarProps = {
  orderBy: string;
};

export default function PlantOrderBar({ orderBy }: PlantOrderBarProps) {
  return (
    <div className={"PlantOrderBar"}>
      <span>Sortieren nach:</span>
      {orderOptions.map((option) => (
        // 🔎 Zeigen: den Pfad vor dem Fragezeichen vertippen, dann meckert
        //    TypeScript. Hinter dem Fragezeichen darf alles stehen.
        <Link
          key={option.orderBy}
          href={`/?orderBy=${option.orderBy}`}
          className={option.orderBy === orderBy ? "active" : undefined}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
