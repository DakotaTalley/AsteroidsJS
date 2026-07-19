import Entity from "./entity";

class Bullet extends Entity {
  constructor(x, y, dx, dy, frame) {
    super(x, y, dx, dy, 0);
    this.color = "#FFFFFF";
    this.h = 4;
    this.w = 4;
    this.frame = frame;
    this.time = 0;
  }

  // Bound getter for collisions
  getBounds() {
    var p0 = {
      x: this.x - this.w / 2,
      y: this.y - this.h / 2,
    };
    var p1 = {
      x: this.x + this.w / 2,
      y: this.y - this.h / 2,
    };
    var p2 = {
      x: this.x + this.w / 2,
      y: this.y + this.h / 2,
    };
    var p3 = {
      x: this.x - this.w / 2,
      y: this.y + this.h / 2,
    };

    return [p0, p1, p2, p3];
  }

  // Drawing primitive for Canvas#drawEntity — a filled rectangle in
  // bullet-local space, translated by the Canvas at draw time.
  getDrawShape() {
    return {
      mode: "fill",
      color: this.color,
      x: this.x,
      y: this.y,
      points: [
        { x: -this.w / 2, y: -this.h / 2 },
        { x: this.w / 2, y: -this.h / 2 },
        { x: this.w / 2, y: this.h / 2 },
        { x: -this.w / 2, y: this.h / 2 },
      ],
    };
  }

  // Check distance travelled by frames since creation
  checkDistance(frame) {
    if (this.time < 2 && this.frame == frame) {
      this.time++;
    }
    if (this.time > 1) {
      return true;
    }
  }
}

export default Bullet;
