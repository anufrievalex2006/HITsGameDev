export const config = {
    canvas: {
        width: 800,
        height: 400,
    },
    player: {
        width: 40,
        height: 40,
        jumpForce: -10,
        gravity: 0.5,
        sprite: {
            src: "player1.png",
            frameWidth: 864/8,
            frameHeight: 140,
            framesPerRow: 8,
            rows: 1,
            frames: 8,
            animationSpeed: 120
        }
    },
    enemies: {
        stone: {
            sprite: {
                src: "Images/Enemies/stone.png",
                frameWidth: 600,
                frameHeight: 502,
                framesPerRow: 1,
                rows: 1,
                frames: 1,
                animationSpeed: 250
            }
        },
        nazgul: {
            sprite: {
                src: "Images/Enemies/bird.png",
                frameWidth: 1085,
                frameHeight: 860,
                framesPerRow: 1,
                rows: 1,
                frames: 1,
                animationSpeed: 250
            }
        },
        branch: {
            sprite: {
                src: "Images/Enemies/branch.png",
                frameWidth: 1158,
                frameHeight: 930,
                framesPerRow: 1,
                rows: 1,
                frames: 1,
                animationSpeed: 250
            }
        },
        hitdown: {
            sprite: {
                src: "Images/Enemies/villager.png",
                frameWidth: 1024,
                frameHeight: 1536,
                framesPerRow: 1,
                rows: 1,
                frames: 1,
                animationSpeed: 250
            }
        },
        boss: {
            sprite: {
                src: "Images/Enemies/boss.png",
                frameWidth: 1457,
                frameHeight: 834,
                framesPerRow: 1,
                rows: 1,
                frames: 1,
                animationSpeed: 250
            }
        }
    },
    collectible: {
        width: 150,
        height: 150,
        speedUp: {
            sprite: {
                src: "Images/Enemies/speedUp.png",
                frameWidth: 600,
                frameHeight: 502,
                framesPerRow: 1,
                rows: 1,
                frames: 1,
                animationSpeed: 250
            }
        },
        speedDown: {
            sprite: {
                src: "Images/Enemies/speedDown.png",
                frameWidth: 600,
                frameHeight: 502,
                framesPerRow: 1,
                rows: 1,
                frames: 1,
                animationSpeed: 250
            }
        }
    },
    obstacles: {
        initialSpeed: 5,
        maxSpeed: 20,
        acceleration: 0.003,
        spawnInterval: 1500,
    },
    platform: {
        segmentWidth: 100,
        segmentHeight: 20,
        sprite: {
                src: "Images/platform.png",
                frameWidth: 1292,
                frameHeight: 1024,
                framesPerRow: 1,
                rows: 1,
                frames: 1,
                animationSpeed: 250
            }
    },
    colors: {
        background: "white",
        player: "blue",
        obstacle: "red",
        platform: "green",
        text: "black",
    },
};