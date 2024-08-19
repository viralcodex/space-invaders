export default class Player {
    //controls
    right = false;
    left = false;
    shoot = false;
    constructor(
        canvas,
        bulletGenerator,
    ) {
        this.canvas = canvas;
        this.bulletGenerator = bulletGenerator;
        this.image = new Image();
        this.image.src = 'img/player.png';
        this.image.onload = () => {
            this.isLoaded = true;
        }
        this.height = this.image.height / 1.25;
        this.width = this.image.width / 1.25;
        this.y = this.canvas.height - 75;
        this.x = (this.canvas.width - this.width) / 2; //offsetting for centering image horizontally

        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
    }

    draw(ctx) {
        if (this.shoot) {
            this.bulletGenerator.shoot(this.x + this.width / 2, this.y, 4);
        }
        this.move();
        this.wallBounding();
        if (this.isLoaded)
            ctx.drawImage(this.image, this.x, this.y, this.height, this.width);
    }

    reset() {
        this.y = this.canvas.height - 75;
        this.x = (this.canvas.width - this.width) / 2;
        this.bulletGenerator.reset();
    }

    wallBounding() {
        //if x position of the ship goes out of the bounds for the canvas, 
        //reset it to be inside the bounds
        if (this.x < 0) {
            this.x = 0;
        }
        else if (this.x > this.canvas.width - this.width) //offsetting for including image width also
        {
            this.x = this.canvas.width - this.width;
        }
    }

    move() {
        if (this.right)
            this.x += 3; //velocity for moving
        else if (this.left)
            this.x -= 3; //velocity for moving
    }

    keyup = (e) => {
        if (e.code === "Space")
            this.shoot = false;

        if (e.code === "ArrowRight" || e.code === "KeyD")
            this.right = false;

        if (e.code === "ArrowLeft" || e.code === "KeyA")
            this.left = false;
    }

    keydown = (e) => {
        if (e.code === "Space")
            this.shoot = true;

        if (e.code === "ArrowRight" || e.code === "KeyD")
            this.right = true;

        if (e.code === "ArrowLeft" || e.code === "KeyA")
            this.left = true;
    }
}