
import type p5 from 'p5';

export class Cube {
  q: number;
  r: number;
  s: number;
  name?: string;
  index?: number;

  constructor(q: number, r: number, s: number, name?: string, index?: number) {
    if (Math.round(q + r + s) !== 0) {
      const q_diff = Math.abs(q - Math.round(q));
      const r_diff = Math.abs(r - Math.round(r));
      const s_diff = Math.abs(s - Math.round(s));
      if (q_diff > r_diff && q_diff > s_diff) {
          q = -r - s;
      } else if (r_diff > s_diff) {
          r = -q - s;
      } else {
          s = -q - r;
      }
    }
    this.q = Math.round(q);
    this.r = Math.round(r);
    this.s = Math.round(s);
    this.name = name;
    this.index = index;
  }
}

export const cubeDirections = [
    new Cube(0, -1, 1, 'N'),
    new Cube(1, -1, 0, 'NE'),
    new Cube(1, 0, -1, 'SE'),
    new Cube(0, 1, -1, 'S'),
    new Cube(-1, 1, 0, 'SW'),
    new Cube(-1, 0, 1, 'NW'),
];

export function cubeAdd(a: Cube, b: Cube): Cube {
    return new Cube(a.q + b.q, a.r + b.r, a.s + b.s);
}

// This hardcoded map defines the spiral layout from the image.
const spiralCoordinates: { [index: number]: { q: number; r: number } } = {
  0: { q: 0, r: 0 }, 1: { q: -1, r: 1 }, 2: { q: 0, r: 1 }, 3: { q: 1, r: 0 },
  4: { q: 1, r: -1 }, 5: { q: 0, r: -1 }, 6: { q: -1, r: 0 }, 7: { q: -2, r: 2 },
  8: { q: -1, r: 2 }, 9: { q: 0, r: 2 }, 10: { q: 1, r: 1 }, 11: { q: 2, r: 0 },
  12: { q: 2, r: -1 }, 13: { q: 2, r: -2 }, 14: { q: 1, r: -2 }, 15: { q: 0, r: -2 },
  16: { q: -1, r: -1 }, 17: { q: -2, r: 0 }, 18: { q: -2, r: 1 }, 19: { q: -3, r: 3 },
  20: { q: -2, r: 3 }, 21: { q: -1, r: 3 }, 22: { q: 0, r: 3 }, 23: { q: 1, r: 2 },
  24: { q: 2, r: 1 }, 25: { q: 3, r: 0 }, 26: { q: 3, r: -1 }, 27: { q: 3, r: -2 },
  28: { q: 3, r: -3 }, 29: { q: 2, r: -3 }, 30: { q: 1, r: -3 }, 31: { q: 0, r: -3 },
  32: { q: -1, r: -2 }, 33: { q: -2, r: -1 }, 34: { q: -3, r: 0 }, 35: { q: -3, r: 1 },
  36: { q: -3, r: 2 }, 37: { q: -4, r: 4 }, 38: { q: -3, r: 4 }, 39: { q: -2, r: 4 },
  40: { q: -1, r: 4 }, 41: { q: 0, r: 4 }, 42: { q: 1, r: 3 }, 43: { q: 2, r: 2 },
  44: { q: 3, r: 1 }, 45: { q: 4, r: 0 }, 46: { q: 4, r: -1 }, 47: { q: 4, r: -2 },
  48: { q: 4, r: -3 }, 49: { q: 4, r: -4 }, 50: { q: 3, r: -4 }, 51: { q: 2, r: -4 },
  52: { q: 1, r: -4 }, 53: { q: 0, r: -4 }, 54: { q: -1, r: -3 }, 55: { q: -2, r: -2 },
  56: { q: -3, r: -1 }, 57: { q: -4, r: 0 }, 58: { q: -4, r: 1 }, 59: { q: -4, r: 2 },
  60: { q: -4, r: 3 }, 61: { q: -5, r: 5 }, 62: { q: -4, r: 5 }, 63: { q: -3, r: 5 },
  64: { q: -2, r: 5 }, 65: { q: -1, r: 5 }, 66: { q: 0, r: 5 }, 67: { q: 1, r: 4 },
  68: { q: 2, r: 3 }, 69: { q: 3, r: 2 }, 70: { q: 4, r: 1 }, 71: { q: 5, r: 0 },
  72: { q: 5, r: -1 }, 73: { q: 5, r: -2 }, 74: { q: 5, r: -3 }, 75: { q: 5, r: -4 },
  76: { q: 5, r: -5 }, 77: { q: 4, r: -5 }, 78: { q: 3, r: -5 }, 79: { q: 2, r: -5 },
  80: { q: 1, r: -5 }, 81: { q: 0, r: -5 }, 82: { q: -1, r: -4 }, 83: { q: -2, r: -3 },
  84: { q: -3, r: -2 }, 85: { q: -4, r: -1 }, 86: { q: -5, r: 0 }, 87: { q: -5, r: 1 },
  88: { q: -5, r: 2 }, 89: { q: -5, r: 3 }, 90: { q: -5, r: 4 }
};

export function createHexGrid(radius: number): Cube[] {
    const hexGrid: Cube[] = [];
    const maxIndex = (radius * (radius + 1)) * 3; // Max index for a grid of a given radius

    for (let i = 0; i <= maxIndex; i++) {
        const coords = spiralCoordinates[i];
        if (coords) {
            hexGrid.push(new Cube(coords.q, coords.r, -coords.q - coords.r, undefined, i));
        }
    }
    return hexGrid;
}


export function cubeToPixel(cube: Cube, size: number, p: p5) {
  if (!cube) {
    // Prevent crash if cube is undefined
    return p.createVector(0, 0);
  }
  const x = size * (3/2 * cube.q);
  const y = size * (Math.sqrt(3)/2 * cube.q + Math.sqrt(3) * cube.r);
  return p.createVector(x, y);
}

export function pixelToCube(x: number, y: number, size: number) {
  const q = (2/3 * x) / size;
  const r = (-1/3 * x + Math.sqrt(3)/3 * y) / size;
  return new Cube(q, r, -q - r);
}
