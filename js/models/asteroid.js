class Asteroid extends Entity {
    constructor(x, y, dx, dy, size) {
        super(x, y, dx, dy, 0, 0);

        this.size = size;
        this.numSides = 6;

        this.points = [];
       
        for (var i = 0; i <= this.numSides; i += 1) {
            this.points[i] = [this.x + (this.size * 20) * Math.cos(i * 2 * Math.PI / this.numSides),
            y + (this.size * 20) * Math.sin(i * 2 * Math.PI / this.numSides)];
        };
    }

}