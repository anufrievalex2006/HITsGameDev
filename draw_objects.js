function drawTerrain() {
    ctx.fillStyle = "#8B4513";
    platformSegments.forEach(segment => {
        ctx.fillRect(segment.x, segment.y + 10, segment.width, canvas.height - (segment.y + 10));
    });
    
    ctx.fillStyle = "#2E8B57";
    platformSegments.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, segment.width, 10);
    });
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