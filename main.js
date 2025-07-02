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
                count: { min: 9, max: 15 },
                speedRange: { min: 0.8, max: 1.2 }
            },
            nazgulEnemies: {
                count: { min: 5, max: 10 },
                speedRange: { min: 1.6, max: 2.0 },
                speedXRange: { min: -5, max: -3 },
                heightRange: { min: 60, max: 120 }
            },
            hitdownEnemies: {
                count: { min: 5, max: 10 },
                speedRange: { min: 1.0, max: 1.5 }
            },
            branch: {
                count: { min: 4, max: 13 },
            }
        },
        collectibleConfig: {
            speedUp: {
                count: { min: 9, max: 20 }
            },
            speedDown: {
                count: { min: 8, max: 15 }
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
                count: { min: 13, max: 17 },
                speedRange: { min: 1.0, max: 1.5 }
            },
            nazgulEnemies: {
                count: { min: 8, max: 15 },
                speedRange: { min: 2.0, max: 2.6 },
                speedXRange: { min: -6, max: -3 },
                heightRange: { min: 45, max: 90 }
            },
            hitdownEnemies: {
                count: { min: 10, max: 16 },
                speedRange: { min: 1.2, max: 1.8 }
            },
            branch: {
                count: { min: 4, max: 13 },
            }
        },
        collectibleConfig: {
            speedUp: {
                count: { min: 9, max: 20 }
            },
            speedDown: {
                count: { min: 8, max: 15 }
            }
        }
    }
};

const levelGenerator = new LevelGenerator(levelConfigs);

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