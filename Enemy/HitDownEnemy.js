import { config } from "../config.js"

export class HitDownEnemy {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.width = 46.55;
        this.height = 90;
        this.type = data.type || 'Hitdown';
        this.passed = false;
        this.speedModifier = data.speed || 1.0;
        this.boundPlatform = null;
        this.relativeSpeed = data.relativeSpeed || 2;
        this.originalX = x;

        this.maxHealth = 6;
        this.curHealth = this.maxHealth;
        this.shouldRemove = false;
        this.hitCooldown = 0;
        this.hitCooldownTime = 60;

        this.sprite = new Image();
        this.sprite.src = config.enemies.hitdown.sprite.src;
        this.spriteLoaded = false;

        this.sprite.onload = () => {
            this.spriteLoaded = true;
        };

        this.sprite.onerror = () => {
            console.warn(`Failed to load sprite: ${config.enemies.hitdown.sprite.src}`);
            this.spriteLoaded = false;
        };

        this.curFrame = 0;
        this.lastFrameTime = 0;
        this.animationSpeed = config.enemies.hitdown.sprite.animationSpeed;
    }

    update(speed) {
        this.x -= speed;

        if (this.hitCooldown > 0)
            this.hitCooldown -= 16;

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

    takeDamage() {
        if (this.hitCooldown <= 0) {
            this.curHealth--;
            this.hitCooldown = this.hitCooldownTime;

            if (this.curHealth <= 0)
                this.shouldRemove = true;
            return true;
        }
        return false;
    }

    updateAnimation() {
        const curTime = Date.now();
        if (curTime - this.lastFrameTime > this.animationSpeed) {
            this.curFrame = (this.curFrame + 1) % config.enemies.hitdown.sprite.frames;
            this.lastFrameTime = curTime;
        }
    }

    draw(ctx) {
        if (this.spriteLoaded) {
            const spriteConfig = config.enemies.hitdown.sprite;

            const frameWidth = spriteConfig.frameWidth;
            const frameHeight = spriteConfig.frameHeight;
            const framesPerRow = spriteConfig.framesPerRow;

            const row = Math.floor(this.curFrame / framesPerRow);
            const col = this.curFrame % framesPerRow;

            const sourceX = col * frameWidth;
            const sourceY = row * frameHeight;
            if (this.hitCooldown > 0) {
                ctx.save();
                ctx.globalAlpha = 0.5 + 0.5*Math.sin(Date.now() * 0.02);
            }

            ctx.drawImage(
                this.sprite,
                sourceX, sourceY, frameWidth, frameHeight,
                this.x, this.y, this.width, this.height
            );
            if (this.hitCooldown > 0)
                ctx.restore();
        }
        else {
            let color = 'orange';
            if (this.curHealth === 2) color = 'yellow';
            else if (this.curHealth === 1) color = 'red';

            if (this.hitCooldown > 0) {
                ctx.save();
                ctx.globalAlpha = 0.5;
            }

            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this.hitCooldown > 0)
                ctx.restore();
        }
        this.drawHealthBar(ctx);
    }

    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 8;
        const barX = this.x;
        const barY = this.y - 8;

        ctx.fillStyle = 'red';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = 'green';
        const healthWidth = (this.curHealth / this.maxHealth) * barWidth;
        ctx.fillRect(barX, barY, healthWidth, barHeight);
    }

    isOutOfBounds() {
        return this.x + this.width < 0;
    }
}