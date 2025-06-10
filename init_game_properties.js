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

const player = {
    x: 20,
    y: canvas.height - platformHeight - 50,
    width: 50,
    height: 50,
    color: "blue",
    velocityY: 0,
    isJumping: false
};

let obstacles = [];