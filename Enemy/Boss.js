import { config } from "../config.js";

export class BossEnemy {
    constructor(x, y, data) {
        this.x = x;
        this.y = data.y;
        this.width = 550;
        this.height = 300;
        this.type = data.type || 'Boss';
        this.passed = false;
        this.speedModifier = data.speed || 1.0;

        this.sprite = new Image();
        this.sprite.src = config.enemies.boss.sprite.src;
        this.spriteLoaded = false;

        this.sprite.onload = () => {
            this.spriteLoaded = true;
        };

        this.sprite.onerror = () => {
            console.warn(`Failed to load sprite: ${config.enemies.boss.sprite.src}`);
            this.spriteLoaded = false;
        };

        this.curFrame = 0;
        this.lastFrameTime = 0;
        this.animationSpeed = config.enemies.boss.sprite.animationSpeed;
    }

    update(speed) {
        this.x -= speed * this.speedModifier;
        this.updateAnimation();
    }

    updateAnimation() {
        const curTime = Date.now();
        if (curTime - this.lastFrameTime > this.animationSpeed) {
            this.curFrame = (this.curFrame + 1) % config.enemies.boss.sprite.frames;
            this.lastFrameTime = curTime;
        }
    }

    draw(ctx) {
        if (this.spriteLoaded) {
            const spriteConfig = config.enemies.boss.sprite;

            const frameWidth = spriteConfig.frameWidth;
            const frameHeight = spriteConfig.frameHeight;
            const framesPerRow = spriteConfig.framesPerRow;

            const row = Math.floor(this.curFrame / framesPerRow);
            const col = this.curFrame % framesPerRow;

            const sourceX = col * frameWidth;
            const sourceY = row * frameHeight;

            ctx.drawImage(
                this.sprite,
                sourceX, sourceY, frameWidth, frameHeight,
                this.x, this.y, this.width, this.height
            );
        }else{
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    isOutOfBounds() {
        return this.x + this.width < 0;
    }
}