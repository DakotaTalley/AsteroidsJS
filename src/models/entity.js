class Entity {
  constructor(x, y, dx, dy, orientation) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.orientation = orientation;
    this.color = "#000000";
    // Render-time interpolation source point (see getInterpolatedPosition) —
    // starts equal to the spawn position so a freshly created entity draws
    // without any interpolation glitch on its first frame.
    this.prevX = x;
    this.prevY = y;
    this.prevOrientation = orientation;
  }

  // setX/setY/setO are also the mechanism for teleporting an entity (screen
  // wrap in updatePosition, Spaceship#reset after a death) rather than
  // moving it continuously. Snapping prev* here means a render mid-teleport
  // draws at the new position instead of interpolating a streak across the
  // screen from the old one.
  setX(x) {
    this.x = x;
    this.prevX = x;
  }

  setY(y) {
    this.y = y;
    this.prevY = y;
  }

  setO(o) {
    this.orientation = o;
    this.prevOrientation = o;
  }

  setDx(dx) {
    this.dx = dx;
  }

  setDy(dy) {
    this.dy = dy;
  }

  // Call once per fixed physics step, before moving the entity, so
  // getInterpolatedPosition/Orientation have a start point to blend from at
  // render time (which runs 0+ times per physics step, not 1:1).
  savePreviousState() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.prevOrientation = this.orientation;
  }

  // Blends between last physics step's position and this step's, so
  // renderGraphics (which runs once per requestAnimationFrame, independent
  // of the fixed-dt physics rate) can draw a position between two ticks
  // instead of always the last completed one. alpha is
  // accumulator / dt — 0 right after a physics step, approaching 1 just
  // before the next one.
  getInterpolatedPosition(alpha) {
    return {
      x: this.prevX + (this.x - this.prevX) * alpha,
      y: this.prevY + (this.y - this.prevY) * alpha,
    };
  }

  getInterpolatedOrientation(alpha) {
    return (
      this.prevOrientation + (this.orientation - this.prevOrientation) * alpha
    );
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
