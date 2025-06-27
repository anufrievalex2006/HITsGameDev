export class Layer {
    constructor(image, width, height, scale = 1) {
        this.x = 0;
        this.y = 0;
        this.image = image;
        this.width = width * scale;
        this.height = height * scale;
        this.scale = scale;
    }

    update(speed) {
        this.x -= speed;
        if(this.x <= -this.width){
            this.x = 0;
        }
    }

    draw(ctx) {
        ctx.drawImage(
            this.image, 
            this.x, 
            this.y, 
            this.width, 
            this.height
        );
        ctx.drawImage(
            this.image, 
            this.x + this.width, 
            this.y, 
            this.width, 
            this.height
        );
    }
}