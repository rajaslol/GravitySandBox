import { useRef, useCallback, useEffect } from 'react';
import { VOID, SAND, WATER, STONE, PARTICLE_COLORS } from './types';

const CELL_SIZE = 5;
const GRID_WIDTH = 160;
const GRID_HEIGHT = 120;

export function useSimulation(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const gridRef = useRef<number[][]>([]);
  const isStaticRef = useRef<boolean[][]>([]);
  const colorNoiseRef = useRef<number[][]>([]);
  const currentMaterialRef = useRef(SAND);
  const isMouseDownRef = useRef(false);
  const mouseGridRef = useRef({ x: 0, y: 0 });
  const brushRadiusRef = useRef(4);
  const animationFrameRef = useRef<number>();
  const isDarkModeRef = useRef(true);

  const initializeGrids = useCallback(() => {
    const grid: number[][] = [];
    const isStatic: boolean[][] = [];
    const colorNoise: number[][] = [];

    for (let y = 0; y < GRID_HEIGHT; y++) {
      grid[y] = [];
      isStatic[y] = [];
      colorNoise[y] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        grid[y][x] = VOID;
        isStatic[y][x] = false;
        colorNoise[y][x] = (Math.random() - 0.5) * 20;
      }
    }

    gridRef.current = grid;
    isStaticRef.current = isStatic;
    colorNoiseRef.current = colorNoise;
  }, []);

  const getParticleColor = useCallback((type: number, x: number, y: number): string | null => {
    if (type === VOID) return null;
    const base = PARTICLE_COLORS[type];
    const noise = colorNoiseRef.current[y][x];
    const lightness = Math.max(25, Math.min(75, base.l + noise));
    const saturation = Math.max(0, Math.min(100, base.s + noise * 0.5));
    return `hsl(${base.h}, ${saturation}%, ${lightness}%)`;
  }, []);

  const inBounds = useCallback((x: number, y: number) => {
    return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
  }, []);

  const isEmpty = useCallback((x: number, y: number) => {
    return inBounds(x, y) && gridRef.current[y][x] === VOID;
  }, [inBounds]);

  const isWater = useCallback((x: number, y: number) => {
    return inBounds(x, y) && gridRef.current[y][x] === WATER;
  }, [inBounds]);

  const swapCells = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const grid = gridRef.current;
    const colorNoise = colorNoiseRef.current;
    const isStatic = isStaticRef.current;

    const tempType = grid[y1][x1];
    const tempNoise = colorNoise[y1][x1];
    const tempStatic = isStatic[y1][x1];

    grid[y1][x1] = grid[y2][x2];
    colorNoise[y1][x1] = colorNoise[y2][x2];
    isStatic[y1][x1] = isStatic[y2][x2];

    grid[y2][x2] = tempType;
    colorNoise[y2][x2] = tempNoise;
    isStatic[y2][x2] = tempStatic;
  }, []);

  const moveCell = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
    const grid = gridRef.current;
    const colorNoise = colorNoiseRef.current;
    const isStatic = isStaticRef.current;

    grid[toY][toX] = grid[fromY][fromX];
    colorNoise[toY][toX] = colorNoise[fromY][fromX];
    isStatic[toY][toX] = isStatic[fromY][fromX];

    grid[fromY][fromX] = VOID;
    isStatic[fromY][fromX] = false;
  }, []);

  const updateSand = useCallback((x: number, y: number) => {
    const below = y + 1;
    
    if (below < GRID_HEIGHT) {
      if (isEmpty(x, below)) {
        moveCell(x, y, x, below);
        return true;
      }
      if (isWater(x, below)) {
        swapCells(x, y, x, below);
        return true;
      }
    }

    const dir = Math.random() < 0.5 ? -1 : 1;
    const diag1X = x + dir;
    const diag2X = x - dir;

    if (below < GRID_HEIGHT) {
      if (inBounds(diag1X, below)) {
        if (isEmpty(diag1X, below)) {
          moveCell(x, y, diag1X, below);
          return true;
        }
        if (isWater(diag1X, below)) {
          swapCells(x, y, diag1X, below);
          return true;
        }
      }
      if (inBounds(diag2X, below)) {
        if (isEmpty(diag2X, below)) {
          moveCell(x, y, diag2X, below);
          return true;
        }
        if (isWater(diag2X, below)) {
          swapCells(x, y, diag2X, below);
          return true;
        }
      }
    }

    return false;
  }, [isEmpty, isWater, moveCell, swapCells, inBounds]);

  const updateWater = useCallback((x: number, y: number) => {
    const below = y + 1;

    if (below < GRID_HEIGHT && isEmpty(x, below)) {
      moveCell(x, y, x, below);
      return true;
    }

    const dir = Math.random() < 0.5 ? -1 : 1;

    if (below < GRID_HEIGHT) {
      if (isEmpty(x + dir, below)) {
        moveCell(x, y, x + dir, below);
        return true;
      }
      if (isEmpty(x - dir, below)) {
        moveCell(x, y, x - dir, below);
        return true;
      }
    }

    const spreadDir = Math.random() < 0.5 ? -1 : 1;
    const canSpreadPrimary = isEmpty(x + spreadDir, y);
    const canSpreadSecondary = isEmpty(x - spreadDir, y);

    if (canSpreadPrimary) {
      moveCell(x, y, x + spreadDir, y);
      return true;
    } else if (canSpreadSecondary) {
      moveCell(x, y, x - spreadDir, y);
      return true;
    }

    return false;
  }, [isEmpty, moveCell]);

  const updateStone = useCallback((x: number, y: number) => {
    if (isStaticRef.current[y][x]) return false;

    const below = y + 1;

    if (below < GRID_HEIGHT) {
      if (isEmpty(x, below)) {
        moveCell(x, y, x, below);
        return true;
      }
      if (isWater(x, below)) {
        swapCells(x, y, x, below);
        return true;
      }
    }

    isStaticRef.current[y][x] = true;
    return false;
  }, [isEmpty, isWater, moveCell, swapCells]);

  const updateCell = useCallback((x: number, y: number) => {
    const cellType = gridRef.current[y][x];
    switch (cellType) {
      case SAND:
        updateSand(x, y);
        break;
      case WATER:
        updateWater(x, y);
        break;
      case STONE:
        updateStone(x, y);
        break;
    }
  }, [updateSand, updateWater, updateStone]);

  const updateSimulation = useCallback(() => {
    const leftToRight = Math.random() < 0.5;

    for (let y = GRID_HEIGHT - 2; y >= 0; y--) {
      if (leftToRight) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          updateCell(x, y);
        }
      } else {
        for (let x = GRID_WIDTH - 1; x >= 0; x--) {
          updateCell(x, y);
        }
      }
    }
  }, [updateCell]);

  const paintParticles = useCallback((centerX: number, centerY: number) => {
    const radiusSq = brushRadiusRef.current * brushRadiusRef.current;

    for (let dy = -brushRadiusRef.current; dy <= brushRadiusRef.current; dy++) {
      for (let dx = -brushRadiusRef.current; dx <= brushRadiusRef.current; dx++) {
        if (dx * dx + dy * dy > radiusSq) continue;

        const x = centerX + dx;
        const y = centerY + dy;

        if (!inBounds(x, y)) continue;
        if (Math.random() > 0.75) continue;

        if (currentMaterialRef.current === VOID) {
          gridRef.current[y][x] = VOID;
          isStaticRef.current[y][x] = false;
        } else if (gridRef.current[y][x] === VOID) {
          gridRef.current[y][x] = currentMaterialRef.current;
          isStaticRef.current[y][x] = false;
          colorNoiseRef.current[y][x] = (Math.random() - 0.5) * 25;
        }
      }
    }
  }, [inBounds]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get background color based on theme
    const bgColor = isDarkModeRef.current ? '#080810' : '#e8e8e8';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cellType = gridRef.current[y][x];

        if (cellType !== VOID) {
          const color = getParticleColor(cellType, x, y);
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }
    }
  }, [canvasRef, getParticleColor]);

  const gameLoop = useCallback(() => {
    if (isMouseDownRef.current) {
      paintParticles(mouseGridRef.current.x, mouseGridRef.current.y);
    }

    updateSimulation();
    render();

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [paintParticles, updateSimulation, render]);

  const screenToGrid = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x = Math.floor((clientX - rect.left) * scaleX / CELL_SIZE);
    let y = Math.floor((clientY - rect.top) * scaleY / CELL_SIZE);

    x = Math.max(0, Math.min(GRID_WIDTH - 1, x));
    y = Math.max(0, Math.min(GRID_HEIGHT - 1, y));

    return { x, y };
  }, [canvasRef]);

  const handlePointerStart = useCallback((clientX: number, clientY: number) => {
    isMouseDownRef.current = true;
    const pos = screenToGrid(clientX, clientY);
    mouseGridRef.current = pos;
  }, [screenToGrid]);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    const pos = screenToGrid(clientX, clientY);
    mouseGridRef.current = pos;
  }, [screenToGrid]);

  const handlePointerEnd = useCallback(() => {
    isMouseDownRef.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GRID_WIDTH * CELL_SIZE;
    canvas.height = GRID_HEIGHT * CELL_SIZE;

    initializeGrids();
    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef, initializeGrids, gameLoop]);

  return {
    canvasWidth: GRID_WIDTH * CELL_SIZE,
    canvasHeight: GRID_HEIGHT * CELL_SIZE,
    setMaterial: (material: number) => {
      currentMaterialRef.current = material;
    },
    setBrushSize: (size: number) => {
      brushRadiusRef.current = size;
    },
    setDarkMode: (isDark: boolean) => {
      isDarkModeRef.current = isDark;
    },
    clearGrid: initializeGrids,
    handlePointerStart,
    handlePointerMove,
    handlePointerEnd,
  };
}
