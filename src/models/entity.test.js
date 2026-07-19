import { describe, it, expect } from "vitest";
import Entity from "./entity";

describe("Entity#updatePosition", () => {
  it("wraps to the right edge when x goes negative", () => {
    const e = new Entity(1, 50, -10, 0, 0, 10);
    e.updatePosition(200, 100, 1);
    expect(e.getX()).toBe(200);
  });

  it("wraps to the left edge when x exceeds width", () => {
    const e = new Entity(199, 50, 10, 0, 0, 10);
    e.updatePosition(200, 100, 1);
    expect(e.getX()).toBe(0);
  });

  it("wraps to the bottom edge when y goes negative", () => {
    const e = new Entity(50, 1, 0, -10, 0, 10);
    e.updatePosition(200, 100, 1);
    expect(e.getY()).toBe(100);
  });

  it("wraps to the top edge when y exceeds height", () => {
    const e = new Entity(50, 99, 0, 10, 0, 10);
    e.updatePosition(200, 100, 1);
    expect(e.getY()).toBe(0);
  });
});

describe("Entity#accelerate", () => {
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
    const e = new Entity(0, 0, dx, dy, orientation, 1);
    e.accelerate(1);
    expect(e.dx).toBeCloseTo(expected.dx);
    expect(e.dy).toBeCloseTo(expected.dy);
  });
});

describe("Entity#decelerate", () => {
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
    const e = new Entity(0, 0, dx, dy, orientation, 1);
    e.decelerate(1);
    expect(e.dx).toBeCloseTo(expected.dx);
    expect(e.dy).toBeCloseTo(expected.dy);
  });
});

describe("Entity#checkCollision", () => {
  it("returns true when a bound point falls inside the target box", () => {
    const e = new Entity(10, 10, 0, 0, 0, 10);
    e.getBounds = () => [
      { x: 8, y: 8 },
      { x: 12, y: 8 },
      { x: 12, y: 12 },
      { x: 8, y: 12 },
    ];
    const target = { x: 10, y: 10, w: 20, h: 20 };
    expect(e.checkCollision(target)).toBe(true);
  });

  it("returns false when no bound point falls inside the target box", () => {
    const e = new Entity(10, 10, 0, 0, 0, 10);
    e.getBounds = () => [
      { x: 8, y: 8 },
      { x: 12, y: 8 },
      { x: 12, y: 12 },
      { x: 8, y: 12 },
    ];
    const target = { x: 100, y: 100, w: 10, h: 10 };
    expect(e.checkCollision(target)).toBe(false);
  });
});
