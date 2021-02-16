import Ship from "../models/Ship.js";
import EnemiesGroup from "../models/EnemiesGroup.js";
//import Boss from "../models/Boss.js";
import AsteroidGroup from "../models/AsteroidGroup.js";

/**
 * 
 */
export default class SecondScene extends Phaser.Scene {
    constructor() {

        super("Second");
        this.maxScore = 0;

    }

    /**
     * used to receive data from other scenes
     */
    init(data) {
        console.log('init', data);

        //get score passed from PlayGame scene
        this.score = data.score;
        this.shipMissiles = data.specialBullet;
        this.shipFire = data.fireCount;
        this.shipx=data.shipx;
        this.shipy=data.shipy;

        //keeps the highest score
        this.maxScore = this.maxScore < this.score ? this.score : this.maxScore;
    }
    

    create() {
        console.log("Starting game");

        //this.bird = this.physics.add.sprite(100, 100, "ship", 2);

        const width = this.game.config.width;
        const height = this.game.config.height;
        //this.add.image(width / 2, height / 2, "bg");
        this.add.image(0, 0, "bg").setDisplayOrigin(0, 0).setDisplaySize(width, height);

        this.ship = new Ship(this, this.shipx, this.shipy);
        this.ship.setScale(0.4);
        this.ship.specialBullet = this.shipMissiles;
        this.ship.fireCount = this.shipFire;

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
        this.cursors.switchBullet = this.input.keyboard.addKey('A');
    /** 
         * create a new EnemiesGroup (new class to handle group of Enemy) that can hold 100 enemies
         */
        this.enemies = new EnemiesGroup(this.physics.world, this, 100);
        this.asteroids = new AsteroidGroup(this.physics.world, this, 100);



        this.physics.add.overlap(this.ship, this.enemies, (ship, enemy) => {
            //console.log("crash!");
            if (ship.canBeKilled) {

                ship.dead();
                this.enemies.killAndHide(enemy);
                enemy.removeFromScreen();
                this.labelLives.setText("Lives: " + ship.lives);
                this.labelScore.setText("Score: " + this.score);
                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        ship.revive();
                    }
                });
            }
        });


        this.physics.add.overlap(this.ship, this.asteroids, (ship, asteroid) => {
            //console.log("crash!");
            if (ship.canBeKilled) {

                ship.dead();
                this.asteroids.killAndHide(asteroid);
                asteroid.removeFromScreen();
                this.labelLives.setText("Lives: " + ship.lives);
                this.labelScore.setText("Score: " + this.score);
                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        ship.revive();
                    }
                });
            }
        });
        
        
        this.enemies.children.each(function (enemy) {

            this.physics.add.overlap(this.ship, enemy.bullets, (ship, bullet) => {
                console.log("crash!");
                if (ship.canBeKilled) {

                    ship.dead();
                    enemy.bullets.killAndHide(bullet);
                    bullet.removeFromScreen();
                    this.labelLives.setText("Lives: " + ship.lives);
                    this.labelScore.setText("Score: " + this.score);
                    this.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            ship.revive();
                        }
                    });
                }
            });
        }, this);


        this.physics.add.overlap(this.ship.bullets, this.asteroids, (bullet, asteroid) => {

            console.log("overlap bullets and asteroids");

            this.ship.bullets.killAndHide(bullet);

            //prevent collision with multiple enemies by removing the bullet from screen and stoping it
            bullet.removeFromScreen();

            if (asteroid.canDestroy) {
                this.asteroids.killAndHide(asteroid);


                //remove enemy from screen and stop it
                asteroid.removeFromScreen();

                this.score += 10;
                this.gainMissileScore+=10;
                if (this.gainMissileScore>40) {
                    this.ship.specialBullet += 1;
                    this.gainMissileScore=0;
                }
                //update the score text

                //this.labelScore.setText("Missiles: " + this.ship.specialBullet);
            }
            this.labelScore.setText("Score: " + this.score);
        });



        this.physics.add.overlap(this.ship.bullets, this.enemies, (bullet, enemy) => {
            //bullet.destroy(); //destroy method removes object from the memory
            //enemy.destroy();

            console.log("overlap bullets and asteroids");

            this.ship.bullets.killAndHide(bullet);

            //prevent collision with multiple enemies by removing the bullet from screen and stoping it
            bullet.removeFromScreen();

            if (enemy.killCount > 0) {
                enemy.killCount -= 1;
            }
            else {
                this.enemies.killAndHide(enemy);


                //remove enemy from screen and stop it
                enemy.removeFromScreen();

                this.score += 10;
                this.gainMissileScore+=10;
                if (this.gainMissileScore>40) {
                    this.ship.specialBullet += 1;
                    this.gainMissileScore=0;
                }
                //update the score text
                this.labelScore.setText("Score: " + this.score);
            }
            if(enemy.killCount==1){
                this.ship.specialBullet+=1;
            }
        });


        this.physics.add.overlap(this.ship.missiles, this.asteroids, (missile, asteroid) => {
            //bullet.destroy(); //destroy method removes object from the memory
            //enemy.destroy();

            console.log("overlap missile and asteroids");

            this.ship.missiles.killAndHide(missile);
            this.asteroids.killAndHide(asteroid);

            //prevent collision with multiple enemies by removing the bullet from screen and stoping it
            missile.removeFromScreen();

            asteroid.removeFromScreen();
            if (asteroid.goldAsteroid) {
                this.score += 20;
                this.gainMissileScore+=20;
                this.ship.fireCount += 1;
                this.ship.specialBullet += 2;
                console.log(this.ship.fireCount)

                if (this.ship.fireCount>3 && this.ship.fireRate > 110) {
                    this.ship.fireRate -= 20;
                    this.ship.fireCount=0;
                }
                //remove enemy from screen and stop it

                //update the score text
            }
            this.score += 10;
            this.gainMissileScore+=10;
            if (this.gainMissileScore> 40) {
                this.ship.specialBullet += 1;
                this.gainMissileScore=0;
            }
            

            this.labelScore.setText("Score: " + this.score);
        });


        this.physics.add.overlap(this.ship.missiles, this.enemies, (missile, enemy) => {
            //bullet.destroy(); //destroy method removes object from the memory
            //enemy.destroy();

            this.ship.missiles.killAndHide(missile);
            this.enemies.killAndHide(enemy);

            //prevent collision with multiple enemies by removing the bullet from screen and stoping it
            missile.removeFromScreen();

            enemy.removeFromScreen();
        

            this.score += 10;
            this.gainMissileScore+=10;
            if (this.gainMissileScore>40) {
                this.ship.specialBullet += 1;
                this.gainMissileScore=0;
            }

            if(enemy.killCount>0){
                this.ship.specialBullet+=1;
            }

            enemy.killCount=0;
            

            this.labelScore.setText("Score: " + this.score);
        });



        /**
         * config object for enemy spawn timer
         */


        this.enemyTimerDelay = 3000
        this.enemySpawnConfig = {
            delay: this.enemyTimerDelay,
            repeat: -1,
            callback: () => {
                let margin = 300;
                let x = this.sys.canvas.width;
                let y = Math.floor(Math.random() * (this.sys.canvas.height - margin)) + margin;
                //now it does not need to create a new Enemy object (false argument) because they are created with the scene creation
                let enemy = this.enemies.getFirstDead(false, x, y);
                if (enemy) {
                    let randomToKill = Phaser.Math.Between(1, 7);
                    if (randomToKill == 2) {
                        enemy.killCount = 2;
                        enemy.special=true;
                        enemy.tint = 0x03AC13;
                    }
                    else {
                        enemy.tint = 0xffffff;
                        enemy.special=false;
                        //enemy.justFire();
                    }
                    enemy.spawn()
                    //enemy.setScale(Phaser.Math.Between(3, 10)/10);
                    //enemy.
                }
            }
        };
        this.enemyTimer = this.time.addEvent(this.enemySpawnConfig);

        this.enemySpawnCounter = 0;


        this.asteroidTimerDelay = 4000
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
                    let asteroidSize = Phaser.Math.Between(3, 10) / 10;
                    if (asteroidSize < 0.6) {
                        asteroid.canDestroy = true;
                        asteroid.goldAsteroid = false;
                        asteroid.tint = 0xFFFFFF;
                    }
                    else {
                        let randomNumber = Phaser.Math.Between(1, 5);
                        asteroid.canDestroy = false;
                        if (randomNumber == 3) {
                            asteroid.goldAsteroid = true;
                            asteroid.tint = 0x03AC13;
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

        /*
            if(this.score>50){
                this.boss=new Boss(this.physics.world, 200, 200);
            }
            */

    }

    update(time, delta) {
        //console.log(time + " " + delta);
        this.labelMissile.setText("Missiles: " + this.ship.specialBullet);
        // game runs while the bird has more than 0 lives
        if (this.ship.lives > 0) {
            //deal with enemies spawn rate

            //this.spawnNewAsteroids();
            //this.spawnNewEnemies();


            this.ship.update(this.cursors, time);

            this.asteroids.children.iterate(function (asteroid) {

                if (asteroid.isOutsideCanvas()) {
                    //bullet.active = false;
                    this.asteroids.killAndHide(asteroid);
                }
            }, this);

            this.asteroidSpawnCounter += delta;

            this.enemies.children.iterate(function (enemy) {

                if (enemy.special) {
                    enemy.update(time, enemy.x);
                }
                else {
                    enemy.justFire(time);
                }

                if(enemy.isOutsideCanvas()){
                    this.enemies.killAndHide(enemy);
                }

                
            }, this);

            this.enemySpawnCounter += delta;

        }

        else {

            //stops this scene
            this.scene.stop();

            this.themeSound.stop();

            //starts the game over scene and passes the actual score to render at that scene
            this.scene.start('GameOver', { score: this.score });
        }

        if(this.score>200){
            this.scene.stop();

            this.themeSound.stop();

            //starts the game over scene and passes the actual score to render at that scene
            this.scene.start('Final', { score: this.score , specialBullet:this.ship.specialBullet, fireCount:this.ship.fireCount, shipx:this.ship.x, shipy:this.ship.y});
        }




    }

    /**
     * example of how change the spawn rate 
     * spawnCounter accumulates delta (seconds between frames) 
     * when spawnCounter greaterOrEqual to seconds, removes the actual spawnTimer and replaces to a new one with a lesser delay
     * some limitations for ridiculous spawn rate could be set
    */

    spawnNewEnemies() {
        const seconds = 10;
        if (this.enemySpawnCounter >= seconds * 1000) {
            console.log("remove timer");
            this.enemySpawnCounter = 0;
            this.enemyTimer.remove(false);
            this.enemySpawnConfig.delay -= 50;
            if (this.enemySpawnConfig.delay < 0) {
                this.enemySpawnConfig.delay = 0;
            }
            this.enemyTimer = this.time.addEvent(this.enemySpawnConfig);
            console.log("add new timer delay: " + this.enemySpawnConfig.delay);
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