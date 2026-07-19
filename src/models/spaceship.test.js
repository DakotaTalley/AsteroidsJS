import { describe, it, expect } from "vitest";
import Spaceship from "./spaceship";
import Bullet from "./bullet";

describe("Spaceship#shoot", () => {
  it("fires straight up at the default orientation", () => {
    const s = new Spaceship(50, 50);
    const bullet = s.shoot(1);

    expect(bullet).toBeInstanceOf(Bullet);
    expect(bullet.x).toBe(50);
    expect(bullet.y).toBe(50);
    expect(bullet.frame).toBe(1);
    expect(bullet.dx).toBeCloseTo(0);
    expect(bullet.dy).toBeCloseTo(-0.5);
  });

  it("fires in the direction the ship is rotated", () => {
    const s = new Spaceship(50, 50);
    s.setO(90);
    const bullet = s.shoot(2);

    expect(bullet.dx).toBeCloseTo(0.5);
    expect(bullet.dy).toBeCloseTo(0);
  });
});

describe("Spaceship#getBounds", () => {
  it("returns the three points of the ship's triangle", () => {
    const s = new Spaceship(0, 0);
    const bounds = s.getBounds();

    expect(bounds).toEqual([
      { x: 0, y: -10 },
      { x: 6, y: 10 },
      { x: -6, y: 10 },
    ]);
  });
});
