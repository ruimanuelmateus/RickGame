import Asteroid from "./Asteroid.js";

/**
 * Class created to include logic to group creation
 * classType argument for Scene::add.group does not call overriden constructor
 * it will create as many Enemy objects as passed by maxSize argument
 */
export default class AsteroidGroup extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, maxSize) {
        super(world, scene);

        for (let i = 0; i < maxSize; i++) {
            let child = new Asteroid(scene, -100, -100);
            child.active = false;
            this.add(child);
        }

        console.log(this);

    }
}