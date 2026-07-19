function Canvas(id) {
  this.canvas = document.getElementById(id);
  this.context = this.canvas.getContext("2d");

  // The width/height attributes are the intended CSS/layout size. Scale the
  // backing pixel buffer by devicePixelRatio for sharpness on high-DPI
  // displays, constrain the visible CSS size to that same layout size, and
  // keep `this.width`/`this.height` in logical (CSS) pixels since all game
  // logic and draw math is expressed in those units.
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  this.dpr = window.devicePixelRatio || 1;

  this.canvas.width = this.width * this.dpr;
  this.canvas.height = this.height * this.dpr;
  this.canvas.style.width = `${this.width}px`;
  this.canvas.style.height = `${this.height}px`;
  this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

  this.setBackground = function (color) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.width, this.height);
  };

  // Generic entity renderer — reads the drawing primitive returned by
  // entity.getDrawShape() and issues the actual context calls, so adding a
  // new entity type doesn't require a new Canvas draw method.
  this.drawEntity = function (entity) {
    const shape = entity.getDrawShape();

    this.context.translate(shape.x, shape.y);
    if (shape.rotation) {
      this.context.rotate(shape.rotation);
    }

    this.context.beginPath();
    this.context.moveTo(shape.points[0].x, shape.points[0].y);
    for (let i = 1; i < shape.points.length; i++) {
      this.context.lineTo(shape.points[i].x, shape.points[i].y);
    }

    if (shape.mode === "stroke") {
      this.context.strokeStyle = shape.color;
      this.context.lineWidth = shape.lineWidth ?? 1;
      this.context.stroke();
    } else {
      this.context.fillStyle = shape.color;
      this.context.fill();
    }

    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  };

  this.drawText = function (text, xLoc, yLoc, align) {
    this.context.font = "20px Turret Road";
    this.context.fillStyle = "white";
    this.context.textAlign = align;
    this.context.fillText(text, xLoc, yLoc);
  };

  this.drawLives = function (lives, spaceship) {
    var xLoc = spaceship.w;

    for (let i = 0; i < lives; i++) {
      this.context.fillStyle = spaceship.color;
      this.context.translate(xLoc, spaceship.h / 2 + 5);
      this.context.beginPath();
      this.context.moveTo(0, -spaceship.h / 2);
      this.context.lineTo(-spaceship.w / 2, spaceship.h / 2);
      this.context.lineTo(spaceship.w / 2, spaceship.h / 2);
      this.context.fill();
      this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      xLoc += spaceship.w * 2;
    }
  };

  this.drawSelector = function (xpos, rectW) {
    this.context.beginPath();
    this.context.strokeStyle = "white";
    this.context.lineWidth = 1.2;
    this.context.rect(xpos - 30, this.height / 2 + 8, rectW, 30);
    this.context.stroke();
  };

}

export default Canvas;
