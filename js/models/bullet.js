class Bullet extends Entity {
    constructor(x, y, dx, dy, frame) {
        super(x, y, dx, dy, 0, 0);
        this.h = 4;
        this.w = 4;
        this.frame = frame;
        this.time = 0;
    }

    // Bound getter for collisions
    getBounds() {
        var p0 = {
            x: this.x - this.w / 2,
            y: this.y - this.h / 2
        }
        var p1 = {
            x: this.x + this.w / 2,
            y: this.y - this.h / 2
        }
        var p2 = {
            x: this.x + this.w / 2,
            y: this.y + this.h / 2
        }
        var p3 = {
            x: this.x - this.w / 2,
            y: this.y + this.h / 2
        }

        return [p0, p1, p2, p3];
    }

    checkCollision(entity) {
        var thisBounds = this.getBounds();

        for (i = 0; i < thisBounds.length; i++) {
            if (thisBounds[i].x > (entity.x - entity.w / 2) &&
                thisBounds[i].x < (entity.x + entity.w / 2) &&
                thisBounds[i].y > (entity.y - entity.h / 2) &&
                thisBounds[i].y < (entity.y + entity.h / 2)) {
                    return true;
                }
        }
        return false;
    }

    // Check distance travelled by frames since creation
    checkDistance(frame) {
        if (this.time < 2 && this.frame == frame) {
            this.time++;
        }
        if (this.time > 1) {
            return true;
        }
    }
}