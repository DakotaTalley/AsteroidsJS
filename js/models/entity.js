function Entity(x, y, dx, dy, orientation, jerk) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.jerk = jerk;
    this.orientation = orientation;
    this.points = [];
    this.color = "#000000";

    Entity.prototype.setX = function(x) {
        this.x = x;
    }

    Entity.prototype.setY = function(y) {
        this.y = y;
    }

    Entity.prototype.updatePosition = function() {
        this.x += this.dx;
        this.y += this.dy;
    }

    Entity.prototype.accelerate = function() {
        var deg = this.mathifyOrientation();
        this.dx += Math.cos(deg) / this.jerk;
        this.dy -= Math.sin(deg) / this.jerk;
    }

    Entity.prototype.decelerate = function() {
        var deg = this.mathifyOrientation();
        this.dx -= Math.cos(deg) / this.jerk;
        this.dy += Math.sin(deg) / this.jerk;
    }

    Entity.prototype.mathifyOrientation = function() {
        // Convert to degrees, then convert to radians.
        return (90 - this.orientation) * (Math.PI / 180);
    }

    // Positive rotates right, Negative rotates left
    Entity.prototype.rotate = function(amount) {
        this.orientation += amount;
    }
}