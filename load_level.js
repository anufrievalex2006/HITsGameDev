function loadLevel() {
    const savedLevel = localStorage.getItem("runnerLevel");
    if (savedLevel) {
        levelData = JSON.parse(savedLevel);
    } else {
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

function generateTerrainFromLevel() {
    platformSegments.length = 0;
    
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
    
    obstacles.length = 0;
    levelData.obstacles.forEach(obs => {
        obstacles.push({
            x: obs.x,
            y: obs.y - 50,
            width: 20,
            height: 50,
            color: "red",
            passed: false
        });
    });
}