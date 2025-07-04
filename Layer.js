export class Layer {
    constructor(image, width, height, scale = 1, speedFactor = 1, canvasHeight) {
        this.x = 0;
        this.y = 0;
        this.image = image;
        this.width = width * scale;
        this.height = height * scale;
        this.scale = scale;
        this.speedFactor = speedFactor;
        this.canvasHeight = canvasHeight;
        
        this.scaledHeight = canvasHeight;
        this.scaledWidth = (canvasHeight / height) * width;
    }

    update(speed) {
        this.x -= speed*this.speedFactor;
        if(this.x <= -this.scaledWidth){
            this.x = 0;
        }
    }

    draw(ctx) {
        ctx.drawImage(
            this.image, 
            this.x, 
            this.y, 
            this.scaledWidth, 
            this.scaledHeight
        );
        ctx.drawImage(
            this.image, 
            this.x + this.scaledWidth, 
            this.y, 
            this.scaledWidth, 
            this.scaledHeight
        );
    }
}