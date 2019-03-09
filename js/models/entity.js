

class Entity {
    constructor(x, y, dx, dy, orientation, jerk) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.jerk = jerk;
        this.orientation = orientation;
        this.points = [];
        this.color = "#000000";
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    updatePosition() {
        this.x += this.dx;
        this.y += this.dy;
    }

    accelerate() {
        var deg = this.mathifyOrientation();
        this.dx += Math.cos(deg) / this.jerk;
        this.dy -= Math.sin(deg) / this.jerk;
    }

    decelerate() {
        var deg = this.mathifyOrientation();
        this.dx -= Math.cos(deg) / this.jerk;
        this.dy += Math.sin(deg) / this.jerk;
    }

    mathifyOrientation() {
        // Convert to degrees, then convert to radians.
        return (90 - this.orientation) * (Math.PI / 180);
    }

    // Positive rotates right, Negative rotates left
    rotate(amount) {
        this.orientation += amount;
    }
}