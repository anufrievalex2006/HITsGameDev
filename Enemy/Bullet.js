export class BulletEnemy {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.type = data.type || 'Bullet';
        this.passed = false;
        this.speedModifier = data.speed || 1.0;
        this.damage = data.damage || 10
    }

    update(speed) {
        this.x -= speed * this.speedModifier;
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOutOfBounds() {
        return this.x + this.width < 0;
    }
}