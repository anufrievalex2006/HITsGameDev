import { config } from "./config.js";

export class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.passed = false;
    }

    update(speed) {
        this.x -= speed;
    }

    draw(ctx) {
        ctx.fillStyle = config.colors.obstacle;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOutOfBounds() {
        return this.x + this.width < 0;
    }
}