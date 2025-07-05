import { Layer } from "./Layer.js"

export class Background {

    constructor(layersConfig, canvas) {
        this.layers = [];
        this.canvas = canvas;
        this.loaded = false;
        this.loadPromises = [];
        
        layersConfig.forEach((layerSrc, index) => {
            const img = new Image();

            const loadPromise = new Promise((resolve) => {
                img.onload = () => {
                    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                    this.layers.push(new Layer(img, img.width, img.height, scale, layerSrc.speed, canvas.height));
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load background image: ${layerSrc.src}`);
                    resolve();
                };
            });
            this.loadPromises.push(loadPromise);
            img.src = layerSrc.src;
        });

        Promise.all(this.loadPromises).then(() => {
            this.loaded = true;
            this.layers.sort((a, b) => a.speedFactor - b.speedFactor);
        });
    }

    update(speed) {
        this.layers.forEach(layer => {
            layer.update(speed * layer.speedFactor);
        });
    }

    draw(ctx) {
        this.layers.forEach(layer => {
            layer.draw(ctx);
        });
    }
}