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

    this.drawAsteroid = function(arr) {
        for (item in asteroids) {
            this.context.strokeStyle = '#FFFFFF'
            this.context.lineWidth = 1;

            this.context.translate((this.width / 2) + asteroids[item].x, (this.height / 2) + asteroids[item].y);
            this.context.beginPath();
            this.context.moveTo (asteroids[item].points[0][0] , asteroids[item].points[0][1]);          
            for (var i = 1; i < asteroids[item].points.length; i += 1) 
            {
                this.context.lineTo(asteroids[item].points[i][0] , asteroids[item].points[i][1]);
            }
            this.context.lineTo(asteroids[item].points[0][0], asteroids[item].points[0][1]);
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
}