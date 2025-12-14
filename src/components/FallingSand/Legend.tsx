const legendItems = [
  { color: "bg-sand", label: "Sand: Falls & piles up" },
  { color: "bg-water", label: "Water: Flows & spreads" },
  { color: "bg-stone", label: "Stone: Falls then stays fixed" },
];

export function Legend() {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={`w-4 h-4 ${item.color} border border-border`} />
          <span className="font-mono text-xs text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
