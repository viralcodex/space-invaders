export default class Enemy {
    constructor(x, y, number) {
        this.image = new Image();
        this.image.src = `./img/enemy${number}.png`;
        this.image.onload = () => {
            this.isLoaded = true
            this.width = this.image.width / 1.25;
            this.height = this.image.height / 1.25;
        }
        this.image.onerror = () => {
            console.error(`Failed to load image: img/enemy${type}.png`);
            this.isLoaded = false;
        };
        this.x = x;
        this.y = y;
        this.isLoaded = false;
    }

    draw(ctx) {
        if (this.isLoaded)
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        else {
            console.log(`Image not loaded for enemy type ${this.type}`);
        }
    }

    //because enemies go R to L then one row down then go L to R
    move(Vx, Vy) {
        this.x += Vx;
        this.y += Vy;
    }

    //collision : with player
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