import Ship from "../models/Ship.js";
import EnemiesGroup from "../models/EnemiesGroup.js";
import Boss from "../models/Boss.js";
import AsteroidGroup from "../models/AsteroidGroup.js";

/**
 * 
 */
export default class FinalScene extends Phaser.Scene {
    constructor() {

        super("Final");

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
        this.shipx = data.shipx;
        this.shipy = data.shipy;

        //keeps the highest score
    }

    create() {
        console.log("Starting game");

        //this.bird = this.physics.add.sprite(100, 100, "ship", 2);

        const width = this.game.config.width;
        const height = this.game.config.height;

        this.add.image(0, 0, "bg2").setDisplayOrigin(0, 0).setDisplaySize(width, height);

        this.ship = new Ship(this, this.shipx, this.shipy);
        this.ship.setScale(0.4);
        this.ship.specialBullet = this.shipMissiles;
        this.ship.fireCount = this.shipFire;

        this.boss = new Boss(this, width + 500, height / 2);

        this.gainMissileScore = 0;

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

        this.bossLifes = this.add.text(width - 200, height - 100, "Boss: " + this.boss.life, {
            font: "30px Cambria",
            fill: "#ffffff"
        });

        //this.bird.setGravityY(-10);
        //this.bird.setVelocityY(10)

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.switchBullet = this.input.keyboard.addKey('A');

        /** 
         * create a new EnemiesGroup (new class to handle group of Enemy) that can hold 100 enemies
         */
        this.enemies = new EnemiesGroup(this.physics.world, this, 100);
        this.asteroids = new AsteroidGroup(this.physics.world, this, 100);
        this.rocks = new AsteroidGroup(this.physics.world, this, 500);


        /**
         * deal with overlap/collision of bird and enemies
         */

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

        this.physics.add.overlap(this.ship, this.boss, (ship) => {
            //console.log("crash!");
            if (ship.canBeKilled) {

                ship.dead();
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



        /**
         * deal with overlap/collision of bird bullets and enemies
         */


        this.physics.add.overlap(this.ship.bullets, this.asteroids, (bullet, asteroid) => {
            //bullet.destroy(); //destroy method removes object from the memory
            //enemy.destroy();

            console.log("overlap bullets and asteroids");

            this.ship.bullets.killAndHide(bullet);

            //prevent collision with multiple enemies by removing the bullet from screen and stoping it
            bullet.removeFromScreen();

            if (asteroid.canDestroy) {
                this.asteroids.killAndHide(asteroid);


                //remove enemy from screen and stop it
                asteroid.removeFromScreen();

                this.score += 10;
                this.gainMissileScore += 10;
                if (this.gainMissileScore > 40) {
                    this.ship.specialBullet += 1;
                    this.gainMissileScore = 0;
                }
            }
            this.labelScore.setText("Score: " + this.score);
        });


        this.physics.add.overlap(this.ship.bullets, this.boss, (boss, bullet) => {
            if (this.boss.life < 200) {
                console.log("overlap bullets and boss");

                this.ship.bullets.killAndHide(bullet);
                bullet.removeFromScreen();

                //prevent collision with multiple enemies by removing the bullet from screen and stoping it


                this.boss.life -= 1;
            }
        });



        this.physics.add.overlap(this.ship.bullets, this.enemies, (bullet, enemy) => {
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
                this.gainMissileScore += 10;
                if (this.gainMissileScore > 40) {
                    this.ship.specialBullet += 1;
                    this.gainMissileScore = 0;
                }
                this.labelScore.setText("Score: " + this.score);
            }
            if (enemy.killCount == 1) {
                this.ship.specialBullet += 1;
            }
        });


        this.physics.add.overlap(this.ship.missiles, this.asteroids, (missile, asteroid) => {
            
            console.log("overlap missile and asteroids");

            this.ship.missiles.killAndHide(missile);
            this.asteroids.killAndHide(asteroid);

            //prevent collision with multiple enemies by removing the bullet from screen and stoping it
            missile.removeFromScreen();

            asteroid.removeFromScreen();
            if (asteroid.goldAsteroid) {
                this.score += 20;
                this.gainMissileScore += 20;
                this.ship.fireCount += 1;
                this.ship.specialBullet += 2;
                console.log(this.ship.fireCount)

                if (this.ship.fireCount > 3 && this.ship.fireRate > 110) {
                    this.ship.fireRate -= 20;
                    this.ship.fireCount = 0;
                }
            }
            this.score += 10;
            this.gainMissileScore += 10;
            if (this.gainMissileScore > 40) {
                this.ship.specialBullet += 1;
                this.gainMissileScore = 0;
            }


            this.labelScore.setText("Score: " + this.score);
        });


        this.physics.add.overlap(this.ship.missiles, this.boss, (boss, missile) => {
            
            console.log("overlap missile and boss");

            this.ship.missiles.killAndHide(missile);
            //this.asteroids.killAndHide(asteroid);

            //prevent collision with multiple enemies by removing the bullet from screen and stoping it
            missile.removeFromScreen();

            this.boss.life -= 5;


            this.labelScore.setText("Score: " + this.score);
        });


        this.physics.add.overlap(this.ship.missiles, this.enemies, (missile, enemy) => {
            this.ship.missiles.killAndHide(missile);
            this.enemies.killAndHide(enemy);

            //prevent collision with multiple enemies by removing the bullet from screen and stoping it
            missile.removeFromScreen();

            enemy.removeFromScreen();

            this.score += 10;
            this.gainMissileScore += 10;
            if (this.gainMissileScore > 40) {
                this.ship.specialBullet += 1;
                this.gainMissileScore = 0;
            }

            if (enemy.killCount > 0) {
                this.ship.specialBullet += 2;
            }


            this.labelScore.setText("Score: " + this.score);
        });



        /**
         * config object for enemy spawn timer
         */


        this.enemyTimerDelay = 10000
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

                    enemy.killCount = 3;
                    enemy.tint = 0x03AC13;
                    enemy.spawn()
                    //enemy.setScale(Phaser.Math.Between(3, 10)/10);
                    //enemy.
                }
            }
        };
        this.enemyTimer = this.time.addEvent(this.enemySpawnConfig);

