import { GameEngine } from "./GameEngine.js";
import { LevelGenerator } from "./LevelGenerator.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 400;

const levelConfigs = {
    weather_hills: {
        id: "weather_hills",
        name: "Weather Hills",
        boss: "King-Wizard of Angmar",
        spawn: { x: 50, y: 300 },
        width: 25000,
        difficulty: 1,
        theme: "hills",
        platformConfig: {
            minWidth: 300,
            maxWidth: 600,
            minGap: 0,
            maxGap: 0,
            heightVariation: 100,
            baseHeight: 300
        },
        enemyConfig: {
            stoneEnemies: {
                count: { min: 20, max: 30 },
                speedRange: { min: 0.8, max: 1.2 }
            },
            nazgulEnemies: {
                count: { min: 5, max: 10 },
                speedRange: { min: 1.6, max: 2.0 },
                speedXRange: { min: -5, max: -3 },
                heightRange: { min: 60, max: 120 }
            },
            branch: {
                count: { min: 9, max: 20 },
            }
        },
        collectibleConfig: {
            speedUp: {
                count: { min: 9, max: 20 }
            },
            speedDown: {
                count: { min: 8, max: 15 }
            }
        },
        layerConfig: {
            tree: {
                count: { min: 20, max: 40 }
            },
            bush: {
                count: { min: 25, max: 50 }
            },
            clother: {
                count: { min: 1, max: 4 }
            }
        }
    },
    moria: {
        id: "moria",
        name: "Moria",
        boss: "Balrog",
        spawn: { x: 100, y: 200 },
        width: 35000,
        difficulty: 2,
        theme: "cave",
        platformConfig: {
            minWidth: 300,
            maxWidth: 600,
            minGap: 100,
            maxGap: 250,
            heightVariation: 100,
            baseHeight: 300
        },
        enemyConfig: {
            stoneEnemies: {
                count: { min: 9, max: 20 },
                speedRange: { min: 1.0, max: 1.5 }
            },
            nazgulEnemies: {
                count: { min: 8, max: 15 },
                speedRange: { min: 2.0, max: 2.6 },
                speedXRange: { min: -6, max: -3 },
                heightRange: { min: 45, max: 90 }
            },
            branch: {
                count: { min: 9, max: 20 },
            }
        },
        collectibleConfig: {
            speedUp: {
                count: { min: 9, max: 20 }
            },
            speedDown: {
                count: { min: 8, max: 15 }
            }
        },
        layerConfig: {
            tree: {
                count: { min: 20, max: 40 }
            },
            bush: {
                count: { min: 25, max: 50 }
            },
            clother: {
                count: { min: 1, max: 4 }
            }
        }
    }
};

const levelGenerator = new LevelGenerator(levelConfigs);
class LevelGenerator {
    constructor() {
        this.seed = Date.now();
    }

