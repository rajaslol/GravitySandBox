import { useRef, useState, useEffect } from 'react';
import { useSimulation } from './useSimulation';
import { MaterialButton } from './MaterialButton';
import { ThemeToggle } from './ThemeToggle';
import { BrushSlider } from './BrushSlider';
import { Legend } from './Legend';
import { VOID, SAND, WATER, STONE } from './types';

export function FallingSandSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentMaterial, setCurrentMaterial] = useState(SAND);
  const [brushSize, setBrushSize] = useState(4);
  const [isDark, setIsDark] = useState(true);

  const {
    canvasWidth,
    canvasHeight,
    setMaterial,
    setBrushSize: setSimBrushSize,
    setDarkMode,
    clearGrid,
    handlePointerStart,
    handlePointerMove,
    handlePointerEnd,
  } = useSimulation(canvasRef);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setDarkMode(isDark);
  }, [isDark, setDarkMode]);

  const handleMaterialChange = (material: number) => {
    setCurrentMaterial(material);
    setMaterial(material);
  };

  const handleBrushChange = (size: number) => {
    setBrushSize(size);
    setSimBrushSize(size);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handlePointerStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handlePointerMove(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case '1':
          handleMaterialChange(SAND);
          break;
        case '2':
          handleMaterialChange(WATER);
          break;
        case '3':
          handleMaterialChange(STONE);
          break;
        case 'e':
          handleMaterialChange(VOID);
          break;
        case 'c':
          clearGrid();
          break;
        case 't':
          setIsDark((prev) => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearGrid]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 max-w-4xl w-full">
        {/* Header */}
        <header className="flex items-center gap-4">
          <h1 className="font-mono text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            ⏳ FALLING SAND
          </h1>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </header>

        {/* Controls */}
        <nav className="flex flex-wrap gap-2 justify-center">
          <MaterialButton
            label="Sand"
            icon="🏖️"
            variant="sand"
            isSelected={currentMaterial === SAND}
            onClick={() => handleMaterialChange(SAND)}
          />
          <MaterialButton
            label="Water"
            icon="💧"
            variant="water"
            isSelected={currentMaterial === WATER}
            onClick={() => handleMaterialChange(WATER)}
          />
          <MaterialButton
            label="Stone"
            icon="🪨"
            variant="stone"
            isSelected={currentMaterial === STONE}
            onClick={() => handleMaterialChange(STONE)}
          />
          <MaterialButton
            label="Erase"
            icon="✨"
            variant="erase"
            isSelected={currentMaterial === VOID}
            onClick={() => handleMaterialChange(VOID)}
          />
          <MaterialButton
            label="Clear"
            icon="🗑️"
            variant="clear"
            isSelected={false}
            onClick={clearGrid}
          />
        </nav>

        {/* Settings */}
        <div className="flex flex-wrap gap-4 justify-center">
          <BrushSlider value={brushSize} onChange={handleBrushChange} />
        </div>

        {/* Canvas */}
        <main>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="border-4 border-canvas-border bg-canvas-bg cursor-crosshair shadow-lg max-w-full h-auto"
            style={{ imageRendering: 'pixelated' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handlePointerEnd}
            onMouseLeave={handlePointerEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handlePointerEnd}
            onContextMenu={(e) => e.preventDefault()}
          />
        </main>

        {/* Legend */}
        <Legend />

        {/* Info */}
        <footer className="text-center max-w-md">
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            Click and drag to paint particles. Sand sinks through water, stone becomes immovable once it lands.
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-2">
            Keys: 1=Sand, 2=Water, 3=Stone, E=Erase, C=Clear, T=Theme
          </p>
        </footer>
      </div>
    </div>
  );
}
