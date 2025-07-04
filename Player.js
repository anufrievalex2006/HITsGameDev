import { config } from "./config.js";
import { BulletEnemy } from './Enemy/Bullet.js';

export class Player {
    constructor(x, y) {
        this.width = config.player.width;
        this.height = config.player.height;
        this.x = x;
        this.y = y;
        this.velocityY = 0;
        this.isJumping = false;
        this.typeShoot = 1;
        this.cntTypeShoot = 3;

        this.lastShotTime = 0;
        this.shootDelay = {
            1: 0,
            2: 350,
            3: 400
        };

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

    shoot(enemyManager) {
        const currentTime = Date.now();
        const delay = this.shootDelay[this.typeShoot];

        if (this.typeShoot != 1 && currentTime - this.lastShotTime < delay) {
            return false;
        }

        const screenX = this.x + 10;
        let damage = 10;
        if(this.typeShoot === 1){
            damage = 10;
        }else if(this.typeShoot === 2){
            damage = 50;
        }else if(this.typeShoot === 3){
            damage = 35;
        }

        if (this.typeShoot === 3) {
            let enemy = new BulletEnemy(
                screenX,
                this.y,
                { type: "Bullet", speed: -5, damage: damage, ySpeed: -7 }
            );
            enemyManager.addInStart(enemy);
            enemy = new BulletEnemy(
                screenX,
                this.y,
                { type: "Bullet", speed: -5, damage: damage, ySpeed: 0 }
            );
            enemyManager.addInStart(enemy);
            enemy = new BulletEnemy(
                screenX,
                this.y,
                { type: "Bullet", speed: -5, damage: damage, ySpeed: 7 }
            );
            enemyManager.addInStart(enemy);
        } else {
            let enemy = new BulletEnemy(
                screenX,
                this.y,
                { type: "Bullet", speed: -5, damage: damage }
            );
            enemyManager.addInStart(enemy);
        }
        this.lastShotTime = currentTime;
        return true;
    }

    changeShootType() {
        this.typeShoot++;
        if(this.typeShoot > this.cntTypeShoot){
            this.typeShoot = 1;
        }
    }
}