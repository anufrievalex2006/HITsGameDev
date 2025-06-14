export const config = {
    canvas: {
        width: 800,
        height: 400,
    },
    player: {
        width: 30,
        height: 50,
        jumpForce: -10,
        gravity: 0.5,
    },
    obstacles: {
        initialSpeed: 5,
        maxSpeed: 25,
        acceleration: 0.01,
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