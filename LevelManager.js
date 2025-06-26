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

    getLayerEnemies() {
        return this.currentLevel?.layerEnemies || [];
    }

    getCollectible() {
        return this.currentLevel?.collectibles || [];
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

    getPlatforms() {
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