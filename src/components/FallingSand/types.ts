export const VOID = 0;
export const SAND = 1;
export const WATER = 2;
export const STONE = 3;

export type ParticleType = typeof VOID | typeof SAND | typeof WATER | typeof STONE;

export interface ParticleColor {
  h: number;
  s: number;
  l: number;
}

export const PARTICLE_COLORS: Record<number, ParticleColor> = {
  [SAND]: { h: 48, s: 85, l: 55 },
  [WATER]: { h: 210, s: 75, l: 58 },
  [STONE]: { h: 220, s: 5, l: 55 },
};
