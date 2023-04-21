import Entity from "../models/entity";
import Bullet from "../models/bullet";

class Spaceship extends Entity {
  constructor(x, y) {
    super(x, y, 0, 0, 0, 10);
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

  shoot(frame) {
    var deg = this.mathifyOrientation();
    var dx = Math.cos(deg) * 0.5;
    var dy = Math.sin(deg) * -0.5;

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
