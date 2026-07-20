import Entity from "../models/entity";
import Bullet from "../models/bullet";

class Spaceship extends Entity {
  constructor(x, y) {
    super(x, y, 0, 0, 0);
    this.jerk = 10;
    this.maxD = 0.5;
    this.h = 20;
    this.w = 12;
    this.color = "#FFFFFF";
    this.timeLastShoot = 0;
  }

  reset(w, h) {
    this.setX(w / 2);
    this.setY(h / 2);
    this.setO(0);
    this.setDx(0);
    this.setDy(0);
  }

  accelerate(dt) {
    var rad = this.orientationToRadians();
    this.dx += (Math.cos(rad) / this.jerk) * dt;
    this.dy -= (Math.sin(rad) / this.jerk) * dt;

    this.clampSpeed();
  }

  decelerate(dt) {
    var rad = this.orientationToRadians();
    this.dx -= (Math.cos(rad) / this.jerk) * dt;
    this.dy += (Math.sin(rad) / this.jerk) * dt;

    this.clampSpeed();
  }

  clampSpeed() {
    if (this.dx > this.maxD) {
      this.dx = this.maxD;
    }
    if (this.dx < -this.maxD) {
      this.dx = -this.maxD;
    }
    if (this.dy > this.maxD) {
      this.dy = this.maxD;
    }
    if (this.dy < -this.maxD) {
      this.dy = -this.maxD;
    }
  }

  shoot() {
    var rad = this.orientationToRadians();
    var dx = Math.cos(rad) * 0.5;
    var dy = Math.sin(rad) * -0.5;

    return new Bullet(this.x, this.y, dx, dy);
  }

  // Collision triangle, rotated by `orientation` using the same transform
  // the renderer applies in getDrawShape — otherwise the hitbox stays
  // nose-up while the drawn sprite turns, and the two disagree.
  getBounds() {
    var rad = (this.orientation * Math.PI) / 180;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    var localPoints = [
      { x: 0, y: -this.h / 2 },
      { x: this.w / 2, y: this.h / 2 },
      { x: -this.w / 2, y: this.h / 2 },
    ];

    return localPoints.map((p) => ({
      x: this.x + p.x * cos - p.y * sin,
      y: this.y + p.x * sin + p.y * cos,
    }));
  }

  // Drawing primitive for Canvas#drawEntity — a filled triangle in
  // ship-local space, positioned/rotated by the Canvas at draw time. alpha
  // (default 1, i.e. "current position") interpolates between the last
  // physics step and this one — see Entity#getInterpolatedPosition.
  getDrawShape(alpha = 1) {
    const { x, y } = this.getInterpolatedPosition(alpha);
    return {
      mode: "fill",
      color: this.color,
      x,
      y,
      rotation: (this.getInterpolatedOrientation(alpha) * Math.PI) / 180,
      points: [
        { x: 0, y: -this.h / 2 },
        { x: -this.w / 2, y: this.h / 2 },
        { x: this.w / 2, y: this.h / 2 },
      ],
    };
  }
}

export default Spaceship;
