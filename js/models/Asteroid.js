import Explosion from './Explosion.js'

export default class Asteroid extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "asteroid", 1);

        this.scene.add.existing(this);

        //enable physics to sprite
        this.scene.physics.world.enable(this);

        this.setScale(0.5);

        this.canDestroy=false;

        this.goldAsteroid=false;

    }


    

    removeFromScreen() {
        new Explosion(this.scene, this.x, this.y);
        this.x = -300;
        this.y=300;
        this.setVelocity(0, 0);
    }

    spawn() {
        this.visible = true;
        this.active = true;
        this.setVelocityX(-100);
    }

    isOutsideCanvas() {
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        return this.x > width || this.y > height || this.x < 0 || this.y < 0;
    }


}