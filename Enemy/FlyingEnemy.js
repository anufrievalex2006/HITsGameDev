import { config } from "../config.js"

export class FlyingEnemy {
    constructor(x, y, data) {
        this.x = x;
        this.y = data.y;
        this.width = 125;
        this.height = 50;
        this.type = data.type || 'Nazgul';
        this.speedX = data.speedX || -3;
        this.passed = false;
        this.speedModifier = data.speed || 1.0;

        this.sprite = new Image();
        this.sprite.src = config.enemies.nazgul.sprite.src;
        this.spriteLoaded = false;

        this.sprite.onload = () => {
            this.spriteLoaded = true;
        };

        this.sprite.onerror = () => {
            console.warn(`Failed to load sprite: ${config.enemies.nazgul.sprite.src}`);
            this.spriteLoaded = false;
        };

        this.curFrame = 0;
        this.lastFrameTime = 0;
        this.animationSpeed = config.enemies.nazgul.sprite.animationSpeed;
    }

    update(speed) {
        this.x += this.speedX - (speed * this.speedModifier);
        this.updateAnimation();
    }

    updateAnimation() {
        const curTime = Date.now();
        if (curTime - this.lastFrameTime > this.animationSpeed) {
            this.curFrame = (this.curFrame + 1) % config.enemies.nazgul.sprite.frames;
            this.lastFrameTime = curTime;
        }
    }

    draw(ctx) {
        if (this.spriteLoaded) {
            const spriteConfig = config.enemies.nazgul.sprite;

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
        }
        else {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    isOutOfBounds() {
        return this.x + this.width < 0;
    }
}