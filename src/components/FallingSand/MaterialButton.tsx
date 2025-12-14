import { cn } from "@/lib/utils";

interface MaterialButtonProps {
  label: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
  variant: 'sand' | 'water' | 'stone' | 'erase' | 'clear';
}

const variantStyles = {
  sand: "bg-sand text-foreground hover:bg-sand-dark border-2 border-sand-dark",
  water: "bg-water text-primary-foreground hover:bg-water-dark border-2 border-water-dark",
  stone: "bg-stone text-primary-foreground hover:bg-stone-dark border-2 border-stone-dark",
  erase: "bg-secondary text-secondary-foreground hover:bg-muted border-2 border-border",
  clear: "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-2 border-destructive/80",
};

export function MaterialButton({ label, icon, isSelected, onClick, variant }: MaterialButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-3 font-mono text-sm font-semibold transition-all duration-200",
        "active:translate-y-0.5",
        variantStyles[variant],
        isSelected && "ring-2 ring-foreground ring-offset-2 ring-offset-background shadow-lg translate-y-[-2px]"
      )}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}
