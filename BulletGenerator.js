import Bullet from "./Bullet.js";

export default class BulletGenerator {
    bullets = [];

    constructor(canvas, maxBullets, color) {
        this.maxBullets = maxBullets;
        this.canvas = canvas;
        this.color = color;
        this.playerShoot = new Audio('sound/shoot.wav');
        this.playerShoot.volume = 0.4;
    }

    draw(ctx) {
        //remove bullets out of canvas
        //then draw the remaining on screen

        this.bullets = this.bullets.filter(bullet => bullet.y + bullet.width > 0
            && bullet.y <= this.canvas.height
        )

        this.bullets.forEach(bullet => bullet.draw(ctx)
            // timing management
        );
    }

    ifCollides(sprite) {
        const bulletCollidingIndex = this.bullets.findIndex(bullet => bullet.collision(sprite));
        if (bulletCollidingIndex >= 0) {
            this.bullets.splice(bulletCollidingIndex, 1);
            return true;
        }
        return false;
    }

    ifBulletsCollide(otherBulletGenerator) {
        this.bullets = this.bullets.filter((bullet) => {
            const collision = otherBulletGenerator.bullets.findIndex(otherBullet => bullet.collision(otherBullet))
            if (collision >= 0) {
                otherBulletGenerator.bullets.splice(collision, 1);
                return false;
            }
            return true;
        })
    }

    shoot(x, y, velocity) {
        //checking if next bullet is allowed to be fired or not
        if (this.bullets.length < this.maxBullets) {
            this.bullets.push(new Bullet(this.canvas, x, y, velocity, this.color));
            this.playerShoot.currentTime = 0;
            this.playerShoot.play;
        }
    }

    reset() {
        this.bullets = [];
    }


}