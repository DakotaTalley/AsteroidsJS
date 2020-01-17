class Asteroid extends Entity {
    constructor(x, y, dx, dy, size, numSides) {
        super(x, y, dx, dy, 0, 10);
        
        this.size = size;
        this.numSides = numSides;
        this.r = 5 * this.size;
        this.maxR = 0; 
        this.bounds = this.genBounds();
        this.h = this.maxR * 2; 
        this.w = this.maxR * 2;

    }

    genBounds() {
        var points = [];
        for (i = 0; i < this.numSides; i++) {
            var randR = (Math.random() * this.r) + this.r;
            this.checkMaxR(randR);
            points.push({
                x: randR * Math.cos(i * 2 * Math.PI / this.numSides),
                y: randR * Math.sin(i * 2 * Math.PI / this.numSides)
            })
        }
        points.push(points[0]);

        return points;
    }

    getBounds() {
        return this.bounds;
    }

    checkMaxR(r) {
        if (r > this.maxR) {
            this.maxR = r;
        }
    }

    split() {
        if (this.size - 1 == 0) {
            return 0;
        } else {
            var newSize = this.size - 1;
            var newA1 = new Asteroid(this.x, this.y, this.dx, this.dy - 1, newSize, this.numSides);
            var newA2 = new Asteroid(this.x, this.y, this.dx, this.dy + 1, newSize, this.numSides);

            return [newA1, newA2];
        }
    }
}