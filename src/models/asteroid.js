import Entity from "./entity";

class Asteroid extends Entity {
  constructor(x, y, dx, dy, size, numSides) {
    super(x, y, dx, dy, 0);

    this.color = "#FFFFFF";
    this.size = size;
    this.numSides = numSides;
    this.r = 5 * this.size;
    this.maxR = 0;
    this.localBounds = this.genBounds();
    this.h = this.maxR * 2;
    this.w = this.maxR * 2;
  }

  genBounds() {
    var points = [];
    for (let i = 0; i < this.numSides; i++) {
      var randR = Math.random() * this.r + this.r;
      this.checkMaxR(randR);
      points.push({
        x: randR * Math.cos((i * 2 * Math.PI) / this.numSides),
        y: randR * Math.sin((i * 2 * Math.PI) / this.numSides),
      });
    }
    points.push(points[0]);

    return points;
  }

  // Bound getter for collisions/drawing — local shape translated to the
  // asteroid's current position, matching Bullet/Spaceship's absolute
  // coordinates.
  getBounds() {
    return this.localBounds.map((p) => ({
      x: p.x + this.x,
      y: p.y + this.y,
    }));
  }

  // Drawing primitive for Canvas#drawEntity — a stroked polygon in
  // asteroid-local space (localBounds already closes back to its first
  // point), translated by the Canvas at draw time. alpha (default 1, i.e.
  // "current position") interpolates between the last physics step and
  // this one — see Entity#getInterpolatedPosition.
  getDrawShape(alpha = 1) {
    const { x, y } = this.getInterpolatedPosition(alpha);
    return {
      mode: "stroke",
      color: this.color,
      lineWidth: 1,
      x,
      y,
      points: this.localBounds,
    };
  }

  checkMaxR(r) {
    if (r > this.maxR) {
      this.maxR = r;
    }
  }

  // Radius used for circle-based collision tests (see Entity#checkCollision)
  // — the mean of the base and max vertex radii, since genBounds scatters
  // vertices uniformly across [r, maxR] rather than at a single distance.
  getCollisionRadius() {
    return (this.r + this.maxR) / 2;
  }

  split() {
    if (this.size - 1 == 0) {
      return 0;
    } else {
      var newSize = this.size - 1;
      var newA1 = new Asteroid(
        this.x,
        this.y,
        this.dx,
        this.dy * -1,
        newSize,
        this.numSides,
      );
      var newA2 = new Asteroid(
        this.x,
        this.y,
        this.dx * -1,
        this.dy,
        newSize,
        this.numSides,
      );

      return [newA1, newA2];
    }
  }
}

export default Asteroid;
