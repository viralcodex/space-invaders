export default class Utils {
    score = 0;

    constructor() {
        this.score = 0;
    }

    updateScore(killType) {
        this.score += killType ? 500 : 100;
        document.getElementById('score').innerHTML = `Score: ${this.score}`
    }

    reinitialiseScore() {
        this.score = 0;
    }

}   