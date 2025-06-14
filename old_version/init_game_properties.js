const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = true;
let score = 0;
let animationFrameId;
let obstacleSpeed = 5;
const kAccelerate = 0.2;

const platformHeight = 60;
const platformSegments = [];
const segmentWidth = 100;

let levelData = {
    platforms: [],
    obstacles: []
};

let levels = [
    {
        "level": "Weather Hills",
        "boss": "King-Wizard of Angmar",
        "enemies": [
            { "type": "Stone", "x": 300 },
            { "type": "Cave", "x": 600 },
            { "type": "Nazgul", "x": 800 },
            { "type": "Stone", "x": 950 }
        ]
    },
    {
        "level": "Moria",
        "boss": "Balrog",
        "enemies": [
            { "type": "orc", "x": 300 },
            { "type": "troll", "x": 800 }
        ]
    }
];

const player = {
    x: 20,
    y: 10,
    width: 50,
    height: 50,
    color: "blue",
    velocityX: 0,
    velocityY: 0,
    isJumping: false
};

const cave = {
    x: 20,
    y: 10,
    width: 50,
    height: 50,
    color: "black",
    velocityX: 0
}

const stone = {
    x: 20,
    y: 10,
    width: 50,
    height: 50,
    color: "green",
    velocityX: 0
}

const nazgul = {
    x: 20,
    y: 10,
    width: 50,
    height: 50,
    color: "green",
    velocityX: 0
}

let obstacles = [];