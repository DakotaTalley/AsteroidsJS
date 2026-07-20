import { describe, it, expect } from "vitest";
import Spaceship from "./spaceship";
import Bullet from "./bullet";

describe("Spaceship#shoot", () => {
  it("fires straight up at the default orientation", () => {
    const s = new Spaceship(50, 50);
    const bullet = s.shoot();

    expect(bullet).toBeInstanceOf(Bullet);
    expect(bullet.x).toBe(50);
    expect(bullet.y).toBe(50);
    expect(bullet.dx).toBeCloseTo(0);
    expect(bullet.dy).toBeCloseTo(-0.5);
  });

  it("fires in the direction the ship is rotated", () => {
    const s = new Spaceship(50, 50);
    s.setO(90);
    const bullet = s.shoot();

    expect(bullet.dx).toBeCloseTo(0.5);
    expect(bullet.dy).toBeCloseTo(0);
  });
});

describe("Spaceship#accelerate", () => {
  it.each([
    {
      name: "dx above maxD",
      orientation: 90,
      dx: 0.4,
      dy: 0,
      expected: { dx: 0.5, dy: 0 },
    },
    {
      name: "dx below -maxD",
      orientation: 270,
      dx: -0.4,
      dy: 0,
      expected: { dx: -0.5, dy: 0 },
    },
    {
      name: "dy above maxD",
      orientation: 180,
      dx: 0,
      dy: 0.4,
      expected: { dx: 0, dy: 0.5 },
    },
    {
      name: "dy below -maxD",
      orientation: 0,
      dx: 0,
      dy: -0.4,
      expected: { dx: 0, dy: -0.5 },
    },
  ])("clamps $name to maxD", ({ orientation, dx, dy, expected }) => {
    const s = new Spaceship(0, 0);
    s.jerk = 1;
    s.setO(orientation);
    s.setDx(dx);
    s.setDy(dy);
    s.accelerate(1);
    expect(s.dx).toBeCloseTo(expected.dx);
    expect(s.dy).toBeCloseTo(expected.dy);
  });
});

describe("Spaceship#decelerate", () => {
  it.each([
    {
      name: "dx above maxD",
      orientation: 270,
      dx: 0.4,
      dy: 0,
      expected: { dx: 0.5, dy: 0 },
    },
    {
      name: "dx below -maxD",
      orientation: 90,
      dx: -0.4,
      dy: 0,
      expected: { dx: -0.5, dy: 0 },
    },
    {
      name: "dy above maxD",
      orientation: 0,
      dx: 0,
      dy: 0.4,
      expected: { dx: 0, dy: 0.5 },
    },
    {
      name: "dy below -maxD",
      orientation: 180,
      dx: 0,
      dy: -0.4,
      expected: { dx: 0, dy: -0.5 },
    },
  ])("clamps $name to maxD", ({ orientation, dx, dy, expected }) => {
    const s = new Spaceship(0, 0);
    s.jerk = 1;
    s.setO(orientation);
    s.setDx(dx);
    s.setDy(dy);
    s.decelerate(1);
    expect(s.dx).toBeCloseTo(expected.dx);
    expect(s.dy).toBeCloseTo(expected.dy);
  });
});

describe("Spaceship#getBounds", () => {
  it("returns the three points of the ship's triangle at the default orientation", () => {
    const s = new Spaceship(0, 0);
    const bounds = s.getBounds();

    expect(bounds).toEqual([
      { x: 0, y: -10 },
      { x: 6, y: 10 },
      { x: -6, y: 10 },
    ]);
  });

  it("rotates with the ship's orientation, matching the drawn sprite", () => {
    const s = new Spaceship(0, 0);
    s.setO(90);
    const bounds = s.getBounds();

    // The nose (0, -10) rotates 90 degrees to point along +x.
    expect(bounds[0].x).toBeCloseTo(10);
    expect(bounds[0].y).toBeCloseTo(0);
  });

  it("translates the rotated triangle to the ship's position", () => {
    const s = new Spaceship(50, 60);
    s.setO(180);
    const bounds = s.getBounds();

    // The nose (0, -10) rotates 180 degrees to (0, 10), then translates.
    expect(bounds[0].x).toBeCloseTo(50);
    expect(bounds[0].y).toBeCloseTo(70);
  });
});

describe("Spaceship#getDrawShape", () => {
  it("returns a filled triangle positioned/rotated at the ship's current state", () => {
    const s = new Spaceship(50, 60);
    s.setO(90);
    const shape = s.getDrawShape();

    expect(shape.mode).toBe("fill");
    expect(shape.color).toBe(s.color);
    expect(shape.x).toBe(50);
    expect(shape.y).toBe(60);
    expect(shape.rotation).toBeCloseTo(Math.PI / 2);
    expect(shape.points).toEqual([
      { x: 0, y: -10 },
      { x: -6, y: 10 },
      { x: 6, y: 10 },
    ]);
  });
});
