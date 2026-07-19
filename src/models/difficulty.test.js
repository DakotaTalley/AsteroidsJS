import { describe, it, expect } from "vitest";
import Difficulty from "./difficulty";

describe("Difficulty#increaseDiff", () => {
  it("increments up to but not beyond the max", () => {
    const d = new Difficulty();
    expect(d.getDiff()).toBe(1);

    d.increaseDiff();
    expect(d.getDiff()).toBe(2);

    d.increaseDiff();
    expect(d.getDiff()).toBe(3);

    d.increaseDiff();
    expect(d.getDiff()).toBe(3);
  });
});

describe("Difficulty#decreaseDiff", () => {
  it("decrements down to but not below the min", () => {
    const d = new Difficulty();
    d.increaseDiff();
    d.increaseDiff();
    expect(d.getDiff()).toBe(3);

    d.decreaseDiff();
    expect(d.getDiff()).toBe(2);

    d.decreaseDiff();
    expect(d.getDiff()).toBe(1);

    d.decreaseDiff();
    expect(d.getDiff()).toBe(1);
  });
});
