import Ship from '../models/Ship.js';

/**
 * 
 */
export default class InitialScene extends Phaser.Scene {
    constructor() {

        super("Initial");
        this.maxScore = 0;

    }

    /**
     * used to receive data from other scenes
     */
    init() {
        console.log('init');

        //get score passed from PlayGame scene
        //keeps the highest score
        
    }

    create() {
        let { width, height } = this.sys.game.canvas
        this.width = width;
        this.height = height;

        //get all basic cursors input (Up, Down, Left, Right, Space Bar and Shift)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.composeHUD();

        this.add.text(200, 100, "Ready for a new adventure?", {
            font: "50px Cambria",
            fill: "#ffffff"
        });

        this.add.text(300, 600, "Press space to start", {
            font: "40px Cambria",
            fill: "#ffffff"
        });

        this.initialSound = this.sound.add("theme", { volume: 0.5 });

        this.initialSound.play();
 
    }
    composeHUD() {
        //add the background in the center of screen (could set anchor point to left up using .setOrigin(0,0))
        this.bg = this.add.image(this.width / 2, this.height / 2, "bg");
        //scale background
        this.bg.setDisplaySize(this.width, this.height);

        this.ship = new Ship(this, this.width/2, this.height/2 +100, null, null);

    } 

    update() {
        if (this.cursors.space.isDown) {

            //stops the presente scene
            this.scene.stop();

            this.initialSound.stop();

            //starts PlayGame scene
            this.scene.start('PlayGame');
        }
    }

}