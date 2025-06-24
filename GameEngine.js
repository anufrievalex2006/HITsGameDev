import { config } from "./config.js";
import { Player } from "./Player.js";
import { Platform } from "./Platform.js";
import { FlyingEnemy } from './Enemy/FlyingEnemy.js';
import { StoneEnemy } from './Enemy/StoneEnemy.js';
import { BulletEnemy } from './Enemy/Bullet.js';
import { BossEnemy } from './Enemy/Boss.js';
import { LevelManager } from './LevelManager.js';
import { EntityManager } from "./EntityManager.js";

export class GameEngine {
    constructor(canvas, levels) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.player = null;
        this.originalEnemies = [];
        this.originalWholePlatforms = [];
        this.wholePlatforms = [];
        this.platformManager = new EntityManager();
        this.enemyManager = new EntityManager();
        this.levelManager = new LevelManager(levels);
        this.score = 0;
        this.speed = config.obstacles.initialSpeed;
        this.gameRunning = false;
        this.animationFrameId = null;
        this.lastObstacleTime = 0;
        this.levelDistance = 0;
        this.BossHP = 0;

        this.keyHandler = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.keyHandler)
            document.removeEventListener("keydown", this.keyHandler);

        this.keyHandler = (e) => {
            if (e.key === " " && this.gameRunning) {
                this.player?.jump();
            }
            if (e.key === "q" && this.gameRunning) {
                const screenX = 80;
                let enemy = new BulletEnemy(
                            screenX,
                            this.player?.y,
                            {type: "Bullet", speed: -5}
                        );
                this.enemyManager.addInStart(enemy)
            }
        };

        document.addEventListener("keydown", this.keyHandler);
    }

    generatePlatforms() {
        this.platformManager.clear();
        this.wholePlatforms = this.levelManager.getPlatforms();
        
        this.wholePlatforms.forEach(platform => {
            const segmentWidth = config.platform.segmentWidth;
            const segmentCount = Math.ceil(platform.width / segmentWidth);

            for (let i = 0; i < segmentCount; i++) {
                if(i != segmentCount - 1){
                    this.platformManager.add(
                        new Platform(
                            platform.x + i * segmentWidth,
                            platform.y,
                            segmentWidth
                        )
                    );
                }else{
                    this.platformManager.add(
                        new Platform(
                            platform.x + i * segmentWidth,
                            platform.y,
                            platform.width - segmentWidth * segmentCount
                        )
                    );
                }
            }
        });
    }

    spawnEnemy() {
        const enemies = this.levelManager.getEnemies();
        const viewportEnd = this.levelDistance + this.canvas.width;

        enemies.forEach(enemyData => {
            if (!enemyData.spawned && enemyData.x <= viewportEnd + 200) {
                const screenX = enemyData.x - this.levelDistance + this.canvas.width;

                let enemy;
                switch (enemyData.type) {
                    case 'Stone':
                        const plat = this.findWholePlatformForEnemy(enemyData.x);
                        if (!plat) {
                            return;
                        }
                        enemy = new StoneEnemy(
                            screenX,
                            plat.y - 40,
                            enemyData
                        );
                        break;
                    case 'Nazgul':
                        enemy = new FlyingEnemy(
                            screenX,
                            enemyData.y,
                            enemyData
                        );
                        break;
                    default:
                        enemy = new StoneEnemy(
                            screenX,
                            this.canvas.height - 50,
                            enemyData
                        );
                }

                enemy.originalX = enemyData.x;
                const platform = this.findWholePlatformForEnemy(enemy.originalX);
                if (platform) {
                    enemy.boundPlatform = platform;
                    if (enemyData.relativeSpeed === undefined)
                        enemy.relativeSpeed = 2;
                }
                this.enemyManager.add(enemy);
                enemyData.spawned = true;
            }
        });
    }

    findWholePlatformForEnemy(enemyX) {
        for (const platform of this.wholePlatforms) {
            if (enemyX >= platform.x && enemyX <= platform.x + platform.width) {
                return platform;
            }
        }
        return null;
    }

    update() {
        if (!this.player) return;
        
        this.player.update(this.platformManager.entities, this.speed);
        this.platformManager.update(this.speed);
        this.enemyManager.update(this.speed);

        this.wholePlatforms.forEach(platform => {
            platform.x -= this.speed;
        });
        
        if (this.speed < config.obstacles.maxSpeed) {
            this.speed += config.obstacles.acceleration;
        }
        this.levelDistance += this.speed;

        this.spawnEnemy();
        this.checkCollisions();
        this.checkLevelCompletion();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.platformManager.draw(this.ctx);
        this.enemyManager.draw(this.ctx);
        if (this.player) {
            this.player.draw(this.ctx);
        }

        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.canvas.width / 4, 10, this.BossHP, 10);

        if(this.checkDistanceForSpawnBoss()){
            let boss = new BossEnemy(
                this.canvas.width,
                0,
                {y: 0, type: "Boss", speed: 0.1}
            )
            console.log("spawn boss")
            this.enemyManager.add(boss)
            this.BossHP = this.canvas.width / 2
        }

        this.ctx.fillStyle = config.colors.text;
        this.ctx.font = "28px Arial";
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }

    checkCollisions() {
        if (!this.player) return;

        const boss = this.enemyManager.entities.find(e => e.type === "Boss");

        if(this.BossHP > 0 && boss){
            this.enemyManager.entities.forEach(enemy => {
                if(enemy.type != "Boss" && enemy.type === "Bullet"){
                    if(this.isColliding(enemy, boss) && !enemy.hitBoss){
                        this.BossHP -= 10;
                        enemy.hitBoss = true;
                        enemy.shouldRemove = true;

                        if(this.BossHP <= 0){
                            this.BossHP = 0;
                        }
                    }
                }
            });

            this.enemyManager.entities = this.enemyManager.entities.filter(e => !e.shouldRemove);
            if (this.BossHP <= 0) {
                this.gameWin();
                return;
            }
        }
        
        this.enemyManager.entities.forEach(enemy => {
            if (this.isColliding(this.player, enemy)) {
                this.gameOver();
            } else if (this.player.x > enemy.x + enemy.width && !enemy.passed) {
                this.score++;
                enemy.passed = true;
                
                if (enemy.relativeSpeed !== 0)
                    enemy.relativeSpeed = 0;
            }
        });

        if (this.player.y + this.player.height > this.canvas.height) {
            this.gameOver();
        }
    }

    isColliding(player, obstacle) {
        return (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        );
    }

    gameOver() {
        if (!this.gameRunning) return;

        this.gameRunning = false;
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;

        alert(`Game Over! Score: ${this.score}`);
        this.resetLevel();
        setTimeout(() => {
            this.start();
        }, 100);
    }

    loadLevel(levelId) {
        if (!this.levelManager.loadLevel(levelId)) {
            console.error(`Level ${levelId} not found!`);
            return false;
        }
        
        this.originalEnemies = JSON.parse(JSON.stringify(this.levelManager.getEnemies()));
        this.originalWholePlatforms = JSON.parse(JSON.stringify(this.levelManager.getPlatforms()));
        this.wholePlatforms = JSON.parse(JSON.stringify(this.originalWholePlatforms));
        this.resetLevel();
        return true;
    }

    resetLevel() {
        this.enemyManager.clear();
        this.platformManager.clear();

        if (this.originalEnemies.length > 0) {
            this.levelManager.setEnemies(JSON.parse(JSON.stringify(this.originalEnemies)));
        }
        if (this.originalWholePlatforms.length > 0) {
            this.levelManager.setPlatforms(JSON.parse(JSON.stringify(this.originalWholePlatforms)));
            this.wholePlatforms = JSON.parse(JSON.stringify(this.originalWholePlatforms));
        }
        this.generatePlatforms();
        
        const spawn = this.levelManager.getSpawnPoint();
        this.player = new Player(spawn.x, spawn.y);
        
        const currentLevel = this.levelManager.getCurrentLevel();
        if (currentLevel) {
            currentLevel.enemies.forEach(enemy => {
                enemy.spawned = false;
                if (enemy.passed) enemy.passed = false;
            });
        }
        
        this.score = 0;
        this.speed = config.obstacles.initialSpeed;
        this.levelDistance = 0;
        this.lastObstacleTime = 0;
        this.BossHP = 0
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    start() {
        if (this.gameRunning) return;

        this.gameRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    stop() {
        this.gameRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    gameLoop() {
        if (!this.gameRunning) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    checkDistanceForSpawnBoss(){
        if(this.levelDistance >= 15000 && this.levelDistance <= 15500 && this.BossHP == 0){
            return true
        }else{
            return false
        }
    }

    checkLevelCompletion() {
        const enemies = this.levelManager.getEnemies();
        const allDefeated = enemies.every(enemy => enemy.spawned && enemy.passed);

        if (allDefeated && enemies.length > 0) {
            const nextLevelId = this.getNextLevelId();
            if (nextLevelId) {
                this.transitionToLevel(nextLevelId);
            } else {
                this.gameWin();
            }
        }
    }

    getNextLevelId() {
        const currentId = this.levelManager.getCurrentLevel()?.id;
        const allLevels = this.levelManager.getAllLevels();
        const currentIndex = allLevels.findIndex(l => l.id === currentId);
        
        if (currentIndex < allLevels.length - 1) {
            return allLevels[currentIndex + 1].id;
        }
        return null;
    }

    transitionToLevel(levelId) {
        this.stop();
        
        let alpha = 0;
        const fadeOut = () => {
            alpha += 0.05;
            this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (alpha < 1) {
                requestAnimationFrame(fadeOut);
            } else {
                this.loadLevel(levelId);
                this.start();
                
                const fadeIn = () => {
                    alpha -= 0.05;
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.draw();
                    this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    
                    if (alpha > 0) {
                        requestAnimationFrame(fadeIn);
                    }
                };
                fadeIn();
            }
        };
        fadeOut();
    }

    gameWin() {
        this.gameRunning = false;
        alert(`Победа! Игра завершена. Счет: ${this.score}`);
        this.stop()
        $("#gameScreen").hide();
        $("#map").show();
    }

    findPlatformForEnemy(enemyX) {
        for (const platform of this.platformManager.entities) {
            if (enemyX >= platform.x && enemyX <= platform.x + platform.width) {
                return platform;
            }
        }
        return null;
    }
}