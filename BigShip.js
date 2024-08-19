export default class BigShip {

    constructor(canvas, x, y) {
        this.canvas = canvas
        this.x = x; //from RTL
        this.y = y; //on top
        this.image = new Image();
        this.image.src = './img/bigship2.png';
        this.image.onload = () => {
            this.isLoaded = true;
            this.width = this.image.width / 20;
            this.height = this.image.height / 20;
        }
        this.isLoaded = false;
        this.isDestroyed = false;
        this.Vx = 1;
        this.timer = 750;
    }

    draw(ctx) {
        if (this.isDestroyed) return;
        this.decreaseTimer();
        if (this.timer <= 0) {
            this.move();
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            this.resetTimer();
        }

    }

    clearImage(ctx) {
        this.isDestroyed = true;
        ctx.clearRect(this.x, this.y, this.width, this.height);
        this.resetTimer();
    }

    collision(sprite) {
        /**
       * on x-axis : rect 1 x + rect 1 width < sprite x OR rect 1 x > sprite x + sprite width
       * on y-axis : rect 1 y + rect 1 height < sprite y OR rect 1 y > sprite y + sprite height
       */
        if (this.x + this.width < sprite.x ||
            this.x > sprite.x + sprite.width ||
            this.y + this.height < sprite.y ||
            this.y > sprite.y + sprite.height
        ) {
            return false;
        }

        return true;
    }

    decreaseTimer() {
        --this.timer;
    }

    move() {
        this.x -= this.Vx;
    }

    resetTimer() {
        if (this.x + this.width < 0 || this.isDestroyed) {
            this.timer = 500;
            this.x = this.canvas.width + 10;
            this.isDestroyed = false;
        }
    }

    reset() {
        this.x = this.canvas.width + 10;
        this.isDestroyed = false;
        this.timer = 500;
    }
}