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

  // Tests this entity's bound points against a circle centered on `entity`.
  // A circle is a much closer match to a drawn asteroid's polygon than its
  // axis-aligned bounding box (which spans up to 2x the mean radius), so
  // near-corner passes and edge-overlap misses are both less likely. Targets
  // that expose getCollisionRadius() (e.g. Asteroid) use it directly;
  // others fall back to half their larger bounding-box dimension.
  checkCollision(entity) {
    var thisBounds = this.getBounds();
    var radius = entity.getCollisionRadius
      ? entity.getCollisionRadius()
      : Math.max(entity.w, entity.h) / 2;

    for (let i = 0; i < thisBounds.length; i++) {
      var dx = thisBounds[i].x - entity.x;
      var dy = thisBounds[i].y - entity.y;

      if (dx * dx + dy * dy < radius * radius) {
        return true;
      }
    }
    return false;
  }
}

export default Entity;
