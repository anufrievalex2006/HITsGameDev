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
        cutscene: {
            video: "cutscene1.mp4"
        },
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
        cutscene: {
            video: "cutscene2.mp4" // Сюда вторая кастсцена идёт
        },
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

let curLeveId = null;
const cutsceneVideo = document.getElementById("cutsceneVideo");
const cutsceneScreen = document.getElementById("cutsceneScreen");
const cutsceneControls = document.getElementById("cutsceneControls");

cutsceneVideo.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

cutsceneVideo.addEventListener("click", (e) => {
    e.preventDefault();
});

document.querySelectorAll(".levelBtn").forEach(button => {
    button.addEventListener("click", () => {
        const levelId = button.dataset.level;
        curLeveId = levelId;
        showCutscene(levelId);
    });
});

function showCutscene(levelId) {
    const levelConfig = levelConfigs[levelId];
    if (!levelConfig || !levelConfig.cutscene || !levelConfig.cutscene.video) {
        console.log("Нет кастсцены для уровня:", levelId);
        startLevel(levelId);
        return;
    }

    cutsceneVideo.src = levelConfig.cutscene.video;
    cutsceneVideo.currentTime = 0;

    const fadeOverlay = document.createElement('div');
    fadeOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0;
        z-index: 9999;
        transition: opacity 0.5s ease;
        pointer-events: none;
    `;
    document.body.appendChild(fadeOverlay);

    setTimeout(() => {
        fadeOverlay.style.opacity = '1';
    }, 50);

    setTimeout(() => {
        $("#map").hide();
        $("#cutsceneScreen").show();
        cutsceneScreen.classList.add('show');

        fadeOverlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(fadeOverlay);
        }, 200);

        setTimeout(() => {
            cutsceneVideo.classList.add('show');
            cutsceneVideo.muted = false;
            cutsceneVideo.play().catch(error => {
                console.error("Ошибка воспроизведения: ", error);
                startLevel(levelId);
            });

            setTimeout(() => {
                cutsceneControls.classList.add('show');
            }, 100);
        }, 50);
    }, 200);
}

function startLevel(levelId) {
    const fadeOverlay = document.createElement('div');
    fadeOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0;
        z-index: 9999;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    document.body.appendChild(fadeOverlay);
    setTimeout(() => {
        fadeOverlay.style.opacity = '1';
    }, 50);

    cutsceneScreen.classList.remove('show');
    cutsceneVideo.classList.remove('show');
    cutsceneControls.classList.remove('show');

    cutsceneVideo.pause();
    cutsceneVideo.currentTime = 0;

    game.stop();

    setTimeout(() => {
        if (game.loadLevel(levelId)) {
            $("#cutsceneScreen").hide();
            $("#gameScreen").show();

            fadeOverlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(fadeOverlay);
            }, 300);
            game.start();
        }
    }, 400);
}

cutsceneVideo.addEventListener("ended", () => {
    if (curLeveId)
        startLevel(curLeveId);
});

document.getElementById("skip").addEventListener("click", () => {
    if (curLeveId)
        startLevel(curLeveId);
});

cutsceneVideo.addEventListener("error", (e) => {
    console.error("Ошибка загрузки видео: ", e);
    if (curLeveId)
        startLevel(curLeveId);
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