"use client";
import { useState } from "react";

type CounterProps = {
  label?: string
}

export default function Counter({label}: CounterProps) {
  console.log("Counter", new Date().toLocaleTimeString());
  const [count, setCount] = useState(2);

  return <div className={"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}>
    <h3>{label || "Kein Label"}</h3>
    Counter: {count}
    <button onClick={() => setCount(count+1)}>Increase!</button>
  </div>
}