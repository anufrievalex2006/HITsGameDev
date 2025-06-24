export class LevelManager {
    constructor(levels) {
        this.levels = levels;
        this.currentLevel = null;
    }

    loadLevel(levelId) {
        const level = this.levels.find(l => l.id === levelId);
        if (!level) return false;
        
        this.currentLevel = level;
        return true;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getEnemies() {
        return this.currentLevel?.enemies || [];
    }

    generateEnemies(platforms) {
        const enemies = [];
        platforms.forEach(platform => {
            if (Math.random() > 0.7) { // 30% шанс появления врага на платформе
                const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
                enemies.push({
                    type,
                    x: platform.x + platform.width / 2,
                    y: type === "Flying" ? platform.y - 100 : platform.y - 40,
                    speed: 1 + Math.random() * 2
                });
            }
        });
        return enemies;
    }

    generateLevel(){
        generatePlatforms(0,0,0);
    }

    generatePlatforms(prevX, prevY, count) {
        const platforms = [];
        let currentX = prevX;
        let currentY = prevY;
        const maxJumpX = 300;
        const maxJumpY = 100;

        for (let i = 0; i < count; i++) {
            const distanceX = 50 + Math.random() * (maxJumpX - 50);
            const heightDiff = (Math.random() - 0.5) * maxJumpY;

            if(platforms.length != 0){
                let last = platforms[platforms.length - 1];
                currentX = last.x + last.width;
                currentY = last.y;
            }

            currentX += distanceX;
            currentY += heightDiff;
            if(i === 0){
                currentX = 0
                currentY = 400
            }

            currentY = Math.max(100, Math.min(350, currentY));

            platforms.push({ x: currentX, y: currentY, width: 100 + Math.random() * 500 });
        }
        return platforms;
    }

    getPlatforms() {
        //return this.generatePlatforms(0, 700, 20);
        return this.currentLevel?.platforms || [];
    }

    setPlatforms(platforms) {
        if (this.currentLevel) {
            this.currentLevel.platforms = platforms;
        }
    }

    setEnemies(enemies) {
        if (this.currentLevel) {
            this.currentLevel.enemies = enemies;
        }
    }

    getSpawnPoint() {
        return this.currentLevel?.spawn || { x: 50, y: 300 };
    }

    getAllLevels() {
        return this.levels.map(level => ({
            id: level.id,
            name: level.name,
            boss: level.boss
        }));
    }
}