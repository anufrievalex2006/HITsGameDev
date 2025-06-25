import { config } from "./config.js";

export class Player {
    constructor(x, y) {
        this.width = config.player.width;
        this.height = config.player.height;
        this.x = x;
        this.y = y;
        this.velocityY = 0;
        this.isJumping = false;

        this.sprite = new Image();
        this.sprite.src = config.player.sprite.src;
        this.spriteLoaded = false;

        this.sprite.onload = () => {
            this.spriteLoaded = true;
        };

        this.curFrame = 0;
        this.lastFrameTime = 0;
        this.animationSpeed = config.player.sprite.animationSpeed;
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
        this.updateAnimation();
    }

    updateAnimation() {
        const curTime = Date.now();
        if (curTime - this.lastFrameTime > this.animationSpeed) {
            this.curFrame = (this.curFrame + 1) % config.player.sprite.frames;
            this.lastFrameTime = curTime;
        }
    }

    draw(ctx) {
        if (this.spriteLoaded) {
            const frameWidth = config.player.sprite.frameWidth;
            const frameHeight = config.player.sprite.frameHeight;
            const framesPerRow = config.player.sprite.framesPerRow;

            const row = Math.floor(this.curFrame / framesPerRow);
            const col = this.curFrame % framesPerRow;

            const sourceX = col * frameWidth;
            const sourceY = row * frameHeight;
            ctx.drawImage(
                this.sprite,
                sourceX, sourceY, frameWidth, frameHeight,
                this.x, this.y, this.width, this.height
            );
        }
        else {
            ctx.fillStyle = config.colors.player;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityY = 0;
        this.isJumping = false;
        this.curFrame = 0;
        this.lastFrameTime = 0;
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = config.player.jumpForce;
            this.isJumping = true;
        }
    }
}