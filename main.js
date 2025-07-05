import { GameEngine } from "./GameEngine.js";
import { LevelGenerator } from "./LevelGenerator.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 400;

let backgroundMusic;
let isMusicPlaying = false;
let musicUserPaused = false;

function initBackgroundMusic() {
    backgroundMusic = document.getElementById("backgroundMusic");
    if (!backgroundMusic) {
        backgroundMusic = document.createElement('audio');
        backgroundMusic.id = 'backgroundMusic';
        backgroundMusic.preload = 'auto';
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.3;
        
        const source = document.createElement('source');
        source.src = 'media.mp3';
        source.type = 'audio/mpeg';
        backgroundMusic.appendChild(source);
        
        document.body.appendChild(backgroundMusic);
    }
    else backgroundMusic.volume = 0.3;

    backgroundMusic.addEventListener('ended', function() {
        if (!musicUserPaused) {
            this.currentTime = 0;
            this.play().catch(e => {
                console.log("Ошибка воспроизведения: ", e);
            });
        }
    });
    backgroundMusic.addEventListener('error', function(e) {
        console.log('Ошибка загрузки аудио:', e);
    });
    backgroundMusic.addEventListener('pause', function() {
        isMusicPlaying = false;
        updateMusicButton();
    });
    backgroundMusic.addEventListener('play', function() {
        isMusicPlaying = true;
        updateMusicButton();
    });
    tryPlayMusic();
}

function tryPlayMusic() {
    if (!isMusicPlaying && !musicUserPaused && backgroundMusic) {
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicButton();
        }).catch(e => {
            console.log('Автовоспроизведение заблокировано браузером');
        });
    }
}

function toggleMusic() {
    if (!backgroundMusic) return;
    
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicUserPaused = true;
        isMusicPlaying = false;
    } else {
        musicUserPaused = false;
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
        }).catch(e => {
            console.log('Ошибка воспроизведения:', e);
        });
    }
    updateMusicButton();
}

function updateMusicButton() {
    const musicBtn = document.getElementById('musicToggle');
    if (musicBtn) {
        musicBtn.textContent = isMusicPlaying ? '🔊' : '🔇';
        musicBtn.title = isMusicPlaying ? 'Выключить музыку' : 'Включить музыку';
    }
}

