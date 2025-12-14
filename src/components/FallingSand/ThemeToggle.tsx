import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-3 font-mono text-sm font-semibold bg-secondary text-secondary-foreground border-2 border-border hover:bg-muted transition-all duration-200 active:translate-y-0.5"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          Light
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          Dark
        </>
      )}
    </button>
  );
}
