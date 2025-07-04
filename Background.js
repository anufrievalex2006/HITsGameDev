import { Layer } from "./Layer.js"

export class Background {

    constructor(layersConfig, canvas) {
        this.layers = [];
        this.canvas = canvas;
        
        layersConfig.forEach((layerSrc, index) => {
            const img = new Image();
            img.src = layerSrc.src;
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            this.layers.push(new Layer(img, img.width, img.height, scale, layerSrc.speed, canvas.height));
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