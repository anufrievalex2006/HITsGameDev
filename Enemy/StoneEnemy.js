import { config } from "../config.js"

export class StoneEnemy {
    constructor(x, y, data) {
        this.x = x;
        this.y = data.y;
        this.width = 40;
        this.height = 40;
        this.type = data.type || 'Stone';
        this.passed = false;
        this.speedModifier = data.speed || 1.0;
        this.boundPlatform = null;

        this.sprite = new Image();
        this.sprite.src = config.enemies.stone.sprite.src;
        this.spriteLoaded = false;

        this.sprite.onload = () => {
            this.spriteLoaded = true;
        };

        this.sprite.onerror = () => {
            console.warn(`Failed to load sprite: ${config.enemies.stone.sprite.src}`);
            this.spriteLoaded = false;
        };

        this.curFrame = 0;
        this.lastFrameTime = 0;
        this.animationSpeed = config.enemies.stone.sprite.animationSpeed;
    }

    update(speed) {
        if(
            this.originalX < this.boundPlatform?.x
            || this.originalX > this.boundPlatform?.x + this.boundPlatform?.width
        ){
            this.speedModifier *= -1;
            if(this.originalX < this.boundPlatform?.x){
                this.x += (this.boundPlatform?.x - this.originalX);
                this.originalX = this.boundPlatform?.x;
            }
            if(this.originalX > this.boundPlatform?.x  + this.boundPlatform?.width){
                this.x -= (this.originalX - this.boundPlatform?.x - this.boundPlatform?.width);
                this.originalX = this.boundPlatform?.x  + this.boundPlatform?.width;
            }
        }
        this.x -= speed * this.speedModifier;
        this.originalX -= speed * this.speedModifier;
        this.updateAnimation();
    }

    updateAnimation() {
        const curTime = Date.now();
        if (curTime - this.lastFrameTime > this.animationSpeed) {
            this.curFrame = (this.curFrame + 1) % config.enemies.stone.sprite.frames;
            this.lastFrameTime = curTime;
        }
    }

    draw(ctx) {
        if (this.spriteLoaded) {
            const spriteConfig = config.enemies.stone.sprite;

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
            ctx.fillStyle = 'gray';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    isOutOfBounds() {
        return this.x + this.width < 0;
    }
}