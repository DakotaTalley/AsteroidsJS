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


// Return array of x and y outside of the window for spawning
function genOutsideWin(shpSize){
    var arr = [];
    var canvasX = canvas.width;
    var canvasY = canvas.height;
    // Left or Right from 0
    arr[0] = Math.round(Math.random()) * 2 - 1;
    // Up or Down from 0
    arr[1] = Math.round(Math.random()) * 2 - 1;
    // If both are negative, set one lower than screen size
    if(arr[0] < 1 && arr[1] < 1){
        Math.random() > 0.5 ? arr[0] = canvasX - shpSize : arr[1] = canvasY - shpSize;
        return arr;      
    }
    //if both are positive, randomize, then pick one and make it larger than screen size
    if(arr[0] > 1 && arr[0] > 1){
        arr[0] = Math.random() * canvasX;
        arr[1] = Math.random() * canvasY;
        Math.random() > 0.5 ? arr[0] = canvasX + shpSize : arr[1] = canvasY + shpSize;
        return arr;
    }

    arr[0] = Math.random() * canvasX;
    arr[1] = Math.random() * canvasY;
    arr[0] < 1 ? arr[0] = canvasX - shpSize : arr[1] = canvasY - shpSize;
    return arr;
}

// Gets a random number between @param min and @param max
// * Max is inclusive in this function *
function randomNumber(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}