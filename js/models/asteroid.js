function Asteroid(x, y, dx, dy, size) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.points = [];

    this.generateShape = function(numSides) {       
        for (var i = 0; i <= numSides; i += 1) {
            this.points[i] = [this.x + (this.size * 20) * Math.cos(i * 2 * Math.PI / numSides),
            y + (this.size * 20) * Math.sin(i * 2 * Math.PI / numSides)];
        }
    }

    this.generateShape(randomNumber(5, 10));
}


// Return array of x and y outside of the window for spawning
function genOutsideWin(shpSize){
    var x;
    var y;
    var canvasX = canvas.width;
    var canvasY = canvas.height;
    // Left or Right from 0
    x = Math.round(Math.random()) * 2 - 1;
    // Up or Down from 0
    y = Math.round(Math.random()) * 2 - 1;
    // If both are negative, set one lower than screen size
    if(x < 1 && y < 1){
        if (Math.random() > 0.5) {
            x = canvasX - shpSize;
        }else{
            y = canvasY - shpSize;
        } 
        return [x,y];      
    }
    //if both are positive, randomize, then pick one and make it larger than screen size
    if(arr[0] > 1 && arr[0] > 1){
        arr[0] = Math.random() * canvasX;
        arr[1] = Math.random() * canvasY;
        if(Math.random() > 0.5){
            arr[0] = canvasX + shpSize;
        }else{
            arr[1] = canvasY + shpSize;
        }
        return arr;
    }

    arr[0] = Math.random() * canvasX;
    arr[1] = Math.random() * canvasY;
    if(arr[0] < 1){
        arr[0] = canvasX - shpSize;
    }else{
        arr[1] = canvasY - shpSize;
    }
    return arr;
}

// Gets a random number between @param min and @param max
// * Max is inclusive in this function *
function randomNumber(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}