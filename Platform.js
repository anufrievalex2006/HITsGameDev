import { config } from "./config.js";

export class Platform {
    constructor(x, y, width = config.platform.segmentWidth) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = config.platform.segmentHeight;
    }

    update(speed) {
        this.x -= speed;
    }

    draw(ctx) {
        ctx.fillStyle = config.colors.platform;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOutOfBounds() {
        return this.x + this.width < 0;
    }
}