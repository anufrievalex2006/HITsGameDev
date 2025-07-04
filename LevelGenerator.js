export class LevelGenerator {

    constructor(levelConfigs) {
        this.levelConfigs = levelConfigs;
        this.seed = Date.now();
    }

    random(seed = this.seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    randomRange(min, max, seed = this.seed) {
        return min + this.random(seed) * (max - min);
    }

    randomInt(min, max, seed = this.seed) {
        return Math.floor(this.randomRange(min, max + 1, seed));
    }

    insertIntoSortedArray(arr, newElement, compareFun = (a, b) => a.x - b.x) {
        let left = 0;
        let right = arr.length;

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (compareFun(newElement, arr[mid]) < 0) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }

        arr.splice(left, 0, newElement);
        return arr;
    }

    generatePlatforms(config) {
        const platforms = [];
        const { minWidth, maxWidth, minGap, maxGap, heightVariation, baseHeight } = config.platformConfig;

        let curX = 0;
        let platformId = 0;

        const firstPlatformWidth = this.randomRange(minWidth * 2, maxWidth * 2, this.seed + platformId);
        platforms.push({
            x: 0,
            y: baseHeight,
            width: firstPlatformWidth
        });

        curX = firstPlatformWidth;
        platformId++;

        while (curX < config.width) {
            const gap = this.randomRange(minGap, maxGap, this.seed + platformId*100);
            curX += gap;

            if (curX >= config.width) break;

            const width = this.randomRange(minWidth, maxWidth, this.seed + platformId*200);
            const heightOffset = this.randomRange(-heightVariation/2, heightVariation/2, this.seed + platformId*300);
            const height = Math.max(200, Math.min(380, baseHeight + heightOffset));
            
            console.log(`Platform at x=${curX}, width=${Math.min(width, config.width - curX)}`);

            platforms.push({
                x: curX,
                y: height,
                width: Math.min(width, config.width - curX)
            });

            curX += width;
            platformId++;
        }
        console.log(`--------------------------------------------------------------------------------------`);
        return platforms;
    }

    generateEnemies(config, platforms) {
        let enemies = [];
        let availablePlatforms = [...platforms];

        const kStones = this.randomInt(
            config.enemyConfig.stoneEnemies.count.min,
            config.enemyConfig.stoneEnemies.count.max,
            this.seed + 1000
        );

        for (let i = 0; i < kStones; i++) {
            if (availablePlatforms.length === 0) break;
        
            const platformIndex = this.randomInt(0, availablePlatforms.length - 1, this.seed + i + 1100);
            const platform = availablePlatforms[platformIndex];

            const x = this.randomRange(
                platform.x + platform.width * 0.3, 
                platform.x + platform.width * 0.7,
                this.seed + i + 1200
            );

            const y = platform.y - 40;

            const speed = this.randomRange(
                config.enemyConfig.stoneEnemies.speedRange.min,
                config.enemyConfig.stoneEnemies.speedRange.max,
                this.seed + i + 1300
            );

            enemies.push({
                type: "Stone",
                x: x,
                y: y,
                speed: speed,
                relativeSpeed: 2
            });

            availablePlatforms.splice(platformIndex, 1);
        }

        const kHitdowns = this.randomInt(
            config.enemyConfig.hitdownEnemies.count.min,
            config.enemyConfig.hitdownEnemies.count.max,
            this.seed + 4000
        );

        for (let i = 0; i < kHitdowns; i++) {
            if (availablePlatforms.length === 0) break;

            const platformIndex = this.randomInt(0, availablePlatforms.length - 1, this.seed + i + 4100);
            const platform = availablePlatforms[platformIndex];

            const x = this.randomRange(
                platform.x + platform.width * 0.3,
                platform.x + platform.width * 0.7
            );
            const y = platform.y - 50;
            const speed = this.randomRange(
                config.enemyConfig.hitdownEnemies.speedRange.min,
                config.enemyConfig.hitdownEnemies.speedRange.max,
                this.seed + i + 4300
            );
            enemies.push({
                type: "Hitdown",
                x: x,
                y: y,
                speed: speed,
                relativeSpeed: 2
            });

            availablePlatforms.splice(platformIndex, 1);
        }

        enemies = enemies.sort((a, b) => a.x - b.x);

        const kBranchs = this.randomInt(
            config.enemyConfig.branch.count.min,
            config.enemyConfig.branch.count.max,
            this.seed + 3000
        );

        let banchs = [];

        for (let i = 0; i < kBranchs; i++) {
            if (availablePlatforms.length === 0) break;

            const platformIndex = this.randomInt(0, availablePlatforms.length - 1, this.seed + i + 3100);
            const platform = availablePlatforms[platformIndex];

            const x = this.randomRange(
                platform.x + platform.width * 0.3, 
                platform.x + platform.width * 0.7,
                this.seed + i + 3200
            );

            const y = platform.y - 40;
            if(banchs.length == 0){
                banchs.push({
                    type: "Branch",
                    x: x,
                    y: y,
                    speed: 0,
                    relativeSpeed: 0
                });
            }else if(banchs.length == 1){
                banchs.push({
                    type: "Branch",
                    x: x,
                    y: y,
                    speed: 0,
                    relativeSpeed: 0
                });
                banchs = banchs.sort((a, b) => a.x - b.x);
            } else {
                this.insertIntoSortedArray(
                    banchs,
                    {
                        type: "Branch",
                        x: x,
                        y: y,
                        speed: 0,
                        relativeSpeed: 0
                    }
                );
            }
        }

        if(banchs.length != 0){
            this.insertIntoSortedArray(enemies, banchs[0]);
        }
        for(let i = 1; i < banchs.length; ++i){
            if(banchs[i].x - banchs[i-1].x < 30 || banchs[i].x - banchs[i-1].x > 200){
                this.insertIntoSortedArray(enemies, banchs[i]);
            }
        }

        let toDelete = [];
        for(let i = 0; i < enemies.length - 1; ++i){
            if(enemies[i].type === "Branch" && enemies[i+1].type === "Stone"){
                if(enemies[i + 1].x - enemies[i].x < 100){
                    toDelete.push(enemies[i+1]);
                }
            }
        }
        enemies = enemies.filter(enemy => !toDelete.includes(enemy));
        enemies = enemies.sort((a, b) => a.x - b.x);

        const kNazguls = this.randomInt(
            config.enemyConfig.nazgulEnemies.count.min,
            config.enemyConfig.nazgulEnemies.count.max,
            this.seed + 2000
        );

        for (let i = 0; i < kNazguls; i++) {
            const x = this.randomRange(400, config.width - 200, this.seed + i + 2100);
            const y = this.randomRange(
                config.enemyConfig.nazgulEnemies.heightRange.min,
                config.enemyConfig.nazgulEnemies.heightRange.max,
                this.seed + i + 2200
            );
            const speed = this.randomRange(
                config.enemyConfig.nazgulEnemies.speedRange.min,
                config.enemyConfig.nazgulEnemies.speedRange.max,
                this.seed + i + 2300
            );
            const speedX = this.randomRange(
                config.enemyConfig.nazgulEnemies.speedXRange.min,
                config.enemyConfig.nazgulEnemies.speedXRange.max,
                this.seed + i + 2400
            );

            enemies.push({
                type: "Nazgul",
                x: x,
                y: y,
                speed: speed,
                speedX: speedX
            });
        }
        enemies = enemies.sort((a, b) => a.x - b.x);
        return enemies;
    }

    generateCollectibles(config, platforms) {
        const collectibles = [];
        const minDistance = 150;

        const kSpeedUp = this.randomInt(
            config.collectibleConfig.speedUp.count.min,
            config.collectibleConfig.speedUp.count.max,
            this.seed + 1000
        );

        for (let i = 0; i < kSpeedUp; i++) {
            const platform = platforms[this.randomInt(0, platforms.length - 1, this.seed + i + 1100)];
            const x = this.randomRange(
                platform.x + 20,
                platform.x + platform.width - 60,
                this.seed + i + 1200
            );

            const tooClose = collectibles.some(c => Math.abs(c.x - x) < minDistance);
            if (tooClose) continue;

            collectibles.push({
                type: "SpeedUp",
                x: x,
                y: platform.y - 40,
                speed: 0,
                relativeSpeed: 0
            });
        }

        const kSpeedDown = this.randomInt(
            config.collectibleConfig.speedDown.count.min,
            config.collectibleConfig.speedDown.count.max,
            this.seed + 2000
        );

        for (let i = 0; i < kSpeedDown; i++) {
            const platform = platforms[this.randomInt(0, platforms.length - 1, this.seed + i + 2100)];
            const x = this.randomRange(
                platform.x + 20,
                platform.x + platform.width - 60,
                this.seed + i + 2200
            );

            const tooClose = collectibles.some(c => Math.abs(c.x - x) < minDistance);
            if (tooClose) continue;

            collectibles.push({
                type: "SpeedDown",
                x: x,
                y: platform.y - 40,
                speed: 0,
                relativeSpeed: 0
            });
        }
        return collectibles;
    }

    generateLevel(levelId) {
        const config = this.levelConfigs[levelId];
        if (!config) {
            console.error(`Level config not found for ${levelId}`);
            return null;
        }

        let abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'w', 'z'];

        let randomId = levelId;
        for(let i = 0; i < 10; ++i){
            randomId += abc[Math.floor[Math.random() * 10]]
        }

        this.seed = this.hashCode(randomId) + 12345*Math.random();
        const platforms = this.generatePlatforms(config);
        const enemies = this.generateEnemies(config, platforms);
        const collectibles = this.generateCollectibles(config, platforms);

        return {
            id: config.id,
            name: config.name,
            boss: config.boss,
            spawn: config.spawn,
            platforms: platforms,
            enemies: enemies,
            collectibles: collectibles,
            layers: config.layers
        };
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash &= hash;
        }
        return Math.abs(hash);
    }

}