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
            { x: 0, y: 350, width: 1000 },
            { x: 1200, y: 300, width: 300 },
            { x: 1600, y: 250, width: 200 },
            { x: 1800, y: 250, width: 800 }
        ],
        enemies: [
            { 
                type: "Stone", 
                x: 300, 
                y: 350,
                speed: 1.0
            },
            { 
                type: "Nazgul", 
                x: 800,
                y: 100,
                speed: 1.2,
                speedX: -4
            },
            { 
                type: "Stone", 
                x: 950,
                speed: 0.8
            }
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

document.querySelectorAll(".level-btn").forEach(button => {
    button.addEventListener("click", () => {
        const levelId = button.dataset.level;
        if (game.loadLevel(levelId)) {
            $("#levelSelect").hide();
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
    $("#levelSelect").show();
});

document.getElementById("backFromLevels").addEventListener("click", () => {
    $("#levelSelect").hide();
    $("#mainMenu").show();
});