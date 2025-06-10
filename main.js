const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameRunning = true;
let score = 0;
let lastObstacleTime = 0;
let animationFrameId;
let obstacleInterval = 1000;
let obstacleSpeed = 5;
const kAccelerate = 0.2;

// Добавляем параметры для генерации карты
const platformHeight = 60;
const platformSegments = [];
const segmentWidth = 100;
let currentTerrainY = canvas.height - platformHeight;

function generateInitialTerrain() {
    const segments = Math.ceil(canvas.width / segmentWidth) + 2;
    for (let i = 0; i < segments; i++) {
        platformSegments.push({
            x: i * segmentWidth,
            y: currentTerrainY,
            width: segmentWidth,
            height: platformHeight
        });
    }
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

    // Добавляем новые сегменты
    const lastSegment = platformSegments[platformSegments.length - 1];
    if (lastSegment.x + segmentWidth < canvas.width + segmentWidth) {
        // Генерируем новую высоту платформы с плавным переходом
        const heightVariation = Math.random() * 40 - 20;
        currentTerrainY = Math.max(
            Math.min(
                lastSegment.y + heightVariation,
                canvas.height - platformHeight
            ),
            canvas.height - platformHeight - 100
        );

        platformSegments.push({
            x: lastSegment.x + segmentWidth,
            y: currentTerrainY,
            width: segmentWidth,
            height: platformHeight
        });
    }
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
    
    const currentTime = Date.now();
    if (currentTime - lastObstacleTime > obstacleInterval) {
        createObstacle();
        lastObstacleTime = currentTime;
    }
    
    drawTerrain();
    drawPlayer();
    drawObstacles();

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

window.onload = () => {
    generateInitialTerrain();
    lastObstacleTime = Date.now();
    animationFrameId = requestAnimationFrame(gameLoop);
};

function createObstacle() {
    const currentSegment = platformSegments.find(segment => 
        canvas.width >= segment.x && canvas.width <= segment.x + segment.width
    );
    
    if (currentSegment) {
        obstacles.push({
            x: canvas.width,
            y: currentSegment.y - 50,
            width: 20,
            height: 50,
            color: "red",
            passed: false
        });
    }
    obstacleInterval = Math.random() * 1000 + 1000;
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
            player.x < obst.x + obst.width &&
            player.x + player.width > obst.x &&
            player.y < obst.y + obst.height &&
            player.y + player.height > obst.y
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
    generateInitialTerrain();
    gameRunning = true;
    obstacleSpeed = 5;
    score = 0;
    lastObstacleTime = Date.now();
}