import BigShip from "./BigShip.js";
import Enemy from "./Enemy.js";
import Utils from "./utils.js";
export default class EnemyGenerator {

    enemies = [
        [3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3],
        [2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]
    ];
    currentEnemies = [];

    directions = [0, 1, 2, 3]; //(towards:)l, r, dl, dr
    currentDirection = this.directions[0];
    movingDownCounter = 30;
    //will increase as enemies count decreases
    Vx = 0;
    Vy = 0;
    Vbullet = -3;

    //start velocities
    Vxdefault = 0.65;
    Vydefault = 0.75;

    //bullet firing delays
    bulletFireAfter = 100;
    defaultFireDelay = 50;


    constructor(canvas, playerBulletGenerator, enemyBulletGenerator) {
        this.canvas = canvas;
        this.enemyBulletGenerator = enemyBulletGenerator;
        this.playerBulletGenerator = playerBulletGenerator;
        this.enemyDeathSound = new Audio('sound/enemy-death.wav');
        this.enemyDeathSound.volume = 0.4;
        this.createEnemies();
        this.bigShip = new BigShip(canvas, this.canvas.width, 10);
    }

    draw(ctx, utils) {
        //order very necessary -> decrease, then update, then reset (counter)
        this.decrementMovindDownCounter();
        this.updateDirectionAndVelocity();
        this.collisions(ctx, utils);
        this.drawEnemies(ctx);
        this.resetMovingDownCounter();
        this.increaseSpeed();
        this.fireBullets();
    }

    drawEnemies(ctx) {
        this.currentEnemies.flat().forEach(enemy => {
            enemy.move(this.Vx, this.Vy);
            enemy.draw(ctx);
        });
        this.bigShip.draw(ctx);
    }

    collisions(ctx, utils) { //hit by player bullets
        this.currentEnemies.forEach(enemyRow => {
            enemyRow.forEach((enemy, index) => {
                if (this.playerBulletGenerator.ifCollides(enemy)) {
                    enemyRow.splice(index, 1);
                    utils.updateScore(0);
                    this.enemyDeathSound.play;
                }
            });
        });

        if (this.playerBulletGenerator.ifCollides(this.bigShip)) {
            this.bigShip.clearImage(ctx);
            utils.updateScore(1);
        }

        //remove rows that are empty
        this.currentEnemies = this.currentEnemies.filter(enemyRow => enemyRow.length > 0);
    }

    fireBullets() {
        --this.bulletFireAfter;
        if (this.bulletFireAfter <= 0) {
            this.bulletFireAfter = this.defaultFireDelay;
            const allEnemies = this.currentEnemies.flat();
            const enemyIndexToFire = Math.floor(Math.random() * allEnemies.length);
            const enemyToFire = allEnemies[enemyIndexToFire];
            if(this.currentEnemies.flat().length > 15)
                this.enemyBulletGenerator.shoot(enemyToFire.x + enemyToFire.width / 2, enemyToFire.y, this.Vbullet);
            else if(this.currentEnemies.flat().length > 7)
                this.enemyBulletGenerator.shoot(enemyToFire.x + enemyToFire.width / 2, enemyToFire.y, this.Vbullet - .5);
            else
            this.enemyBulletGenerator.shoot(enemyToFire.x + enemyToFire.width / 2, enemyToFire.y, this.Vbullet - 1);
        }
    }

    increaseSpeed() {
        if (this.currentEnemies.flat().length < 15 && this.currentEnemies.flat().length >= 7) {
            this.defaultFireDelay = 75
            this.Vxdefault = 1.25;
            this.Vydefault = 1.25;
        }
        else if (this.currentEnemies.flat().length < 7) {
            this.defaultFireDelay = 50
            this.Vxdefault = 1.5;
            this.Vydefault = 1.5;
        }
    }

    decrementMovindDownCounter() {
        if ([2, 3].includes(this.currentDirection))
            this.movingDownCounter--;
    }

    resetMovingDownCounter() {
        if (this.movingDownCounter <= 0)
            this.movingDownCounter = 30;
    }

    movement(newDirection) {//for moving down from either sides
        this.Vx = 0;
        this.Vy = this.Vydefault;
        if (this.movingDownCounter <= 0) {
            this.currentDirection = newDirection;
            // console.log("NEWW: ", this.currentDirection)
            return true;
        }
        return false;
    }

    updateDirectionAndVelocity() { //increased horizontal velocity as enemies are decreasing
        for (const enemyRow of this.currentEnemies) {
            if (this.currentDirection === this.directions[0]) { // towards L
                this.Vx = -this.Vxdefault;
                this.Vy = 0;
                // console.log(enemyRow[enemyRow.length -1].x);
                if (enemyRow[enemyRow.length - 1].x <= 0) {
                    this.currentDirection = this.directions[2];
                    break;
                }
            }
            else if (this.currentDirection === this.directions[2]) { //DL
                if (this.movement(this.directions[1])) {
                    break;
                }
            }
            else if (this.currentDirection === this.directions[1]) //towards R
            {
                this.Vx = this.Vxdefault;
                this.Vy = 0;
                if (enemyRow[0].x + enemyRow[0].width
                    >= this.canvas.width) {
                    this.currentDirection = this.directions[3];
                    break;
                }
            }
            else if (this.currentDirection === this.directions[3]) { //DR
                if (this.movement(this.directions[0]))
                    break;
            }
        }
    }

    //for each row in enemies, pushing the enemy sprites in the currentEnemies list 
    //using its height and width scaled to 0.75 times of the original
    createEnemies() {
        this.enemies.forEach((row, rowIndex) => {
            this.currentEnemies[rowIndex] = [];
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    const enemy = new Enemy(this.canvas.width - 40 - (enemyIndex * 50) / 1.25, 60 + (rowIndex * 35) / 1.25, enemyNumber);
                    this.currentEnemies[rowIndex].push(
                        enemy
                    );
                }
            });
        });
        // console.log(this.currentEnemies);
    }

    ifCollides(sprite) {
        return this.currentEnemies.flat().some(enemy => enemy.collision(sprite));
    }

    reset() {
        this.currentEnemies = [];
        this.currentDirection = this.directions[0];
        this.movingDownCounter = 30;
        this.Vx = 0;
        this.Vy = 0;
        this.Vxdefault = 0.65;
        this.Vydefault = 0.75;
        this.createEnemies();
        this.bigShip.reset();
    }

}