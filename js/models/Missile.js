export default class Missile extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {

        super(scene, x, y, "missile");


        this.scene.add.existing(this);

        //enable physics to sprite
        this.scene.physics.world.enable(this);

        this.baseVelocity = 350;

        this.setScale(0.12);
    }

    removeFromScreen() {
        this.x = -500;
        this.Y=500;
        this.setVelocity(0, 0);
    }

    isOutsideCanvas() {
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        return this.x > width || this.y > height || this.x < 0 || this.y < 0;
    }

}