/* eslint-disable react-refresh/only-export-components --
 * Die Verwaltung der Toasts und ihre Anzeige stehen zusammen in einer Datei,
 * damit die Demo mit möglichst wenigen Hilfsdateien auskommt. Fast Refresh
 * lädt diese Datei dafür immer ganz neu.
 */
import { useEffect, useState } from "react";

type Toast = { id: number; message: string; time: string };
type ToastListener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let nextId = 0;
const listeners = new Set<ToastListener>();

// So lange steht ein Toast. Der Wert liegt über dem Abstand zweier Meldungen,
// damit sich in der Vorführung mehrere übereinander sammeln.
const TOAST_DURATION_MS = 12000;

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

export function addToast(message: string) {
  const id = nextId++;
  const time = new Date().toLocaleTimeString("de-DE");
  toasts = [...toasts, { id, message, time }].slice(-5);
  emit();

  setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id);
    emit();
  }, TOAST_DURATION_MS);
}

export function clearToasts() {
  toasts = [];
  emit();
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState(toasts);

  // Anmelden im Effekt, damit beim Rendern kein Seiteneffekt entsteht.
  useEffect(() => {
    listeners.add(setCurrentToasts);
    return () => {
      listeners.delete(setCurrentToasts);
    };
  }, []);

  return (
    <div className={"fixed top-4 right-4 z-50 flex flex-col gap-2"}>
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={"rounded-lg bg-emerald-600 px-6 py-3 text-white shadow-lg"}
        >
          <span className={"mr-2 font-mono text-xs text-emerald-100"}>
            {toast.time}
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
