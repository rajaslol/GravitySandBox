interface BrushSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function BrushSlider({ value, onChange }: BrushSliderProps) {
  return (
    <div className="flex items-center gap-4 bg-card border-2 border-border px-4 py-3">
      <label className="font-mono text-sm text-muted-foreground whitespace-nowrap">
        Brush:
      </label>
      <input
        type="range"
        min="1"
        max="12"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-24 h-2 bg-muted appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
      />
      <span className="font-mono text-sm font-bold text-accent bg-secondary px-2 py-1 border border-border min-w-[2rem] text-center">
        {value}
      </span>
    </div>
  );
}
