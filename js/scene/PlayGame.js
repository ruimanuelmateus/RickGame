import Ship from "../models/Ship.js";
//import EnemiesGroup from "../models/EnemiesGroup.js";
//import Boss from "../models/Boss.js";
import AsteroidGroup from "../models/AsteroidGroup.js";

export default class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    create() {
        console.log("Starting game");

        //this.bird = this.physics.add.sprite(100, 100, "ship", 2);

        const width = this.game.config.width;
        const height = this.game.config.height;

        //this.add.image(width / 2, height / 2, "bg");
        this.add.image(0, 0, "bg").setDisplayOrigin(0, 0).setDisplaySize(width, height);

        this.ship = new Ship(this, 100, 100);
        this.ship.setScale(0.4);
        this.score = 0;

        this.gainMissileScore=0;


        /**
         * creates text for score
         */
        this.labelScore = this.add.text(100, 20, "Score: " + this.score, {
            font: "30px Cambria",
            fill: "#ffffff"
        });
        /**
         * create text for bird lives
         */
        this.labelLives = this.add.text(290, 20, "Lives: " + this.ship.lives, {
            font: "30px Cambria",
            fill: "#ffffff"
        });

        this.labelMissile = this.add.text(590, 20, "Missiles: " + this.ship.specialBullet, {
            font: "30px Cambria",
            fill: "#ffffff"
        });

    
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.switchBullet=this.input.keyboard.addKey('A');

        this.asteroids=new AsteroidGroup(this.physics.world, this, 100);
    
       this.physics.add.overlap(this.ship, this.asteroids, (ship, asteroid) => {
        //console.log("crash!");
        if (ship.canBeKilled) {

            ship.dead();
            this.asteroids.killAndHide(asteroid);
            asteroid.removeFromScreen();
            this.labelLives.setText("Lives: " + ship.lives);
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    ship.revive();
                }
            });
        }
    });

        /**
         * deal with overlap/collision of bird bullets and enemies
         */

        
        this.physics.add.overlap(this.ship.bullets, this.asteroids, (bullet, asteroid) => {
    
            console.log("overlap bullets and asteroids");

            this.ship.bullets.killAndHide(bullet);

            bullet.removeFromScreen();

            if(asteroid.canDestroy){
            this.asteroids.killAndHide(asteroid);
            
        
            //remove enemy from screen and stop it
            asteroid.removeFromScreen();

            this.score += 10;
            this.gainMissileScore+=10;
            if(this.gainMissileScore>40){
                this.ship.specialBullet+=1;
                this.gainMissileScore=0;
            }
            //update the score text
            this.labelScore.setText("Score: " + this.score);
            }
        });


        this.physics.add.overlap(this.ship.missiles, this.asteroids, (missile, asteroid) => {
            console.log("overlap missile and asteroids");

            this.ship.missiles.killAndHide(missile);
            this.asteroids.killAndHide(asteroid);
            
            //prevent collision with multiple enemies by removing the bullet from screen and stoping it
            missile.removeFromScreen();

            asteroid.removeFromScreen();
            if(asteroid.goldAsteroid){
                this.score+=20;
                this.gainMissileScore+=20;
                this.ship.fireCount+=1;
                this.ship.specialBullet+=2;
                console.log(this.ship.fireCount)
            
                if(this.ship.fireCount>3 && this.ship.fireRate>110){
                    this.ship.fireRate-=20;
                    this.ship.fireCount=0;
                }
            //remove enemy from screen and stop it

            //update the score text
            }
            this.score+=10;
            this.gainMissileScore+=10;
            if(this.gainMissileScore>40){
                this.ship.specialBullet+=1;
                this.gainMissileScore=0;
            }
            
            this.labelScore.setText("Score: " + this.score);
        });
        

       this.asteroidTimerDelay = 2000
       this.asteroidSpawnConfig = {
           delay: this.asteroidTimerDelay,
           repeat: -1,
           callback: () => {
               let x = this.sys.canvas.width;
               let y = Phaser.Math.Between(0, this.sys.canvas.height);
               //now it does not need to create a new Enemy object (false argument) because they are created with the scene creation
               let asteroid = this.asteroids.getFirstDead(false, x, y);
               if (asteroid) {
                   //asteroid.spawn();
                   let asteroidSize=Phaser.Math.Between(3, 10)/10;
                   if(asteroidSize<0.6){
                    asteroid.canDestroy=true;
                    asteroid.goldAsteroid=false;
                    asteroid.tint=0xFFFFFF;
                   }
                   else{
                       let randomNumber=Phaser.Math.Between(1, 5);
                       asteroid.canDestroy=false;
                       if(randomNumber==3){
                        asteroid.goldAsteroid=true;
                        asteroid.tint=0x03AC13;
                    }
                   }
                   asteroid.setScale(asteroidSize);
                   asteroid.spawn();
               }
           }
       };

       this.asteroidTimer = this.time.addEvent(this.asteroidSpawnConfig);

       this.asteroidSpawnCounter = 0;


        this.themeSound = this.sound.add("terry", { volume: 0.1 });

        this.themeSound.play();

        let fireSound = this.sound.add("fire", {
            volume: 0.1
        });

        this.ship.fireSound = fireSound;

        let missileSound = this.sound.add("missile", {
            volume: 0.8
        });

        this.ship.missileSound = missileSound;

    }

    update(time, delta) {
        //console.log(time + " " + delta);
        this.labelMissile.setText("Missiles: " + this.ship.specialBullet);  
        // game runs while the bird has more than 0 lives
        if (this.ship.lives > 0) {
            //deal with enemies spawn rate
            
            this.spawnNewAsteroids();

            this.ship.update(this.cursors, time);
       
            this.asteroids.children.iterate(function (asteroid) {
                if (asteroid.isOutsideCanvas()) {
                    //bullet.active = false;
                    this.asteroids.killAndHide(asteroid);
                }
            }, this);

            this.asteroidSpawnCounter += delta;
        }

        else {

            //stops this scene
            this.scene.stop();

            this.themeSound.stop();

            //starts the game over scene and passes the actual score to render at that scene
            this.scene.start('GameOver', { score: this.score });
        }

        if(this.score>30 || time>50000){
            this.scene.stop();

            this.themeSound.stop();

            //starts the game over scene and passes the actual score to render at that scene
            this.scene.start('Second', { score: this.score , specialBullet:this.ship.specialBullet, fireCount:this.ship.fireCount, 
                shipx:this.ship.x, shipy:this.ship.y});
        }


    }

   spawnNewAsteroids() {
    const seconds = 10;
    if (this.asteroidSpawnCounter >= seconds * 1000) {
        console.log("remove timer");
        this.asteroidSpawnCounter = 0;
        this.asteroidTimer.remove(false);
        this.asteroidSpawnConfig.delay -= 50;
        if (this.asteroidSpawnConfig.delay < 0) {
            this.asteroidSpawnConfig.delay = 0;
        }
        this.asteroidTimer = this.time.addEvent(this.asteroidSpawnConfig);
        console.log("add new timer delay: " + this.asteroidSpawnConfig.delay);
    }
}

}