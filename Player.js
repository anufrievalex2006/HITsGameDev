import { config } from "./config.js";

export class Player {
    constructor(x, y) {
        this.width = config.player.width;
        this.height = config.player.height;
        this.x = x;
        this.y = y;
        this.velocityY = 0;
        this.isJumping = false;
    }

    update(platformSegments, obstacleSpeed) {
        this.y += this.velocityY;
        this.velocityY += config.player.gravity;

        const currentSegment = platformSegments.find(segment => 
            this.x + this.width >= segment.x && 
            this.x <= segment.x + segment.width
        );

        if (currentSegment && this.y + this.height > currentSegment.y) {
            if (this.y - currentSegment.y > 0) {
                this.x -= obstacleSpeed;
            } else {
                this.y = currentSegment.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = config.colors.player;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = config.player.jumpForce;
            this.isJumping = true;
        }
    }
}