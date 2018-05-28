function Asteroid(x, y, dx, dy, size) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.points = [];
    this.points[0] = [];
    this.points[1] = [];

    this.generateShape = function(numSides) {       
        for (var i = 0; i <= numSides; i += 1) {
            this.points[0][i] = this.x + (this.size * 20) * Math.cos(i * 2 * Math.PI / numSides);
            this.points[1][i] = y + (this.size * 20) * Math.sin(i * 2 * Math.PI / numSides);
        }
    }

    this.generateShape(randomNumber(5, 10));
}

// Gets a random number between @param min and @param max
// * Max is inclusive in this function *
function randomNumber(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}