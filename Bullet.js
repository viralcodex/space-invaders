/**
 * @type {HTMLCanvasElement}
 */
export default class Bullet {
    constructor(canvas, x, y, velocity, color) {
        this.canvas = canvas;
        this.color = color;
        this.width = 5;
        this.height = 10;
        this.x = x - this.width / 2
        this.y = y;
        this.velocity = velocity;
    }

    draw(ctx) {
        this.y -= this.velocity;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    //collision (sprite : enemy or player)
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



}