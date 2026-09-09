import { Link } from "@tanstack/react-router";

export default function PlantOrderBar() {
  return (
    <div className={"PlantOrderBar"}>
      <span>Sortieren nach:</span>
      <Link to={"/"}
        search={{orderBy: "id"}}
      >Id
      </Link>
      <Link to={"/"}
            search={{orderBy: "lastWatered"}}
      >Last Watered</Link>
    </div>
  );
}
