const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = true;
let score = 0;
let animationFrameId;
let obstacleSpeed = 5;
const kAccelerate = 0.2;

// Параметры платформы
const platformHeight = 60;
const platformSegments = [];
const segmentWidth = 100;

// Данные уровня - загружаем из localStorage
let levelData = {
    platforms: [],
    obstacles: []
};

// Загрузка сохранённого уровня
function loadLevel() {
    const savedLevel = localStorage.getItem("runnerLevel");
    if (savedLevel) {
        levelData = JSON.parse(savedLevel);
    } else {
        // Уровень по умолчанию
        levelData = {
            platforms: [
                {startX: 0, endX: 1000, y: 700},
                {startX: 1200, endX: 1500, y: 650},
                {startX: 1700, endX: 2000, y: 600}
            ],
            obstacles: [
                {x: 500, y: 650},
                {x: 800, y: 650},
                {x: 1400, y: 600}
            ]
        };
    }
}

// Генерация террейна из данных уровня
function generateTerrainFromLevel() {
    platformSegments.length = 0;
    
    // Генерация платформ
    levelData.platforms.forEach(platform => {
        const segmentCount = Math.ceil((platform.endX - platform.startX) / segmentWidth);
        
        for (let i = 0; i < segmentCount; i++) {
            platformSegments.push({
                x: platform.startX + i * segmentWidth,
                y: platform.y,
                width: segmentWidth,
                height: platformHeight
            });
        }
    });
    
    // Генерация препятствий
    obstacles.length = 0;
    levelData.obstacles.forEach(obs => {
        obstacles.push({
            x: obs.x,
            y: obs.y - 50, // высота препятствия
            width: 20,
            height: 50,
            color: "red",
            passed: false
        });
    });
}

function drawTerrain() {
    // Рисуем коричневую поверхность под блоками
    ctx.fillStyle = "#8B4513";
    platformSegments.forEach(segment => {
        ctx.fillRect(segment.x, segment.y + 10, segment.width, canvas.height - (segment.y + 10));
    });
    
    // Рисуем зеленые блоки сверху
    ctx.fillStyle = "#2E8B57";
    platformSegments.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, segment.width, 10);
    });
}

function gameLoop() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateTerrain();
    updatePlayer();
    updateObstacles();
    
    drawTerrain();
    drawPlayer();
    drawObstacles();
    
    // Score
    ctx.fillStyle = "black";
    ctx.font = "28px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    detectCollision();

    animationFrameId = requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.key === " " && !player.isJumping) {
        player.velocityY = -10;
        player.isJumping = true;
    }
});

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

function initGame() {
    loadLevel();
    generateTerrainFromLevel();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function updateTerrain() {
    // Двигаем сегменты влево
    platformSegments.forEach(segment => {
        segment.x -= obstacleSpeed;
    });

    // Удаляем сегменты, которые ушли за пределы экрана
    while (platformSegments[0] && platformSegments[0].x + segmentWidth < 0) {
        platformSegments.shift();
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            if (obstacleSpeed < 25) obstacleSpeed += kAccelerate;
        }
    }
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
    player.y += player.velocityY;
    player.velocityY += 0.5;

    // Находим текущий сегмент под игроком
    const currentSegment = platformSegments.find(segment => 
        player.x + player.width >= segment.x && player.x <= segment.x + segment.width
    );

    if (currentSegment && player.y + player.height > currentSegment.y) {
        player.y = currentSegment.y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    }
}

function detectCollision() {
    obstacles.forEach(obst => {
        if (
            player.x + 2 < obst.x + obst.width - 2 &&
            player.x + player.width - 2 > obst.x + 2 &&
            player.y + 2 < obst.y + obst.height - 2 &&
            player.y + player.height - 2 > obst.y + 2
        ) {
            gameRunning = false;
            alert(`Game Over! Score: ${score}`);
            resetGame();        
        }
        else if (
            player.x > obst.x + obst.width && !obst.passed
        ) { 
            score++;
            obst.passed = true;
        }
    });
}

function resetGame() {
    cancelAnimationFrame(animationFrameId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.x = 20;
    player.y = canvas.height - platformHeight - 50;
    player.velocityY = 0;
    player.isJumping = false;
    obstacles = [];
    platformSegments.length = 0;
    generateTerrainFromLevel();
    gameRunning = true;
    obstacleSpeed = 5;
    score = 0;
}