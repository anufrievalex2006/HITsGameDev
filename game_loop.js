function gameLoop() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateTerrain();
    updatePlayer();
    updateObstacles();
    
    drawTerrain();
    drawPlayer();
    drawObstacles();
    
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

function initGame() {
    loadLevel();
    generateTerrainFromLevel();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function updateTerrain() {
    platformSegments.forEach(segment => {
        segment.x -= obstacleSpeed;
    });

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

function updatePlayer() {
    player.y += player.velocityY;
    player.velocityY += 0.5;

    const currentSegment = platformSegments.find(segment => 
        player.x + player.width >= segment.x && player.x <= segment.x + segment.width
    );

    if (currentSegment && player.y + player.height > currentSegment.y) {
        player.y = currentSegment.y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    }

    if (player.y + player.height > canvas.height) {
        gameRunning = false;
        alert(`Game Over! Score: ${score}`);
        resetGame();
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

function startGame() {
    initGame();
}

function stopGame() {
    if (typeof cancelAnimationFrame === "function" && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}