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

    getPlatforms() {
        return this.currentLevel?.platforms || [];
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