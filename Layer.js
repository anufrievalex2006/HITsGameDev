export class Layer {
    constructor(image, width, height) {
        this.x = 0;
        this.y = 0;
        this.image = image;
        this.width = width;
        this.height = height;
    }

    update(speed) {
        this.x -= speed;
        if(this.x <= -this.width){
            this.x = 0;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
        ctx.drawImage(this.image, this.x + this.width, this.y);
    }
}