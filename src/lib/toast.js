import { useSyncExternalStore } from "react";

let current = null;
let timer;
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

export function toast(message) {
  clearTimeout(timer);
  current = { id: Date.now(), message };
  emit();
  timer = setTimeout(() => {
    current = null;
    emit();
  }, 2600);
}

export function useToast() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => null
  );
}