    random(seed = this.seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    randomRange(min, max, seed = this.seed) {
        return min + this.random(seed) * (max - min);
    }

    randomInt(min, max, seed = this.seed) {
        return Math.floor(this.randomRange(min, max + 1, seed));
    }

    generatePlatforms(config) {
        const platforms = [];
        const { minWidth, maxWidth, minGap, maxGap, heightVariation, baseHeight } = config.platformConfig;

        let curX = 0;
        let platformId = 0;

        const firstPlatformWidth = this.randomRange(minWidth * 2, maxWidth * 2, this.seed + platformId);
        platforms.push({
            x: 0,
            y: baseHeight,
            width: firstPlatformWidth
        });

        curX = firstPlatformWidth;
        platformId++;

        while (curX < config.width) {
            const gap = this.randomRange(minGap, maxGap, this.seed + platformId*100);
            curX += gap;

            if (curX >= config.width) break;

            const width = this.randomRange(minWidth, maxWidth, this.seed + platformId*200);
            const heightOffset = this.randomRange(-heightVariation/2, heightVariation/2, this.seed + platformId*300);
            const height = Math.max(200, Math.min(380, baseHeight + heightOffset));
            
            console.log(`Platform at x=${curX}, width=${Math.min(width, config.width - curX)}`);

            platforms.push({
                x: curX,
                y: height,
                width: Math.min(width, config.width - curX)
            });

            curX += width;
            platformId++;
        }
        console.log(`--------------------------------------------------------------------------------------`);
        return platforms;
    }

    generateEnemies(config, platforms) {
        const enemies = [];

        const kStones = this.randomInt(
            config.enemyConfig.stoneEnemies.count.min,
            config.enemyConfig.stoneEnemies.count.max,
            this.seed + 1000
        );

        for (let i = 0; i < kStones; i++) {
            const platform = platforms[this.randomInt(0, platforms.length - 1, this.seed + i + 1100)];
            const x = this.randomRange(
                platform.x + 20, 
                platform.x + platform.width - 60,
                this.seed + i + 1200
            );
            const y = platform.y - 40;
            const speed = this.randomRange(
                config.enemyConfig.stoneEnemies.speedRange.min,
                config.enemyConfig.stoneEnemies.speedRange.max,
                this.seed + i + 1300
            );

            enemies.push({
                type: "Stone",
                x: x,
                y: y,
                speed: speed,
                relativeSpeed: 2
            });
        }

        const kBranchs = this.randomInt(
            config.enemyConfig.branch.count.min,
            config.enemyConfig.branch.count.max,
            this.seed + 3000
        );

        for (let i = 0; i < kBranchs; i++) {
            const platform = platforms[this.randomInt(0, platforms.length - 1, this.seed + i + 3100)];
            const x = this.randomRange(
                platform.x + 20, 
                platform.x + platform.width - 60,
                this.seed + i + 3200
            );
            const y = platform.y - 40;

            enemies.push({
                type: "Branch",
                x: x,
                y: y,
                speed: 0,
                relativeSpeed: 0
            });
        }

        const kNazguls = this.randomInt(
            config.enemyConfig.nazgulEnemies.count.min,
            config.enemyConfig.nazgulEnemies.count.max,
            this.seed + 2000
        );

        for (let i = 0; i < kNazguls; i++) {
            const x = this.randomRange(400, config.width - 200, this.seed + i + 2100);
            const y = this.randomRange(
                config.enemyConfig.nazgulEnemies.heightRange.min,
                config.enemyConfig.nazgulEnemies.heightRange.max,
                this.seed + i + 2200
            );
            const speed = this.randomRange(
                config.enemyConfig.nazgulEnemies.speedRange.min,
                config.enemyConfig.nazgulEnemies.speedRange.max,
                this.seed + i + 2300
            );
            const speedX = this.randomRange(
                config.enemyConfig.nazgulEnemies.speedXRange.min,
                config.enemyConfig.nazgulEnemies.speedXRange.max,
                this.seed + i + 2400
            );

            enemies.push({
                type: "Nazgul",
                x: x,
                y: y,
                speed: speed,
                speedX: speedX
            });
        }
        return enemies;
    }

    generateLayer(config, platforms) {
        const enemies = [];

        const kTrees = this.randomInt(
            config.layerConfig.tree.count.min,
            config.layerConfig.tree.count.max,
            this.seed + 2000
        );

        for (let i = 0; i < kTrees; i++) {
            const platform = platforms[this.randomInt(0, platforms.length - 1, this.seed + i + 2100)];
            const x = this.randomRange(
                platform.x + 20, 
                platform.x + platform.width - 280,
                this.seed + i + 2200
            );
            const y = platform.y - 500;

            enemies.push({
                type: "Tree",
                x: x,
                y: y,
                speed: 0,
                relativeSpeed: 0
            });
        }

        const kBushs = this.randomInt(
            config.layerConfig.bush.count.min,
            config.layerConfig.bush.count.max,
            this.seed + 3000
        );

        for (let i = 0; i < kBushs; i++) {
            const platform = platforms[this.randomInt(0, platforms.length - 1, this.seed + i + 3100)];
            const x = this.randomRange(
                platform.x + 20, 
                platform.x + platform.width - 65,
                this.seed + i + 3200
            );
            const y = platform.y - 30;

            enemies.push({
                type: "Bush",
                x: x,
                y: y,
                speed: 0,
                relativeSpeed: 0
            });
        }

        const kClothers = this.randomInt(
            config.layerConfig.clother.count.min,
            config.layerConfig.clother.count.max,
            this.seed + 4000
        );

        for (let i = 0; i < kClothers; i++) {
            const platform = platforms[this.randomInt(0, platforms.length - 1, this.seed + i + 4100)];
            const x = this.randomRange(
                platform.x + 20, 
                platform.x + platform.width - 140,
                this.seed + i + 4200
            );
            const y = platform.y - 80;

            enemies.push({
                type: "Clother",
                x: x,
                y: y,
                speed: 0,
                relativeSpeed: 0
            });
        }
        return enemies;
    }

    generateCollectibles(config, platforms) {
        const collectibles = [];
        const minDistance = 150;

        const kSpeedUp = this.randomInt(
            config.collectibleConfig.speedUp.count.min,
            config.collectibleConfig.speedUp.count.max,
            this.seed + 1000
        );

        for (let i = 0; i < kSpeedUp; i++) {
            const platform = platforms[this.randomInt(0, platforms.length - 1, this.seed + i + 1100)];
            const x = this.randomRange(
                platform.x + 20,
                platform.x + platform.width - 60,
                this.seed + i + 1200
            );

            const tooClose = collectibles.some(c => Math.abs(c.x - x) < minDistance);
            if (tooClose) continue;

            collectibles.push({
                type: "SpeedUp",
                x: x,
                y: platform.y - 40,
                speed: 0,
                relativeSpeed: 0
            });
        }

        const kSpeedDown = this.randomInt(
            config.collectibleConfig.speedDown.count.min,
            config.collectibleConfig.speedDown.count.max,
            this.seed + 2000
        );

        for (let i = 0; i < kSpeedDown; i++) {
            const platform = platforms[this.randomInt(0, platforms.length - 1, this.seed + i + 2100)];
            const x = this.randomRange(
                platform.x + 20,
                platform.x + platform.width - 60,
                this.seed + i + 2200
            );

            const tooClose = collectibles.some(c => Math.abs(c.x - x) < minDistance);
            if (tooClose) continue;

            collectibles.push({
                type: "SpeedDown",
                x: x,
                y: platform.y - 40,
                speed: 0,
                relativeSpeed: 0
            });
        }
        return collectibles;
    }

    generateLevel(levelId) {
        const config = levelConfigs[levelId];
        if (!config) {
            console.error(`Level config not found for ${levelId}`);
            return null;
        }

        let abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'w', 'z'];

        let randomId = levelId;
        for(let i = 0; i < 10; ++i){
            randomId += abc[Math.floor[Math.random() * 10]]
        }

        this.seed = this.hashCode(randomId) + 12345*Math.random();
        const platforms = this.generatePlatforms(config);
        const enemies = this.generateEnemies(config, platforms);
        const collectibles = this.generateCollectibles(config, platforms);
        const layerEnemies = this.generateLayer(config, platforms);

        return {
            id: config.id,
            name: config.name,
            boss: config.boss,
            spawn: config.spawn,
            platforms: platforms,
            enemies: enemies,
            collectibles: collectibles,
            layerEnemies: layerEnemies
        };
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash &= hash;
        }
        return Math.abs(hash);
    }
}

const levels = Object.keys(levelConfigs).map(id =>
    levelGenerator.generateLevel(id)
).filter(level => level !== null);

const game = new GameEngine(canvas, levels);

document.querySelectorAll(".levelBtn").forEach(button => {
    button.addEventListener("click", () => {
        const levelId = button.dataset.level;
        game.stop();
        if (game.loadLevel(levelId)) {
            $("#map").hide();
            $("#gameScreen").show();
            game.start();
        }
    });
});

document.getElementById("backFromGame").addEventListener("click", () => {
    game.stop();
    game.resetLevel();
    $("#gameScreen").hide();
    $("#map").show();
});

document.getElementById("playBtn").addEventListener("click", () => {
    $("#mainMenu").hide();
    $("#map").show();
});

document.getElementById("backFromLevels").addEventListener("click", () => {
    $("#map").hide();
    $("#mainMenu").show();
});