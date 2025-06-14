export class FlyingEnemy {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 30;
        this.type = data.type || 'Nazgul';
        this.speedX = data.speedX || -3;
        this.passed = false;
        this.speedModifier = data.speed || 1.0;
    }

    update(speed) {
        this.x += this.speedX - (speed * this.speedModifier);
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOutOfBounds() {
        return this.x + this.width < 0;
    }
}