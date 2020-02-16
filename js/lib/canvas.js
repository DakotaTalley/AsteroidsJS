function Canvas(id) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    

    this.setBackground = function(color) {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    this.drawSpaceship = function(spaceship) {
        this.context.fillStyle = spaceship.color;
        this.context.translate(spaceship.x, spaceship.y);
        this.context.rotate(spaceship.orientation * Math.PI / 180);
        this.context.beginPath();
        this.context.moveTo(0, -spaceship.h/2);
        this.context.lineTo(-spaceship.w/2, spaceship.h/2);
        this.context.lineTo(spaceship.w/2, spaceship.h/2);
        this.context.fill();
        this.context.rotate(-spaceship.orientation * Math.PI / 180);
        this.context.setTransform(1, 0, 0, 1, 0, 0);

    }

    this.drawAsteroids = function(ast, bounds) {
        this.context.strokeStyle = '#FFFFFF';
        this.context.lineWidth = 1;
        this.context.translate(ast.x, ast.y);
        this.context.beginPath();
        this.context.moveTo(bounds[0].x, bounds[0].y);
        for (var i = 1; i < ast.numSides + 1; i ++) 
        {
            this.context.lineTo(bounds[i].x, bounds[i].y);
        };
        /* this.context.moveTo(ast.r * Math.cos(0 * 2 * Math.PI / ast.numSides), ast.r * Math.sin(0 * 2 * Math.PI / ast.numSides));
        for (var i = 1; i < ast.numSides + 1; i ++) 
        {
            var x = ast.r * Math.cos(i * 2 * Math.PI / ast.numSides);
            var y = ast.r * Math.sin(i * 2 * Math.PI / ast.numSides);
            this.context.lineTo(x, y);
        }; */
        this.context.stroke();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.drawBullets = function(bul) {
        this.context.fillStyle = '#FFFFFF';

        this.context.translate(bul.x, bul.y);
        this.context.beginPath();
        this.context.lineTo(-bul.w/2, -bul.h/2);
        this.context.lineTo(bul.w/2, -bul.h/2);
        this.context.lineTo(bul.w/2, bul.h/2);
        this.context.lineTo(-bul.w/2, bul.h/2);
        this.context.fill();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.drawScore = function(score) {
        this.context.font = "20px Arial";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.fillText(score, this.width / 2, 20);
    }

    this.drawHigh = function(score) {
        this.context.font = "20px Arial";
        this.context.fillStyle = "white";
        this.context.textAlign = "right";
        this.context.fillText(score, this.width - 5, 20);
    }

    this.drawLives = function(lives, spaceship) {
        var xLoc = spaceship.w;

        for (i = 0; i < lives; i++) {
            this.context.fillStyle = spaceship.color;
            this.context.translate(xLoc, spaceship.h / 2 + 5);
            this.context.beginPath();
            this.context.moveTo(0, -spaceship.h/2);
            this.context.lineTo(-spaceship.w/2, spaceship.h/2);
            this.context.lineTo(spaceship.w/2, spaceship.h/2);
            this.context.fill();
            this.context.setTransform(1, 0, 0, 1, 0, 0);

            xLoc += spaceship.w * 2;
        }
    }

    this.drawPaused = function(message) {
        this.context.font = "20px Arial";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.fillText(message, this.width / 2, this.height / 2);
    }

    this.drawDiff = function(diff) {
        console.log(diff);
        var xpos;
        var rectW;
        if (diff == 1) {
            xpos = this.width / 3;
            rectW = 60;
        } else if (diff ==2) {
            xpos = this.width / 2 - 10;
            rectW = 80;
        } else {
            xpos = this.width * 2 / 3;
            rectW = 60;
        }
        
        this.context.beginPath();
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 1.2;
        this.context.rect(xpos - 30, this.height / 2 + 8, rectW, 30);
        this.context.stroke(); 

        this.context.font = "20px Arial";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.fillText("Easy", this.width / 3, this.height / 2 + 30);
        this.context.fillText("Normal", this.width / 2, this.height / 2 + 30);
        this.context.fillText("Hard", this.width * 2 / 3, this.height / 2 + 30);

  
    }
}