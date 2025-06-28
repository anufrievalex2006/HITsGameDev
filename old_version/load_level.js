function loadLevel() {
    const savedLevel = localStorage.getItem("runnerLevel");
    if (savedLevel) {
        levelData = JSON.parse(savedLevel);
    } else {
        levelData.platforms.push({
            "startX": 0,
            "endX": 250,
            "y": 553
        });
        levelData.obstacles.push({
            "x": 200,
            "y": 553
        });

        const MIN_GAP = 10;
        const MAX_GAP = 100;
        const MIN_LENGTH = 150;
        const MAX_LENGTH = 600;
        const MAX_Y = 700;
        const MIN_Y = 200;
        const MAX_DY = 80;

        for (var i = 0; i < 50; ++i) {
            const prev = levelData.platforms[i];

            const gap = MIN_GAP + Math.floor((MAX_GAP - MIN_GAP) * Math.random());
            const length = MIN_LENGTH + Math.floor((MAX_LENGTH - MIN_LENGTH) * Math.random());
            const startX = prev.endX + gap;
            const endX = startX + length;

            let dy = randomSign() * Math.floor(MAX_DY * Math.random());
            let newY = prev.y + dy;

            newY = Math.max(MIN_Y, Math.min(MAX_Y, newY));

            levelData.platforms.push({
                "startX": startX,
                "endX": endX,
                "y": newY
            });
        }

        for (var i = 0; i < 25; ++i) {
            const platIndex = 1 + Math.floor(49 * Math.random()); // Индексы 1-50
            const platform = levelData.platforms[platIndex];

            const posX = platform.startX + Math.floor(0.4 * (platform.endX - platform.startX));

            levelData.obstacles.push({
                "x": posX,
                "y": platform.y
            });
        }
    }
    player.y = levelData.platforms[0].y - player.height
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

function randomSign(){
    if(Math.random() < 0.5){
        return -1;
    }else{
        return 1;
    }
}