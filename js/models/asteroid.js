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

/*
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
    if(x > 1 && y > 1){
        x = Math.random() * canvasX;
        y = Math.random() * canvasY;
        if(Math.random() > 0.5){
            x = canvasX + shpSize;
        }else{
            y = canvasY + shpSize;
        }
        return [x,y];
    }

    x = Math.random() * canvasX;
    y = Math.random() * canvasY;
    if(x < 1){
        x = canvasX - shpSize;
    }else{
        y = canvasY - shpSize;
    }
    return [x,y];
}

*/
