class Entity {
  constructor(x, y, dx, dy, orientation) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.orientation = orientation;
    this.color = "#000000";
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  setO(o) {
    this.orientation = o;
  }

  setDx(dx) {
    this.dx = dx;
  }

  setDy(dy) {
    this.dy = dy;
  }

  updatePosition(width, height, dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;

    if (this.x < 0) {
      this.setX(width);
    }
    if (this.x > width) {
      this.setX(0);
    }

    if (this.y < 0) {
      this.setY(height);
    }
    if (this.y > height) {
      this.setY(0);
    }
  }

  orientationToRadians() {
    // Compass orientation (0 = up, clockwise-positive) to a standard math
    // angle in radians (0 = +x axis, counterclockwise-positive).
    return (90 - this.orientation) * (Math.PI / 180);
  }

  // Positive rotates right, Negative rotates left
  rotate(amount) {
    this.orientation += amount;
  }

  checkCollision(entity) {
    var thisBounds = this.getBounds();

    for (let i = 0; i < thisBounds.length; i++) {
      if (
        thisBounds[i].x > entity.x - entity.w / 2 &&
        thisBounds[i].x < entity.x + entity.w / 2 &&
        thisBounds[i].y > entity.y - entity.h / 2 &&
        thisBounds[i].y < entity.y + entity.h / 2
      ) {
        return true;
      }
    }
    return false;
  }
}

export default Entity;
