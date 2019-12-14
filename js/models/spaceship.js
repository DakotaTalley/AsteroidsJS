class Spaceship extends Entity {
    constructor(x, y) {
        super(x, y, 0, 0, 0, 10);
        this.h = 20;
        this.w = 12;
        this.color = "#FFFFFF";
    }

    shoot(frame) {
        var deg = this.mathifyOrientation();
        var dx = Math.cos(deg) * 5;
        var dy = Math.sin(deg) * -5;

        return new Bullet(this.x, this.y, dx, dy, frame);
    }

    getBounds() {
        var p0 = {
            x: this.x,
            y: this.y - this.h / 2
        }
        var p1 = {
            x: this.x + this.w / 2,
            y: this.y + this.h / 2
        }
        var p2 = {
            x: this.x - this.w / 2,
            y: this.y + this.h / 2
        }
        return [p0, p1, p2];
    }

    checkCollision(entity) {
        return 0;
    }
}