function createMusicToggleButton() {
    const musicBtn = document.createElement('button');
    musicBtn.id = 'musicToggle';
    musicBtn.className = 'music-toggle-btn';
    musicBtn.textContent = '🔊';
    musicBtn.title = 'Управление музыкой';
    musicBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.8);
        color: #ffcc00;
        border: 2px solid #444;
        font-size: 20px;
        cursor: pointer;
        z-index: 1001;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    `;
    
    musicBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(0, 0, 0, 0.9)';
        this.style.borderColor = '#ffcc00';
        this.style.transform = 'scale(1.1)';
    });
    
    musicBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(0, 0, 0, 0.8)';
        this.style.borderColor = '#444';
        this.style.transform = 'scale(1)';
    });
    
    musicBtn.addEventListener('click', toggleMusic);
    document.body.appendChild(musicBtn);
}

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
        },
        layers: [
            {src: "/Images/layers/first_level/layer1.jpg", speed: 0.3},
            {src: "/Images/layers/first_level/layer2.png", speed: 0.5},
            {src: "/Images/layers/first_level/layer3.png", speed: 1},
            {src: "/Images/layers/first_level/layer4.png", speed: 2}
        ]
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
        endCutscene: {
            video: "cutscene3.mp4" // Концовка
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
        },
        layers: [
            {src: "/Images/layers/second_level/layer1.png", speed: 0.2},
            {src: "/Images/layers/second_level/layer2.png", speed: 0.3},
            {src: "/Images/layers/second_level/layer3.png", speed: 0.4},
            {src: "/Images/layers/second_level/layer4.png", speed: 1},
            {src: "/Images/layers/second_level/layer5.png", speed: 2}
        ]
    }
};

const levelGenerator = new LevelGenerator(levelConfigs);

const levels = Object.keys(levelConfigs).map(id =>
    levelGenerator.generateLevel(id)
).filter(level => level !== null);

const game = new GameEngine(canvas, levels, levelConfigs);

let curLeveId = null;
const cutsceneVideo = document.getElementById("cutsceneVideo");
const cutsceneScreen = document.getElementById("cutsceneScreen");
const cutsceneControls = document.getElementById("cutsceneControls");

document.addEventListener('DOMContentLoaded', function() {
    initBackgroundMusic();
    createMusicToggleButton();
    
    document.addEventListener('click', function(e) {
        if (e.target.id !== 'musicToggle') {
            tryPlayMusic();
        }
    }, { once: true });
    
    document.addEventListener('keydown', function(e) {
        if (e.key !== ' ' || !musicUserPaused) {
            tryPlayMusic();
        }
    }, { once: true });
    
    document.addEventListener('touchstart', tryPlayMusic, { once: true });
});

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

function showCutscene(levelId, isEnd = false) {
    const levelConfig = levelConfigs[levelId];
    const cutsceneConfig = isEnd ? levelConfig?.endCutscene : levelConfig?.cutscene;

    if (!levelConfig || !cutsceneConfig || !cutsceneConfig.video) {
        console.log("Нет кастсцены для уровня:", levelId, "isEndCutscene:", isEndCutscene);
        if (isEnd) showGameCompletionMessage();
        else startLevel(levelId);
        return;
    }

    console.log("Попытка загрузить видео:", cutsceneConfig.video);
    game.stop();
    cutsceneVideo.src = cutsceneConfig.video;
    cutsceneVideo.currentTime = 0;

    cutsceneVideo.addEventListener('loadeddata', function onLoadedData() {
        console.log("Видео успешно загружено:", cutsceneConfig.video);
        cutsceneVideo.removeEventListener('loadeddata', onLoadedData);
    });

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
        $("#gameScreen").hide();
        $("#mainMenu").hide();

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
                console.error("Не удалось воспроизвести видео:", cutsceneConfig.video);
                if (isEnd) showGameCompletionMessage();
                else startLevel(levelId);
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

function showGameCompletionMessage() {
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

    cutsceneScreen.classList.remove("show");
    cutsceneVideo.classList.remove("show");
    cutsceneControls.classList.remove("show");

    cutsceneVideo.pause();
    cutsceneVideo.currentTime = 0;

    setTimeout(() => {
        $("#cutsceneScreen").hide();
        $("#gameScreen").hide();
        $("#map").show();

        fadeOverlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(fadeOverlay);
        }, 300);

        setTimeout(() => {
            alert("Поздравляем! Вы прошли все уровни игры!");
        }, 500);
    }, 400);
}

window.showEndCutscene = function(levelId) {
    showCutscene(levelId, true);
}

cutsceneVideo.addEventListener("ended", () => {
    if (curLeveId) {
        const isEnd = cutsceneVideo.src.includes("cutscene3.mp4");
        if (isEnd) showGameCompletionMessage();
        else startLevel(curLeveId);
    }
});

document.getElementById("skip").addEventListener("click", () => {
    if (curLeveId) {
        const isEnd = cutsceneVideo.src.includes("cutscene3.mp4");
        if (isEnd) showGameCompletionMessage();
        else startLevel(curLeveId);
    }
});

cutsceneVideo.addEventListener("error", (e) => {
    console.error("Ошибка загрузки видео: ", e);
    console.error("Текущий src видео:", cutsceneVideo.src);
    console.error("Состояние видео:", {
        networkState: cutsceneVideo.networkState,
        readyState: cutsceneVideo.readyState,
        error: cutsceneVideo.error
    });
    if (curLeveId) {
        const isEnd = cutsceneVideo.src.includes("cutscene3.mp4");
        if (isEnd) {
            console.log("Пропускаем финальную кастсцену из-за ошибки");
            showGameCompletionMessage();
        }
        else {
            console.log("Пропускаем начальную кастсцену из-за ошибки");
            startLevel(curLeveId);
        }
    }
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