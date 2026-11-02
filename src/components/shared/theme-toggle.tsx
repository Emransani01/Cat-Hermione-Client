"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@teispace/next-themes";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <button
        type="button"
        className="btn btn-circle h-10 min-h-10 w-10 border border-base-300 bg-base-100"
        aria-label="Loading theme"
        disabled
      >
        <Sun size={19} />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="btn btn-circle h-10 min-h-10 w-10 border border-base-300 bg-base-100 text-base-content hover:border-primary/40 hover:bg-secondary"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
