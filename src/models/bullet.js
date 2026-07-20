import Entity from "./entity";

class Bullet extends Entity {
  constructor(x, y, dx, dy) {
    super(x, y, dx, dy, 0);
    this.color = "#FFFFFF";
    this.h = 4;
    this.w = 4;
  }

  // Bullets don't wrap like other entities — leaving the playfield means
  // the bullet is gone (see isOffScreen), not that it re-enters the far
  // edge. This also sidesteps any pause-related time confusion, since
  // expiry now depends only on position, never on a clock.
  updatePosition(width, height, dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;
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
  // bullet-local space, translated by the Canvas at draw time. alpha
  // (default 1, i.e. "current position") interpolates between the last
  // physics step and this one — see Entity#getInterpolatedPosition.
  getDrawShape(alpha = 1) {
    const { x, y } = this.getInterpolatedPosition(alpha);
    return {
      mode: "fill",
      color: this.color,
      x,
      y,
      points: [
        { x: -this.w / 2, y: -this.h / 2 },
        { x: this.w / 2, y: -this.h / 2 },
        { x: this.w / 2, y: this.h / 2 },
        { x: -this.w / 2, y: this.h / 2 },
      ],
    };
  }

  // True once the bullet has left the visible playfield.
  isOffScreen(width, height) {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}

export default Bullet;
