import { ChangeEvent } from "react";

type IntervalSelectorProps = {
  interval?: number;
  onIntervalChange(newInterval: number): void;
};

export default function IntervalSelector({
  interval,
  onIntervalChange,
}: IntervalSelectorProps) {
  const handleIntervalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valueAsString = e.target.value;

    // alternativ parseInt
    onIntervalChange(Number(valueAsString));
  };

  // Validierung (z.B. keine negativen Zahlen) machen wir später

  return (
    <div className={""}>
      <label>Interval</label>
      <input
        type={"number"}
        value={interval || ""}
        onChange={handleIntervalChange}
      />
      <button
        type="button"
        className={"sm"}
        onClick={() => onIntervalChange(1)}
      >
        Dayly
      </button>
      <button
        type="button"
        className={"sm"}
        onClick={() => onIntervalChange(7)}
      >
        Weekly
      </button>
      <button
        type="button"
        className={"sm"}
        onClick={() => onIntervalChange(14)}
      >
        Biweekly
      </button>
      {interval !== undefined && (
        <div className={"px-1 text-sm"}>Alle {interval} Tage gießen</div>
      )}
    </div>
  );
}
