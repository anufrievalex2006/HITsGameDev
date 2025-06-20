export class EntityManager {
    constructor() {
        this.entities = [];
    }

    add(entity) {
        this.entities.push(entity);
    }

    addInStart(entity) {
        this.entities.unshift(entity);
    }

    update(...args) {
        this.entities.forEach(entity => entity.update(...args));
        this.entities = this.entities.filter(entity => !entity.isOutOfBounds?.());
    }

    draw(ctx) {
        this.entities.forEach(entity => entity.draw(ctx));
    }

    clear() {
        this.entities = [];
    }
}