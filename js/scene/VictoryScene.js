
/**
 * 
 */
export default class VictoryScene extends Phaser.Scene {
    constructor() {

        super("Victory");
        this.maxScore = 0;

    }

    /**
     * used to receive data from other scenes
     */
    init() {
        console.log('victory');

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

        this.add.text(200, 100, "Victory", {
            font: "50px Cambria",
            fill: "#ffffff"
        });

        this.add.text(300, 600, "Press space to play again", {
            font: "40px Cambria",
            fill: "#ffffff"
        });

        this.victorySound = this.sound.add("schwi", { volume: 0.9 });

        this.victorySound.play();
 
    }
    composeHUD() {
        //add the background in the center of screen (could set anchor point to left up using .setOrigin(0,0))
        this.bg = this.add.image(this.width / 2, this.height / 2, "bg2");
        //scale background
        this.bg.setDisplaySize(this.width, this.height);

    }

    update() {
        if (this.cursors.space.isDown) {

            //stops the presente scene
            this.scene.stop();

            this.victorySound.stop();

            //starts PlayGame scene
            this.scene.start('PlayGame');
        }
    }

}