import { describe, it, expect } from "vitest";
import Bullet from "./bullet";

describe("Bullet#updatePosition", () => {
  it("moves in a straight line without wrapping at the screen edges", () => {
    const b = new Bullet(195, 50, 1, 0);
    b.updatePosition(200, 100, 10);
    expect(b.x).toBe(205);
    expect(b.y).toBe(50);
  });
});

describe("Bullet#isOffScreen", () => {
  it("is false while inside the playfield", () => {
    const b = new Bullet(100, 50, 0, 0);
    expect(b.isOffScreen(200, 100)).toBe(false);
  });

  it.each([
    { name: "left of the playfield", x: -1, y: 50 },
    { name: "right of the playfield", x: 201, y: 50 },
    { name: "above the playfield", x: 100, y: -1 },
    { name: "below the playfield", x: 100, y: 101 },
  ])("is true when $name", ({ x, y }) => {
    const b = new Bullet(x, y, 0, 0);
    expect(b.isOffScreen(200, 100)).toBe(true);
  });
});

describe("Bullet#getDrawShape", () => {
  it("returns a filled rectangle in bullet-local space at the bullet's position", () => {
    const b = new Bullet(30, 40, 0, 0);
    const shape = b.getDrawShape();

    expect(shape.mode).toBe("fill");
    expect(shape.color).toBe(b.color);
    expect(shape.x).toBe(30);
    expect(shape.y).toBe(40);
    expect(shape.points).toEqual([
      { x: -2, y: -2 },
      { x: 2, y: -2 },
      { x: 2, y: 2 },
      { x: -2, y: 2 },
    ]);
  });
});
