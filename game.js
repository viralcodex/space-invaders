import Player from './player.js';
import BulletGenerator from './BulletGenerator.js';
import EnemyGenerator from "./EnemyGenerator.js";
import Utils from './utils.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let CANVAS_WIDTH = canvas.width = 500;
let CANVAS_HEIGHT = canvas.height = 500;
let gameOver = false;
let gameWon = false;
let lives = 3;
let animationFrameId;
let paused = false;

const playerBulletGenerator = new BulletGenerator(canvas, 1, "white");
const enemyBulletGenerator = new BulletGenerator(canvas, 20, "red");
const enemyGenerator = new EnemyGenerator(canvas, playerBulletGenerator, enemyBulletGenerator);
const player = new Player(canvas, playerBulletGenerator);
const utils = new Utils();

function game() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    checkGameOver();
    if (!gameOver && !gameWon && !paused) {
        player.draw(ctx);
        enemyGenerator.draw(ctx, utils);
        playerBulletGenerator.draw(ctx);
        enemyBulletGenerator.draw(ctx);
        playerBulletGenerator.ifBulletsCollide(enemyBulletGenerator);
        animationFrameId = requestAnimationFrame(game);
    } else if (gameOver || gameWon) {
        displayGameOverOrGameWon();
    }
}

function displayGameOverOrGameWon() {
    if (gameOver) {
        document.getElementById('rule').style.setProperty('display', 'none');
        document.getElementById('score').style.setProperty('display', 'none');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "white";
        ctx.font = "25px Verdana";
        ctx.fillText('Game Over!', CANVAS_WIDTH / 2 - 75, CANVAS_HEIGHT / 2);
        utils.reinitialiseScore();
        cancelAnimationFrame(animationFrameId);
        restartGame();
    } else if (gameWon) {
        ctx.fillStyle = "white";
        ctx.font = "25px Verdana";
        ctx.fillText('Get Ready for next wave!', CANVAS_WIDTH / 2 - 150, CANVAS_HEIGHT / 2);
        setTimeout(handlePlayAgain, 3000);
    }
}

function restartGame() {
    document.getElementById('play-again').style.setProperty('display', 'block');
    document.getElementById('play-again').removeEventListener('click', handlePlayAgain); //remove any additional event listeners before it
    document.getElementById('play-again').addEventListener('click', handlePlayAgain);
    document.getElementById('lives').innerHTML = '';
    document.getElementById('score').innerHTML = 'Score: 0';
}

function handlePlayAgain() {
    console.log('clicked');
    document.getElementById('score').style.setProperty('display', 'block');
    document.getElementById('play-again').style.setProperty('display', 'none');
    document.getElementById('rule').style.setProperty('display', 'block');
    if (gameOver && !gameWon) {
        document.getElementById('lives').innerHTML = `
        <img src="img/player.png" alt="life 1" id="life-1" width="25" height="24" />
        <img src="img/player.png" alt="life 2" id="life-2" width="25" height="24" />
        <img src="img/player.png" alt="life 3" id="life-3" width="25" height="24" />
        `;
        document.getElementById('score').innerHTML = 'Score: 0';
        lives = 3;
        utils.reinitialiseScore();
    }
    gameOver = false;
    gameWon = false;
    player.reset();
    enemyGenerator.reset();
    enemyBulletGenerator.reset();
    playerBulletGenerator.reset();
    animationFrameId = requestAnimationFrame(game);
}

function checkGameOver() {
    if (lives == 0) {
        gameOver = true;
        gameWon = false;
    } else if (enemyBulletGenerator.ifCollides(player)) {
        document.getElementById(`life-${lives}`).remove();
        --lives;
    }
    if (enemyGenerator.ifCollides(player)) {
        gameOver = true;
        gameWon = false;
    }
    if (enemyGenerator.currentEnemies.length === 0) {
        gameWon = true;
        gameOver = false;
    }
}


document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        if (paused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
});

function pauseGame() {
    if (!gameWon) {
        paused = true;
        cancelAnimationFrame(animationFrameId);
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "white";
        ctx.font = "25px Verdana";
        ctx.fillText('Paused', CANVAS_WIDTH / 2 - 50, CANVAS_HEIGHT / 2);
    }
}

function resumeGame() {
    paused = false;
    animationFrameId = requestAnimationFrame(game);
}


requestAnimationFrame(game);