class Asteroid extends Entity {
    constructor(x, y, dx, dy, size, numSides) {
        super(x, y, dx, dy, 0, 10);
        
        this.size = size;
        this.numSides = numSides;
        this.r = 10 * this.size;
        this.h = this.r * 2;
        this.w = this.r * 2;
    }

    getBounds() {
        var points = [];
        for (i = 0; i < this.numSides + 1; i++) {
            points.push({
                x: this.r * Math.cos(i * 2 * Math.PI / this.numSides),
                y: this.r * Math.sin(i * 2 * Math.PI / this.numSides)
            })
        }

        return points;
    }
}