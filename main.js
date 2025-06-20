import { GameEngine } from "./GameEngine.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 400;

const levels = [
    {
        id: "weather_hills",
        name: "Weather Hills",
        boss: "King-Wizard of Angmar",
        spawn: { x: 50, y: 300 },
        platforms: [
            { x: 0, y: 350, width: 1500 },
            { x: 1600, y: 350, width: 400 },
            { x: 2100, y: 300, width: 300 },
            { x: 2500, y: 350, width: 500 },
            { x: 3100, y: 300, width: 400 },
            { x: 3600, y: 250, width: 600 },
            { x: 4200, y: 350, width: 800 },
        ],
        enemies: [
            { type: "Stone", x: 300, y: 350, speed: 1.0 },
            { type: "Stone", x: 1000, y: 350, speed: 1.2 },
            { type: "Stone", x: 1500, y: 350, speed: 0.9 },
            { type: "Stone", x: 1900, y: 350, speed: 1.1 },
            { type: "Stone", x: 2500, y: 350, speed: 0.8 },
            { type: "Stone", x: 2900, y: 350, speed: 1.3 },
            { type: "Stone", x: 3300, y: 300, speed: 1.3 },
            
            // Летающие враги
            { type: "Nazgul", x: 800, y: 100, speed: 1.2, speedX: -4 },
            { type: "Nazgul", x: 1500, y: 150, speed: 1.5, speedX: -3 },
            { type: "Nazgul", x: 2400, y: 200, speed: 1.8, speedX: -5 },
            { type: "Nazgul", x: 3200, y: 180, speed: 2.0, speedX: -4 },
        ]
    },
    {
        id: "moria",
        name: "Moria",
        boss: "Balrog",
        spawn: { x: 100, y: 200 },
        platforms: [
            { x: 0, y: 350, width: 800 },
            { x: 900, y: 300, width: 400 },
            { x: 1400, y: 250, width: 300 }
        ],
        enemies: [
            { type: "Stone", x: 300 },
            { type: "Stone", x: 800 }
        ]
    }
];

const game = new GameEngine(canvas, levels);

document.querySelectorAll(".levelBtn").forEach(button => {
    button.addEventListener("click", () => {
        const levelId = button.dataset.level;
        if (game.loadLevel(levelId)) {
            $("#map").hide();
            $("#gameScreen").show();
            game.start();
        }
    });
});

document.getElementById("backFromGame").addEventListener("click", () => {
    game.stop();
    $("#gameScreen").hide();
    $("#mainMenu").show();
});

document.getElementById("playBtn").addEventListener("click", () => {
    $("#mainMenu").hide();
    $("#map").show();
});

document.getElementById("backFromLevels").addEventListener("click", () => {
    $("#map").hide();
    $("#mainMenu").show();
});