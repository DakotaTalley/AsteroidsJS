class Asteroid extends Entity {
    constructor(x, y, dx, dy, size, numSides) {
        super(x, y, dx, dy, 0, 10);
        
        this.size = size;
        this.numSides = numSides;
        this.shape = 'circle';
        this.r = 10 * size;
    }

}