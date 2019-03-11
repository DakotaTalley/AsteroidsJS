class Spaceship extends Entity {
    constructor() {
        super(0, 0, 0, 0, 0, 10);
        this.h = 20;
        this.w = 12;
    }

    shoot() {
        var deg = this.mathifyOrientation();
        var dx = Math.cos(deg) * 5;
        var dy = Math.sin(deg) * -5;

        return new Entity(this.x, this.y, dx, dy, 0);
    }
}