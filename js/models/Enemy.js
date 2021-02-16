import Explosion from './Explosion.js'
import Bullet from "./Bullet.js";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "enemy", 1);

        this.scene.add.existing(this);

        //enable physics to sprite
        this.scene.physics.world.enable(this);

        this.setScale(0.7);

        this.killCount = 0;

        this.goDown = true;

        this.special=false;

        this.bulletsMaxsize = 20;

        this.timeToShoot=0;

        this.bullets = this.scene.physics.add.group({
            maxSize: this.bulletsMaxsize,
            classType: Bullet
        });

        //this.setGravityY(-10);

    }


    removeFromScreen() {
        new Explosion(this.scene, this.x, this.y);
        this.x = -300;
        this.y = -300;
        this.setVelocityX(0);
        this.setVelocityY(0);
    }

    spawn() {
        this.visible = true;
        this.active = true;
        this.setVelocityX(-100);
        this.setVelocityY(0);
    }

    isOutsideCanvas() {
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        return this.x > width || this.y > height || this.x < 0 || this.y < 0;
    }

    update(time, x) {
        if (x < 600) {
            const height = this.scene.game.config.height;
            this.setVelocityX(0);
            if (this.y < 10) {
                this.goDown = true;
            }
            else if (this.y > height - 100) {
                this.goDown = false;
            }

            if (this.goDown) {
                this.setVelocityY(100);
            }
            else {
                this.setVelocityY(-100);
            }

        }
        else {
            this.setVelocityY(0);
        }



        let bullet = this.bullets.getFirstDead(true, this.x, this.y, "enemyBullet");

        if (bullet) {
            //bullet.setVelocityX(350);
            bullet.active = true;
            bullet.visible = true;

            bullet.fire(this.scene.ship);


        }
        this.timeToShoot = time + 3500;

        if (this.bullets.children.size > this.bulletsMaxsize) {
            console.log("Group size failed")
        }
        if (this.fireSound) {
            this.fireSound.play();
        }

        this.bullets.children.iterate(function (bullet) {
            if (bullet.isOutsideCanvas()) {
                //bullet.active = false;
                this.bullets.killAndHide(bullet);
                bullet.removeFromScreen();
            }
        }, this);

    }

    justFire(time){
        if (this.timeToShoot < time) {

            let bullet=this.bullets.getFirstDead(true,this.x,this.y,"enemyBullet");

            if (bullet) {
                bullet.setVelocityX(-350);
                bullet.active = true;
                bullet.visible = true;

                //bullet.fire(this.scene.ship);
                

            }
            this.timeToShoot = time + 2500;

            if (this.bullets.children.size > this.bulletsMaxsize) {
                console.log("Group size failed")
            }
            if (this.fireSound) {
                this.fireSound.play();
            }
            
            this.bullets.children.iterate(function (bullet) {
                if (bullet.isOutsideCanvas()) {
                    //bullet.active = false;
                    this.bullets.killAndHide(bullet);
                }
            }, this);

        }
    }

}