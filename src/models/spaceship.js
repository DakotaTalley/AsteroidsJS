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

  shoot(frame) {
    var rad = this.orientationToRadians();
    var dx = Math.cos(rad) * 0.5;
    var dy = Math.sin(rad) * -0.5;

    return new Bullet(this.x, this.y, dx, dy, frame);
  }

  getBounds() {
    var p0 = {
      x: this.x,
      y: this.y - this.h / 2,
    };
    var p1 = {
      x: this.x + this.w / 2,
      y: this.y + this.h / 2,
    };
    var p2 = {
      x: this.x - this.w / 2,
      y: this.y + this.h / 2,
    };
    return [p0, p1, p2];
  }
}

export default Spaceship;
