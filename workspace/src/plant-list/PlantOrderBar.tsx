import { Link } from "@tanstack/react-router";

export default function PlantOrderBar() {
  return (
    <div className={"PlantOrderBar"}>
      <span>Sortieren nach:</span>
      {/* 🔎 Zeigen: activeProps setzt die Klasse, solange die Adresse zu
          diesem Link passt. Der aktive Zustand steht damit in der URL und
          nicht in einem useState. */}
      <Link
        to={"/"}
        search={{ orderBy: "id" }}
        activeProps={{ className: "active" }}
      >
        Standard
      </Link>
      <Link
        to={"/"}
        search={{ orderBy: "lastWatered" }}
        activeProps={{ className: "active" }}
      >
        Zuletzt gegossen
      </Link>
    </div>
  );
}
