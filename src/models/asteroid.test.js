import { describe, it, expect } from "vitest";
import Asteroid from "./asteroid";

describe("Asteroid#genBounds", () => {
  it("produces one point per side plus a closing point back to the start", () => {
    const a = new Asteroid(100, 100, 0.1, 0.1, 3, 8);
    const bounds = a.getBounds();
    expect(bounds).toHaveLength(9);
    expect(bounds[8]).toEqual(bounds[0]);
  });
});

describe("Asteroid#split", () => {
  it("returns 0 when splitting a size-1 asteroid", () => {
    const a = new Asteroid(100, 100, 0.1, 0.1, 1, 8);
    expect(a.split()).toBe(0);
  });

  it("returns two smaller asteroids with mirrored velocity when size > 1", () => {
    const a = new Asteroid(100, 100, 0.2, 0.3, 2, 8);
    const result = a.split();

    expect(result).toHaveLength(2);
    const [first, second] = result;

    expect(first).toBeInstanceOf(Asteroid);
    expect(second).toBeInstanceOf(Asteroid);
    expect(first.size).toBe(1);
    expect(second.size).toBe(1);
    expect(first.dx).toBe(0.2);
    expect(first.dy).toBe(-0.3);
    expect(second.dx).toBe(-0.2);
    expect(second.dy).toBe(0.3);
  });
});