        this.enemySpawnCounter = 0;


        this.asteroidSpawnConfig = {
            delay: 5000,
            repeat: -1,
            callback: () => {
                let x = this.sys.canvas.width;
                let y = Phaser.Math.Between(0, this.sys.canvas.height);
                //now it does not need to create a new Enemy object (false argument) because they are created with the scene creation
                let asteroid = this.asteroids.getFirstDead(false, x, y);
                if (asteroid) {
                    //asteroid.spawn();
                    let asteroidSize = Phaser.Math.Between(1, 5);
                    if (asteroidSize < 4) {
                        asteroid.canDestroy = true;
                        asteroid.goldAsteroid = false;
                        asteroid.tint = 0xFFFFFF;
                        asteroid.setScale(0.4)
                    }
                    else {

                        asteroid.canDestroy = false;

                        asteroid.goldAsteroid = true;
                        asteroid.tint = 0x03AC13;
                        asteroid.setScale(0.8);

                    }
                    asteroid.spawn();
                }
            }
        };

        this.asteroidTimer = this.time.addEvent(this.asteroidSpawnConfig);

        //this.asteroidSpawnCounter = 0;


        this.themeSound = this.sound.add("schwi", { volume: 0.9 });

        this.themeSound.play();

        let fireSound = this.sound.add("fire", {
            volume: 0.1
        });



        this.ship.fireSound = fireSound;

        let missileSound = this.sound.add("missile", {
            volume: 0.8
        });

        this.ship.missileSound = missileSound;

        let showSound = this.sound.add("showMe", {
            volume: 0.8
        });

        this.boss.showSound = showSound;

        ;

        /*
            if(this.score>50){
                this.boss=new Boss(this.physics.world, 200, 200);
            }
            */



    }

    update(time, delta) {
        //console.log(time + " " + delta);
        this.labelMissile.setText("Missiles: " + this.ship.specialBullet);
        this.bossLifes.setText("Boss: " + this.boss.life);

        if (this.boss.blast) {
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    let x = this.sys.canvas.width;
                    let y = Phaser.Math.Between(0, this.sys.canvas.height);
                    let asteroid = this.asteroids.getFirstDead(false, x, y);
                    if (asteroid) {
                        asteroid.canDestroy = true;
                        asteroid.goldAsteroid = false;
                        asteroid.tint = 0xFFFFFF;
                        asteroid.setScale(0.4);
                        asteroid.spawn();
                    }
                },
                repeat: 30
            });
            this.boss.blast = false;
        }

        // game runs while the bird has more than 0 lives
        if (this.ship.lives > 0) {

            this.boss.update();

            this.ship.update(this.cursors, time);


            this.asteroids.children.iterate(function (asteroid) {

                if (asteroid.isOutsideCanvas()) {
                    //bullet.active = false;
                    this.asteroids.killAndHide(asteroid);
                }
            }, this);

            //this.asteroidSpawnCounter += delta;

            this.enemies.children.iterate(function (enemy) {

                enemy.update(time, enemy.x);


                if (enemy.isOutsideCanvas()) {
                    this.enemies.killAndHide(enemy);
                }


            }, this);

            this.enemySpawnCounter += delta;

            if(this.boss.life<1){
                this.scene.stop();

            this.themeSound.stop();

            //starts the game over scene and passes the actual score to render at that scene
            this.scene.start('Victory', { score: this.score + this.ship.specialBullet*10 });
            }

        }
        else {

            //stops this scene
            this.scene.stop();

            this.themeSound.stop();

            //starts the game over scene and passes the actual score to render at that scene
            this.scene.start('GameOver', { score: this.score });
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


}