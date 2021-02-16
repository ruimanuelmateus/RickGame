import Explosion from './Explosion.js'
import Asteroid from './Asteroid.js';

export default class Boss extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "boss", 1);

        this.scene.add.existing(this);

        //enable physics to sprite
        this.scene.physics.world.enable(this);

        this.life = 100;

        this.goDown = true;

        this.lastLife = 100;

        this.blast=false;

        this.rocksMaxSize = 100;

        this.setScale(0.5);

        this.rocks = this.scene.physics.add.group({
            maxSize: 100,
            classType: Asteroid
        });

    }

    update() {

        if(this.life<this.lastLife){
            if(this.showSound){
                this.showSound.play();
            }
            this.lastLife-=10;
            this.blast=true;
        }
        

        this.setVelocityX(-200);
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;
        //const velocity = 150;
        if (this.x < 800) {
            const height = this.scene.game.config.height;
            this.setVelocityX(0);
            if (this.y < 150) {
                //this.goDown = true;
                this.setVelocityY(100);
            }
            else if (this.y > height - 150) {
                //this.goDown = false;
                this.setVelocityY(-100);
            }
 
            

        }
        else {
            this.setVelocityY(0);
        }



    }


    /**
     * create an explosion, decrease one life, prevent a new collision and put the bird off-screen
     */
    dead() {
        let x = this.x;
        let y = this.y;
        new Explosion(this.scene, x, y);

    }


    isOutsideCanvas() {
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        return this.x > width || this.y > height || this.x < 0 || this.y < 0;
    }

}