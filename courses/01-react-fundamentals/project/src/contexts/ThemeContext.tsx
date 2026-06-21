import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext =
  createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useLocalStorage<Theme>(
      "task-app-theme",
      "light"
    );

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) =>
      prev === "light" ? "dark" : "light"
    );
  };

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);

  return (
    ctx || {
      theme: "light",
      setTheme: () => {},
      toggleTheme: () => {},
    }
  );
}