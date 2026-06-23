import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;
      return JSON.parse(item) as T;
    } catch {
      if (process.env.NODE_ENV === "development") {
        console.warn(`useLocalStorage: failed to parse key "${key}", using initial value.`);
      }
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)): void => {
    try {
      const valueToStore =
        typeof value === "function"
          ? (value as (prev: T) => T)(storedValue)
          : value;
      setStoredValue(valueToStore);
      try {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        if (process.env.NODE_ENV === "development") {
          console.warn(`useLocalStorage: failed to write key "${key}" to localStorage.`);
        }
      }
    } catch {
      if (process.env.NODE_ENV === "development") {
        console.warn(`useLocalStorage: setValue failed for key "${key}".`);
      }
    }
  };

  return [storedValue, setValue];
}