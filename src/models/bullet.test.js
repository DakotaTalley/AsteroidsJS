import { describe, it, expect } from "vitest";
import Bullet from "./bullet";

describe("Bullet#checkDistance", () => {
  it("does not expire before two matching-frame ticks have elapsed", () => {
    const b = new Bullet(0, 0, 0, 0, 5);
    expect(b.checkDistance(5)).toBeUndefined();
  });

  it("expires once two matching-frame ticks have elapsed", () => {
    const b = new Bullet(0, 0, 0, 0, 5);
    b.checkDistance(5);
    expect(b.checkDistance(5)).toBe(true);
  });

  it("stays expired on subsequent checks", () => {
    const b = new Bullet(0, 0, 0, 0, 5);
    b.checkDistance(5);
    b.checkDistance(5);
    expect(b.checkDistance(5)).toBe(true);
  });

  it("only advances time on the frame it was fired", () => {
    const b = new Bullet(0, 0, 0, 0, 5);
    expect(b.checkDistance(6)).toBeUndefined();
    expect(b.time).toBe(0);
  });
});
