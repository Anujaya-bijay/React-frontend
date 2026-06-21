import { useState } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);

      if (item) {
        return JSON.parse(item);
      }

      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (
    value: T | ((prev: T) => T)
  ) => {
    try {
      const valueToStore =
        value instanceof Function
          ? value(storedValue)
          : value;

      setStoredValue(valueToStore);

      localStorage.setItem(
        key,
        JSON.stringify(valueToStore)
      );
    } catch {}
  };

  return [storedValue, setValue];
}

export default useLocalStorage;