import Bullet from "./Bullet.js";
import Explosion from "./Explosion.js";
import Missile from "./Missile.js";

export default class Ship extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "ship");

        this.scene.add.existing(this);

        //enable physics to sprite
        this.scene.physics.world.enable(this);

        this.lives = 3;

        this.fireCount=0;

        this.specialBullet=1;

        //used to create an invencibility time window after a death
        this.canBeKilled = true;

        this.velocity = 250;

        this.timeToShoot = 0;
        this.fireRate = 350;

        //this.newBullet=false;

        //this.bullets=[];

        this.bulletsMaxsize = 20;

        this.bullets = this.scene.physics.add.group({
            maxSize: this.bulletsMaxsize,
            classType: Bullet
        });

        this.missiles = this.scene.physics.add.group({
            maxSize: 4,
            classType: Missile
        });


    }

    update(cursors, time) {

        if (cursors.space.isDown && this.timeToShoot < time) {

            let bullet=this.bullets.getFirstDead(true,this.x,this.y,"bullet");

            if (bullet) {
                bullet.setVelocityX(350);
                bullet.active = true;
                bullet.visible = true;

                //bullet.fire(this.scene.enemy);
                

            }
            this.timeToShoot = time + this.fireRate;

            if (this.bullets.children.size > this.bulletsMaxsize) {
                console.log("Group size failed")
            }
            if (this.fireSound) {
                this.fireSound.play();
            }   

        }


        if (cursors.switchBullet.isDown && this.timeToShoot < time && this.specialBullet>0) {

            let missile=this.missiles.getFirstDead(true, this.x, this.y, "missile");

            if(missile){
                missile.setVelocityX(350);
                missile.active=true;
                missile.visible=true;
            }

            this.timeToShoot=time+500;
            if (this.missiles.children.size > 4) {
                console.log("Group size failed")
            }
            if (this.missileSound) {
                this.missileSound.play();
            }    

            this.specialBullet-=1;

        }


        this.setVelocity(0);
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;
        //const velocity = 150;
        if (cursors.down.isDown && this.y < height - this.frame.height*0.3) {
            this.setVelocityY(this.velocity);
        } else if (cursors.up.isDown && this.y > 0 + this.frame.height*0.3) {
            this.setVelocityY(-this.velocity);
        }
        if (cursors.right.isDown && this.x < width - this.frame.width*0.3) {
            this.setVelocityX(this.velocity);
        } else if (cursors.left.isDown && this.x > 0 + this.frame.width*0.3) {
            this.setVelocityX(-this.velocity);
        }

        this.bullets.children.iterate(function (bullet) {
            if (bullet.isOutsideCanvas()) {
                //bullet.active = false;
                this.bullets.killAndHide(bullet);
                bullet.removeFromScreen();
            }
        }, this);

        this.missiles.children.iterate(function (missile) {
            if (missile.isOutsideCanvas()) {
                //bullet.active = false;
                this.missiles.killAndHide(missile);
            }
        }, this);


    }


    /**
     * create an explosion, decrease one life, prevent a new collision and put the bird off-screen
     */
    dead() {
        let x = this.x;
        let y = this.y;
        new Explosion(this.scene, x, y);
        this.lives -= 1;

        //prevents new collision
        this.canBeKilled = false;
        this.x = -700;
        this.y = -700;

    }

    /**
     * replace the bird on-screen, change the bird color (tint) and re-enable collisions
     */
    revive() {

        this.x = 100;
        this.y = 100;

        let i = 0;
        let repetition = 200
        let changeTint = true;

        /**
         * timer to change the bird's color/tint 
         */
        this.scene.time.addEvent({
            repeat: repetition,
            loop: false,
            callback: () => {

                //in the last repetition replace the normal color (tint) and re-enables collision
                if (i >= repetition) {
                    this.tint = 0xFFFFFF
                    this.canBeKilled = true;
                } else {

                    if (changeTint) {
                        this.tint = 0xFF0000
                    } else {
                        this.tint = 0xFFFFFF
                    }
                    if (i % 20 == 0) {
                        changeTint = !changeTint;
                    }

                }
                i++
            }
        });
    }


}