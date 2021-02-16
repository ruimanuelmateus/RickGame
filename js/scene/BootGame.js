export default class bootGame extends Phaser.Scene {
    constructor() {
        super("BootGame");
    }
    preload() {
        
        this.load.spritesheet("ship", "assets/spaceship.png", {
            frameWidth: 250,
            frameHeight: 156
        });
       


        this.load.image("bullet", "assets/bullet.png");

        this.load.image("boss", "assets/boss.png");

        this.load.image("enemyBullet", "assets/bullet.png");

        this.load.image("missile", "assets/missile.png")

        this.load.spritesheet("enemy", "assets/enemies.png", {
            frameHeight: 96,
            frameWidth: 96
        });

        this.load.spritesheet("asteroid", "assets/asteroids.png", {
            frameHeight: 127,
            frameWidth: 127
        });

        this.load.spritesheet("rock", "assets/asteroids.png", {
            frameHeight: 127,
            frameWidth: 127
        });

        this.load.spritesheet("explosion", "assets/explosion.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.image("bg", "assets/space.jpg");

        this.load.image("bg2", "assets/bg2.jpg");

        this.load.audio("fire", "assets/fire-sound.mp3");
        this.load.audio("missile", "assets/missile-sound.wav");
        this.load.audio("showMe","assets/show_me.mp3");
        this.load.audio("theme", "assets/intro.mp3");
        this.load.audio("gameover", "assets/gameover.mp3");
        this.load.audio("schwi", "assets/Schwifty.mp3");
        this.load.audio("terry", "assets/terryfold.mp3");

    }
    create() {
        this.scene.start("Initial");
        //this.scene.start("Victory");
    }
}