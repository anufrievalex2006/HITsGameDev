export class BossEnemy {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 1200;
        this.type = data.type || 'Boss';
        this.passed = false;
        this.speedModifier = data.speed || 1.0;
    }

    update(speed) {
        this.x -= speed * this.speedModifier;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOutOfBounds() {
        return this.x + this.width < 0;
    }
}