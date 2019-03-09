class Spaceship extends Entity {
    constructor() {
        super(0, 0, 0, 0, 0, 10);
    }

    shoot() {
        var deg = this.mathifyOrientation();
        var jerk = 10;
        var dx = Math.cos(deg) / jerk;
        var dy = Math.sin(deg) / jerk;

        return new Entity(this.x, this.y, 0, 0, 0, jerk);
    }
}