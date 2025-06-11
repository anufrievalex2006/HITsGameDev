function loadLevel() {
    const savedLevel = localStorage.getItem("runnerLevel");
    if (savedLevel) {
        levelData = JSON.parse(savedLevel);
    } else {
        //потом добавим случайную генерацию
        levelData = {
            "platforms": [
                {
                    "startX": 2.0287958115183247,
                    "endX": 250.5562827225131,
                    "y": 553.0335678469717
                },
                {
                    "startX": 250.5562827225131,
                    "endX": 497.05497382198956,
                    "y": 652.9793933614847
                },
                {
                    "startX": 550.8180628272252,
                    "endX": 697.9057591623036,
                    "y": 600.7854622594612
                },
                {
                    "startX": 749.640052356021,
                    "endX": 949.4764397905759,
                    "y": 500.8396367449482
                },
                {
                    "startX": 949.4764397905759,
                    "endX": 1148.2984293193717,
                    "y": 603.0064806042282
                },
                {
                    "startX": 1149.3128272251308,
                    "endX": 1350.163612565445,
                    "y": 589.6803705356264
                },
                {
                    "startX": 1350.163612565445,
                    "endX": 1545.9424083769634,
                    "y": 573.0227329498742
                },
                {
                    "startX": 1545.163612565445,
                    "endX": 2045.9424083769634,
                    "y": 573.0227329498742
                }
            ],
            "obstacles": [
                {
                    "x": 898.7565445026178,
                    "y": 507.5026917792491
                }
            ]
        };
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