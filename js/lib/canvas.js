function Canvas(id) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    

    this.setBackground = function(color) {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    this.drawSpaceship = function(color, x, y, orientation) {
        this.context.fillStyle = color;
        this.context.translate((this.width / 2) + x, (this.height / 2) + y);
        this.context.rotate(orientation * Math.PI / 180);
        this.context.beginPath();
        this.context.moveTo(0, - 10);
        this.context.lineTo(-6, 10);
        this.context.lineTo(6, 10);
        this.context.fill();
        this.context.rotate(-orientation * Math.PI / 180);
        this.context.setTransform(1, 0, 0, 1, 0, 0);

    }

    this.drawAsteroids = function(arr) {
        for (item in asteroids) {
            ast = asteroids[item];
            this.context.strokeStyle = '#FFFFFF'
            this.context.lineWidth = 1;
            // To Do: Why /100 works?
            this.context.translate((this.width / 2) + ast.x / 100, (this.height / 2) + ast.y / 100);
            this.context.moveTo (ast.x + ast.size * Math.cos(1), ast.y + ast.size * Math.sin(1));
            this.context.beginPath();
            for (var i = 0; i < ast.numSides + 1; i ++) 
            {
                this.context.lineTo(ast.x + ast.size * 10 * Math.cos(i * 2 * Math.PI / ast.numSides), ast.y + ast.size * 10 * Math.sin(i * 2 * Math.PI / ast.numSides));
            };
            this.context.stroke();
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    this.drawEntities = function(arr) {
        for (item in entities) {
            this.context.fillStyle = '#FFFFFF';

            this.context.translate((this.width / 2) + entities[item].x, (this.height /2) + entities[item].y);
            this.context.beginPath();
            this.context.lineTo(0, -3);
            this.context.lineTo(-3, 0);
            this.context.lineTo(0, 3);
            this.context.lineTo(3, 0);
            this.context.fill();
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    this.drawScore = function(arr) {
        this.context.font = "20px Arial";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.fillText(arr, this.width / 2, 20);
    }
}