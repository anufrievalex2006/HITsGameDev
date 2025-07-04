import { config } from "../config.js"

export class Branch {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 100;
        this.type = data.type || 'Branch';
        this.passed = false;
        this.speedModifier = data.speed || 1.0;
        this.boundPlatform = null;
        this.relativeSpeed = 0;
        this.isFalling = false;
        this.fallSpeed = 0;
        this.detectionRange = 200;

        this.sprite = new Image();
        this.sprite.src = config.enemies.branch.sprite.src;
        this.spriteLoaded = false;

        this.sprite.onload = () => {
            this.spriteLoaded = true;
        };

        this.sprite.onerror = () => {
            console.warn(`Failed to load sprite: ${config.enemies.branch.sprite.src}`);
            this.spriteLoaded = false;
        };

        this.curFrame = 0;
        this.lastFrameTime = 0;
        this.animationSpeed = config.enemies.branch.sprite.animationSpeed;
    }

    update(speed, playerX) {

        if (!this.isFalling && playerX !== undefined) {
            const distanceToPlayer = Math.abs(this.x - playerX);
            if (distanceToPlayer <= this.detectionRange) {
                this.isFalling = true;
            }
        }

        if (this.isFalling) {
            this.fallSpeed += 0.5;
            this.y += this.fallSpeed;
            this.x -= speed;
        } else {
            this.x -= speed;
            
            if (this.boundPlatform) {
                if (this.y + this.height < this.boundPlatform.y) {
                    this.y += 0.075;
                }
            }
        }

        if (this.boundPlatform && this.relativeSpeed !== 0 && !this.passed) {
            this.x += this.relativeSpeed;

            const platLeft = this.boundPlatform.x;
            const platRight = this.boundPlatform.x + this.boundPlatform.width;

            if (this.x <= platLeft) {
                this.x = platLeft;
                this.relativeSpeed = Math.abs(this.relativeSpeed);
            }
            else if (this.x + this.width >= platRight) {
                this.x = platRight - this.width;
                this.relativeSpeed = -Math.abs(this.relativeSpeed);
            }
        }

        this.updateAnimation();
    }

    updateAnimation() {
        const curTime = Date.now();
        if (curTime - this.lastFrameTime > this.animationSpeed) {
            this.curFrame = (this.curFrame + 1) % config.enemies.branch.sprite.frames;
            this.lastFrameTime = curTime;
        }
    }

    draw(ctx) {
        if (this.spriteLoaded) {
            const spriteConfig = config.enemies.branch.sprite;

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