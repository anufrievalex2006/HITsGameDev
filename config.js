export const config = {
    canvas: {
        width: 800,
        height: 400,
    },
    player: {
        width: 30,
        height: 30,
        jumpForce: -10,
        gravity: 0.5,
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
    },
    colors: {
        background: "white",
        player: "blue",
        obstacle: "red",
        platform: "green",
        text: "black",
    },
};